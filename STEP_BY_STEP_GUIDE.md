# Step-by-Step Guide: Building Connect Us React Native App

This guide will walk you through creating the "Connect Us" React Native app from scratch using Expo, Firebase, and NativeWind.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (will be installed globally)
- A Firebase account
- Code editor (VS Code recommended)
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio

---

## Step 1: Initialize Expo Project

1. **Install Expo CLI globally:**
   ```bash
   npm install -g expo-cli
   ```

2. **Create a new Expo project:**
   ```bash
   npx create-expo-app connect-us --template blank-typescript
   cd connect-us
   ```

3. **Verify the project was created:**
   ```bash
   npm start
   ```
   You should see the Expo development server start.

---

## Step 2: Install Dependencies

Install all required dependencies for the project:

```bash
npm install @react-native-async-storage/async-storage @react-navigation/bottom-tabs @react-navigation/native @react-navigation/native-stack dayjs expo-image-picker expo-status-bar firebase nativewind react-native-safe-area-context react-native-screens tailwindcss uuid
```

Install TypeScript and development dependencies:

```bash
npm install --save-dev @types/react @types/react-native @types/uuid typescript
```

---

## Step 3: Setup NativeWind (Tailwind CSS for React Native)

1. **Install NativeWind CLI:**
   ```bash
   npm install --save-dev nativewind
   ```

2. **Create `tailwind.config.js` in the root:**
   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./App.{js,jsx,ts,tsx}",
       "./src/**/*.{js,jsx,ts,tsx}"
     ],
     presets: [require("nativewind/preset")],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. **Update `babel.config.js`:**
   ```javascript
   module.exports = function(api) {
     api.cache(true);
     return {
       presets: [
         "babel-preset-expo",
         "nativewind/babel",
       ],
     };
   };
   ```

4. **Create `metro.config.js` in the root:**
   ```javascript
   const { getDefaultConfig } = require("expo/metro-config");
   const { withNativeWind } = require('nativewind/metro');

   const config = getDefaultConfig(__dirname);

   module.exports = withNativeWind(config, { input: './global.css' });
   ```

5. **Create `global.css` in the root:**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

6. **Create `nativewind-env.d.ts` in the root:**
   ```typescript
   /// <reference types="nativewind/types" />
   ```

---

## Step 4: Configure TypeScript

Update `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "jsx": "react-native"
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "nativewind-env.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

---

## Step 5: Setup Firebase Project

1. **Go to Firebase Console:**
   - Visit https://console.firebase.google.com/
   - Click "Add project" or select an existing project
   - Follow the setup wizard

2. **Enable Authentication:**
   - In Firebase Console, go to "Authentication"
   - Click "Get Started"
   - Enable "Email/Password" sign-in method

3. **Get Firebase Configuration:**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon (`</>`) to add a web app
   - Copy the Firebase configuration object

4. **Create `.env` file in the root:**
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
   ```

5. **Install environment variables package:**
   ```bash
   npm install --save-dev @expo/config-plugins
   ```

   Note: Expo automatically reads `.env` files with the `EXPO_PUBLIC_` prefix.

---

## Step 6: Create Project Structure

Create the following folder structure:

```
connect-us/
├── src/
│   ├── contexts/
│   ├── screens/
│   ├── types/
│   └── firebase.ts
├── assets/
├── App.tsx
├── index.ts
└── ...
```

Create the directories:

```bash
mkdir -p src/contexts src/screens src/types
```

---

## Step 7: Setup Firebase Configuration

Create `src/firebase.ts`:

```typescript
import { initializeApp, FirebaseApp } from "firebase/app";
import { initializeAuth, Auth } from "firebase/auth";
import {
  getFirestore,
  Firestore,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// @ts-expect-error - getReactNativePersistence is available at runtime but not in types
import { getReactNativePersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const timestamp: () => FieldValue = serverTimestamp;
export default app;
```

---

## Step 8: Create Auth Context

Create `src/contexts/AuthContext.tsx`:

```typescript
import { createContext } from "react";
import { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextType>({ user: null });
```

---

## Step 9: Create Navigation Types

Create `src/types/navigation.ts`:

```typescript
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
};
```

---

## Step 10: Create Login Screen

Create `src/screens/LoginScreen.tsx`:

```typescript
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

const { height } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigation = useNavigation<LoginScreenNavigationProp>();

  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "auth/invalid-credential":
        return "Invalid email or password";
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      default:
        return "Login failed. Please try again";
    }
  }

  async function handleLogin() {
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Success: Login successful");
    } catch (err: any) {
      const errorCode = err?.code || "";
      const errorMessage = getErrorMessage(errorCode);

      if (
        errorCode === "auth/invalid-credential" ||
        errorCode === "auth/user-not-found" ||
        errorCode === "auth/wrong-password"
      ) {
        setPasswordError(errorMessage);
      } else if (errorCode === "auth/invalid-email") {
        setEmailError(errorMessage);
      } else {
        Alert.alert("Login Error", errorMessage);
      }
    }
  }

  const isSmallScreen = height < 700;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            className="flex-1 justify-center px-6"
            style={{ paddingVertical: isSmallScreen ? 20 : 40 }}
          >
            <View
              className="items-center mb-8"
              style={{ marginBottom: isSmallScreen ? 24 : 48 }}
            >
              <Text className="text-5xl mb-3">📱</Text>
              <Text
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontSize: isSmallScreen ? 24 : 30 }}
              >
                Welcome Back
              </Text>
              <Text className="text-gray-500 text-center text-sm">
                Sign in to continue
              </Text>
            </View>

            <View className="mb-6">
              <View>
                <TextInput
                  className={`border rounded-xl px-4 py-3.5 mb-1 bg-gray-50 text-gray-900 ${
                    emailError ? "border-red-500" : "border-gray-200"
                  }`}
                  style={{ fontSize: 16 }}
                  placeholder="Email"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {emailError ? (
                  <Text className="text-red-500 text-sm mb-3 px-1">
                    {emailError}
                  </Text>
                ) : null}
              </View>

              <View>
                <TextInput
                  className={`border rounded-xl px-4 py-3.5 mb-1 bg-gray-50 text-gray-900 ${
                    passwordError ? "border-red-500" : "border-gray-200"
                  }`}
                  style={{ fontSize: 16 }}
                  placeholder="Password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError("");
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {passwordError ? (
                  <Text className="text-red-500 text-sm mb-3 px-1">
                    {passwordError}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                className="bg-black rounded-xl py-4 mb-6"
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text
                  className="text-white text-center font-bold"
                  style={{ fontSize: 16 }}
                >
                  Log In
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-center flex-wrap">
              <Text className="text-gray-600" style={{ fontSize: 15 }}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text className="text-black font-bold" style={{ fontSize: 15 }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
```

---

## Step 11: Create Signup Screen

Create `src/screens/SignupScreen.tsx`:

```typescript
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type SignupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Signup"
>;

const { height } = Dimensions.get("window");

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const navigation = useNavigation<SignupScreenNavigationProp>();

  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email is already registered";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/weak-password":
        return "Password is too weak. Use at least 6 characters";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later";
      default:
        return "Signup failed. Please try again";
    }
  }

  async function handleSignup() {
    setEmailError("");
    setPasswordError("");
    setDisplayNameError("");

    if (!displayName.trim()) {
      setDisplayNameError("Display name is required");
      return;
    }

    if (displayName.trim().length < 2) {
      setDisplayNameError("Display name must be at least 2 characters");
      return;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      console.log("Success: Signup successful");
      navigation.navigate("Login");
    } catch (err: any) {
      const errorCode = err?.code || "";
      const errorMessage = getErrorMessage(errorCode);

      if (
        errorCode === "auth/email-already-in-use" ||
        errorCode === "auth/invalid-email"
      ) {
        setEmailError(errorMessage);
      } else if (errorCode === "auth/weak-password") {
        setPasswordError(errorMessage);
      } else {
        Alert.alert("Signup Error", errorMessage);
      }
    }
  }

  const isSmallScreen = height < 700;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            className="flex-1 justify-center px-6"
            style={{ paddingVertical: isSmallScreen ? 20 : 40 }}
          >
            <View
              className="items-center mb-8"
              style={{ marginBottom: isSmallScreen ? 24 : 48 }}
            >
              <Text className="text-5xl mb-3">✨</Text>
              <Text
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontSize: isSmallScreen ? 24 : 30 }}
              >
                Create Account
              </Text>
              <Text className="text-gray-500 text-center text-sm">
                Join us and start sharing
              </Text>
            </View>

            <View className="mb-6">
              <View>
                <TextInput
                  className={`border rounded-xl px-4 py-3.5 mb-1 bg-gray-50 text-gray-900 ${
                    displayNameError ? "border-red-500" : "border-gray-200"
                  }`}
                  style={{ fontSize: 16 }}
                  placeholder="Display Name"
                  placeholderTextColor="#9ca3af"
                  value={displayName}
                  onChangeText={(text) => {
                    setDisplayName(text);
                    setDisplayNameError("");
                  }}
                  autoCapitalize="words"
                />
                {displayNameError ? (
                  <Text className="text-red-500 text-sm mb-3 px-1">
                    {displayNameError}
                  </Text>
                ) : null}
              </View>

              <View>
                <TextInput
                  className={`border rounded-xl px-4 py-3.5 mb-1 bg-gray-50 text-gray-900 ${
                    emailError ? "border-red-500" : "border-gray-200"
                  }`}
                  style={{ fontSize: 16 }}
                  placeholder="Email"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {emailError ? (
                  <Text className="text-red-500 text-sm mb-3 px-1">
                    {emailError}
                  </Text>
                ) : null}
              </View>

              <View>
                <TextInput
                  className={`border rounded-xl px-4 py-3.5 mb-1 bg-gray-50 text-gray-900 ${
                    passwordError ? "border-red-500" : "border-gray-200"
                  }`}
                  style={{ fontSize: 16 }}
                  placeholder="Password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError("");
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {passwordError ? (
                  <Text className="text-red-500 text-sm mb-3 px-1">
                    {passwordError}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                className="bg-black rounded-xl py-4 mb-6"
                onPress={handleSignup}
                activeOpacity={0.8}
              >
                <Text
                  className="text-white text-center font-bold"
                  style={{ fontSize: 16 }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-center flex-wrap">
              <Text className="text-gray-600" style={{ fontSize: 15 }}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-black font-bold" style={{ fontSize: 15 }}>
                  Log In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
```

---

## Step 12: Create Main App Component

Update `App.tsx`:

```typescript
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./src/firebase";
import { AuthContext } from "./src/contexts/AuthContext";
import "./global.css";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  if (initializing) return null;

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={{ user }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: "#ffffff" },
              headerTintColor: "#000000",
              headerTitleStyle: { fontWeight: "700", fontSize: 18 },
              headerShadowVisible: false,
              headerBorderVisible: false,
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}
```

---

## Step 13: Update app.json

Update `app.json`:

```json
{
  "expo": {
    "name": "connect-us",
    "slug": "connect-us",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

---

## Step 14: Update .gitignore

Ensure your `.gitignore` includes:

```
# local env files
.env*.local
.env

# Expo
.expo/
.expo-shared/
dist/
web-build/

# node.js
node_modules/
npm-debug.log
yarn-error.log

# OSX
.DS_Store

# TypeScript
*.tsbuildinfo
```

---

## Step 15: Create Assets (Optional)

Add app icons and splash screens to the `assets/` folder:
- `icon.png` (1024x1024)
- `adaptive-icon.png` (1024x1024)
- `splash-icon.png` (1242x2436)
- `favicon.png` (48x48)

---

## Step 16: Run the App

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Run on different platforms:**
   - **iOS Simulator (macOS only):** Press `i` in the terminal or run `npm run ios`
   - **Android Emulator:** Press `a` in the terminal or run `npm run android`
   - **Web:** Press `w` in the terminal or run `npm run web`
   - **Physical device:** Scan the QR code with Expo Go app

---

## Step 17: Testing

1. **Test Signup:**
   - Navigate to Signup screen
   - Enter display name, email, and password
   - Verify successful account creation
   - Check that it navigates to Login screen

2. **Test Login:**
   - Enter valid credentials
   - Verify successful login
   - Check Firebase Authentication console for the new user

3. **Test Error Handling:**
   - Try invalid email format
   - Try weak password (< 6 characters)
   - Try wrong credentials
   - Try existing email on signup

---

## Troubleshooting

### Issue: NativeWind styles not working
- **Solution:** Make sure `global.css` is imported in `App.tsx` and `metro.config.js` is configured correctly

### Issue: Firebase not initializing
- **Solution:** Check that `.env` file exists with correct `EXPO_PUBLIC_` prefixed variables
- Restart the development server after adding environment variables

### Issue: Navigation errors
- **Solution:** Ensure all navigation types are correctly defined in `src/types/navigation.ts`

### Issue: TypeScript errors
- **Solution:** Run `npm install` again to ensure all type definitions are installed
- Check `tsconfig.json` configuration

---

## Next Steps (Optional Enhancements)

1. **Add Protected Routes:**
   - Create a HomeScreen or Dashboard
   - Add navigation guards based on authentication state

2. **Add Profile Screen:**
   - Display user information
   - Allow profile editing

3. **Add Image Upload:**
   - Use `expo-image-picker` to upload profile pictures
   - Store images in Firebase Storage

4. **Add Password Reset:**
   - Implement "Forgot Password" functionality

5. **Add Social Authentication:**
   - Google Sign-In
   - Apple Sign-In

---

## Summary

You've successfully created a React Native Expo app with:
- ✅ Expo setup with TypeScript
- ✅ Firebase Authentication (Email/Password)
- ✅ React Navigation
- ✅ NativeWind (Tailwind CSS)
- ✅ Login and Signup screens
- ✅ Auth Context for state management
- ✅ Form validation and error handling
- ✅ Responsive UI design

The app is now ready for further development and customization!
