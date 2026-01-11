"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/Auth.context";
import { usePosts } from "@/app/context/Post.context";

export const PostLoader = () => {
  const { isAuthenticated } = useAuth();
  const { createPost } = usePosts();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!isAuthenticated) return null;

  const submit = async () => {
    await createPost(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <div className="p-4 border rounded">
      <input
        className="input w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="textarea w-full mt-2"
        placeholder="Write something..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={submit} className="btn btn-primary mt-2">
        Post
      </button>
    </div>
  );
};
