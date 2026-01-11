import { User } from "./user"
export interface Post {
id:number
title: string 
content : string
createdAt : string 
user : User 
likesCount? : string
isLiked ? : boolean

}