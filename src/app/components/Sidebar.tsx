"use client";
import Link from "next/link";
import { FaRegCalendarAlt, FaRegBell, FaCog } from "react-icons/fa";
import { CirclePlus } from "lucide-react";
import { SiMcdonalds } from "react-icons/si";
import Image from "next/image";

const Sidebar = () => {
  return (
    <div className="w-64 z-50 h-screen bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <span className="font-bold">Logo</span>
        </div>
      </div>

      {/* Projects Section */}
      <div className="p-4 flex-grow ">
        <h2 className="text-xs font-semibold text-gray-500 mb-4">PROJECTS</h2>
        <nav className="space-y-2">
          <Link
            href="/mcd"
            className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
          >
            <SiMcdonalds className="mr-3" size={18} color="#FFC837" />

            <span>McD int</span>
          </Link>
          <Link
            href="/kfc"
            className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
          >
            <Image
              src="/kfc.svg"
              alt="KFC"
              width={18}
              height={18}
              className="mr-3"
            />
            <span>KFC int</span>
          </Link>
          <Link
            href="/dom"
            className="flex items-center text-gray-700 hover:bg-gray-100 p-2 rounded-lg"
          >
            <Image
              src="/dominos.svg"
              alt="Dom"
              width={18}
              height={18}
              className="mr-3"
            />
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

        <button className=" flex items-center border border-purple-400 text-gray-700 hover:bg-gray-100 px-2 py-1 mt-1 rounded-lg">
          <CirclePlus size={16} className="mr-2" />
          <span className="">Add Item</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-6 flex flex-col space-y-3">
        <button className=" w-full flex justify-center border  border-purple-400 items-center jus text-gray-700 hover:bg-gray-100 px-2 py-1  rounded-lg">
          <FaRegCalendarAlt size={16} className="mr-2" />
          <span className="">Add Calendar</span>
        </button>

        <button className=" w-full flex justify-center border border-purple-400 items-center text-gray-700 hover:bg-gray-100 px-2 py-1  rounded-lg">
          <CirclePlus size={18} className="mr-2" />
          <span className="">Add Projects</span>
        </button>
      </div>

      {/* Settings Section */}
      <div className="p-4 border-t border-gray-200">
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
