export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  imageUrl: string;
  caption: string;
  createdAt: Date;
  likes: string[];
  comments: Comment[];
}

export interface CreatePostData {
  userId: string;
  userName: string;
  userAvatar?: string;
  imageUrl: string;
  caption: string;
}
