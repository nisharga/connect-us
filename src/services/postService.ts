import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import { Post, CreatePostData } from "../types/post";

export async function uploadPostImageToCloudinary(uri: string) {
  const data = new FormData();

  data.append("file", {
    uri,
    type: "image/jpeg",
    name: "post.jpg",
  } as any);

  data.append("upload_preset", "profile_uploads");
  data.append("folder", "posts");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/da8yjlzsn/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const json = await res.json();

  if (!json.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return json.secure_url as string;
}

export async function createPost(postData: CreatePostData): Promise<string> {
  try {
    const postsRef = collection(db, "posts");
    const docRef = await addDoc(postsRef, {
      ...postData,
      createdAt: Timestamp.now(),
      likes: [],
      comments: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"), limit(50));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        userAvatar: data.userAvatar,
        imageUrl: data.imageUrl,
        caption: data.caption,
        createdAt: data.createdAt.toDate(),
        likes: data.likes || [],
        comments: data.comments || 0,
      } as Post;
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
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
        return {
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          userAvatar: data.userAvatar,
          imageUrl: data.imageUrl,
          caption: data.caption,
          createdAt: data.createdAt.toDate(),
          likes: data.likes || [],
          comments: data.comments || 0,
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
