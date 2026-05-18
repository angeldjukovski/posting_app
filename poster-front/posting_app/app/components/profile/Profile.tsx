"use client";
import { usePosts } from "@/app/context/Post.context";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { PostCard } from "../post-card/PostCard";
import { useAuth } from "@/app/context/Auth.context";
import { useComments } from "@/app/context/Comment.context";
import { Repost } from "@/app/types/repost.interface";
import { Post } from "@/app/types/post.interface";

export const Profile = () => {
  const { getByUser, findPostByRepost } = usePosts();
  const { findCommentByRepost } = useComments();
  const { user: currentUser } = useAuth();
  const params = useParams();

  const userId = params?.id ? Number(params.id) : (currentUser?.id ?? null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [reposts, setReposts] = useState<Repost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        const [userPosts, userRepost, userCommentReposts] = await Promise.all([
          getByUser(userId),
          findPostByRepost(userId),
          findCommentByRepost(userId),
        ]);

        setPosts(userPosts);
        const mergedReposts: Repost[] = [
          ...userRepost
            .filter((post) => post)
            .map((post) => ({
              type: "post" as const,
              data: post,
            })),

          ...userCommentReposts
            .filter((comment) => comment)
            .map((comment) => ({
              type: "comment" as const,
              data: comment,
            })),
        ];
        setReposts(mergedReposts);
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
          reposts.map((item, index) => {
            if (!item.data) return null;

            if (item.type === "post") {
              return (
                <PostCard
                  key={`post-${item.data.id}-${index}`}
                  post={item.data}
                />
              );
            }

            return (
              <div
                key={`comment-${item.data.id}-${index}`}
                className="card bg-base-100 shadow border p-4"
              >
                <p className="font-bold">@{item.data.user?.username}</p>

                <h3 className="font-semibold">{item.data.title}</h3>

                <p>{item.data.content}</p>
              </div>
            );
          })
        ) : (
          <p>There are no reposts</p>
        )}
      </div>
    </div>
  );
};
