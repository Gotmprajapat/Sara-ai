// js/ai.js
//
// Sara AI brain interface.
// IMPORTANT:
// Secret AI API keys yahan mat daalna.
// Final app me secure backend/API ke through AI call hogi.

import {
  getMemories,
  searchMemories
} from "./memory.js";

import {
  getMood,
  getResponseStyle,
  updateMoodFromMessage
} from "./personality.js";


// ==========================================
// AI SETTINGS
// ==========================================

const AI_CONFIG = {
  endpoint: "/api/sara",
  maxMemories: 20
};


// ==========================================
// BUILD SARA CONTEXT
// ==========================================

async function buildContext(userMessage) {

  let memories = [];

  try {

    memories =
      await searchMemories(userMessage);

  } catch (error) {

    console.log(
      "Memory search unavailable:",
      error
    );

  }


  // Agar exact matching memory nahi mili,
  // recent memories use karenge.

  if (!memories.length) {

    try {

      memories =
        await getMemories();

      memories =
        memories.slice(
          -AI_CONFIG.maxMemories
        );

    } catch (error) {

      console.log(
        "Could not load memories:",
        error
      );

    }

  }


  return {

    mood: getMood(),

    responseStyle:
      getResponseStyle(),

    memories: memories.map(
      memory => memory.text
    )

  };

}


// ==========================================
// ASK SARA
// ==========================================

export async function askSara(userMessage) {

  if (!userMessage || !userMessage.trim()) {

    return {
      text: "",
      mood: "normal"
    };

  }


  const text =
    userMessage.trim();


  // User ke message se basic mood update
  const detectedMood =
    updateMoodFromMessage(text);


  // Sara ka context
  const context =
    await buildContext(text);


  const requestBody = {

    message: text,

    context: {

      ...context,

      mood: detectedMood

    },

    assistant: {

      name: "Sara",

      style:
        "natural, concise, emotionally aware",

      language:
        "Hindi/Hinglish",

      avoid:
        "unnecessarily long replies"

    }

  };


  try {

    const response =
      await fetch(
        AI_CONFIG.endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(
              requestBody
            )
        }
      );


    if (!response.ok) {

      throw new Error(
        "AI server returned " +
        response.status
      );

    }


    const data =
      await response.json();


    return {

      text:
        data.text ||
        "Hmm... ek baar phir bolo.",

      mood:
        data.mood ||
        detectedMood

    };


  } catch (error) {

    console.error(
      "Sara AI error:",
      error
    );


    // Abhi backend nahi bana hai,
    // isliye temporary response.

    return {

      text:
        "Main ready hoon. AI brain connect hone ke baad main tumse properly baat kar paungi.",

      mood:
        detectedMood

    };

  }

}


// ==========================================
// CHECK AI CONNECTION
// ==========================================

export async function checkAI() {

  try {

    const response =
      await fetch(
        AI_CONFIG.endpoint,
        {
          method: "GET"
        }
      );

    return response.ok;

  } catch {

    return false;

  }

        }
