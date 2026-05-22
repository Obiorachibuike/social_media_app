import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useGetMessages, useCreateMessage, useGetUserById } from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";
import { client, appwriteConfig } from "@/lib/appwrite/config";

const Chat = () => {
  const { id: contactId } = useParams();
  const { user } = useUserContext();
  const [message, setMessage] = useState("");

  const { data: contact, isLoading: isLoadingContact } = useGetUserById(contactId || "");
  const { data: messages, isLoading: isLoadingMessages, refetch } = useGetMessages(user.id, contactId || "");
  const { mutateAsync: sendMessage, isLoading: isSending } = useCreateMessage();

  useEffect(() => {
    if (!appwriteConfig.messageCollectionId) return;

    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messageCollectionId}.documents`,
      (response) => {
        if (
          response.events.includes("databases.*.collections.*.documents.*.create")
        ) {
          refetch();
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [refetch]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !contactId) return;

    try {
      await sendMessage({
        senderId: user.id,
        receiverId: contactId,
        text: message,
      });
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoadingContact || isLoadingMessages) return <Loader />;

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src={contact?.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="contact"
            className="w-12 h-12 rounded-full"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">{contact?.name}</h2>
        </div>

        <div className="flex flex-col flex-1 w-full mt-10 bg-dark-2 rounded-3xl p-5 overflow-y-auto max-h-[60vh]">
          {messages?.documents.length === 0 ? (
            <p className="text-light-4 text-center">No messages yet. Say hi!</p>
          ) : (
            messages?.documents.map((msg: any) => {
              const isSender = (typeof msg.sender === 'string' ? msg.sender : msg.sender.$id) === user.id;
              return (
                <div
                  key={msg.$id}
                  className={`flex w-full mb-4 ${isSender ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[70%] ${
                      isSender ? "bg-primary-500 text-white rounded-br-none" : "bg-dark-4 text-light-1 rounded-bl-none"
                    }`}
                  >
                    <p className="body-medium">{msg.text}</p>
                    <p className="subtle-semibold text-light-4 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-4 w-full mt-5">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-dark-4 border-none text-light-1 p-4 rounded-xl focus:ring-0 outline-none"
          />
          <button
            type="submit"
            disabled={isSending}
            className="shad-button_primary px-10 rounded-xl"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
