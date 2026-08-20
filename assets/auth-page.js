import { requireAuth, redirectIfAuthenticated } from "./firebase-auth.js";

const body = document.body;

if (body?.hasAttribute("data-auth-required")) {
  requireAuth({ redirect: body.dataset.authRedirect || "login.html" }).catch(console.error);
}

if (body?.hasAttribute("data-auth-guest-only")) {
  redirectIfAuthenticated({ redirect: body.dataset.authRedirect || "biodata.html" }).catch(console.error);
}
