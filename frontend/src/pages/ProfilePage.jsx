import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Check, X, Edit, AtSign } from "lucide-react";
import dayjs from "dayjs";


const ProfilePage = () => {
  const { authUser, isUpdatingProfilePicture, updateProfilePicture, isUpdatingUsername, updateUsername } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState(authUser?.user?.username || "");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfilePicture({ profilePic: base64Image });
    };
  };

  const handleUsernameUpdate = async () => {
    if (username.trim() === "") return;

    setIsEditingUsername(false);
    if (username !== authUser.user.username) {
      console.log(`Updating username: ${username}`)
      await updateUsername({ userName: username });
    }
  };

  const cancelUsernameEdit = () => {
    setUsername(authUser.user.username); // Fix: Reset to original username from authUser
    setIsEditingUsername(false);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.user.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfilePicture ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfilePicture}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfilePicture ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <AtSign className="w-4 h-4" />
                Username
              </div>

              {isEditingUsername ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="px-4 py-2.5 bg-base-200 rounded-lg border flex-grow"
                    autoFocus
                  />
                  <button
                    onClick={handleUsernameUpdate}
                    className="p-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    disabled={isUpdatingUsername}
                  >
                    {isUpdatingUsername ? (
                      <span className="text-white text-xs animate-pulse">Saving...</span>
                    ) : (
                      <Check className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={cancelUsernameEdit}
                    className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg flex-grow">
                    {authUser.user.username}
                  </p>
                  <button
                    onClick={() => setIsEditingUsername(true)}
                    className="hidden group-hover:inline-flex p-2 bg-base-100 rounded-lg hover:bg-base-200 transition-colors cursor-pointer"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-100 rounded-lg">{authUser.user.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>  {authUser.user.createdAt
                  ? dayjs(authUser.user.createdAt).format("MMMM D, YYYY")
                  : ""}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;