// js/app.js

import { initializeFirebase } from "./firebase.js";
import { startAuthUI } from "./auth-ui.js";


// ==========================================
// SARA STATE
// ==========================================

const Sara = {
  active: false,
  listening: false,
  speaking: false,
  mood: "normal"
};


// ==========================================
// ELEMENTS
// ==========================================

const saraApp =
  document.getElementById("saraApp");

const activateButton =
  document.getElementById("activateButton");

const saraStatus =
  document.getElementById("saraStatus");


// ==========================================
// START AFTER LOGIN
// ==========================================

async function startSara(user) {

  console.log("Logged in:", user.uid);

  document
    .getElementById("authScreen")
    ?.classList.add("hidden");

  saraApp
    ?.classList.remove("hidden");

  if (saraStatus) {
    saraStatus.textContent =
      "Sara ready";
  }


  // Sara ke heavy modules ab login ke baad load honge
  const voice =
    await import("./voice.js");

  const assistant =
    await import("./assistant.js");


  window.SaraVoice = voice;
  window.SaraAssistant = assistant;


  activateButton?.addEventListener(
    "click",
    async () => {

      Sara.active = !Sara.active;

      if (Sara.active) {

        if (saraStatus) {
          saraStatus.textContent =
            "Sara active";
        }

        await voice.speak(
          "Haan, bolo 😊",
          "happy"
        );

      } else {

        voice.stopSpeaking();

        if (saraStatus) {
          saraStatus.textContent =
            "Sara ready";
        }

      }

    }
  );


  console.log(
    "Sara modules loaded successfully"
  );

}


// ==========================================
// START APP
// ==========================================

async function startApp() {

  try {

    await initializeFirebase();

    console.log(
      "Firebase connected"
    );

    startAuthUI(
      startSara
    );

  } catch (error) {

    console.error(
      "APP START ERROR:",
      error
    );

    const message =
      document.getElementById(
        "authMessage"
      );

    if (message) {

      message.textContent =
        "App error: " +
        (error.message || error);

    }

  }

}


startApp();
