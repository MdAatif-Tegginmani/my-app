import { Search, UserPlus } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { HiMiniUserCircle } from "react-icons/hi2";

export interface User {
  id: number;
  name: string;
  time?: string;
  address?: string;
}

interface OwnerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (user: User | null) => void;
  users: User[];
  position: { x: number; y: number };
}

const OwnerSelectModal: React.FC<OwnerSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  users,
  position,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`fixed z-50 ${isOpen ? "block" : "hidden"}`}
      style={{
        top: position.y,
        left: position.x,
        transform: "translate(-50%, 0)",
      }}
    >
      <div
        className="bg-white dark:bg-gray-800 dark:text-white dark:border-[#474a66] border rounded-xl shadow-xl p-4 w-80"
        ref={modalRef}
      >
        <div className="relative flex items-center mb-4">
          <span className="absolute left-3 text-gray-600">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search names, roles or teams"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-4 py-1.5 border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded text-sm"
          />
        </div>

        <h3 className="text-xs dark:text-gray-300 text-gray-600 mb-2 px-1">Suggested People</h3>
        <div className="max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => {
                onSelect(user);
                onClose();
              }}
            >
              <HiMiniUserCircle size={28} className="text-gray-400" />
              <span className="text-sm">{user.name}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-2 mt-2 hover:bg-gray-100 rounded-md cursor-pointer">
          <UserPlus size={14} className="text-gray-500 dark:text-gray-300" />
          <span className="text-xs">Invite a new member by email</span>
        </div>
      </div>
    </div>
  );
};

export default OwnerSelectModal;
