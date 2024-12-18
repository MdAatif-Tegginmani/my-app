import React, { useState } from "react";

interface User {
  id: number;
  name: string;
  img: string;
}

interface OwnerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (user: User | null) => void;
  users: User[];
}

const OwnerSelectModal: React.FC<OwnerSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  users,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded shadow-lg p-4">
        <h2 className="text-lg font-bold mb-2">Select an Owner</h2>
        <input
          type="text"
          placeholder="Search names, roles or teams"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        <div className="max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                onSelect(user);
                onClose();
              }}
            >
              <span>{user.name}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-2 text-blue-500">
          Close
        </button>
      </div>
    </div>
  );
};

export default OwnerSelectModal;
