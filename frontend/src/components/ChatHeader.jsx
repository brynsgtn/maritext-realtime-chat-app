import { UserRoundXIcon, X } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";


const ChatHeader = () => {
  const { selectedUser, setSelectedUser, isRemovingContact, removeContact } = useChatStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const { onlineUsers } = useAuthStore();

  const handleRemoveContact = (recipientId) => {
    removeContact(recipientId)
    console.log(`Removing recipientId: ${recipientId}`)
    setIsModalOpen(false);
  }

  useEffect(() => {
    console.log(selectedUser)
  }, [selectedUser])
  return (

    <>
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.username} />
              </div>
            </div>

            {/* User info */}
            <div>
              <div className="flex items-center">
                <h3 className="font-medium">{selectedUser.username}</h3>
                <UserRoundXIcon
                  className="ms-3 size-4 cursor-pointer text-error"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
              <p className="text-sm text-base-content/70">
                {/* {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"} */}
                {selectedUser.email}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>


 {/* Modal */}
      {isModalOpen && (
        <div
          className="modal modal-open fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)} // close modal when clicking background
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-box rounded-lg p-6 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
          >
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-2">Are you sure you want to remove this contact?</p>
            <p className="mb-6 text-sm text-error">
              All messages with this contact will be deleted.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-outline"
                disabled={isRemovingContact}
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveContact(selectedUser._id)}
                className={`btn btn-error ${isRemovingContact ? "loading" : ""}`}
                disabled={isRemovingContact}
              >
                {isRemovingContact ? "Remove..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>

  );
};
export default ChatHeader;