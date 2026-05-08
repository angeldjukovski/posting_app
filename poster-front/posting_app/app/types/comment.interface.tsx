import { Post } from "./post.interface";
import { User } from "./user";

export interface Comment {
  post? : Post
  id: number;
  postId: number;
  title: string;
  content: string;
  createdAt: string;
  user?: User;
  likesCount?: number;
  repostsCount?: number;
  isLiked?: boolean;
  isReposted?: boolean;
}
