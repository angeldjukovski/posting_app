import { Post } from "./post.interface";
import { Comment } from "./comment.interface";

export interface Repost {
type : "post" | "comment"
data : Post | Comment
}