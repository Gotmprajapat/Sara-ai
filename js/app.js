// js/app.js

import { initializeFirebase } from "./firebase.js";

import {
  startAuthUI
} from "./auth-ui.js";


// ==========================================
// SARA STATE
// ==========================================

const Sara = {
  name: localStorage.getItem("saraName") || "Sara",

  active: false,

  mood: "normal",

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

const activateButton =
  document.getElementById("activateButton");


// ==========================================
// FIREBASE
// ==========================================

async function startFirebase() {

  try {

    await initializeFirebase();

    console.log(
      "Firebase connected successfully"
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
// SARA MOOD
// ==========================================

function setMood(mood) {

  Sara.mood = mood;

  avatarContainer?.classList.remove(
    "happy",
    "sad",
    "annoyed"
  );

  if (
    mood === "happy" ||
    mood === "sad" ||
    mood === "annoyed"
  ) {

    avatarContainer?.classList.add(mood);

  }

}


// ==========================================
// SHOW SARA
// ==========================================

function showSara() {

  saraApp?.classList.remove(
    "hidden"
  );

}


// ==========================================
// START SARA AFTER LOGIN
// ==========================================

async function startSara(user) {

  console.log(
    "Sara user:",
    user.uid
  );

  showSara();

  setStatus(
    "Sara ready"
  );

  Sara.active = false;

  if (saraMessage) {

    saraMessage.textContent =
      "Haan, main ready hoon 😊";

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

  setMood("happy");

  setStatus(
    "Sara active"
  );

  if (saraMessage) {

    saraMessage.textContent =
      "Haan, bolo 😊";

  }

}


// ==========================================
// DEACTIVATE
// ==========================================

function deactivateSara() {

  Sara.active = false;

  activateButton?.classList.remove(
    "active"
  );

  if (activateButton) {

    activateButton.textContent =
      "ACTIVATE SARA";

  }

  setMood("normal");

  setStatus(
    "Sara ready"
  );

}


// ==========================================
// ACTIVATE BUTTON
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


// ==========================================
// PUBLIC CONTROLLER
// ==========================================

window.Sara = {

  activate: activateSara,

  deactivate: deactivateSara,

  setMood: setMood,

  getMood: () => Sara.mood

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
