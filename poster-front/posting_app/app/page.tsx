import { PostLoader } from "./components/post-loader/PostLoader";
import { PostFeed } from "./components/feed/PostFeed";

export default function Home() {
  return (
     <>
      <PostLoader />
      <PostFeed />
    </>
  );
}
