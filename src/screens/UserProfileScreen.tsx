// This screen displays a public user profile that other users can view
// It shows user information and provides option to start a chat

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { BackArrowIcon, ChatIcon } from "../components/Icons";
import { Post } from "../types/post";
import PostCard from "../components/PostCard";
import { getOrCreateChatRoom } from "../services/chatService";
import { followUser, unfollowUser, isFollowing, getUserStats } from "../services/userService";

type UserProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "UserProfile"
>;

type Props = NativeStackScreenProps<RootStackParamList, "UserProfile">;

export default function UserProfileScreen({ route }: Props) {
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const { userId } = route.params;
  const { user: currentUser } = useContext(AuthContext);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Compute displayName after user data is loaded
  const displayName = user 
    ? (user.displayName || user.userName || user.name || user.email || "User")
    : "User";

  // Fetch user data
  useEffect(() => {
    async function loadUser() {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUser({
            uid: userDoc.id,
            ...userDoc.data(),
          });
          
          // Check if current user is following this user
          if (currentUser) {
            const isFollowingUser = await isFollowing(currentUser.uid, userId);
            setFollowing(isFollowingUser);
          }

          // Load user stats
          const stats = await getUserStats(userId);
          setFollowersCount(stats.followersCount);
          setFollowingCount(stats.followingCount);
        } else {
          Alert.alert("Error", "User not found");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error loading user:", error);
        Alert.alert("Error", "Could not load user profile");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [userId, currentUser]);

  // Fetch user's posts
  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userPosts = snapshot.docs.map((doc) => {
          const data = doc.data();
          // Convert comments array
          const comments = (data.comments || []).map((comment: any) => ({
            ...comment,
            createdAt: comment.createdAt?.toDate ? comment.createdAt.toDate() : new Date(comment.createdAt),
          }));
          return {
            id: doc.id,
            userId: data.userId,
            userName: data.userName,
            userAvatar: data.userAvatar,
            imageUrl: data.imageUrl,
            caption: data.caption,
            createdAt: data.createdAt.toDate(),
            likes: data.likes || [],
            comments: comments,
          } as Post;
        });
        // Sort by createdAt descending
        userPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setPosts(userPosts);
        setPostsLoading(false);
      },
      (error) => {
        console.error("Error loading user posts:", error);
        setPostsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const handleStartChat = async () => {
    if (!currentUser || !user) return;

    try {
      // Create or get the chat room
      const chatRoomId = await getOrCreateChatRoom(
        currentUser.uid,
        user.uid,
        {
          displayName:
            currentUser.displayName || currentUser.email || "Current User",
          email: currentUser.email || "",
          photoURL: currentUser.photoURL || "",
        },
        {
          displayName: displayName,
          email: user.email || "",
          photoURL: user.photoURL || "",
        }
      );

      // Navigate to the chat screen
      navigation.navigate("Chat", {
        chatRoomId,
        otherUserId: user.uid,
        otherUserName: displayName,
        otherUserPhoto: user.photoURL,
      });
    } catch (error) {
      console.error("Error starting chat:", error);
      Alert.alert("Error", "Could not start chat");
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser || followLoading) return;

    setFollowLoading(true);
    try {
      if (following) {
        await unfollowUser(currentUser.uid, userId);
        setFollowing(false);
        setFollowersCount(prev => prev - 1);
      } else {
        await followUser(currentUser.uid, userId);
        setFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="mb-6">
            {/* Native header used */}

            <View className="items-center mb-6 pt-4">
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                {displayName}
              </Text>

              <View className="mb-4">
                {user.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <View className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-lg items-center justify-center">
                    <Text className="text-gray-500 text-2xl font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              {/* User Stats */}
              <View className="flex-row justify-center space-x-8 mt-4 mb-6">
                <View className="items-center">
                  <Text className="text-gray-900 font-bold text-lg">
                    {posts.length}
                  </Text>
                  <Text className="text-gray-500 text-sm">Posts</Text>
                </View>
                <View className="items-center">
                  <Text className="text-gray-900 font-bold text-lg">{followersCount}</Text>
                  <Text className="text-gray-500 text-sm">Followers</Text>
                </View>
                <View className="items-center">
                  <Text className="text-gray-900 font-bold text-lg">{followingCount}</Text>
                  <Text className="text-gray-500 text-sm">Following</Text>
                </View>
              </View>

              {/* Action Buttons */}
              {currentUser?.uid !== userId && (
                <View className="flex-row justify-center space-x-3 w-full px-4 mb-4">
                  <TouchableOpacity
                    onPress={handleFollowToggle}
                    disabled={followLoading}
                    className={`flex-1 py-3 rounded-lg ${following ? 'bg-gray-200' : 'bg-black'}`}
                    activeOpacity={0.8}
                  >
                    {followLoading ? (
                      <ActivityIndicator color={following ? '#000' : '#fff'} />
                    ) : (
                      <Text className={`font-bold text-base text-center ${following ? 'text-gray-900' : 'text-white'}`}>
                        {following ? 'Following' : 'Follow'}
                      </Text>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={handleStartChat}
                    className="flex-1 py-3 rounded-lg bg-blue-500 flex-row items-center justify-center"
                    activeOpacity={0.8}
                  >
                    <ChatIcon size={18} color="#fff" />
                    <Text className="text-white font-bold text-base ml-2">Message</Text>
                  </TouchableOpacity>
                </View>
              )}

              {user.bio ? (
                <View className="w-full px-6 mb-4">
                  <Text className="text-gray-700 text-base text-center">{user.bio}</Text>
                </View>
              ) : null}
            </View>

            {/* Posts Section Header */}
            <View className="px-4 pb-3 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-900">
                {displayName}'s Posts
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          !postsLoading ? (
            <View className="flex-1 items-center justify-center py-20 px-4">
              <Text className="text-gray-500 text-center text-base">
                No posts yet.
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          postsLoading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
