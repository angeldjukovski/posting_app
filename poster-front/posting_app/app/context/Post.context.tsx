"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Post } from "../types/post.interface";
import { PostAPI } from "../services/post.service";
import { useAuth } from "./Auth.context";
import { User } from "../types/user";

interface PostContextType {
  posts: Post[];
  createPost: (title: string, content: string) => Promise<void>;
  editPost: (postID: number, title: string, content: string) => Promise<void>;
  deletePost: (postID: number) => Promise<void>;
  toggleLike: (postID: number) => Promise<{ isLiked: boolean } | undefined>;
  toggleRepost: (
    postID: number,
  ) => Promise<{ isReposted: boolean } | undefined>;
  getByUser: (userID: number) => Promise<Post[]>;

  reload: (userId ? : number) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const {user} = useAuth()

  const load = async (userId ? : number) => {
    const data = await PostAPI.getPosts(userId);
    setPosts(data);
  };

  useEffect(() => {
    
    let mounted = true;

    const run = async () => {
      const data = await PostAPI.getPosts(user?.id);
      if (mounted) {
        setPosts(data);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const createPost = async (title: string, content: string) => {
    const newPost = await PostAPI.create(title, content);
    setPosts((prev) => [newPost, ...prev]);
  };

  const deletePost = async (id: number) => {
    await PostAPI.delete(id);
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const editPost = async (id: number, title: string, content: string) => {
    const updatePost = await PostAPI.update(id, title, content);
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? updatePost : post)),
    );
  };

  const toggleLike = async (
    postID: number,
  ): Promise<{ isLiked: boolean } | undefined> => {
    try {
      const response = await PostAPI.like(postID);
     setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postID) {
          return {
            ...post,
            isLiked: response.isLiked ?? false,
            likesCount: response.isLiked
              ? (post.likesCount || 0) + 1
              : Math.max(0, (post.likesCount || 0) - 1),
          };
        }
        return post;
      }),
    )
      return { isLiked: response.isLiked ?? false };;
    } catch (error) {
      console.error("The problem is in the backend or the API call:", error);
    }
  };

  const toggleRepost = async (postID: number): Promise<{ isReposted: boolean } | undefined> => {
    try {
      const response = await PostAPI.repost(postID);
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postID) {
            return {
              ...post,
              isReposted: response.isReposted ?? false,
              repostsCount: response.isReposted
                ? (post.repostsCount || 0) + 1
                : Math.max(0, (post.repostsCount  || 0) - 1),
            };
          }
          return post;
        }),
      );
      return { isReposted: response.isReposted ?? false };
    } catch (error) {
      console.error("The post cannot be reposted", error);
    }
  };

  const getByUser = async (userID : number): Promise<Post[]> => {
    try {
      const data = await PostAPI.getByUser(userID);
      return data || [];
    } catch (error) {
      console.warn("Cant get the users post check the backend", error);
      return [];
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        createPost,
        deletePost,
        editPost,
        toggleLike,
        toggleRepost,
        getByUser,
        reload: load,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
export const usePosts = () => {
  const ctx = useContext(PostContext);
  if (!ctx) throw new Error("usePosts must be inside PostProvider");
  return ctx;
};
