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
// MOOD
// ==========================================

function setMood(mood = "normal") {

  Sara.mood = mood;

  avatarContainer?.classList.remove(
    "happy",
    "sad",
    "annoyed",
    "excited"
  );

  if (
    ["happy", "sad", "annoyed", "excited"]
      .includes(mood)
  ) {
    avatarContainer?.classList.add(mood);
  }
}


// ==========================================
// SARA SPEAK
// ==========================================

async function SaraSpeak(text, mood = "normal") {

  if (!text) return;

  Sara.speaking = true;

  setMood(mood);

  if (saraMessage) {
    saraMessage.textContent = text;
  }

  if (saraStatus) {
    saraStatus.textContent =
      "Sara bol rahi hai...";
  }

  avatarContainer?.classList.add(
    "speaking"
  );

  try {

    await window.SaraVoice.speak(
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

  if (saraStatus) {
    saraStatus.textContent =
      Sara.active
        ? "Sara active"
        : "Sara ready";
  }
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

  if (saraStatus) {
    saraStatus.textContent =
      "Sara sun rahi hai...";
  }


  try {

    const userText =
      await window.SaraVoice.listen();


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


    if (saraStatus) {
      saraStatus.textContent =
        "Sara soch rahi hai...";
    }


    const response =
      await window.SaraAssistant.process(
        userText
      );


    await SaraSpeak(
      response.text,
      response.mood || "normal"
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

async function activateSara() {

  Sara.active = true;

  activateButton?.classList.add(
    "active"
  );

  if (activateButton) {
    activateButton.textContent =
      "SARA ACTIVE";
  }

  if (saraStatus) {
    saraStatus.textContent =
      "Sara active";
  }

  await SaraSpeak(
    "Haan, bolo 😊",
    "happy"
  );
}


// ==========================================
// DEACTIVATE
// ==========================================

function deactivateSara() {

  Sara.active = false;

  window.SaraVoice?.stopSpeaking();

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

  if (saraStatus) {
    saraStatus.textContent =
      "Sara ready";
  }
}


// ==========================================
// START AFTER LOGIN
// ==========================================

async function startSara(user) {

  console.log(
    "Logged in:",
    user.uid
  );

  saraApp?.classList.remove(
    "hidden"
  );


  // Voice module
  const voice =
    await import("./voice.js");

  window.SaraVoice = voice;


  // Assistant module
  const assistant =
    await import("./assistant.js");

  window.SaraAssistant =
    assistant;


  // Activate button
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


  // Mic button
  voiceButton?.addEventListener(
    "click",
    listenToUser
  );


  if (saraStatus) {
    saraStatus.textContent =
      "Sara ready";
  }


  console.log(
    "Sara fully loaded"
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

    startAuthUI(
      startSara
    );

  } catch (error) {

    console.error(
      "APP ERROR:",
      error
    );

    const message =
      document.getElementById(
        "authMessage"
      );

    if (message) {
      message.textContent =
        "App error: " +
        error.message;
    }

  }
}


startApp();
