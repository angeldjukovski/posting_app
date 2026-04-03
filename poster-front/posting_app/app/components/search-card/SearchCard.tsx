    'use client'

    import { Post } from "@/app/types/post.interface";
    import { User } from "@/app/types/user";
    import { useState } from "react";
    import { useSearch } from "@/app/context/Search.context";
    import { usePosts } from "@/app/context/Post.context";
    import { useAuth } from "@/app/context/Auth.context";
    import { useEffect } from "react";
    import { PostCard } from "../post-card/PostCard";


    interface SearchCardProp {
    post? : Post
    user?: User
    }


    export const SearchCard = ({post,user}: SearchCardProp) => {

    if(user) {
    return(
    <div className="p-2 border rounded hoover:bg-gray-50 transition-colors cursor-pointer mb-2">
    <p className="text-sm font-semibold text-blue-600">User</p>
    <p className="text-lg">{user.username}</p>
    </div>
    )
    }
    if(post) {
    console.log('Search Data Test',post)
    return(
    <div className="p-2 border rounded hoover:bg-gray-50 transition-colors cursor-pointer mb-2">
    <PostCard key={post.id} post={post}/>
    </div>
    )
    }
    return null
    }


