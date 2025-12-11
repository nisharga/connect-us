//src/screens/SignupScreen.tsx
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