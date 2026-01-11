import api from "../lib/token.intreceptor";
import { Post } from "../types/post.interface";


export const PostAPI = {
  create: async (title: string, content: string): Promise<Post> => {
    const { data } = await api.post<Post>("/post", { title, content });
    return data;
  },

  getPosts: async (): Promise<Post[]> => {
    const { data } = await api.get<Post[]>("/post");
    return data;
  },

  getByUser: async (userID: number): Promise<Post[]> => {
    const { data } = await api.get<Post[]>(`/post/user/${userID}`);
    return data;
  },

  like: async (postID: number) => {
    await api.post(`/post/${postID}/like`);
  },

  repost: async (postID: number) => {
    await api.post(`/post/${postID}/repost`);
  },
  
  update : async(postID : number, title : string, content : string): Promise <Post> => {
  const {data} = await api.patch<Post>(`/post/${postID}`, {title,content})
  return data
  },

   delete : async(postID : number): Promise <void> => {
   await api.delete(`/post/${postID}`)
  }


};
