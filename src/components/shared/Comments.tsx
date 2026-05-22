import { useState } from "react";
import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { useCreateComment, useGetComments, useDeleteComment } from "@/lib/react-query/queries";
import Loader from "./Loader";
import { multiFormatDateString } from "@/lib/utils";

type CommentsProps = {
  postId: string;
};

const Comments = ({ postId }: CommentsProps) => {
  const { user } = useUserContext();
  const [comment, setComment] = useState("");

  const { data: comments, isLoading: isLoadingComments } = useGetComments(postId);
  const { mutateAsync: addComment, isLoading: isAddingComment } = useCreateComment();
  const { mutate: deleteComment } = useDeleteComment();

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addComment({
        userId: user.id,
        postId: postId,
        text: comment,
      });
      setComment("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full mt-10">
      <h3 className="body-bold md:h3-bold w-full">Comments</h3>

      <form onSubmit={handleAddComment} className="flex gap-4 w-full">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 bg-dark-4 border-none text-light-1 p-3 rounded-xl focus:ring-0 outline-none"
        />
        <button
          type="submit"
          disabled={isAddingComment}
          className="shad-button_primary px-8 rounded-xl"
        >
          {isAddingComment ? "Posting..." : "Post"}
        </button>
      </form>

      <div className="flex flex-col gap-4 w-full">
        {isLoadingComments ? (
          <Loader />
        ) : comments?.documents.length === 0 ? (
          <p className="text-light-4">No comments yet.</p>
        ) : (
          comments?.documents.map((comment: Models.Document) => (
            <div key={comment.$id} className="flex gap-3 items-start bg-dark-3 p-4 rounded-2xl">
              <img
                src={comment.user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt="user"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center">
                  <p className="body-bold text-light-1">{comment.user.name}</p>
                  <p className="subtle-semibold text-light-4">
                    {multiFormatDateString(comment.createdAt)}
                  </p>
                </div>
                <p className="small-medium text-light-2 mt-1">{comment.text}</p>
              </div>
              {comment.user.$id === user.id && (
                <button
                  onClick={() => deleteComment(comment.$id)}
                  className="hover:text-red transition"
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={18}
                    height={18}
                  />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
