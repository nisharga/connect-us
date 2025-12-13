import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center px-6 py-10">
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </Text>
            <Text className="text-gray-500 text-center text-sm">
              You're all set to explore
            </Text>
          </View>

          <View className="mb-6">
            <TouchableOpacity
              className="bg-black rounded-xl py-4 mb-4"
              onPress={() => navigation.navigate("Profile")}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-bold text-base">
                Go to Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border border-gray-200 bg-gray-50 rounded-xl py-4"
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text className="text-gray-900 text-center font-bold text-base">
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}