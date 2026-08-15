// ==========================================
// SARA AI - MAIN APP CONTROLLER
// ==========================================

import { initializeFirebase } from "./firebase.js";
import { speak, stopSpeaking } from "./voice.js";
import {
  getMemories,
  saveMemory
} from "./memory.js";
import {
  setMood,
  getMood
} from "./personality.js";


// ------------------------------------------
// App State
// ------------------------------------------

const Sara = {
  name: localStorage.getItem("saraName") || "Sara",

  active: false,

  mood: "normal",

  isSpeaking: false,

  isListening: false
};


// ------------------------------------------
// Elements
// ------------------------------------------

const avatarContainer =
  document.getElementById("avatarContainer");

const avatar =
  document.getElementById("saraAvatar");

const status =
  document.getElementById("saraStatus");

const saraMessage =
  document.getElementById("saraMessage");

const activateButton =
  document.getElementById("activateButton");


// ------------------------------------------
// Firebase
// ------------------------------------------

async function startFirebase() {

  try {

    await initializeFirebase();

    console.log("Firebase connected");

  } catch (error) {

    console.error(
      "Firebase connection error:",
      error
    );

  }

}


// ------------------------------------------
// Sara Status
// ------------------------------------------

function updateStatus(text) {

  if (status) {
    status.textContent = text;
  }

}


// ------------------------------------------
// Sara Animation
// ------------------------------------------

function startSpeakingAnimation() {

  Sara.isSpeaking = true;

  avatarContainer?.classList.add("speaking");

}


function stopSpeakingAnimation() {

  Sara.isSpeaking = false;

  avatarContainer?.classList.remove("speaking");

}


// ------------------------------------------
// Mood
// ------------------------------------------

function updateMood(mood) {

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

  setMood(mood);

}


// ------------------------------------------
// Sara Reply
// ------------------------------------------

async function SaraSpeak(text, mood = "normal") {

  if (!text) return;

  updateMood(mood);

  if (saraMessage) {
    saraMessage.textContent = text;
  }

  updateStatus("Sara bol rahi hai...");

  startSpeakingAnimation();

  try {

    await speak(text);

  } catch (error) {

    console.error(
      "Voice error:",
      error
    );

  }

  stopSpeakingAnimation();

  updateStatus("Sara ready");

}


// ------------------------------------------
// Activate Sara
// ------------------------------------------

function activateSara() {

  Sara.active = true;

  activateButton?.classList.add("active");

  if (activateButton) {
    activateButton.textContent =
      "SARA ACTIVE";
  }

  updateStatus("Sara active");

  SaraSpeak(
    "Haan, main ready hoon. Bolo 😊",
    "happy"
  );

}


// ------------------------------------------
// Deactivate Sara
// ------------------------------------------

function deactivateSara() {

  Sara.active = false;

  stopSpeaking();

  stopSpeakingAnimation();

  activateButton?.classList.remove("active");

  if (activateButton) {
    activateButton.textContent =
      "ACTIVATE SARA";
  }

  updateStatus("Sara inactive");

}


// ------------------------------------------
// Activate Button
// ------------------------------------------

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


// ------------------------------------------
// Hide Sara
// ------------------------------------------

function hideSara() {

  Sara.active = false;

  stopSpeaking();

  const app =
    document.getElementById("saraApp");

  if (app) {

    app.classList.add("saraHidden");

  }

}


// ------------------------------------------
// Show Sara
// ------------------------------------------

function showSara() {

  const app =
    document.getElementById("saraApp");

  if (app) {

    app.classList.remove("saraHidden");

  }

  Sara.active = true;

}


// ------------------------------------------
// Save Memory
// ------------------------------------------

async function remember(text) {

  if (!text) return;

  try {

    await saveMemory(text);

    console.log(
      "Memory saved:",
      text
    );

  } catch (error) {

    console.error(
      "Memory save error:",
      error
    );

  }

}


// ------------------------------------------
// Load Memory
// ------------------------------------------

async function loadSaraMemory() {

  try {

    const memories =
      await getMemories();

    console.log(
      "Sara memories:",
      memories
    );

  } catch (error) {

    console.error(
      "Memory loading error:",
      error
    );

  }

}


// ------------------------------------------
// Custom Name
// ------------------------------------------

function setSaraName(name) {

  if (!name) return;

  Sara.name = name.trim();

  localStorage.setItem(
    "saraName",
    Sara.name
  );

}


// ------------------------------------------
// Start App
// ------------------------------------------

async function startSaraApp() {

  console.log(
    "Starting Sara AI..."
  );

  await startFirebase();

  await loadSaraMemory();

  updateStatus("Sara ready");

}


// ------------------------------------------
// Public Sara Controller
// ------------------------------------------

window.Sara = {

  activate: activateSara,

  deactivate: deactivateSara,

  hide: hideSara,

  show: showSara,

  speak: SaraSpeak,

  remember: remember,

  setName: setSaraName,

  setMood: updateMood,

  getMood: () => Sara.mood

};


// ------------------------------------------
// Start
// ------------------------------------------

startSaraApp();
