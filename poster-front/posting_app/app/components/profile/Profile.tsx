"use client"
import { useState } from "react"
import { usePosts } from "@/app/context/Post.context"
import { useAuth } from "@/app/context/Auth.context"
import { useEffect } from "react"
import { Post } from "@/app/types/post.interface"
import { PostFeed } from "../feed/PostFeed"
import { PostCard } from "../post-card/PostCard"



export const Profile = () => {

const {posts, reload} = usePosts()
const {user: currentUser} = useAuth()

useEffect(() => {
if(currentUser?.id) {
reload(currentUser.id)
}
},[currentUser,reload])


const userPosts = posts.filter(
(post) => post.user?.id === currentUser?.id || post.isReposted
)






return (
   <div className= "flex flex-col gap-4 items-center py-6">
   {userPosts.length > 0 ? (
   userPosts.map((post) => (
   <PostCard key={post.id} post={post}/>
   ))
   ):(
    <div>You do not have any posts</div>
   )}
   </div>
  );
};