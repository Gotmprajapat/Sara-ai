// js/auth-ui.js

import {
  createAccount,
  login,
  logout,
  watchAuthState
} from "./auth.js";


// ==========================================
// ELEMENTS
// ==========================================

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


// ==========================================
// MESSAGE
// ==========================================

function showMessage(message) {

  if (authMessage) {
    authMessage.textContent = message;
  }

  console.log("AUTH:", message);
}


// ==========================================
// LOGIN
// ==========================================

async function handleLogin() {

  const email =
    emailInput?.value.trim();

  const password =
    passwordInput?.value || "";


  if (!email || !password) {

    showMessage(
      "Email aur password enter karo."
    );

    return;
  }


  try {

    loginButton.disabled = true;

    showMessage(
      "Login ho raha hai..."
    );


    await login(
      email,
      password
    );


    showMessage(
      "Login successful."
    );


  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );

    showMessage(
      getFirebaseError(error)
    );


  } finally {

    loginButton.disabled = false;

  }

}


// ==========================================
// CREATE ACCOUNT
// ==========================================

async function handleSignup() {

  const email =
    emailInput?.value.trim();

  const password =
    passwordInput?.value || "";


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

    signupButton.disabled = true;

    showMessage(
      "Account ban raha hai..."
    );


    await createAccount(
      email,
      password
    );


    showMessage(
      "Account ban gaya."
    );


  } catch (error) {

    console.error(
      "SIGNUP ERROR:",
      error
    );

    showMessage(
      getFirebaseError(error)
    );


  } finally {

    signupButton.disabled = false;

  }

}


// ==========================================
// FIREBASE ERROR
// ==========================================

function getFirebaseError(error) {

  if (!error) {
    return "Kuch error aa gaya.";
  }


  console.error(
    "Firebase error:",
    error.code,
    error.message
  );


  switch (error.code) {

    case "auth/email-already-in-use":
      return "Ye email pehle se registered hai.";

    case "auth/invalid-email":
      return "Email galat hai.";

    case "auth/weak-password":
      return "Password aur strong rakho.";

    case "auth/invalid-credential":
      return "Email ya password galat hai.";

    case "auth/user-not-found":
      return "Is email ka account nahi mila.";

    case "auth/wrong-password":
      return "Password galat hai.";

    case "auth/too-many-requests":
      return "Bahut attempts ho gaye. Thodi der baad try karo.";

    case "auth/network-request-failed":
      return "Internet connection check karo.";

    default:
      return (
        "Firebase error: " +
        (error.code || error.message || "unknown")
      );

  }

}


// ==========================================
// BUTTON EVENTS
// ==========================================

if (loginButton) {

  loginButton.addEventListener(
    "click",
    handleLogin
  );

}


if (signupButton) {

  signupButton.addEventListener(
    "click",
    handleSignup
  );

}


// ==========================================
// AUTH STATE
// ==========================================

export function startAuthUI(
  onLoggedIn
) {

  try {

    watchAuthState(
      user => {

        if (user) {

          if (authScreen) {

            authScreen.classList.add(
              "hidden"
            );

          }


          if (
            typeof onLoggedIn ===
            "function"
          ) {

            onLoggedIn(user);

          }


        } else {

          if (authScreen) {

            authScreen.classList.remove(
              "hidden"
            );

          }

        }

      }
    );

  } catch (error) {

    console.error(
      "AUTH STATE ERROR:",
      error
    );

    showMessage(
      getFirebaseError(error)
    );

  }

}


// ==========================================
// LOGOUT
// ==========================================

export async function logoutSara() {

  await logout();

}
