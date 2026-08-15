// js/training.js

import {
  saveMemory,
  getMemories,
  deleteMemory
} from "./memory.js";


// ==========================================
// TRAIN SARA
// ==========================================

export async function trainSara(
  information,
  type = "personal"
) {

  if (!information || !information.trim()) {
    return false;
  }

  await saveMemory(
    information.trim(),
    type
  );

  return true;
}


// ==========================================
// REMEMBER
// ==========================================

export async function remember(
  information
) {

  return trainSara(
    information,
    "personal"
  );

}


// ==========================================
// GET EVERYTHING SARA KNOWS
// ==========================================

export async function getSaraKnowledge() {

  const memories =
    await getMemories();

  return memories;

}


// ==========================================
// FORGET
// ==========================================

export async function forgetMemory(
  memoryId
) {

  if (!memoryId) {
    return false;
  }

  await deleteMemory(
    memoryId
  );

  return true;

}


// ==========================================
// FIND SOMETHING SARA KNOWS
// ==========================================

export async function findKnowledge(
  keyword
) {

  const memories =
    await getMemories();

  if (!keyword) {
    return [];
  }

  const search =
    keyword
      .toLowerCase()
      .trim();


  return memories.filter(
    memory =>
      memory.text &&
      memory.text
        .toLowerCase()
        .includes(search)
  );

}
