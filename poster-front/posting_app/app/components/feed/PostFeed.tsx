"use client";

import { usePosts } from "@/app/context/Post.context";
import Link from "next/link";

export const PostFeed = () => {
  const { posts } = usePosts();

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="border p-3 my-2">
          <Link href={`/profile/${post.user.id}`} className="font-bold">
            @{post.user.username}
          </Link>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};
