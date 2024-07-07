// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBP-J5jkrARmDoo4EKDB_S7un15QMM8x7A',
  authDomain: 'pesto-project-b2d3a.firebaseapp.com',
  databaseURL: 'https://pesto-project-b2d3a-default-rtdb.firebaseio.com',
  projectId: 'pesto-project-b2d3a',
  storageBucket: 'pesto-project-b2d3a.appspot.com',
  messagingSenderId: '24188461454',
  appId: '1:24188461454:web:06b7fc463f961e6faa04df',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
