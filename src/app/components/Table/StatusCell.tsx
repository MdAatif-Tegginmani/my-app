import React, { useState } from "react";
import StatusLabelDropdown from "../StatusLabelDropdown";
import { TableRowData } from "./types";
import { SketchPicker } from "react-color";
import { PaintBucket } from "lucide-react";

export type StatusOption = {
  value: string;
  color: string;
  isEditButton?: boolean;
  isAddNewButton?: boolean;
};

export const defaultStatusOptions: StatusOption[] = [
  { value: "Done", color: "#00C875" },
  { value: "Working on it", color: "#FDAB3D" },
  { value: "Not Started", color: "#C4C4C4" },
  { value: "Stuck", color: "#DF2F4A" },
];

export const statusOptions: StatusOption[] = [
  ...defaultStatusOptions,
  { value: "Add Status", color: "bg-gray-200", isAddNewButton: true },
  { value: "Edit Status", color: "bg-gray-100", isEditButton: true },
];

const RenderStatusCell = ({
  rowIndex,
  // colIndex,
  selectedRows,
  rows,
  updateCell,
  columnId,
  tableId,
}: {
  rowIndex: number;
  colIndex: number;
  selectedRows: boolean[];
  rows: TableRowData[];
  tableId: number;
  updateCell: (
    rowIndex: number,
    tableId: number,
    rowData: {
      columnId: number;
      value: string | number | boolean | null | undefined;
    }
  ) => void;
  columnId: number;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingStatus, setEditingStatus] =
    useState<StatusOption[]>(defaultStatusOptions);
  const [editingStatusIndex, setEditingStatusIndex] = useState<number | null>(
    null
  );
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleStatusEdit = (index: number) => {
    setEditingStatusIndex(index);
  };

  const handleStatusChange = (value: string, index: number) => {
    const newStatuses = [...editingStatus];
    newStatuses[index] = { ...newStatuses[index], value };
    setEditingStatus(newStatuses);

    // If the current cell has this status, update it
    const currentValue = rows[rowIndex][columnId] as string;
    if (currentValue === editingStatus[index].value) {
      updateCell(rowIndex, tableId, {
        columnId: columnId,
        value: value,
      });
    }
  };

  const handleColorChange = (color: string, index: number) => {
    const newStatuses = [...editingStatus];
    newStatuses[index] = { ...newStatuses[index], color };
    setEditingStatus(newStatuses);

    // Update the color for any cells using this status
    const currentValue = rows[rowIndex][columnId] as string;
    if (currentValue === editingStatus[index].value) {
      updateCell(rowIndex, tableId, {
        columnId: columnId,
        value: currentValue, // Trigger a re-render with the same value
      });
    }

    // Ensure the dropdown options are updated
    setEditingStatus([...newStatuses]); // Force update to re-render
  };

  const handleAddNewStatus = () => {
    setEditingStatus([
      ...editingStatus,
      { value: "New Status", color: "#C4C4C4" },
    ]);
    setEditingStatusIndex(editingStatus.length);
  };

  const handleColorPickerToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling up
    setShowColorPicker((prev) => !prev); // Toggle color picker visibility
  };

  return (
    <div
      className={`relative h-full w-full ${
        selectedRows[rowIndex] ? "bg-blue-200" : ""
      }`}
    >
      {isEditing ? (
        <div className="absolute !bg-white z-50 p-4 w-48 shadow-xl">
          <div className="flex flex-col gap-2 h-full text-center">
            {editingStatus.map((status, index) => (
              <div key={index} className="flex items-center gap-2 relative">
                {editingStatusIndex === index ? (
                  <div className="flex items-center gap-3 w-full">
                    <button
                      onClick={handleColorPickerToggle}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <PaintBucket size={20} />
                    </button>
                    <input
                      type="text"
                      className="flex-1 px-2 py-1 border rounded"
                      value={status.value}
                      onChange={(e) =>
                        handleStatusChange(e.target.value, index)
                      }
                      onBlur={() => setEditingStatusIndex(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setEditingStatusIndex(null);
                        }
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="flex items-center w-full gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingStatusIndex(index);
                        setShowColorPicker(true);
                      }}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <PaintBucket size={20} />
                    </button>
                    <div
                      className={`flex-1 px-2 py-1 rounded cursor-pointer text-white`}
                      style={{ backgroundColor: status.color }}
                      onClick={() => handleStatusEdit(index)}
                    >
                      {status.value}
                    </div>
                  </div>
                )}
                {showColorPicker && editingStatusIndex === index && (
                  <div
                    className="absolute left-full top-2 ml-2 z-[60] pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-white p-3 rounded-lg shadow-xl border">
                      <SketchPicker
                        color={status.color || "#000000"}
                        onChangeComplete={(color) =>
                          handleColorChange(color.hex, index)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              className="mt-2 w-full py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleAddNewStatus}
            >
              +Add Status
            </button>
            <button
              className="w-full py-1 bg-gray-200 text-black rounded hover:bg-gray-300 mt-2"
              onClick={() => {
                setIsEditing(false);
                setShowColorPicker(false);
              }}
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <StatusLabelDropdown
          value={(rows[rowIndex][columnId] as string) || ""}
          onChange={(value) => {
            if (value === "Add Status") {
              setIsEditing(true);
              handleAddNewStatus();
            } else if (value === "Edit Status") {
              setIsEditing(true);
            } else {
              updateCell(rowIndex, tableId, {
                columnId: columnId,
                value: value,
              });
            }
          }}
          onEdit={handleEdit}
          options={[
            ...editingStatus,
            ...statusOptions.slice(defaultStatusOptions.length),
          ]}
          isStatus={true}
        />
      )}
    </div>
  );
};

export default RenderStatusCell;
