"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UserProfile() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    profileImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  // 🔥 FETCH USER FROM BACKEND
 useEffect(() => {
  const fetchdata = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/getProfile",
        { withCredentials: true }
      );

      setUser(res.data);
      console.log(res.data)
    } catch (error) {
      console.log(error.response?.data?.message || "error");
    }
  };

  fetchdata();
}, []);

   

 

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
  <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">

    {/* Header */}
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 h-48">
      <div className="absolute left-1/2 -bottom-20 -translate-x-1/2">
        <div className="relative">
          <img
            src={user?.profileImage || "/Eye.png"}
            className="h-40 w-40 rounded-full border-8 border-white object-cover bg-white shadow-lg"
          />
          {editMode && (
            <label className="absolute bottom-2 right-2 bg-blue-600 text-white text-sm px-3 py-2 rounded-full cursor-pointer hover:bg-blue-700 transition duration-200 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Change
              <input
                type="file"
                accept="image/*"
                
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="pt-28 px-8 pb-12">
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
              placeholder="Enter your username"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Bio
            </label>
            <textarea
              rows="5"
              value={formData.bio || ""}
              onChange={(e) =>
                setFormData((p) => ({ ...p, bio: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition duration-200"
              placeholder="Tell us a bit about yourself..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button className="px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 shadow-md">
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">

          {/* Name */}
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            @{user?.username || "username"}
          </h2>

          {/* Email */}
          <p className="text-gray-600 text-base mt-2">
            {user?.email}
          </p>

          {/* Divider */}
          <div className="my-8 h-px bg-gray-200" />

          {/* Bio */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              About
            </h3>
            <p className="text-gray-700 wrap-break-word leading-relaxed text-base">
              {user?.bio || "No bio added yet. Click 'Edit Profile' to add one."}
            </p>
          </div>

          {/* Edit Button */}
          <div className="mt-10">
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
</div>
  );
}
