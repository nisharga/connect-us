export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  imageUrl: string;
  caption: string;
  createdAt: Date;
  likes: string[];
  comments: number;
}

export interface CreatePostData {
  userId: string;
  userName: string;
  userAvatar?: string;
  imageUrl: string;
  caption: string;
}
