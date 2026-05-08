"use client";
import { createContext, useContext, useState } from "react";
import { Comment } from "../types/comment.interface";
import { CommentAPI } from "../services/comment.service";

interface CommentContextType {
  comments: Comment[];
  createComment: (
    postId: number,
    title: string,
    content: string,
  ) => Promise<void>;
  updateComment: (
    postId: number,
    commentID: number,
    title: string,
    content: string,
  ) => Promise<void>;
  deleteComment: (postId: number, commentID: number) => Promise<void>;
  toggleLike: (
    postId: number,
    commentID: number,
  ) => Promise<{ isLiked: boolean } | undefined>;
  toggleRepost: (
    postId: number,
    commentID: number,
  ) => Promise<{ isReposted: boolean } | undefined>;
  reload: (postId: number, userId?: number) => Promise<void>;
}
const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const [comments, setComment] = useState<Comment[]>([]);
  const reload = async (postId: number, userId?: number) => {
    try {
      const data = await CommentAPI.getComments(postId, userId);
      setComment(data);
    } catch (error) {
      console.error("Failed to load comments", error);
    }
  };

  const createComment = async (
    postId: number,
    title: string,
    content: string,
  ) => {
    const newComment = await CommentAPI.create(postId, title, content);
    setComment((prev) => [newComment, ...prev]);
  };
  const updateComment = async (
    postId: number,
    id: number,
    title: string,
    content: string,
  ) => {
    const updatedComment = await CommentAPI.update(postId, id, title, content);
    setComment((prev) =>
      prev.map((comment) => (comment.id === id ? updatedComment : comment)),
    );
  };
  const deleteComment = async (postId: number, id: number) => {
    await CommentAPI.delete(postId, id);
    setComment((prev) => prev.filter((comment) => comment.id !== id));
  };

  const toggleLike = async (
    postId: number,
    commentID: number,
  ): Promise<{ isLiked: boolean } | undefined> => {
    try {
      const response = await CommentAPI.like(postId, commentID);
      setComment((prev) =>
        prev.map((comment) => {
          if (comment.id === commentID) {
            return {
              ...comment,
              isLiked: response.isLiked ?? false,
              likesCount: response.isLiked
                ? (comment.likesCount || 0) + 1
                : Math.max(0, (comment.likesCount || 0) - 1),
            };
          }
          return comment;
        }),
      );
      return { isLiked: response.isLiked ?? false };
    } catch (error) {
      console.error("The problem is in the backend or the API call:", error);
    }
  };
  const toggleRepost = async (
    postId: number,
    commentID: number,
  ): Promise<{ isReposted: boolean } | undefined> => {
    try {
      const response = await CommentAPI.repost(postId, commentID);
      setComment((prev) =>
        prev.map((comment) => {
          if (comment.id === commentID) {
            return {
              ...comment,
              isReposted: response.isReposted ?? false,
              repostsCount: response.isReposted
                ? (comment.repostsCount || 0) + 1
                : Math.max(0, (comment.repostsCount || 0) - 1),
            };
          }
          return comment;
        }),
      );
      return { isReposted: response.isReposted ?? false };
    } catch (error) {
      console.error("The problem is in the backend or the API call:", error);
    }
  };
  return (
    <CommentContext.Provider
      value={{
        comments,
        reload,
        createComment,
        updateComment,
        deleteComment,
        toggleLike,
        toggleRepost,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}
export function useComments() {
  const context =
    useContext(CommentContext);

  if (!context) {
    throw new Error(
      "useComments must be used within CommentProvider"
    );
  }

  return context;
}
