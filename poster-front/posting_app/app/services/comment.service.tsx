import api from "../lib/token.intreceptor";
import { Comment } from "../types/comment.interface";
import { User } from "../types/user";

export const CommentAPI = {
  create: async (
    postID: number,
    title: string,
    content: string,
  ): Promise<Comment> => {
    const { data } = await api.post<Comment>(`/post/${postID}/comment`, {
      title,
      content,
    });
    return data;
  },
  update: async (
    postId: number,
    commentID: number,
    title: string,
    content: string,
  ): Promise<Comment> => {
    const { data } = await api.patch<Comment>(
      `/post/${postId}/comment/${commentID}`,
      {
        title,
        content,
      },
    );
    return data;
  },
  delete: async (postId: number, commentID: number): Promise<void> => {
    await api.delete(`/post/${postId}/comment/${commentID}`);
  },
  like: async (
    postId: number,
    commentID: number,
  ): Promise<{ isLiked?: boolean }> => {
    const { data } = await api.post(
      `/post/${postId}/comment/${commentID}/like`,
    );
    return data;
  },
  deleteLike: async (postId: number, commentID: number): Promise<void> => {
    await api.delete(`/post/${postId}/comment/${commentID}/like`);
  },
  repost: async (
    postId: number,
    commentID: number,
  ): Promise<{ isReposted?: boolean }> => {
    const { data } = await api.post(
      `/post/${postId}/comment/${commentID}/repost`,
    );
    return data;
  },
  deleteRepost: async (postId: number, commentID: number): Promise<void> => {
    await api.delete(`/post/${postId}/comment/${commentID}/repost/`);
  },
  getComments: async (postId: number, userId?: number): Promise<Comment[]> => {
    const url = userId
      ? `/post/${postId}/comment?userId=${userId}`
      : `/post/${postId}/comment`;
    const { data } = await api.get<Comment[]>(url);
    return data;
  },
  findCommentByUser : async(postId : number,userID : number) => {
  const {data} = await api.get(`/post/${postId}/comment/user/${userID}`)
  return data
  },
  findCommentByRepost : async (userID :number): Promise <Comment[]> => {
  const {data} =  await api.get(`/post/0/comment/user/${userID}/reposts`)
  return data
  }
};
