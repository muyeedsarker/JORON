import { requireAuth, logout } from "./auth-guard.js";

/**
 * Call this once from any page that must be available only to signed-in users.
 * The optional logout selector wires an existing logout button to the shared flow.
 */
export async function protectPage({ logoutSelector = "[data-action=logout]" } = {}) {
  const user = await requireAuth();
  if (!user) return null;

  document.documentElement.dataset.authenticated = "true";

  const button = document.querySelector(logoutSelector);
  if (button) {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      button.setAttribute("disabled", "disabled");
      try {
        await logout();
      } catch (error) {
        console.error("Logout failed", error);
        button.removeAttribute("disabled");
        alert("Logout করা যায়নি। আবার চেষ্টা করুন।");
      }
    });
  }

  return user;
}
