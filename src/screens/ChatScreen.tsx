// This screen handles the one-on-one chat interface using GiftedChat
// It shows message history and allows sending new messages in real-time

import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useLayoutEffect,
} from "react";
import {
  View, // Container component
  Text, // Text display component
  TouchableOpacity, // Touchable button
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { AuthContext } from "../contexts/AuthContext";
import { subscribeToMessages, sendMessage } from "../services/chatService";
import { Message } from "../types/chat";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

const ChatScreen = ({ navigation, route }: Props) => {
  // Get route parameters passed from ChatListScreen
  const { chatRoomId, otherUserName } = route.params;

  // Get the current user from AuthContext
  const { user } = useContext(AuthContext);

  // State to store all messages in this chat
  const [messages, setMessages] = useState<IMessage[]>([]);

  // Effect to subscribe to messages when component mounts
  useEffect(() => {
    // Subscribe to real-time message updates for this chat room
    const unsubscribe = subscribeToMessages(chatRoomId, (fetchedMessages) => {
      // Update the messages state with new messages
      setMessages(fetchedMessages);
    });

    // Cleanup function: unsubscribe when component unmounts
    return () => unsubscribe();
  }, [chatRoomId]);

  // Function to handle sending a new message
  // This is called when user taps the send button in GiftedChat
  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      // If no user is logged in, don't send
      if (!user) return;

      // Get the first message from the array (GiftedChat sends an array)
      const message = newMessages[0];

      // Create the message object to send to Firebase
      const messageToSend: Omit<Message, "_id"> = {
        text: message.text, // The message text
        createdAt: new Date(), // Current timestamp
        user: {
          _id: user.uid, // Current user's ID
          name: user.displayName || user.email || "You", // User's name
          ...(user.photoURL && { avatar: user.photoURL }), // User's profile picture (only if it exists)
        },
        chatRoomId: chatRoomId, // Which chat room this belongs to
      };

      // Send the message to Firebase
      try {
        await sendMessage(chatRoomId, messageToSend);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [chatRoomId, user]
  );

  // If no user is logged in, don't render the chat
  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
        <View className="flex-1 justify-center items-center">
          <Text>Please log in to chat</Text>
        </View>
      </SafeAreaView>
    );
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: otherUserName,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} className="px-4">
          <Text className="text-black font-bold">Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, otherUserName]);

  return (
    <SafeAreaView
      className="flex-1 bg-white pt-4 pb-8"
      edges={["top", "bottom"]}
    >
      <View className="flex-1 bg-white px-2">
        {/* Native header used */}

        {/* GiftedChat Component */}
        {/* This handles all the chat UI including message bubbles, input field, and send button */}
        {/* @ts-ignore - GiftedChat type definitions have some conflicts */}
        <GiftedChat
          messages={messages} // Array of messages to display
          onSend={onSend} // Function to call when sending a message
          user={{
            _id: user.uid, // Current user's ID (GiftedChat uses this to show messages on right/left)
            name: user.displayName || user.email || "You", // Current user's name
            ...(user.photoURL && { avatar: user.photoURL }), // Current user's profile picture (only if it exists)
          }}
          // Customize message bubble colors
          renderBubble={(props) => {
            return (
              <View>
                {props.currentMessage && (
                  <View
                    className={`p-3 rounded-2xl mx-2 my-1 max-w-xs ${
                      props.currentMessage.user._id === user.uid
                        ? "bg-black self-end" // Current user's messages on right, primary black
                        : "bg-gray-300 self-start" // Other user's messages on left, gray
                    }`}
                  >
                    <Text
                      className={`${
                        props.currentMessage.user._id === user.uid
                          ? "text-white" // White text for current user
                          : "text-gray-800" // Dark text for other user
                      }`}
                    >
                      {props.currentMessage.text}
                    </Text>
                  </View>
                )}
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
