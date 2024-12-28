import React from "react";
import { User } from "./types";

interface OwnerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (user: User | null, rowIndex: number) => void;
  users: User[];
  rowIndex?: number;
}

const OwnerSelectModal: React.FC<OwnerSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  users,
  rowIndex = -1,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 min-w-[200px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select Owner</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => onSelect(user, rowIndex)}
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">
                {user.time} • {user.address}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerSelectModal;
