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
  availableColumnsWithIcons: Array<{
    id: string;
    name: string;
    columnId: string;
    icon: JSX.Element;
  }>;
  onColumnSelect: () => void;
  existingColumns: string[];
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  availableColumnsWithIcons,
  onColumnSelect,
  existingColumns,
}) => {
  if (!isOpen) return null;

  const handleColumnSelect = (column: Column) => {
    onColumnSelect(column.label);
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute bg-white p-4 rounded-lg shadow-lg w-72"
        style={{
          top: `${buttonPosition.y}px`,
          left: `${buttonPosition.x - 280}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h3 className="text-sm text-gray-500 mb-2">Add Column</h3>
          <SearchBar
            availableColumns={availableColumnsWithIcons}
            onColumnSelect={handleColumnSelect}
            existingColumns={existingColumns}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
