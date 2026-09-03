/**
 * JORON SMS provider adapter.
 *
 * Keep provider credentials in Firebase Functions secrets/environment only.
 * Never commit API keys, auth tokens, OTPs, PINs, or provider secrets.
 *
 * The concrete provider can be wired later without changing the OTP UI or
 * the rest of the application: implement sendSms(to, message) here and
 * expose the provider credentials through Firebase Secret Manager.
 */

function normalizeBangladeshMobile(value) {
  const raw = String(value || '').trim().replace(/[\s-]/g, '');
  if (/^01\d{9}$/.test(raw)) return `+880${raw.slice(1)}`;
  if (/^8801\d{9}$/.test(raw)) return `+${raw}`;
  if (/^\+8801\d{9}$/.test(raw)) return raw;
  return null;
}

/**
 * Provider-neutral entry point.
 *
 * Later, replace the body with the selected SMS provider's server-side API
 * call. The function deliberately fails closed until a provider is configured.
 */
async function sendSms(to, message) {
  const phone = normalizeBangladeshMobile(to);
  if (!phone) throw new Error('INVALID_BANGLADESH_MOBILE');
  if (!message || String(message).length > 480) throw new Error('INVALID_SMS_MESSAGE');

  // SMS provider integration is intentionally deferred until a provider and
  // credentials are supplied. Do not put provider secrets in source control.
  throw new Error('SMS_PROVIDER_NOT_CONFIGURED');
}

module.exports = { sendSms, normalizeBangladeshMobile };
