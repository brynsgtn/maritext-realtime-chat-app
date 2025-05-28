// to do - online users, delivered, chat deletion?, preview image modal

import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    unsendMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  
  // Modal state
  const [showUnsendModal, setShowUnsendModal] = useState(false);
  const [messageToUnsend, setMessageToUnsend] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    console.log(authUser)
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleUnsendClick = (message) => {
    setMessageToUnsend(message);
    setShowUnsendModal(true);
  };

  const confirmUnsend = async () => {
    if (messageToUnsend) {
      try {
        await unsendMessage(messageToUnsend._id);
        setShowUnsendModal(false);
        setMessageToUnsend(null);
      } catch (error) {
        console.error("Failed to unsend message:", error);
        // You might want to show an error toast here
      }
    }
  };

  const cancelUnsend = () => {
    setShowUnsendModal(false);
    setMessageToUnsend(null);
  };

  // Check if message can be unsent (within time limit, e.g., 5 minutes)
  const canUnsendMessage = (message) => {
    if (message.senderId !== authUser.user._id) return false;
    
    const messageTime = new Date(message.createdAt);
    const currentTime = new Date();
    const timeDifference = currentTime - messageTime;
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    return timeDifference <= fiveMinutes;
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
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
   
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
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
              {/* Unsend button - only show for own messages within time limit */}
              {canUnsendMessage(message) && (
                <button
                  onClick={() => handleUnsendClick(message)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 p-1 bg-none rounded-full cursor-pointer"
                  title="Unsend message"
                >
                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                </button>
              )}
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Unsend Confirmation Modal */}
      {showUnsendModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Unsend Message
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to unsend this message? This action cannot be undone and the message will be removed for everyone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelUnsend}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
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
  );
};

export default ChatContainer;