"use client";

import { usePosts } from "@/app/context/Post.context";
import { PostCard } from "../post-card/PostCard";
import Link from "next/link";
import { useAuth } from "@/app/context/Auth.context";
import { useEffect, useState } from "react";

export const PostFeed = () => {
  const { posts, reload } = usePosts();
  const { user } = useAuth();

  useEffect(() => {
    reload(user?.id);
  }, [user,reload]);

  return (
    <div className="flex flex-col gap-4 items-center py-6">
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div>There are no posts</div>
      )}
    </div>
  );
};
