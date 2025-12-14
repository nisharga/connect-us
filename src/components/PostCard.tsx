import React from "react";
import { View, Text, Image } from "react-native";
import { Post } from "../types/post";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <View className="bg-white mb-4 rounded-lg overflow-hidden border border-gray-200">
      {/* User Header */}
      <View className="flex-row items-center px-4 py-3">
        <View className="w-10 h-10 rounded-full bg-gray-300 mr-3 items-center justify-center">
          {post.userAvatar ? (
            <Image
              source={{ uri: post.userAvatar }}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <Text className="text-white font-bold text-lg">
              {post.userName.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <View className="flex-1">
          <Text className="font-bold text-gray-900">{post.userName}</Text>
          <Text className="text-xs text-gray-500">
            {formatDate(post.createdAt)}
          </Text>
        </View>
      </View>

      {/* Post Image */}
      <Image
        source={{ uri: post.imageUrl }}
        className="w-full aspect-square"
        resizeMode="cover"
      />

      {/* Post Content */}
      <View className="px-4 py-3">
        {post.caption && (
          <Text className="text-gray-800 mb-2">
            <Text className="font-bold">{post.userName} </Text>
            {post.caption}
          </Text>
        )}
        <View className="flex-row items-center pt-2">
          <Text className="text-gray-500 text-xs mr-4">
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </Text>
          <Text className="text-gray-500 text-xs">
            {post.comments} {post.comments === 1 ? "comment" : "comments"}
          </Text>
        </View>
      </View>
    </View>
  );
}
