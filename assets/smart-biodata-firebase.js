// JORON Smart Biodata Firebase compatibility wrapper.
// Firebase save/load is handled by biodata.html itself.
// Address handling is loaded once by biodata.html through smart-biodata-address-fix.js.
// The previous legacy import caused duplicate Firebase/address listeners and could overwrite
// dependent dropdown selections. Keep this file intentionally side-effect free.
export {};
