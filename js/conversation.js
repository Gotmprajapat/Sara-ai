// js/conversation.js

import {
  findKnowledge,
  remember
} from "./training.js";


// ==========================================
// TEXT HELPERS
// ==========================================

function clean(text) {

  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[?!.,।]/g, "");

}


// ==========================================
// TRAINING / MEMORY DETECTION
// ==========================================

function extractFact(text) {

  const original =
    text.trim();

  const lower =
    clean(original);


  // ----------------------------------------
  // "mera naam Gautam hai"
  // ----------------------------------------

  let match =
    original.match(
      /mera naam\s+(.+?)\s+(?:hai|है)$/i
    );

  if (match) {

    return {
      key: "user_name",
      value: match[1].trim(),
      text:
        `User ka naam ${match[1].trim()} hai.`
    };

  }


  // ----------------------------------------
  // "meri mummy ka naam Sunita hai"
  // ----------------------------------------

  match =
    original.match(
      /meri mummy ka naam\s+(.+?)\s+(?:hai|है)/i
    );

  if (match) {

    return {
      key: "mother_name",
      value: match[1].trim(),
      text:
        `User ki mummy ka naam ${match[1].trim()} hai.`
    };

  }


  // ----------------------------------------
  // "mere papa ka naam ..."
  // ----------------------------------------

  match =
    original.match(
      /mere papa ka naam\s+(.+?)\s+(?:hai|है)/i
    );

  if (match) {

    return {
      key: "father_name",
      value: match[1].trim(),
      text:
        `User ke papa ka naam ${match[1].trim()} hai.`
    };

  }


  // ----------------------------------------
  // "mujhe ... pasand hai"
  // ----------------------------------------

  match =
    original.match(
      /mujhe\s+(.+?)\s+pasand hai/i
    );

  if (match) {

    return {
      key: "user_preference",
      value: match[1].trim(),
      text:
        `User ko ${match[1].trim()} pasand hai.`
    };

  }


  // ----------------------------------------
  // "mujhe ... pasand nahi hai"
  // ----------------------------------------

  match =
    original.match(
      /mujhe\s+(.+?)\s+pasand nahi hai/i
    );

  if (match) {

    return {
      key: "user_dislike",
      value: match[1].trim(),
      text:
        `User ko ${match[1].trim()} pasand nahi hai.`
    };

  }


  // ----------------------------------------
  // "yaad rakhna: ..."
  // ----------------------------------------

  const rememberPatterns = [
    "yaad rakhna",
    "yaad rakh",
    "dhyan rakhna",
    "dhyan rakh",
    "remember"
  ];


  for (
    const pattern of rememberPatterns
  ) {

    if (lower.startsWith(pattern)) {

      const value =
        original
          .slice(pattern.length)
          .trim();

      if (value) {

        return {
          key: "general_memory",
          value,
          text: value
        };

      }

    }

  }


  return null;

}


// ==========================================
// SAVE FACT
// ==========================================

async function saveFact(fact) {

  await remember(
    fact.text
  );

  return {

    text:
      "Haan, yaad rakh liya. ❤️",

    mood:
      "happy",

    known:
      true

  };

}


// ==========================================
// MEMORY SEARCH
// ==========================================

async function searchMemory(
  text
) {

  const lower =
    clean(text);


  // Specific questions first
  // ----------------------------------------

  if (
    lower.includes("mera naam") ||
    lower.includes("main kaun")
  ) {

    const result =
      await findKnowledge("User ka naam");

    if (result.length) {

      return result[0].text
        .replace(
          "User ka naam ",
          ""
        )
        .replace(
          " hai",
          ""
        ) + ".";

    }

  }


  if (
    lower.includes("mummy ka naam") ||
    lower.includes("maa ka naam") ||
    lower.includes("mom ka naam")
  ) {

    const result =
      await findKnowledge("mummy");

    if (result.length) {

      return result[0].text
        .replace(
          "User ki mummy ka naam ",
          ""
        )
        .replace(
          " hai.",
          ""
        ) + ".";

    }

  }


  if (
    lower.includes("papa ka naam") ||
    lower.includes("father ka naam")
  ) {

    const result =
      await findKnowledge("papa");

    if (result.length) {

      return result[0].text
        .replace(
          "User ke papa ka naam ",
          ""
        )
        .replace(
          " hai.",
          ""
        ) + ".";

    }

  }


  // ----------------------------------------
  // General keyword search
  // ----------------------------------------

  const words =
    lower
      .split(/\s+/)
      .filter(
        word => word.length >= 3
      );


  for (
    const word of words
  ) {

    const result =
      await findKnowledge(word);

    if (result.length) {

      return result[0].text;

    }

  }


  return null;

}


// ==========================================
// BASIC CONVERSATION
// ==========================================

function basicReply(text) {

  const lower =
    clean(text);


  if (
    /^(hi|hii|hello|hey)$/.test(
      lower
    )
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
      text:
        "Main theek hoon. Tum batao?",
      mood:
        "happy",
      known:
        true
    };

  }


  if (
    lower.includes("good morning")
  ) {

    return {
      text:
        "Good morning 😊",
      mood:
        "happy",
      known:
        true
    };

  }


  if (
    lower.includes("thank you") ||
    lower.includes("thanks")
  ) {

    return {
      text:
        "Hmm 😊",
      mood:
        "happy",
      known:
        true
    };

  }


  if (
    lower === "sorry" ||
    lower.includes("sorry sara")
  ) {

    return {
      text:
        "Theek hai.",
      mood:
        "normal",
      known:
        true
    };

  }


  return null;

}


// ==========================================
// MAIN ENGINE
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
  // 1. Check if user is teaching
  // ----------------------------------------

  const fact =
    extractFact(text);


  if (fact) {

    return saveFact(
      fact
    );

  }


  // ----------------------------------------
  // 2. Basic conversation
  // ----------------------------------------

  const basic =
    basicReply(text);


  if (basic) {
    return basic;
  }


  // ----------------------------------------
  // 3. Search memory
  // ----------------------------------------

  try {

    const memoryAnswer =
      await searchMemory(text);


    if (memoryAnswer) {

      return {

        text:
          memoryAnswer,

        mood:
          "normal",

        known:
          true

      };

    }

  } catch (error) {

    console.error(
      "Memory search error:",
      error
    );

  }


  // ----------------------------------------
  // 4. Unknown
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
