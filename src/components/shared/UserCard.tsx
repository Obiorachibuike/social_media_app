import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useFollowUser, useUnfollowUser } from "@/lib/react-query/queries";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const { user: currentUser } = useUserContext();
  const { mutate: followUser, isLoading: isFollowing } = useFollowUser();
  const { mutate: unfollowUser, isLoading: isUnfollowing } = useUnfollowUser();

  const isFollowed = user.followers?.some(
    (follower: any) => (typeof follower === 'string' ? follower : follower.$id) === currentUser.id
  );

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFollowed) {
      unfollowUser({ userId: user.$id, followerId: currentUser.id });
    } else {
      followUser({ userId: user.$id, followerId: currentUser.id });
    }
  };

  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          className="shad-button_primary px-5"
          disabled={isFollowing || isUnfollowing}
          onClick={handleFollow}>
          {isFollowed ? "Following" : "Follow"}
        </Button>
        <Link
          to={`/chat/${user.$id}`}
          className="shad-button_dark_4 px-5 flex-center gap-2 rounded-lg text-light-1"
          onClick={(e) => e.stopPropagation()}
        >
          Message
        </Link>
      </div>
    </Link>
  );
};

export default UserCard;
