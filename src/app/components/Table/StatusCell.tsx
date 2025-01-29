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

export const statusOptions: StatusOption[] = [
  { value: "Done", color: "#00C875" },
  { value: "Working on it", color: "#FDAB3D" },
  { value: "Not Started", color: "#C4C4C4" },
  { value: "Stuck", color: "#DF2F4A" },
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
    useState<StatusOption[]>(statusOptions);
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

    const currentValue = rows[rowIndex][columnId] as string;
    if (currentValue === editingStatus[index].value) {
      updateCell(rowIndex, tableId, {
        columnId: columnId,
        value: currentValue,
      });
    }
  };

  const handleColorPickerToggle = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setEditingStatusIndex(index);
    setShowColorPicker((prev) => !prev);
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
                      onClick={(e) => handleColorPickerToggle(e, index)}
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
                ) : (
                  <div className="flex items-center w-full gap-2">
                    <div
                      className={`flex-1 px-2 py-1 rounded cursor-pointer text-white`}
                      style={{ backgroundColor: status.color }}
                      onClick={() => handleStatusEdit(index)}
                    >
                      {status.value}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              className="mt-2 w-full py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                setEditingStatus([
                  ...editingStatus,
                  { value: "New Status", color: "#C4C4C4" },
                ]);
                setEditingStatusIndex(editingStatus.length);
              }}
            >
              +Add Status
            </button>
            <button
              className="w-full py-1 bg-gray-200 text-black rounded hover:bg-gray-300 mt-2"
              onClick={() => {
                setIsEditing(false);
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
            if (value === "Edit Status") {
              setIsEditing(true);
            } else {
              updateCell(rowIndex, tableId, {
                columnId: columnId,
                value: value,
              });
            }
          }}
          onEdit={handleEdit}
          options={editingStatus}
          isStatus={true}
        />
      )}
    </div>
  );
};

export default RenderStatusCell;
