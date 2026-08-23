import { auth, onAuthStateChanged, signOut, persistenceReady } from "./firebase-client.js";

const next = encodeURIComponent(`${location.pathname.split("/").pop() || "index.html"}${location.search}`);

export async function requireAuth({ login = "login.html" } = {}) {
  await persistenceReady;
  return new Promise((resolve) => {
    let settled = false;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (settled) return;
      settled = true;
      unsubscribe();
      if (!user) {
        location.replace(`${login}?next=${next}`);
        resolve(null);
        return;
      }
      resolve(user);
    });
  });
}

export async function logout({ redirect = "login.html" } = {}) {
  await persistenceReady;
  await signOut(auth);
  location.replace(redirect);
}

export { auth };
