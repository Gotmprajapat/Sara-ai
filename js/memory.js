// js/memory.js

import {
  getDatabase,
  ref,
  push,
  get,
  remove
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

import {
  getCurrentUser
} from "./auth.js";


// ==========================================
// USER MEMORY REFERENCE
// ==========================================

function getUserMemoryRef() {

  const user = getCurrentUser();

  if (!user) {
    throw new Error("User is not logged in.");
  }

  const db = getDatabase();

  return ref(
    db,
    `users/${user.uid}/memories`
  );
}


// ==========================================
// SAVE MEMORY
// ==========================================

export async function saveMemory(
  text,
  type = "personal"
) {

  if (!text || !text.trim()) {
    return false;
  }

  const memoryRef =
    getUserMemoryRef();

  await push(
    memoryRef,
    {
      text: text.trim(),
      type: type,
      createdAt: Date.now()
    }
  );

  return true;
}


// ==========================================
// GET ALL MEMORIES
// ==========================================

export async function getMemories() {

  const memoryRef =
    getUserMemoryRef();

  const snapshot =
    await get(memoryRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data =
    snapshot.val();

  return Object.entries(data)
    .map(([id, memory]) => ({
      id,
      ...memory
    }))
    .sort(
      (a, b) =>
        (a.createdAt || 0) -
        (b.createdAt || 0)
    );
}


// ==========================================
// SEARCH MEMORY
// ==========================================

export async function searchMemories(
  query
) {

  if (!query) {
    return [];
  }

  const memories =
    await getMemories();

  const search =
    query
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


// ==========================================
// FIND KNOWLEDGE
// ==========================================

export async function findKnowledge(
  keyword
) {

  return searchMemories(
    keyword
  );
}


// ==========================================
// DELETE MEMORY
// ==========================================

export async function deleteMemory(
  memoryId
) {

  if (!memoryId) {
    return false;
  }

  const user =
    getCurrentUser();

  if (!user) {
    throw new Error(
      "User is not logged in."
    );
  }

  const db =
    getDatabase();

  const memoryRef =
    ref(
      db,
      `users/${user.uid}/memories/${memoryId}`
    );

  await remove(
    memoryRef
  );

  return true;
    }
