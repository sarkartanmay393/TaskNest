// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOma_i5iesGzK8rUcDee8GyUOeE7mi1Os",
  authDomain: "tsmk-83bbe.firebaseapp.com",
  projectId: "tsmk-83bbe",
  storageBucket: "tsmk-83bbe.appspot.com",
  messagingSenderId: "669451965621",
  appId: "1:669451965621:web:7061bd3b1999673f005afc",
  measurementId: "G-BCB3K5JEBF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);