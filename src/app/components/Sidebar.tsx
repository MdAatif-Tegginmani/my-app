"use client";
import Link from "next/link";
import { FaRegCalendarAlt, FaRegBell, FaCog } from "react-icons/fa";
import { CirclePlus } from "lucide-react";
import { SiMcdonalds } from "react-icons/si";
import Image from "next/image";

const Sidebar = () => {
  return (
    <div className=" w-64 z-50 h-full   border-r border-gray-200  dark:border-gray-700 flex flex-col overflow-y-auto dark:bg-gray-800">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">Logo</span>
        </div>
      </div>

      {/* Projects Section */}
      <div className="p-4 flex-grow">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-4">PROJECTS</h2>
        <nav className="space-y-2 dark:text-[#c0c3cd] ">
          <Link
            href="/mcd"
            className="flex items-center text-foreground hover:bg-secondary p-2 rounded-lg transition-colors"
          >
            <SiMcdonalds className="mr-3" size={18} color="#FFC837" />
            <span>McD int</span>
          </Link>
          <Link
            href="/kfc"
            className="flex items-center text-foreground hover:bg-secondary p-2 rounded-lg transition-colors"
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
            className="flex items-center text-foreground hover:bg-secondary p-2 rounded-lg transition-colors"
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
            className="flex items-center text-foreground hover:bg-secondary p-2 rounded-lg transition-colors"
          >
            <FaRegCalendarAlt className="mr-3" />
            <span>Schedules</span>
          </Link>
        </nav>

        <button className="flex items-center border border-purple-400 dark:border-purple-500 text-foreground hover:bg-secondary px-2 py-1 mt-1 rounded-lg transition-colors">
          <CirclePlus size={16} className="mr-2" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-6 flex flex-col space-y-3">
        <button className="w-full flex justify-center border border-purple-400 dark:border-purple-500 items-center text-foreground hover:bg-secondary px-2 py-1 rounded-lg transition-colors">
          <FaRegCalendarAlt size={16} className="mr-2" />
          <span>Add Calendar</span>
        </button>

        <button className="w-full flex justify-center border border-purple-400 dark:border-purple-500 items-center text-foreground hover:bg-secondary px-2 py-1 rounded-lg transition-colors">
          <CirclePlus size={18} className="mr-2" />
          <span>Add Projects</span>
        </button>
      </div>

      {/* Settings Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-4">SETTINGS</h2>
        <nav className="space-y-2">
          <Link
            href="/notifications"
            className="flex items-center text-foreground hover:bg-secondary p-2 rounded-lg transition-colors"
          >
            <FaRegBell className="mr-3" />
            <span>Notification</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center text-foreground hover:bg-secondary p-2 rounded-lg transition-colors"
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
