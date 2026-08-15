// js/conversation.js

import {
  findKnowledge,
  remember
} from "./training.js";


// ==========================================
// NORMALIZE TEXT
// ==========================================

function cleanText(text) {

  return text
    .toLowerCase()
    .trim()
    .replace(/[?!.,]/g, "");

}


// ==========================================
// CHECK IF USER IS TEACHING SARA
// ==========================================

function getTrainingText(text) {

  const lower =
    cleanText(text);

  const patterns = [

    "yaad rakhna",
    "yaad rakh",
    "remember",
    "dhyan rakhna",
    "dhyan rakh",

    "mera naam",
    "meri mummy ka naam",
    "mere papa ka naam",

    "mujhe pasand hai",
    "mujhe pasand nahi hai"

  ];


  for (const pattern of patterns) {

    if (lower.includes(pattern)) {
      return true;
    }

  }

  return false;

}


// ==========================================
// SAVE TRAINING
// ==========================================

async function handleTraining(text) {

  await remember(text);

  return {
    text: "Haan, yaad rakh liya. ❤️",
    mood: "happy",
    known: true
  };

}


// ==========================================
// FIND ANSWER FROM MEMORY
// ==========================================

async function answerFromMemory(text) {

  const words =
    cleanText(text)
      .split(" ")
      .filter(word => word.length > 2);


  // Important words se memory search
  for (const word of words) {

    const results =
      await findKnowledge(word);


    if (results.length > 0) {

      return results[0].text;

    }

  }


  return null;

}


// ==========================================
// BASIC NORMAL CONVERSATION
// ==========================================

function basicReply(text) {

  const lower =
    cleanText(text);


  if (
    lower === "hi" ||
    lower === "hello" ||
    lower === "hii" ||
    lower === "hey"
  ) {

    return {
      text: "Haan 😊 bolo.",
      mood: "happy",
      known: true
    };

  }


  if (
    lower.includes("kaisi ho") ||
    lower.includes("kaise ho")
  ) {

    return {
      text: "Main bilkul theek hoon. Tum batao?",
      mood: "happy",
      known: true
    };

  }


  if (
    lower.includes("thank you") ||
    lower.includes("thanks") ||
    lower.includes("shukriya")
  ) {

    return {
      text: "Hmm 😊",
      mood: "happy",
      known: true
    };

  }


  if (
    lower.includes("sorry")
  ) {

    return {
      text: "Theek hai.",
      mood: "calm",
      known: true
    };

  }


  return null;

}


// ==========================================
// MAIN CONVERSATION ENGINE
// ==========================================

export async function talkToSara(
  userText
) {

  if (
    !userText ||
    !userText.trim()
  ) {

    return {
      text: "",
      mood: "normal",
      known: false
    };

  }


  const text =
    userText.trim();


  // ----------------------------------------
  // 1. USER IS TEACHING SARA
  // ----------------------------------------

  if (
    getTrainingText(text)
  ) {

    return handleTraining(text);

  }


  // ----------------------------------------
  // 2. BASIC CONVERSATION
  // ----------------------------------------

  const basic =
    basicReply(text);


  if (basic) {
    return basic;
  }


  // ----------------------------------------
  // 3. MEMORY
  // ----------------------------------------

  try {

    const memoryAnswer =
      await answerFromMemory(text);


    if (memoryAnswer) {

      return {
        text: memoryAnswer,
        mood: "normal",
        known: true
      };

    }

  } catch (error) {

    console.error(
      "Memory error:",
      error
    );

  }


  // ----------------------------------------
  // 4. UNKNOWN
  // ----------------------------------------

  return {

    text:
      "Mujhe iska abhi pata nahi hai.",

    mood:
      "normal",

    known:
      false

  };

    }
