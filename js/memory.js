// js/memory.js

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  getFirebaseDB
} from "./firebase.js";

import {
  getCurrentUser
} from "./auth.js";


// ==========================================
// MEMORY COLLECTION
// ==========================================

function getMemoryCollection() {

  const user = getCurrentUser();
  const db = getFirebaseDB();

  if (!user) {
    throw new Error("User is not logged in.");
  }

  if (!db) {
    throw new Error("Firebase database is not initialized.");
  }

  return collection(
    db,
    "users",
    user.uid,
    "memories"
  );
}


// ==========================================
// SAVE MEMORY
// ==========================================

export async function saveMemory(text, type = "personal") {

  if (!text || !text.trim()) {
    return null;
  }

  const memoryCollection =
    getMemoryCollection();

  const memory = {

    text: text.trim(),

    type: type,

    createdAt: serverTimestamp(),

    source: "sara"

  };

  const result =
    await addDoc(
      memoryCollection,
      memory
    );

  console.log(
    "Sara memory saved:",
    text
  );

  return result.id;
}


// ==========================================
// GET MEMORIES
// ==========================================

export async function getMemories() {

  const memoryCollection =
    getMemoryCollection();

  const memoryQuery =
    query(
      memoryCollection,
      orderBy("createdAt", "asc")
    );

  const snapshot =
    await getDocs(memoryQuery);

  const memories = [];

  snapshot.forEach((item) => {

    memories.push({

      id: item.id,

      ...item.data()

    });

  });

  return memories;
}


// ==========================================
// SEARCH MEMORY
// ==========================================

export async function searchMemories(keyword) {

  const memories =
    await getMemories();

  if (!keyword) {
    return memories;
  }

  const searchText =
    keyword.toLowerCase();

  return memories.filter(
    (memory) =>
      memory.text &&
      memory.text
        .toLowerCase()
        .includes(searchText)
  );
}


// ==========================================
// DELETE ONE MEMORY
// ==========================================

export async function deleteMemory(memoryId) {

  const user = getCurrentUser();
  const db = getFirebaseDB();

  if (!user || !db) {
    throw new Error(
      "User or database unavailable."
    );
  }

  await deleteDoc(
    doc(
      db,
      "users",
      user.uid,
      "memories",
      memoryId
    )
  );

  console.log(
    "Sara memory deleted:",
    memoryId
  );
}


// ==========================================
// DELETE ALL MEMORIES
// ==========================================

export async function deleteAllMemories() {

  const memories =
    await getMemories();

  for (const memory of memories) {

    await deleteMemory(
      memory.id
    );

  }

  console.log(
    "All Sara memories deleted."
  );
      }
