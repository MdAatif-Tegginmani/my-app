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
        <div className="flex  items-start max-h-screen pt-24 pl-36">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 flex flex-col items-center rounded-xl py-16 shadow-md">
      <h2 className="text-2xl font-semibold mb-12 dark:text-white ">Profile Settings</h2>
      <form onSubmit={handleSubmit} className=" w-full px-16 space-y-6 ">
        <div className="flex flex-col items-start w-full ">



          <label className="block text-sm font-medium text-gray-700 mb-4 dark:text-gray-300">
            Profile Picture
          </label>
          <div className="flex items-center space-x-4 ">
            <Image
              src="/profileImg.svg"
              alt="Profile"
              width={80}
              height={80}
              className=" rounded-full object-cover "
            />
            <button
              type="button"
              className="px-4 py-2 text-sm border border-gray-300 dark:border-[#474a66]  rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Change Photo
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300 ">
            Full Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-3 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-[#474a66] dark:bg-gray-800 dark:focus:ring-gray-600  "
          />
        </div>

        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300 ">
            Email Address
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-[#474a66] dark:bg-gray-800 dark:focus:ring-gray-600"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#622BD9] bg-opacity-80 text-white rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-1 dark:bg-purple-800 dark:hover:bg-purple-900  "
        >
          Save Changes
        </button>
      </form>
    </div>
    </div>
    </>
  );
}
