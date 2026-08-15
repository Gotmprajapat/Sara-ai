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
  processAssistant
} from "./assistant.js";


// ==========================================
// SARA STATE
// ==========================================

const Sara = {
  name: localStorage.getItem("saraName") || "Sara",
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

  Sara.mood = mood || "normal";

  avatarContainer?.classList.remove(
    "happy",
    "sad",
    "annoyed",
    "excited"
  );

  if (
    ["happy", "sad", "annoyed", "excited"]
      .includes(Sara.mood)
  ) {

    avatarContainer?.classList.add(
      Sara.mood
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
      "Speech error:",
      error
    );

  }

  avatarContainer?.classList.remove(
    "speaking"
  );

  Sara.speaking = false;

  setStatus(
    Sara.active
      ? "Sara active"
      : "Sara ready"
  );

}


// ==========================================
// LISTEN + TALK
// ==========================================

async function listenToUser() {

  if (!Sara.active) {

    await SaraSpeak(
      "Pehle mujhe activate karo.",
      "normal"
    );

    return;

  }


  if (
    Sara.listening ||
    Sara.speaking
  ) {
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


    if (!userText) {
      return;
    }


    console.log(
      "Tum:",
      userText
    );


    if (saraMessage) {
      saraMessage.textContent =
        userText;
    }


    setStatus(
      "Sara soch rahi hai..."
    );


    const response =
  await processAssistant(
    userText
  );


    await SaraSpeak(
      response.text,
      response.mood
    );


  } catch (error) {

    console.error(
      "Voice input error:",
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

  Sara.listening = false;

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
// BUTTONS
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
// AFTER LOGIN
// ==========================================

async function startSara(user) {

  console.log(
    "Logged in:",
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
// FIREBASE
// ==========================================

async function startApp() {

  try {

    await initializeFirebase();

    console.log(
      "Firebase connected"
    );

  } catch (error) {

    console.error(
      "Firebase connection error:",
      error
    );

  }


  startAuthUI(
    startSara
  );

}


startApp();


// ==========================================
// GLOBAL
// ==========================================

window.Sara = {

  activate: activateSara,

  deactivate: deactivateSara,

  listen: listenToUser,

  speak: SaraSpeak,

  setMood: setMood

};
