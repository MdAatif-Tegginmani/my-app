"use client";
import { useState } from "react";
import BackButton from "../../components/BackButton";

export default function PasswordSettings() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (passwords.new !== passwords.confirm) {
      setError("New passwords do not match");
      return;
    }

    if (passwords.new.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Handle password update
  };

  return (
    <>
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="flex items-start max-h-screen pt-24 pl-36">
        <div className="w-full max-w-2xl  bg-white dark:bg-gray-800 flex flex-col items-center rounded-xl py-16 shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white ">
            Change Password
          </h2>
          <form onSubmit={handleSubmit} className=" w-full px-24 space-y-6 ">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800   dark:border-[#474a66] dark:text-gray-300 dark:focus:ring-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800   dark:border-[#474a66] dark:text-gray-300 dark:focus:ring-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300 ">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500  dark:bg-gray-800   dark:border-[#474a66] dark:text-gray-300 dark:focus:ring-gray-600"
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside ml-4 mt-2 ">
                <li>Minimum 8 characters long</li>
                <li>Include at least one number</li>
                <li>Include at least one special character</li>
              </ul>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#622BD9] bg-opacity-80 text-white rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-1  dark:bg-purple-800 dark:hover:bg-purple-900 "
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
