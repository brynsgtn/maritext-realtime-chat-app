// to do - typing, optimize

import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    unsendMessage,
    isUnsendingMessage,
    markMessagesAsRead,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const lastSentMessage = [...messages]
    .reverse()
    .find((msg) => msg.senderId === authUser?.user?._id && !msg.isUnsent);

  // Modal state
  const [showUnsendModal, setShowUnsendModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [messageToUnsend, setMessageToUnsend] = useState(null);

  useEffect(() => {
    if (selectedUser?._id && authUser?.user?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();

      // Mark messages as read when opening chat
      markMessagesAsRead(selectedUser._id);
    }

    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    authUser?.user?._id, // Add this dependency
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    markMessagesAsRead // Add this dependency
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  const handleUnsendClick = (messageId) => {
    setMessageToUnsend(messageId);
    console.log(messageId)
    setShowUnsendModal(true);
  };

  const confirmUnsend = async () => {
    if (messageToUnsend) {
      try {
        await unsendMessage(messageToUnsend);
        setShowUnsendModal(false);
        setMessageToUnsend(null);
      } catch (error) {
        console.error("Failed to unsend message:", error);
      }
    }
  };

  const cancelUnsend = () => {
    setShowUnsendModal(false);
    setMessageToUnsend(null);
  };


  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isLastSent = lastSentMessage && message._id === lastSentMessage._id;


            return (
              <div
                key={message._id}
                className={`chat ${message.senderId === authUser.user._id ? "chat-end" : "chat-start"} group`}
                ref={messageEndRef}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.senderId === authUser.user._id
                          ? authUser.user.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1 flex items-center justify-between">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                  {!message.isUnsent && (
                    <button
                      onClick={() => handleUnsendClick(message._id)}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 p-1 bg-none rounded-full cursor-pointer ${message.senderId === authUser.user._id ? '' : 'hidden'
                        }`}
                      title="Unsend message"
                    >
                      <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                    </button>
                  )}

                </div>
                <div className={`chat-bubble flex flex-col ${message.isUnsent ? ' chat-bubble-secondary italic' : ''}`}>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                      onClick={() => setSelectedImage(message.image)}
                    />
                  )}
                  {message.text && <p className={message.isUnsent ? 'italic' : ''} >{message.text}</p>}
                </div>
                {isLastSent && (
                  <span
                    className={`text-xs text-gray-400 mt-1 self-end ${message.senderId === authUser?.user?._id ? '' : 'hidden'
                      }`}
                  >
                    {message.isRead
                      ? "Seen"
                      : message.isDelivered
                        ? "Delivered"
                        : "Sent"}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Unsend Confirmation Modal */}
        {showUnsendModal && (
          <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
            <div className="rounded-lg p-6 max-w-sm mx-4 shadow-xl">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold">
                  Unsend Message
                </h3>
              </div>

              <p className="mb-6">
                Are you sure you want to unsend this message? This action cannot be undone and the message will be removed for everyone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelUnsend}
                  className="px-4 py-2 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUnsend}
                  className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors cursor-pointer"
                >
                  Unsend
                </button>
              </div>
            </div>
          </div>
        )}

        <MessageInput />
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
          onClick={() => setSelectedImage(null)} // Close on background click
        >
          <div
            className="pt-10 max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside image box
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 cursor-pointer"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain rounded"
            />
          </div>
        </div>
      )}
    </>



  );
};

export default ChatContainer;