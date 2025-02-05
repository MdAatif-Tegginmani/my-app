import React from "react";
import SearchBar from "./SearchBar";

interface Column {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonPosition: { x: number; y: number };
  availableColumnsWithIcons: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }>;
  onColumnSelect: (columnLabel: string) => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  buttonPosition,
  availableColumnsWithIcons,
  onColumnSelect,
}) => {
  if (!isOpen) return null;

  const handleColumnSelect = (column: Column) => {
    onColumnSelect(column.label);
  };

  return (
    <div className="fixed inset-0 z-50 " onClick={onClose}>
      <div
        className="absolute bg-white dark:bg-gray-800 dark:text-white dark:shadow-2xl p-4 rounded-lg shadow-lg w-72"
        style={{
          top: `${buttonPosition.y}px`,
          left: `${buttonPosition.x - 280}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h3 className="text-sm text-gray-500 mb-2 dark:text-gray-300">Add Column</h3>
          <SearchBar
            availableColumns={availableColumnsWithIcons}
            onColumnSelect={handleColumnSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
