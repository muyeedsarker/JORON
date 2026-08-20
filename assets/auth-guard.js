import { requireAuth, redirectIfAuthenticated } from "./firebase-auth.js";

// Add <body data-auth-required> to any page that must be signed in.
// Add <body data-auth-guest-only> to login/signup pages.
const body = document.body;

if (body?.hasAttribute("data-auth-required")) {
  requireAuth({
    redirect: body.dataset.authRedirect || "login.html"
  }).catch((error) => {
    console.error("Authentication guard failed", error);
  });
}

if (body?.hasAttribute("data-auth-guest-only")) {
  redirectIfAuthenticated({
    redirect: body.dataset.authRedirect || "biodata.html"
  }).catch((error) => {
    console.error("Guest auth guard failed", error);
  });
}
