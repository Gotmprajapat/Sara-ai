// js/response.js

import {
  applyMoodToResponse
} from "./personality.js";


// ==========================================
// SHORTEN RESPONSE
// ==========================================

function makeShort(text) {

  if (!text) {
    return "";
  }

  text = text.trim();

  // Bahut lamba answer avoid karo
  if (text.length > 180) {
    text =
      text.substring(0, 177).trim() + "...";
  }

  return text;
}


// ==========================================
// PROCESS RESPONSE
// ==========================================

export function processResponse(
  response,
  userText
) {

  if (!response) {

    return {
      text:
        "Mujhe samajh nahi aaya.",
      mood:
        "normal",
      known:
        false
    };

  }


  const processed = {
    ...response,

    text:
      makeShort(
        response.text
      )
  };


  return applyMoodToResponse(
    processed,
    userText
  );
}


// ==========================================
// UNKNOWN RESPONSE
// ==========================================

export function unknownResponse(
  userText = ""
) {

  return processResponse(
    {
      text:
        "Mujhe iska abhi pata nahi hai.",
      mood:
        "normal",
      known:
        false
    },
    userText
  );

}
