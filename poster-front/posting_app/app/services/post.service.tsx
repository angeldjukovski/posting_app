import api from "../lib/token.intreceptor";
import { Post } from "../types/post.interface";

export const PostAPI = {
  create: async (title: string, content: string): Promise<Post> => {
    const { data } = await api.post<Post>("/post", { title, content });
    return data;
  },
  getPosts: async (userId? : number): Promise<Post[]> => {
    const url = userId ? `/post?userId=${userId}`: "/post"
    const { data } = await api.get<Post[]>(url);
    return data;
  },

  getByUser: async (userID: number): Promise<Post[]> => {
    const { data } = await api.get<Post[]>(`/post/user/${userID}`);
    return data;
  },

  like: async (postID: number): Promise<{ isLiked?: boolean }> => {
   const {data} = await api.post(`/post/${postID}/like`);
   return data
  },

  deleteLike: async (postID: number): Promise<void> => {
    await api.delete(`/post/${postID}/like`);
  },

  repost: async (postID: number): Promise<{isReposted?: boolean}> => {
   const {data} = await api.post(`/post/${postID}/repost`);
   return data
  },

  deleteRepost: async (postID: number): Promise<void> => {
    await api.delete(`/post/${postID}/repost`);
  },

  update: async (
    postID: number,
    title: string,
    content: string,
  ): Promise<Post> => {
    const { data } = await api.patch<Post>(`/post/${postID}`, {
      title,
      content,
    });
    return data;
  },

  delete: async (postID: number): Promise<void> => {
    await api.delete(`/post/${postID}`);
  },
};
