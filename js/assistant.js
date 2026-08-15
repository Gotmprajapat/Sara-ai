// js/assistant.js

import { talkToSara } from "./conversation.js";


// ==========================================
// ACTION TYPES
// ==========================================

const ACTIONS = {
  SEARCH: "search",
  OPEN_APP: "open_app",
  PHONE_ACTION: "phone_action",
  MEMORY: "memory",
  TALK: "talk",
  UNKNOWN: "unknown"
};


// ==========================================
// COMMAND DETECTION
// ==========================================

function detectAction(text) {

  const t =
    text.toLowerCase().trim();


  // Web/search
  if (
    t.includes("search") ||
    t.includes("google par") ||
    t.includes("dhundho") ||
    t.includes("pata karo") ||
    t.includes("check karo")
  ) {

    return ACTIONS.SEARCH;

  }


  // Apps
  if (
    t.includes("youtube kholo") ||
    t.includes("youtube open") ||
    t.includes("instagram kholo") ||
    t.includes("instagram open")
  ) {

    return ACTIONS.OPEN_APP;

  }


  // Phone commands
  if (
    t.includes("brightness") ||
    t.includes("volume") ||
    t.includes("wifi") ||
    t.includes("bluetooth")
  ) {

    return ACTIONS.PHONE_ACTION;

  }


  return ACTIONS.TALK;

}


// ==========================================
// SEARCH
// ==========================================

async function searchWeb(query) {

  const cleanQuery =
    query
      .replace(/search/gi, "")
      .replace(/google par/gi, "")
      .replace(/dhundho/gi, "")
      .replace(/pata karo/gi, "")
      .replace(/check karo/gi, "")
      .trim();


  if (!cleanQuery) {

    return {
      success: false,
      text: "Kya search karna hai?"
    };

  }


  // Abhi browser search.
  // Final Android app me Sara is result ko
  // process karke short answer degi.

  const url =
    "https://www.google.com/search?q=" +
    encodeURIComponent(cleanQuery);


  window.open(
    url,
    "_blank"
  );


  return {

    success: true,

    text:
      `Theek hai, "${cleanQuery}" search kar rahi hoon.`

  };

}


// ==========================================
// OPEN APP
// ==========================================

async function openApp(text) {

  const t =
    text.toLowerCase();


  if (t.includes("youtube")) {

    window.open(
      "https://www.youtube.com/",
      "_blank"
    );

    return {
      success: true,
      text: "YouTube khol rahi hoon."
    };

  }


  if (t.includes("instagram")) {

    window.open(
      "https://www.instagram.com/",
      "_blank"
    );

    return {
      success: true,
      text: "Instagram khol rahi hoon."
    };

  }


  return {

    success: false,

    text:
      "Ye app abhi mere control me nahi hai."

  };

}


// ==========================================
// PHONE ACTION
// ==========================================

async function phoneAction(text) {

  return {

    success: false,

    requiresAndroid: true,

    text:
      "Ye kaam Android app ki permission ke baad kar paungi."

  };

}


// ==========================================
// MAIN ASSISTANT
// ==========================================

export async function processAssistant(
  userText
) {

  if (
    !userText ||
    !userText.trim()
  ) {

    return {
      text: "",
      mood: "normal"
    };

  }


  const action =
    detectAction(
      userText
    );


  // Search
  if (
    action === ACTIONS.SEARCH
  ) {

    return searchWeb(
      userText
    );

  }


  // App
  if (
    action === ACTIONS.OPEN_APP
  ) {

    return openApp(
      userText
    );

  }


  // Phone
  if (
    action === ACTIONS.PHONE_ACTION
  ) {

    return phoneAction(
      userText
    );

  }


  // Normal conversation
  return talkToSara(
    userText
  );

}


// ==========================================
// EXPORT
// ==========================================

window.SaraAssistant = {

  process:
    processAssistant

};⁰
