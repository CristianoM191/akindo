/* ============================================
   AKINDO — Configuração Firebase (SDK Modular v12)
   Exporta app e auth para uso nas páginas
   ============================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCD40B73myZbovoWze0UPL9cPRMfzYelo8",
  authDomain:        "akindo-app.firebaseapp.com",
  projectId:         "akindo-app",
  storageBucket:     "akindo-app.firebasestorage.app",
  messagingSenderId: "893787438184",
  appId:             "1:893787438184:web:f6970e863be2996a00cfdd",
  measurementId:     "G-Q0KCD8GERK"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
