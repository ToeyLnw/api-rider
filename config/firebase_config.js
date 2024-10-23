// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4f5YzpMdt91YAevxglDXw5Q99Ns2lhH8",
  authDomain: "call-rider-3c587.firebaseapp.com",
  projectId: "call-rider-3c587",
  storageBucket: "call-rider-3c587.appspot.com",
  messagingSenderId: "465197385010",
  appId: "1:465197385010:web:29507b664ac67c8fb7c32b",
  measurementId: "G-W0NM449QP0"
};
const storage = getStorage(firebaseApp);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);