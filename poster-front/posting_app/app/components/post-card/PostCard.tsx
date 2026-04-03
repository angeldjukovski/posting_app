'use client'

import { usePosts } from "@/app/context/Post.context"
import Link from "next/link"
import { useAuth } from "@/app/context/Auth.context"
import { useState } from "react"
import { Post } from "@/app/types/post.interface"


interface PostCardProps {
post : Post;
onUpdate? : (updatedPost : Post) => void
}

export const PostCard = ({post, onUpdate} : PostCardProps) => {

const {deletePost,editPost,toggleLike,toggleRepost} = usePosts()
const {user : currentUser,} = useAuth()

const [isEditing, setEditing] = useState(false)
const [editTitle, setEditTitle] = useState(post.title)
const [editContent, setEditContent] = useState(post.content) 

const handleDelete = async() => {
try {
await deletePost(post.id)
}catch(error) {
console.warn('There might be a problem in the backend',error)
}
}


const handleUpdate = async() => {
try {
await editPost(post.id,editTitle,editContent)
setEditing(false)

if(onUpdate) {
onUpdate({ ...post, title: editTitle, content: editContent })
}

}catch(error) {
console.error('Update failed',error)
}

}

const handleLike = async(id : number) => {
try {
const res = await toggleLike(id)
if(res && onUpdate) {
onUpdate({
...post,
isLiked : res.isLiked,
likesCount : res.isLiked ? (post.likesCount || 0) + 1 : Math.max(0, (post.likesCount || 0) - 1)
})
}
}catch(error) {
console.error('There is an error while liking the post',error)
}
}

const handleRepost = async() => {
try {
const response =await toggleRepost(post.id) 
if (response && onUpdate) {
        onUpdate({
          ...post,
          isReposted: response.isReposted,
          repostsCount: response.isReposted 
            ? (post.repostsCount || 0) + 1 
            : Math.max(0, (post.repostsCount || 0) - 1)
            
        })
      }
}catch(error) {
console.error('There is an error while reposting the post',error)
}
}



console.log("Post Data From Feed",post)
return (
<div className="card bg-base-100 w-90 shadow-sm border p-3">
<Link href={`/profile/${post.user?.id}`} className="font-bold">@{post.user?.username}</Link>
{isEditing ? (
<div className="flex flex-col gap-4">
<input className="input input-bordered input-sm" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}/>
<textarea className="textarea textarea-bordered textarea-sm" value={editContent} onChange={(e) => setEditContent(e.target.value)}/>
<div className="flex-gap-2">
<button className="btn btn-success btn-xs" onClick={(handleUpdate)}>Save</button>
<button className="btn btn-success btn-xs" onClick={() => setEditing(false)}>Cancel</button>
</div>
</div>
):(
<>
<h3 className="font-bold">{post.title}</h3>
<p>{post.content}</p>
<div>
<button onClick={() => handleLike(post.id)} className={`flex items-center gap-1 transition-colors ${post.isLiked ? 'text-red-500' : 'hover:text-red-400'} cursor-pointer`}>
Like <span>{post.isLiked ? '❤️' : '🤍'}</span>
<span className="text-xs font-semibold">{post.likesCount || 0}</span></button>
<button onClick={handleRepost} className={`flex items-center gap-1 transition-colors ${post.isReposted ? 'text-green-500' : 'hover:text-green-400'} cursor-pointer`}>Repost
 <span>{post.isReposted ? '🔁' : '🔄'}</span>
<span className="text-xs font-semibold">{post.repostsCount || 0}</span>
</button>
</div>
{post.user?.id === currentUser?.id && (
<div className="flex gap-2 mt-2">
<button className="btn btn-primary btn-xs" onClick={handleDelete}>Delete</button>
<button className="btn btn-primary btn-xs" onClick={() => setEditing(true)}>Edit</button>
</div>
)}
</>
)}
</div>
)}

