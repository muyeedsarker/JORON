/**
 * JORON SMS provider adapter - Twilio Programmable Messaging.
 *
 * Credentials are read ONLY from Firebase Functions secrets/environment:
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_MESSAGING_SERVICE_SID (preferred) OR TWILIO_FROM_NUMBER
 *
 * Node 22 provides fetch, so no extra SDK dependency is required.
 */

function normalizeBangladeshMobile(value) {
  const raw = String(value || '').trim().replace(/[\s-]/g, '');
  if (/^01\d{9}$/.test(raw)) return `+880${raw.slice(1)}`;
  if (/^8801\d{9}$/.test(raw)) return `+${raw}`;
  if (/^\+8801\d{9}$/.test(raw)) return raw;
  return null;
}

function getConfig() {
  const accountSid = String(process.env.TWILIO_ACCOUNT_SID || '').trim();
  const authToken = String(process.env.TWILIO_AUTH_TOKEN || '').trim();
  const messagingServiceSid = String(process.env.TWILIO_MESSAGING_SERVICE_SID || '').trim();
  const fromNumber = String(process.env.TWILIO_FROM_NUMBER || '').trim();
  if (!accountSid || !authToken || (!messagingServiceSid && !fromNumber)) {
    throw new Error('SMS_PROVIDER_NOT_CONFIGURED');
  }
  if (!/^AC[0-9a-fA-F]{32}$/.test(accountSid)) {
    throw new Error('SMS_PROVIDER_CONFIG_INVALID');
  }
  if (messagingServiceSid && !/^MG[0-9a-fA-F]{32}$/.test(messagingServiceSid)) {
    throw new Error('SMS_PROVIDER_CONFIG_INVALID');
  }
  if (!messagingServiceSid && !/^\+\d{8,15}$/.test(fromNumber)) {
    throw new Error('SMS_PROVIDER_CONFIG_INVALID');
  }
  return { accountSid, authToken, messagingServiceSid, fromNumber };
}

async function sendSms(to, message) {
  const phone = normalizeBangladeshMobile(to);
  if (!phone) throw new Error('INVALID_BANGLADESH_MOBILE');
  if (!message || String(message).length > 480) throw new Error('INVALID_SMS_MESSAGE');

  const { accountSid, authToken, messagingServiceSid, fromNumber } = getConfig();
  const body = new URLSearchParams({
    To: phone,
    Body: String(message)
  });
  if (messagingServiceSid) body.set('MessagingServiceSid', messagingServiceSid);
  else body.set('From', fromNumber);

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body,
    signal: AbortSignal.timeout(15000)
  });

  let data = {};
  try { data = await response.json(); } catch (_) {}
  if (!response.ok) {
    console.error('Twilio SMS error:', response.status, data?.code, data?.message);
    throw new Error('SMS_PROVIDER_SEND_FAILED');
  }
  return { sid: data.sid, status: data.status };
}

module.exports = { sendSms, normalizeBangladeshMobile };
