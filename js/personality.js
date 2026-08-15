// js/personality.js

let currentMood =
  localStorage.getItem("saraMood") || "normal";

let currentState = "available";


// ==========================================
// MOODS
// ==========================================

const moods = {
  normal: {
    name: "normal",
    voiceRate: 0.95,
    pitch: 1.05
  },

  happy: {
    name: "happy",
    voiceRate: 1.02,
    pitch: 1.12
  },

  sad: {
    name: "sad",
    voiceRate: 0.88,
    pitch: 0.95
  },

  annoyed: {
    name: "annoyed",
    voiceRate: 0.92,
    pitch: 0.98
  },

  excited: {
    name: "excited",
    voiceRate: 1.08,
    pitch: 1.15
  },

  calm: {
    name: "calm",
    voiceRate: 0.90,
    pitch: 1.02
  }
};


// ==========================================
// SET MOOD
// ==========================================

export function setMood(mood) {

  if (!moods[mood]) {
    mood = "normal";
  }

  currentMood = mood;

  localStorage.setItem(
    "saraMood",
    mood
  );

  return moods[mood];
}


// ==========================================
// GET MOOD
// ==========================================

export function getMood() {

  return currentMood;

}


// ==========================================
// GET MOOD SETTINGS
// ==========================================

export function getMoodSettings() {

  return (
    moods[currentMood] ||
    moods.normal
  );

}


// ==========================================
// SET STATE
// ==========================================

export function setState(state) {

  currentState = state;

}


// ==========================================
// GET STATE
// ==========================================

export function getState() {

  return currentState;

}


// ==========================================
// DETECT BASIC EMOTION
// ==========================================

export function detectEmotion(text) {

  if (!text) {
    return "normal";
  }

  const message =
    text.toLowerCase();

  // Happy
  if (
    message.includes("khush") ||
    message.includes("happy") ||
    message.includes("mast") ||
    message.includes("accha laga") ||
    message.includes("😂") ||
    message.includes("😊")
  ) {
    return "happy";
  }


  // Sad
  if (
    message.includes("sad") ||
    message.includes("dukhi") ||
    message.includes("bura lag") ||
    message.includes("rona") ||
    message.includes("ro raha") ||
    message.includes("ro rahi")
  ) {
    return "sad";
  }


  // Annoyed / angry
  if (
    message.includes("gussa") ||
    message.includes("pareshan") ||
    message.includes("chup") ||
    message.includes("bas karo") ||
    message.includes("jao") ||
    message.includes("hat jao")
  ) {
    return "annoyed";
  }


  // Excited
  if (
    message.includes("wow") ||
    message.includes("wah") ||
    message.includes("zabardast") ||
    message.includes("mil gaya") ||
    message.includes("ho gaya")
  ) {
    return "excited";
  }


  return "normal";
}


// ==========================================
// HANDLE USER EMOTION
// ==========================================

export function updateMoodFromMessage(text) {

  const detected =
    detectEmotion(text);

  setMood(detected);

  return detected;

}


// ==========================================
// MOOD RESPONSE STYLE
// ==========================================

export function getResponseStyle() {

  switch (currentMood) {

    case "happy":
      return "friendly, warm and slightly playful";

    case "sad":
      return "soft, caring and calm";

    case "annoyed":
      return "short, slightly hurt and calm";

    case "excited":
      return "energetic and enthusiastic";

    case "calm":
      return "soft and relaxed";

    default:
      return "natural, concise and friendly";

  }

}
