import { CircleUserRound, Search, UserPlus } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface User {
  id: number;
  name: string;
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
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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
      className={`absolute flex items-center justify-center font-figtree ${isOpen ? "block" : "hidden"}`}
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl p-4 w-80" ref={modalRef}>
        <span className="absolute left-6 top-6 text-gray-400">
          <Search size={16} />
        </span>

        <input
          type="text"
          placeholder="Search names, roles or teams"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 mb-2 text-xs w-full placeholder:pr-16"
        />

        <h3 className="text-xs text-gray-500 mb-2">Suggested People</h3>
        <div className="max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                onSelect(user);
                onClose();
              }}
            >
              <CircleUserRound size={24} className="text-gray-400" />
              <span className="text-sm">{user.name}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
          <UserPlus size={12} />
          <span className="text-xs ml-3">Invite a new member by email</span>
        </div>
      </div>
    </div>
  );
};

export default OwnerSelectModal;
