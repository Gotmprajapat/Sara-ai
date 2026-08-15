// js/auth-ui.js

import {
  createAccount,
  login,
  logout,
  getCurrentUser,
  watchAuthState
} from "./auth.js";


// ================================
// AUTH UI ELEMENTS
// ================================

const authScreen =
  document.getElementById("authScreen");

const emailInput =
  document.getElementById("emailInput");

const passwordInput =
  document.getElementById("passwordInput");

const loginButton =
  document.getElementById("loginButton");

const signupButton =
  document.getElementById("signupButton");

const authMessage =
  document.getElementById("authMessage");


// ================================
// SHOW MESSAGE
// ================================

function showMessage(message) {

  if (authMessage) {
    authMessage.textContent = message;
  }

}


// ================================
// LOGIN
// ================================

async function handleLogin() {

  const email =
    emailInput?.value.trim();

  const password =
    passwordInput?.value;

  if (!email || !password) {

    showMessage(
      "Email aur password enter karo."
    );

    return;
  }

  try {

    showMessage("Login ho raha hai...");

    await login(
      email,
      password
    );

    showMessage("");

  } catch (error) {

    console.error(error);

    showMessage(
      "Login nahi hua. Email/password check karo."
    );

  }
}


// ================================
// CREATE ACCOUNT
// ================================

async function handleSignup() {

  const email =
    emailInput?.value.trim();

  const password =
    passwordInput?.value;

  if (!email || !password) {

    showMessage(
      "Email aur password enter karo."
    );

    return;
  }

  if (password.length < 6) {

    showMessage(
      "Password kam se kam 6 characters ka hona chahiye."
    );

    return;
  }

  try {

    showMessage(
      "Account ban raha hai..."
    );

    await createAccount(
      email,
      password
    );

    showMessage("");

  } catch (error) {

    console.error(error);

    if (
      error.code ===
      "auth/email-already-in-use"
    ) {

      showMessage(
        "Ye email pehle se registered hai."
      );

    } else {

      showMessage(
        "Account nahi bana. Dobara try karo."
      );

    }

  }
}


// ================================
// BUTTONS
// ================================

loginButton?.addEventListener(
  "click",
  handleLogin
);

signupButton?.addEventListener(
  "click",
  handleSignup
);


// ================================
// AUTH STATE
// ================================

export function startAuthUI(
  onLoggedIn
) {

  watchAuthState(
    (user) => {

      if (user) {

        // Login screen hide
        if (authScreen) {
          authScreen.classList.add(
            "hidden"
          );
        }

        // Sara start
        if (typeof onLoggedIn === "function") {
          onLoggedIn(user);
        }

      } else {

        // Login screen show
        if (authScreen) {
          authScreen.classList.remove(
            "hidden"
          );
        }

      }

    }
  );

}


// ================================
// LOGOUT
// ================================

export async function logoutSara() {

  await logout();

}
