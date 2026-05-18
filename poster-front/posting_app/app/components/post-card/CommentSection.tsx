"use client";
import { useEffect, useState } from "react";
import { useComments } from "@/app/context/Comment.context";
import { Comment } from "@/app/types/comment.interface";

interface CommentProps {
  postId: number;
}
export const CommentSection = ({postId }: CommentProps) => {
  const {
    comments,
    createComment,
    updateComment,
    deleteComment,
    toggleLike,
    toggleRepost,
    reload,
  } = useComments();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    reload(postId);
  }, [postId]);

  const postComments = comments
  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return;
    await createComment(postId, title, content);
    setTitle("");
    setContent("");
    await reload(postId)
  };
  return (
    <div className="mt-4 border-t pt-3">
      <h4 className="font-bold mb-2">Comments</h4>
      <div className="flex flex-col gap-2 mb-4">
        <input
          className="input input-bordered input-sm"
          placeholder="Comment title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="textarea textarea-bordered textarea-sm"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={handleCreate} className="btn btn-primary btn-sm w-fit">
          Comment
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {postComments.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-2 bg-base-200">
            <p className="font-semibold">@{comment.user?.username}</p>

            <h5 className="font-bold">{comment.title}</h5>

            <p>{comment.content}</p>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => toggleLike(postId, comment.id)}
                className="text-sm"
              >
                {comment.isLiked ? "❤️" : "🤍"} {comment.likesCount || 0}
              </button>

              <button
                onClick={() => toggleRepost(postId, comment.id)}
                className="text-sm"
              >
                {comment.isReposted ? "🔁" : "🔄"} {comment.repostsCount || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
