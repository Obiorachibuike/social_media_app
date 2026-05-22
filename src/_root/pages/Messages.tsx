import { useGetUsers } from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";

const Messages = () => {
  const { data: users, isLoading } = useGetUsers();

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/chat.svg"
            width={36}
            height={36}
            alt="chat"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Messages</h2>
        </div>

        <div className="flex flex-col flex-1 w-full mt-10 gap-4">
          <p className="text-light-4">Select a user to start a conversation</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users?.documents.map((user) => (
              <Link
                key={user.$id}
                to={`/chat/${user.$id}`}
                className="flex items-center gap-4 p-4 bg-dark-2 rounded-2xl border border-dark-4 hover:border-primary-500 transition-all"
              >
                <img
                  src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="profile"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex flex-col">
                  <p className="body-bold text-light-1">{user.name}</p>
                  <p className="small-regular text-light-3">@{user.username}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
