// JORON Smart Biodata — controlled Save/Restore integration.
// The original legacy implementation is preserved byte-for-byte in
// smart-biodata-firebase-legacy-core.js. The newer Save/Restore handler
// is loaded first so its capture-phase submit handler becomes authoritative.
import "./smart-biodata-firebase.js";
import "./smart-biodata-firebase-legacy-core.js";
