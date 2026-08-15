// js/app.js

import { initializeFirebase } from "./firebase.js";

import {
  startAuthUI
} from "./auth-ui.js";

import {
  speak,
  listen,
  stopSpeaking
} from "./voice.js";

import {
  askSara
} from "./ai.js";


// ==========================================
// SARA STATE
// ==========================================

const Sara = {
  name: localStorage.getItem("saraName") || "Sara",

  active: false,

  mood: "normal",

  listening: false,

  speaking: false
};


// ==========================================
// ELEMENTS
// ==========================================

const saraApp =
  document.getElementById("saraApp");

const avatarContainer =
  document.getElementById("avatarContainer");

const saraStatus =
  document.getElementById("saraStatus");

const saraMessage =
  document.getElementById("saraMessage");

const voiceButton =
  document.getElementById("voiceButton");

const voiceStatus =
  document.getElementById("voiceStatus");

const activateButton =
  document.getElementById("activateButton");


// ==========================================
// FIREBASE
// ==========================================

async function startFirebase() {

  try {

    await initializeFirebase();

    console.log(
      "Firebase connected"
    );

  } catch (error) {

    console.error(
      "Firebase error:",
      error
    );

  }

}


// ==========================================
// STATUS
// ==========================================

function setStatus(text) {

  if (saraStatus) {
    saraStatus.textContent = text;
  }

}


// ==========================================
// MOOD
// ==========================================

function setMood(mood) {

  Sara.mood = mood;

  avatarContainer?.classList.remove(
    "happy",
    "sad",
    "annoyed",
    "excited"
  );

  if (
    mood === "happy" ||
    mood === "sad" ||
    mood === "annoyed" ||
    mood === "excited"
  ) {

    avatarContainer?.classList.add(
      mood
    );

  }

}


// ==========================================
// SARA SPEAK
// ==========================================

async function SaraSpeak(
  text,
  mood = "normal"
) {

  if (!text) return;

  Sara.speaking = true;

  setMood(mood);

  if (saraMessage) {
    saraMessage.textContent = text;
  }

  setStatus(
    "Sara bol rahi hai..."
  );

  avatarContainer?.classList.add(
    "speaking"
  );

  try {

    await speak(
      text,
      mood
    );

  } catch (error) {

    console.error(
      "Voice error:",
      error
    );

  }

  avatarContainer?.classList.remove(
    "speaking"
  );

  Sara.speaking = false;

  setStatus(
    "Sara ready"
  );

}


// ==========================================
// LISTEN
// ==========================================

async function listenToUser() {

  if (!Sara.active) {

    await SaraSpeak(
      "Pehle mujhe activate karo.",
      "normal"
    );

    return;
  }


  if (Sara.listening) {
    return;
  }


  Sara.listening = true;

  voiceButton?.classList.add(
    "listening"
  );

  if (voiceStatus) {

    voiceStatus.textContent =
      "Sun rahi hoon...";

  }

  setStatus(
    "Sara sun rahi hai..."
  );


  try {

    const userText =
      await listen();


    console.log(
      "User:",
      userText
    );


    if (!userText) {
      return;
    }


    // Temporary testing:
    // Actual AI backend next stage me connect hoga.

    if (saraMessage) {

      saraMessage.textContent =
        userText;

    }


    setStatus(
      "Sara soch rahi hai..."
    );


    const response =
      await askSara(
        userText
      );


    await SaraSpeak(
      response.text,
      response.mood
    );


  } catch (error) {

    console.error(
      "Listening error:",
      error
    );


    await SaraSpeak(
      "Mujhe sunai nahi diya. Dobara bolo.",
      "normal"
    );


  } finally {

    Sara.listening = false;

    voiceButton?.classList.remove(
      "listening"
    );

    if (voiceStatus) {

      voiceStatus.textContent =
        "Baat karne ke liye tap karo";

    }

  }

}


// ==========================================
// ACTIVATE
// ==========================================

function activateSara() {

  Sara.active = true;

  activateButton?.classList.add(
    "active"
  );

  if (activateButton) {

    activateButton.textContent =
      "SARA ACTIVE";

  }

  setStatus(
    "Sara active"
  );

  SaraSpeak(
    "Haan, bolo 😊",
    "happy"
  );

}


// ==========================================
// DEACTIVATE
// ==========================================

function deactivateSara() {

  Sara.active = false;

  stopSpeaking();

  avatarContainer?.classList.remove(
    "speaking"
  );

  activateButton?.classList.remove(
    "active"
  );

  if (activateButton) {

    activateButton.textContent =
      "ACTIVATE SARA";

  }

  setStatus(
    "Sara ready"
  );

}


// ==========================================
// BUTTON EVENTS
// ==========================================

activateButton?.addEventListener(
  "click",
  () => {

    if (Sara.active) {

      deactivateSara();

    } else {

      activateSara();

    }

  }
);


voiceButton?.addEventListener(
  "click",
  listenToUser
);


// ==========================================
// START AFTER LOGIN
// ==========================================

async function startSara(user) {

  console.log(
    "Sara user:",
    user.uid
  );

  saraApp?.classList.remove(
    "hidden"
  );

  setStatus(
    "Sara ready"
  );

}


// ==========================================
// PUBLIC CONTROLLER
// ==========================================

window.Sara = {

  activate: activateSara,

  deactivate: deactivateSara,

  listen: listenToUser,

  speak: SaraSpeak,

  setMood: setMood

};


// ==========================================
// START APPLICATION
// ==========================================

async function startApp() {

  await startFirebase();

  startAuthUI(
    startSara
  );

}


startApp();
