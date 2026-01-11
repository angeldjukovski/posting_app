"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Post } from "../types/post.interface";
import { PostAPI } from "../services/post.service";

interface PostContextType {
  posts: Post[];
  createPost: (title: string, content: string) => Promise<void>;
  reload: () => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);

  const load = async () => {
    const data = await PostAPI.getPosts();
    setPosts(data);
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      const data = await PostAPI.getPosts();
      if (mounted) {
        setPosts(data);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  const createPost = async (title: string, content: string) => {
    const newPost = await PostAPI.create(title, content);
    setPosts(prev => [newPost, ...prev]);
  };

  return (
    <PostContext.Provider value={{ posts, createPost, reload: load }}>
      {children}
    </PostContext.Provider>
  );
}
export const usePosts = () => {
  const ctx = useContext(PostContext);
  if (!ctx) throw new Error("usePosts must be inside PostProvider");
  return ctx;
};
