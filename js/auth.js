// js/auth.js

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { getFirebaseAuth } from "./firebase.js";


// ================================
// CREATE ACCOUNT
// ================================

export async function createAccount(email, password) {

  const auth = getFirebaseAuth();

  if (!auth) {
    throw new Error("Firebase Auth is not initialized.");
  }

  const result =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  return result.user;
}


// ================================
// LOGIN
// ================================

export async function login(email, password) {

  const auth = getFirebaseAuth();

  if (!auth) {
    throw new Error("Firebase Auth is not initialized.");
  }

  const result =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return result.user;
}


// ================================
// LOGOUT
// ================================

export async function logout() {

  const auth = getFirebaseAuth();

  if (!auth) {
    throw new Error("Firebase Auth is not initialized.");
  }

  await signOut(auth);
}


// ================================
// CURRENT USER
// ================================

export function getCurrentUser() {

  const auth = getFirebaseAuth();

  if (!auth) {
    return null;
  }

  return auth.currentUser;
}


// ================================
// WATCH LOGIN STATE
// ================================

export function watchAuthState(callback) {

  const auth = getFirebaseAuth();

  if (!auth) {
    throw new Error(
      "Firebase Auth is not initialized."
    );
  }

  return onAuthStateChanged(
    auth,
    callback
  );
}
