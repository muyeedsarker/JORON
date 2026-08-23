import { auth, onAuthStateChanged, persistenceReady } from "./firebase-client.js";

let currentUser = null;
let ready = false;
let resolveReady;
const sessionReady = new Promise((resolve) => { resolveReady = resolve; });

await persistenceReady;
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (!ready) {
    ready = true;
    resolveReady(user);
  }
  window.dispatchEvent(new CustomEvent("joron-auth-state", { detail: { user } }));
});

export async function getCurrentUser() {
  return sessionReady;
}

export function subscribeAuth(callback) {
  const handler = (event) => callback(event.detail.user);
  window.addEventListener("joron-auth-state", handler);
  return () => window.removeEventListener("joron-auth-state", handler);
}

export { currentUser };
