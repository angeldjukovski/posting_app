import { User } from "./user"
import { Comment } from "./comment.interface"
export interface Post {
id:number
title: string 
content : string
createdAt : string 
user? : User 
comment? : Comment
likesCount? : number
repostsCount? : number
isLiked ? : boolean
isReposted?: boolean;

}

