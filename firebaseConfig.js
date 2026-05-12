import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCchLtA_aX0eFUjUX2M9kyVd3NUFAvGe5c",
  authDomain: "cheapy-5d3bb.firebaseapp.com",
  databaseURL: "https://cheapy-5d3bb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cheapy-5d3bb",
  storageBucket: "cheapy-5d3bb.firebasestorage.app",
  messagingSenderId: "972393976723",
  appId: "1:972393976723:web:1c2ee2b93f0a0dde11ce66"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});