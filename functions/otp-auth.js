const { getApps, initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { getAppCheck } = require('firebase-admin/app-check');
const { onRequest } = require('firebase-functions/https');
const { defineSecret } = require('firebase-functions/params');

const TWILIO_ACCOUNT_SID = defineSecret('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = defineSecret('TWILIO_AUTH_TOKEN');
const TWILIO_MESSAGING_SERVICE_SID = defineSecret('TWILIO_MESSAGING_SERVICE_SID');
const TWILIO_FROM_NUMBER = defineSecret('TWILIO_FROM_NUMBER');
const crypto = require('crypto');
const { sendSms, normalizeBangladeshMobile } = require('./sms-provider');

if (!getApps().length) initializeApp();
const db = getFirestore();
const adminAuth = getAuth();
const appCheck = getAppCheck();

const OTP_COLLECTION = 'loginOtps';
const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_WAIT_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;
const ALLOWED_ORIGINS = new Set([
  'https://joron-d7742.web.app',
  'https://joron-d7742.firebaseapp.com',
  'https://muyeedsarker.github.io'
]);

function cors(req, res) {
  const origin = req.get('origin') || '';
  if (ALLOWED_ORIGINS.has(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
  }
  res.set('Access-Control-Allow-Headers', 'Content-Type, X-Firebase-AppCheck');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

function error(res, status, code) {
  return res.status(status).json({ ok: false, error: code });
}

async function requireAppCheck(req, res) {
  const token = req.get('X-Firebase-AppCheck');
  if (!token) {
    error(res, 401, 'APP_CHECK_REQUIRED');
    return false;
  }
  try {
    await appCheck.verifyToken(token);
    return true;
  } catch (e) {
    console.warn('App Check verification failed:', e.message);
    error(res, 401, 'APP_CHECK_INVALID');
    return false;
  }
}

function otpHash(phone, otp) {
  return crypto.createHash('sha256').update(`${phone}|${otp}`).digest('hex');
}

async function findUserByPhone(phone) {
  const local = phone.startsWith('+880') ? `0${phone.slice(4)}` : phone;
  const snap = await db.collection('users').where('phone', '==', local).limit(1).get();
  if (!snap.empty) return snap.docs[0];
  const intl = await db.collection('users').where('phone', '==', phone).limit(1).get();
  return intl.empty ? null : intl.docs[0];
}

exports.sendLoginOtp = onRequest({
  secrets: [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_MESSAGING_SERVICE_SID, TWILIO_FROM_NUMBER]
}, async (req, res) => {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return error(res, 405, 'POST_REQUIRED');
  if (!(await requireAppCheck(req, res))) return;

  const phone = normalizeBangladeshMobile(req.body?.phone);
  if (!phone) return error(res, 400, 'INVALID_BANGLADESH_MOBILE');

  try {
    const userSnap = await findUserByPhone(phone);
    if (!userSnap) return error(res, 404, 'ACCOUNT_NOT_FOUND');

    const ref = db.collection(OTP_COLLECTION).doc(phone.slice(1));
    const previous = await ref.get();
    const previousData = previous.exists ? previous.data() : null;
    const lastSent = Number(previousData?.sentAtMs || 0);
    if (lastSent && Date.now() - lastSent < RESEND_WAIT_MS) {
      return error(res, 429, 'OTP_RESEND_WAIT');
    }

    const otp = String(crypto.randomInt(100000, 1000000));
    await sendSms(phone, `JORON login OTP: ${otp}. It expires in 5 minutes.`);
    await ref.set({
      uid: userSnap.id,
      phone,
      otpHash: otpHash(phone, otp),
      createdAt: FieldValue.serverTimestamp(),
      sentAtMs: Date.now(),
      expiresAtMs: Date.now() + OTP_TTL_MS,
      attempts: 0,
      used: false
    });
    return res.json({ ok: true });
  } catch (e) {
    console.error('sendLoginOtp failed:', e.message);
    if (e.message === 'SMS_PROVIDER_NOT_CONFIGURED') return error(res, 503, 'SMS_PROVIDER_NOT_CONFIGURED');
    return error(res, 500, 'OTP_SEND_FAILED');
  }
});

exports.verifyLoginOtp = onRequest(async (req, res) => {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return error(res, 405, 'POST_REQUIRED');
  if (!(await requireAppCheck(req, res))) return;

  const phone = normalizeBangladeshMobile(req.body?.phone);
  const otp = String(req.body?.otp || '').trim();
  if (!phone || !/^\d{6}$/.test(otp)) return error(res, 400, 'INVALID_OTP');

  try {
    const ref = db.collection(OTP_COLLECTION).doc(phone.slice(1));
    const snap = await ref.get();
    if (!snap.exists) return error(res, 401, 'OTP_INVALID_OR_EXPIRED');
    const data = snap.data() || {};
    if (data.used || Number(data.expiresAtMs || 0) < Date.now()) return error(res, 401, 'OTP_INVALID_OR_EXPIRED');
    const attempts = Number(data.attempts || 0);
    if (attempts >= MAX_ATTEMPTS) return error(res, 429, 'OTP_ATTEMPTS_EXCEEDED');

    if (data.otpHash !== otpHash(phone, otp)) {
      await ref.update({ attempts: attempts + 1 });
      return error(res, 401, 'OTP_INVALID_OR_EXPIRED');
    }

    const userSnap = await findUserByPhone(phone);
    if (!userSnap) return error(res, 401, 'OTP_INVALID_OR_EXPIRED');
    await ref.update({ used: true, verifiedAt: FieldValue.serverTimestamp() });
    const customToken = await adminAuth.createCustomToken(userSnap.id, { otpLogin: true });
    return res.json({ ok: true, customToken });
  } catch (e) {
    console.error('verifyLoginOtp failed:', e.message);
    return error(res, 500, 'OTP_VERIFY_FAILED');
  }
});
