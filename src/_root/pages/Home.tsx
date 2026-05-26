import { useState } from "react";
import { Models } from "appwrite";

import { Loader, PostCard, UserCard, TrendingTags } from "@/components/shared";
import { useGetRecentPosts, useGetUsers, useGetFollowingPosts, useGetCurrentUser } from "@/lib/react-query/queries";

const Home = () => {
  const [feedType, setFeedType] = useState<"recent" | "following">("recent");

  const { data: currentUser } = useGetCurrentUser();
  const followingIds = currentUser?.following?.map((f: any) => typeof f === 'string' ? f : f.$id) || [];

  const {
    data: recentPosts,
    isLoading: isRecentLoading,
    isError: isErrorRecent,
  } = useGetRecentPosts();

  const {
    data: followingPosts,
    isLoading: isFollowingLoading,
    isError: isErrorFollowing,
  } = useGetFollowingPosts(followingIds);

  const posts = feedType === "recent" ? recentPosts : followingPosts;
  const isPostLoading = feedType === "recent" ? isRecentLoading : isFollowingLoading;
  const isErrorPosts = feedType === "recent" ? isErrorRecent : isErrorFollowing;

  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <div className="flex flex-col gap-4 w-full">
            <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
            <div className="flex gap-4 border-b border-dark-4">
              <button
                onClick={() => setFeedType("recent")}
                className={`pb-2 px-4 transition ${feedType === "recent" ? "border-b-2 border-primary-500 text-light-1" : "text-light-3"}`}
              >
                Recent
              </button>
              <button
                onClick={() => setFeedType("following")}
                className={`pb-2 px-4 transition ${feedType === "following" ? "border-b-2 border-primary-500 text-light-1" : "text-light-3"}`}
              >
                Following
              </button>
            </div>
          </div>

          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <div className="flex flex-col gap-10">
          <section>
            <h3 className="h3-bold text-light-1 mb-6">Top Creators</h3>
            {isUserLoading && !creators ? (
              <Loader />
            ) : (
              <ul className="grid 2xl:grid-cols-2 gap-6">
                {creators?.documents.map((creator) => (
                  <li key={creator?.$id}>
                    <UserCard user={creator} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <TrendingTags />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
