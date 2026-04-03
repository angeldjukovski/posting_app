import api from "../lib/token.intreceptor";
import { Post } from "../types/post.interface";
import { User } from "../types/user";

export const SearchAPI =  {
  searchPost: async (query : string): Promise<Post[]> => {
  const response = await api.get(`/search?query=${query}`)
  return response.data.posts 
},  
 
 searchUser: async (query : string): Promise<User[]> => {
  const response = await api.get(`/search?query=${query}`)
  return response.data.users 

}

}