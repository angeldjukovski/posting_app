"use client";
import { usePosts } from "@/app/context/Post.context";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { PostCard } from "../post-card/PostCard";
import { useAuth } from "@/app/context/Auth.context";
import { Post } from "@/app/types/post.interface";

export const Profile = () => {
  const { getByUser, findPostByRepost } = usePosts();
  const { user: currentUser } = useAuth();
  const params = useParams();

  const userId = params?.id ? Number(params.id) : (currentUser?.id ?? null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [reposts, setReposts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        const [userPosts, userRepost] = await Promise.all([
          getByUser(userId),
          findPostByRepost(userId),
        ]);

        setPosts(userPosts);
        setReposts(userRepost);
      } catch (error) {
        console.error("Profile failed to load", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (!userId) return <div>Loading user...</div>;
  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="flex flex-col gap-6 items-center py-6">
      <div className="w-full max-w-xl">
        <h2 className="font-bold text-lg mb-2">Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p>There are no posts</p>
        )}
      </div>

      <div className="w-full max-w-xl">
        <h2 className="font-bold text-lg mb-2">Reposts</h2>
        {reposts.length > 0 ? (
          reposts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p>There are no reposts</p>
        )}
      </div>
    </div>
  );
};
