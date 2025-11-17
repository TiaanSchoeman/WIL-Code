import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDkx8CI49tcmgeS2AcLjkVfU5N4ZeEp0ME",
    authDomain: "wil-tiaan-schoeman-edutrack.firebaseapp.com",
    projectId: "wil-tiaan-schoeman-edutrack",
    storageBucket: "wil-tiaan-schoeman-edutrack.appspot.com",
    messagingSenderId: "876781633466",
    appId: "1:876781633466:web:99412ad44b3ab97c43a783",
    measurementId: "G-V5GE46GW84"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
