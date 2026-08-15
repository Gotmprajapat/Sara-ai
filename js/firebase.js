import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth
} from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore
} from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  firebaseConfig
} from "./firebase-config.js";


let firebaseApp = null;
let auth = null;
let db = null;


export async function initializeFirebase() {

  if (firebaseApp) {
    return {
      app: firebaseApp,
      auth,
      db
    };
  }


  firebaseApp =
    initializeApp(firebaseConfig);


  auth =
    getAuth(firebaseApp);


  db =
    getFirestore(firebaseApp);


  console.log("Firebase initialized");


  return {
    app: firebaseApp,
    auth,
    db
  };
}


export function getFirebaseAuth() {
  return auth;
}


export function getFirebaseDB() {
  return db;
}
