   // js/conversation.js

import {
  processResponse
} from "./response.js";

import {
  findKnowledge,
  remember
} from "./training.js";


// ===============================
// CLEAN TEXT
// ===============================

function clean(text) {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[?!.,।]/g, "");
}


// ===============================
// TRAINING / MEMORY
// ===============================

function extractFact(text) {

  const original = text.trim();

  let match = original.match(
    /mera naam\s+(.+?)\s+(?:hai|है)/i
  );

  if (match) {
    return {
      text: `User ka naam ${match[1].trim()} hai.`
    };
  }


  match = original.match(
    /meri mummy ka naam\s+(.+?)\s+(?:hai|है)/i
  );

  if (match) {
    return {
      text: `User ki mummy ka naam ${match[1].trim()} hai.`
    };
  }


  match = original.match(
    /mere papa ka naam\s+(.+?)\s+(?:hai|है)/i
  );

  if (match) {
    return {
      text: `User ke papa ka naam ${match[1].trim()} hai.`
    };
  }


  match = original.match(
    /mujhe\s+(.+?)\s+pasand nahi hai/i
  );

  if (match) {
    return {
      text:
        `User ko ${match[1].trim()} pasand nahi hai.`
    };
  }


  match = original.match(
    /mujhe\s+(.+?)\s+pasand hai/i
  );

  if (match) {
    return {
      text:
        `User ko ${match[1].trim()} pasand hai.`
    };
  }


  const lower = clean(original);

  const rememberWords = [
    "yaad rakhna",
    "yaad rakh",
    "dhyan rakhna",
    "dhyan rakh",
    "remember"
  ];

  for (const word of rememberWords) {

    if (lower.startsWith(word)) {

      const value =
        original.slice(word.length).trim();

      if (value) {
        return {
          text: value
        };
      }
    }
  }

  return null;
}


// ===============================
// SAVE MEMORY
// ===============================

async function saveFact(fact) {

  await remember(fact.text);

  return {
    text: "Haan, yaad rakh liya. ❤️",
    mood: "happy",
    known: true
  };
}


// ===============================
// MEMORY SEARCH
// ===============================

async function searchMemory(text) {

  const lower = clean(text);


  if (
    lower.includes("mera naam") ||
    lower.includes("main kaun")
  ) {

    const result =
      await findKnowledge("User ka naam");

    if (result.length) {

      return result[0].text
        .replace("User ka naam ", "")
        .replace(" hai.", "")
        .replace(" hai", "") + ".";
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
        .replace(" hai.", "")
        .replace(" hai", "") + ".";
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
        .replace(" hai.", "")
        .replace(" hai", "") + ".";
    }
  }


  const words =
    lower
      .split(/\s+/)
      .filter(
        word => word.length >= 3
      );


  for (const word of words) {

    const result =
      await findKnowledge(word);

    if (result.length) {
      return result[0].text;
    }
  }


  return null;
}

function generateNaturalReply(text) {

  const t =
    text.toLowerCase();


  if (
    t.includes("kahan") ||
    t.includes("kaha")
  ) {

    return "Pata nahi 😅 tum batao, main yaad rakh lungi.";

  }


  if (
    t.includes("kya") ||
    t.includes("kaise") ||
    t.includes("kyu") ||
    t.includes("kyon")
  ) {

    return "Hmm 🤔 iska exact answer mujhe abhi nahi pata.";

  }


  if (
    t.includes("kaun")
  ) {

    return "Ye mujhe abhi yaad nahi hai 😅";

  }


  return "Hmm, iske baare me mujhe abhi yaad nahi hai. Tum bata do, main yaad rakh lungi.";
}

// ===============================
// BASIC TALK
// ===============================

function basicReply(text) {

  const lower = clean(text);


  if (
    /^(hi|hii|hello|hey)$/.test(lower)
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


// ===============================
// MAIN CONVERSATION
// ===============================

export async function talkToSara(
  userText
) {

  if (
    !userText ||
    !userText.trim()
  ) {

    return processResponse(
      {
        text: "",
        mood: "normal",
        known: false
      },
      userText
    );

  }


  const text =
    userText.trim();


  // ===============================
  // USER TRAINING
  // ===============================

  const fact =
    extractFact(text);

  if (fact) {

    const response =
      await saveFact(fact);

    return processResponse(
      response,
      userText
    );

  }


  // ===============================
  // BASIC TALK
  // ===============================

  const basic =
    basicReply(text);

  if (basic) {

    return processResponse(
      basic,
      userText
    );

  }


  // ===============================
  // LONG-TERM MEMORY
  // ===============================

  try {

    const answer =
      await searchMemory(text);

    if (answer) {

      return processResponse(
        {
          text: answer,
          mood: "normal",
          known: true
        },
        userText
      );

    }

  } catch (error) {

    console.error(
      "Memory search error:",
      error
    );

  }


  // ===============================
  // UNKNOWN
  // ===============================

  return processResponse(
  {
    text:
      generateNaturalReply(userText),
    mood:
      "normal",
    known:
      false
  },
  userText
);
