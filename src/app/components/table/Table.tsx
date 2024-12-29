import React, { useState } from "react";
import { Plus } from "lucide-react";
import UnifiedDatePicker from "../UnifiedDatePicker";
import StatusLabelDropdown from "../StatusLabelDropdown";
import OwnerSelectModal from "../OwnerSelectModal";
import { User } from "../types";

interface TableColumn {
  id: number;
  name: string;
  columnId: string;
  icon: JSX.Element | null;
}

interface TableRow {
  [key: string]: string | null;
}

interface TableProps {
  headers: TableColumn[];
  data: TableRow[];
  currentColumnIndex: number;
  availableColumnsWithIcons: TableColumn[];
  setButtonPosition: (position: { x: number; y: number }) => void;
  setModalOpen: (open: boolean) => void;
}

const statusOptions = [
  { value: "Not Started", color: "#CBD5E1" },
  { value: "In Progress", color: "#3B82F6" },
  { value: "Completed", color: "#22C55E" },
  { value: "Blocked", color: "#EF4444" },
];

const labelOptions = [
  { value: "Bug", color: "#EF4444" },
  { value: "Feature", color: "#3B82F6" },
  { value: "Enhancement", color: "#22C55E" },
  { value: "Documentation", color: "#F59E0B" },
];

const users: User[] = [
  { id: 1, name: "Md Aatif", time: "7:57 PM+", address: "Ekaterinburg" },
];

const Table: React.FC<TableProps> = ({
  headers,
  data,
  
  setButtonPosition,
  setModalOpen,
}) => {
  
  const [activeCellPosition, setActiveCellPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  const [activeColumnName, setActiveColumnName] = useState<string | null>(null);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle cell value changes
  const handleRowCell = (
    value: string | null | undefined,
    columnId: string,
    rowIndex: number
  ) => {
    console.log("Cell value changed:", { value, columnId, rowIndex });
  };

  // Render cell content based on column type
  const renderCellContent = (
    col: TableColumn,
    row: TableRow,
    rowIndex: number
  ) => {
    const value = row[col.name]?.toString() || "";

    const handleCellClick = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setActiveCellPosition({ x: rect.x, y: rect.bottom });
      setActiveRowIndex(rowIndex);
      setActiveColumnName(col.name);

      switch (col.name) {
        case "Owner":
        case "People":
          setShowOwnerModal(true);
          break;
        case "Due Date":
        case "Date":
          setShowDatePicker(true);
          break;
      }
    };

    switch (col.name) {
      case "Owner":
      case "People":
        return (
          <div onClick={handleCellClick} className="cursor-pointer">
            {value || "Select Owner"}
          </div>
        );

      case "Due Date":
      case "Date":
        return (
          <div onClick={handleCellClick} className="cursor-pointer">
            {value || "Select Date"}
            {showDatePicker &&
              activeColumnName === col.name &&
              activeRowIndex === rowIndex && (
                <div className="absolute z-50">
                  <UnifiedDatePicker
                    selectedDate={value ? new Date(value) : null}
                    onChange={(date) => {
                      handleRowCell(
                        date?.toISOString(),
                        col.columnId,
                        rowIndex
                      );
                      setShowDatePicker(false);
                    }}
                  />
                </div>
              )}
          </div>
        );

      case "Status":
        return (
          <div onClick={handleCellClick} className="cursor-pointer">
            <StatusLabelDropdown
              value={value}
              onChange={(newValue) =>
                handleRowCell(newValue, col.columnId, rowIndex)
              }
              options={statusOptions}
              isStatus={true}
            />
          </div>
        );

      case "Label":
        return (
          <div onClick={handleCellClick} className="cursor-pointer">
            <StatusLabelDropdown
              value={value}
              onChange={(newValue) =>
                handleRowCell(newValue, col.columnId, rowIndex)
              }
              options={labelOptions}
              isStatus={false}
            />
          </div>
        );

      default:
        return value;
    }
  };

  return (
    <>
      <table className="w-auto border-collapse border border-gray-300 text-sm table-fixed font-figtree">
        <thead>
          <tr>
            <th className="col-checkbox border border-gray-300 p-0.5 hover:bg-gray-100 w-10">
              <input type="checkbox" className="w-4 h-4" />
            </th>
            {headers.map((col, colIndex) => (
              <th
                key={colIndex}
                className={`w-40 col-${col.name
                  .toLowerCase()
                  .replace(
                    /\s+/g,
                    "-"
                  )} border border-gray-300 p-0.5 hover:bg-gray-100 text-center font-normal relative`}
              >
                {col.name}
                <div className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-400" />
              </th>
            ))}
            <th className="col-add border border-gray-300 p-0.5 hover:bg-gray-100">
              <button
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setButtonPosition({ x: rect.x, y: rect.bottom });
                  setModalOpen(true);
                }}
                className="add-column-btn w-full h-full relative group"
                aria-label="Add column"
              >
                <div className="flex items-center justify-center">
                  <Plus size={18} />
                  
                </div>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="w-8 h-8 border border-gray-300 text-center p-0.5">
                <input type="checkbox" className="w-4 h-4" />
              </td>
              {headers.map((col) => (
                <td
                  className="border border-gray-300 p-2 relative"
                  key={col.columnId}
                >
                  {renderCellContent(col, row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {showOwnerModal && activeRowIndex !== null && activeCellPosition && (
        <OwnerSelectModal
          isOpen={showOwnerModal}
          onClose={() => setShowOwnerModal(false)}
          onSelect={(user, rowIndex) => {
            handleRowCell(
              user?.name,
              headers.find((h) => h.name === activeColumnName)?.columnId || "",
              rowIndex
            );
            setShowOwnerModal(false);
          }}
          users={users}
          rowIndex={activeRowIndex}
          position={activeCellPosition}
        />
      )}
    </>
  );
};

export default Table;
