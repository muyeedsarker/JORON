// JORON Functions entrypoint aggregator.
// Keeps the existing index.js intact while exposing modular OTP endpoints.
const core = require('./index');
const otp = require('./otp-auth');
const identifier = require('./identifier-auth');

Object.assign(module.exports, core, otp, identifier);
