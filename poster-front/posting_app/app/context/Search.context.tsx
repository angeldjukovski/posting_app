"use client";
import { createContext, useState, useContext } from "react";
import { SearchAPI } from "../services/search.service";
import { Post } from "../types/post.interface";
import { User } from "../types/user";

interface SearchContextType {
  posts: Post[];
  users: User[];
  query: string;
  setQuery: (query:string) => void
  search : (query : string) => Promise<void>
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");

  const search = async (query: string) => {
    if (!query) {
      setPosts([]);
      setUsers([]);
      return;
    }

    const [users, posts] = await Promise.all([
      SearchAPI.searchUser(query),
      SearchAPI.searchPost(query),
    ]);
    setUsers(users)
    setPosts(posts)
  };

   return (
    <SearchContext.Provider value={{ posts, users, query, setQuery, search }}>
      {children}
    </SearchContext.Provider>
  );
  
}
export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be inside SearchProvider");
  return ctx;
};