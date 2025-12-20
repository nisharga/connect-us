import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";

export interface UserStats {
  followers: string[];
  following: string[];
  followersCount: number;
  followingCount: number;
}

// Get user stats (followers/following)
export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        followers: data.followers || [],
        following: data.following || [],
        followersCount: data.followersCount || 0,
        followingCount: data.followingCount || 0,
      };
    }
    return {
      followers: [],
      following: [],
      followersCount: 0,
      followingCount: 0,
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    throw new Error("Failed to get user stats");
  }
}

// Check if current user is following another user
export async function isFollowing(
  currentUserId: string,
  targetUserId: string
): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, "users", currentUserId));
    if (userDoc.exists()) {
      const following = userDoc.data().following || [];
      return following.includes(targetUserId);
    }
    return false;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}

// Follow a user
export async function followUser(
  currentUserId: string,
  targetUserId: string
): Promise<void> {
  try {
    // Add targetUserId to current user's following list
    await updateDoc(doc(db, "users", currentUserId), {
      following: arrayUnion(targetUserId),
      followingCount: increment(1),
    });

    // Add currentUserId to target user's followers list
    await updateDoc(doc(db, "users", targetUserId), {
      followers: arrayUnion(currentUserId),
      followersCount: increment(1),
    });
  } catch (error) {
    console.error("Error following user:", error);
    throw new Error("Failed to follow user");
  }
}

// Unfollow a user
export async function unfollowUser(
  currentUserId: string,
  targetUserId: string
): Promise<void> {
  try {
    // Remove targetUserId from current user's following list
    await updateDoc(doc(db, "users", currentUserId), {
      following: arrayRemove(targetUserId),
      followingCount: increment(-1),
    });

    // Remove currentUserId from target user's followers list
    await updateDoc(doc(db, "users", targetUserId), {
      followers: arrayRemove(currentUserId),
      followersCount: increment(-1),
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw new Error("Failed to unfollow user");
  }
}
