"use client";
import { useState } from "react";
import Image from "next/image"
import BackButton from "../../components/BackButton";



export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "/default-avatar.png",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update
  };

  return (
  <>
    <div className="mb-4">
            <BackButton />
          </div>
        <div className="flex  min-h-screen p-24">
      <div className="w-full max-w-xl">
      <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <div className="flex items-center space-x-4">
            <Image
              src="/profileImg.svg"
              alt="Profile"
              width={80}
              height={80}
              className=" rounded-full object-cover "
            />
            <button
              type="button"
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Change Photo
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#622BD9] bg-opacity-80 text-white rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-1 "
        >
          Save Changes
        </button>
      </form>
    </div>
    </div>
    </>
  );
}
