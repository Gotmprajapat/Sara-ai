// js/personality.js

let saraMood = "normal";
let saraName = "Sara";


// ==========================================
// SET MOOD
// ==========================================

export function setSaraMood(mood) {

  const allowedMoods = [
    "normal",
    "happy",
    "sad",
    "angry",
    "annoyed",
    "excited",
    "calm"
  ];

  if (
    allowedMoods.includes(mood)
  ) {
    saraMood = mood;
  }

  return saraMood;
}


// ==========================================
// GET MOOD
// ==========================================

export function getSaraMood() {
  return saraMood;
}


// ==========================================
// SET NAME
// ==========================================

export function setSaraName(name) {

  if (
    name &&
    name.trim()
  ) {

    saraName =
      name.trim();

  }

  return saraName;
}


// ==========================================
// GET NAME
// ==========================================

export function getSaraName() {
  return saraName;
}


// ==========================================
// DETECT USER MOOD
// ==========================================

export function detectUserMood(text) {

  const t =
    (text || "")
      .toLowerCase();


  if (
    t.includes("sad") ||
    t.includes("dukhi") ||
    t.includes("udaas") ||
    t.includes("bura lag") ||
    t.includes("rona")
  ) {

    return "sad";

  }


  if (
    t.includes("khush") ||
    t.includes("happy") ||
    t.includes("mast") ||
    t.includes("accha lag")
  ) {

    return "happy";

  }


  if (
    t.includes("gussa") ||
    t.includes("naraz") ||
    t.includes("pareshan") ||
    t.includes("tang")
  ) {

    return "annoyed";

  }


  if (
    t.includes("wah") ||
    t.includes("awesome") ||
    t.includes("excited")
  ) {

    return "excited";

  }


  return "normal";
}


// ==========================================
// MOOD RESPONSE STYLE
// ==========================================

export function applyMoodToResponse(
  response,
  userText
) {

  const userMood =
    detectUserMood(
      userText
    );


  // User sad → Sara soft
  if (
    userMood === "sad"
  ) {

    setSaraMood("sad");

    return {
      ...response,
      mood: "sad"
    };

  }


  // User happy → Sara happy
  if (
    userMood === "happy"
  ) {

    setSaraMood("happy");

    return {
      ...response,
      mood: "happy"
    };

  }


  // User angry/annoyed
  if (
    userMood === "annoyed"
  ) {

    setSaraMood("calm");

    return {
      ...response,
      mood: "calm"
    };

  }


  return {
    ...response,
    mood:
      response.mood ||
      saraMood
  };
}
