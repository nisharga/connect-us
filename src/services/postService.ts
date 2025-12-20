import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  limit,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Post, CreatePostData, Comment } from "../types/post";
import { uploadPostImageToCloudinary } from "./cloudinaryService";

export { uploadPostImageToCloudinary };

export async function createPost(postData: CreatePostData): Promise<string> {
  try {
    const postsRef = collection(db, "posts");
    const docRef = await addDoc(postsRef, {
      ...postData,
      createdAt: Timestamp.now(),
      likes: [],
      comments: [],
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

export function subscribeToPosts(
  callback: (posts: Post[]) => void
): () => void {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, orderBy("createdAt", "desc"), limit(50));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const posts = snapshot.docs.map((doc) => {
        const data = doc.data();
        // Convert comments array
        const comments = (data.comments || []).map((comment: any) => ({
          ...comment,
          createdAt: comment.createdAt?.toDate
            ? comment.createdAt.toDate()
            : new Date(comment.createdAt),
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
      callback(posts);
    },
    (error) => {
      console.error("Error listening to posts:", error);
    }
  );

  return unsubscribe;
}

export async function deletePost(postId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "posts", postId));
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }
}

export async function updatePost(
  postId: string,
  updates: { caption?: string; imageUrl?: string }
): Promise<void> {
  try {
    await updateDoc(doc(db, "posts", postId), updates);
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("Failed to update post");
  }
}

// Like a post
export async function likePost(
  postId: string,
  userId: string
): Promise<void> {
  try {
    await updateDoc(doc(db, "posts", postId), {
      likes: arrayUnion(userId),
    });
  } catch (error) {
    console.error("Error liking post:", error);
    throw new Error("Failed to like post");
  }
}

// Unlike a post
export async function unlikePost(
  postId: string,
  userId: string
): Promise<void> {
  try {
    await updateDoc(doc(db, "posts", postId), {
      likes: arrayRemove(userId),
    });
  } catch (error) {
    console.error("Error unliking post:", error);
    throw new Error("Failed to unlike post");
  }
}

// Add a comment to a post
export async function addComment(
  postId: string,
  comment: Omit<Comment, "id" | "createdAt">
): Promise<void> {
  try {
    const commentWithTimestamp = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...comment,
      createdAt: Timestamp.now(),
    };

    await updateDoc(doc(db, "posts", postId), {
      comments: arrayUnion(commentWithTimestamp),
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Failed to add comment");
  }
}

// Delete a comment from a post
export async function deleteComment(
  postId: string,
  commentId: string
): Promise<void> {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const comments = postSnap.data().comments || [];
      const updatedComments = comments.filter((c: any) => c.id !== commentId);
      
      await updateDoc(postRef, {
        comments: updatedComments,
      });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Failed to delete comment");
  }
}
