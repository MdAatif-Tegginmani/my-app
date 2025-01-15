"use client";
import Link from "next/link";
import { FaRegCalendarAlt, FaRegBell, FaCog } from "react-icons/fa";
import { BsFileEarmarkText } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
         
          <span className="font-semibold">Logo</span>
        </div>
      </div>

      {/* Projects Section */}
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 mb-4">PROJECTS</h2>
        <nav className="space-y-2">
          <Link
            href="/mcd"
            className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
          >
            <BsFileEarmarkText className="mr-3" />
            <span>McD int</span>
          </Link>
          <Link
            href="/kfc"
            className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
          >
            <BsFileEarmarkText className="mr-3" />
            <span>KFC int</span>
          </Link>
          <Link
            href="/dom"
            className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
          >
            <BsFileEarmarkText className="mr-3" />
            <span>Dom int</span>
          </Link>
          <Link
            href="/schedules"
            className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
          >
            <FaRegCalendarAlt className="mr-3" />
            <span>Schedules</span>
          </Link>
        </nav>

        <button className=" flex items-center border border-purple-400 text-gray-700 hover:bg-gray-100 p-1 mt-1 rounded-lg">
          <AiOutlinePlus className="mr-3" />
          <span className="">Add Item</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex flex-col items-center space-y-3">
        <button className=" flex border border-purple-400 items-center text-gray-700 hover:bg-gray-100 px-4 py-1 rounded-lg">
          <FaRegCalendarAlt className="mr-3" />
          <span>Add Calendar</span>
        </button>
        <button className=" flex border border-purple-400 items-center text-gray-700 hover:bg-gray-100 px-4 py-1 rounded-lg">
          <AiOutlinePlus className="mr-3" />
          <span>Add Projects</span>
        </button>
      </div>

      {/* Settings Section */}
      <div className="mt-auto p-4 border-t border-gray-200">
        <h2 className="text-xs font-semibold text-gray-500 mb-4">SETTINGS</h2>
        <nav className="space-y-2">
          <Link
            href="/notifications"
            className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
          >
            <FaRegBell className="mr-3" />
            <span>Notification</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
          >
            <FaCog className="mr-3" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
