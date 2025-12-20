import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = (() => {
  try {
    // Prefer AsyncStorage-based persistence on React Native if available
    let persistence = browserLocalPersistence;
    try {
      // dynamic require so the app still runs if the package isn't installed
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const RNAsyncStorage = require("@react-native-async-storage/async-storage").default;
      if (RNAsyncStorage) {
        persistence = getReactNativePersistence(RNAsyncStorage as any);
      }
    } catch (err) {
      // package not installed or require failed — fall back to browserLocalPersistence
    }

    return initializeAuth(app, {
      persistence,
    });
  } catch (e) {
    // Fallback to regular getAuth if initializeAuth is not available or already initialized
    return getAuth(app);
  }
})();
export const db = getFirestore(app);
