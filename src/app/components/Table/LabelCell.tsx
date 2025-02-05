import React, { useState } from "react";
import StatusLabelDropdown from "../StatusLabelDropdown";
import { TableRowData } from "./types";
import { SketchPicker } from "react-color";
import { PaintBucket } from "lucide-react";

export type LabelOption = {
  value: string;
  color: string;
  isEditButton?: boolean;
  isAddNewButton?: boolean;
};

export const defaultLabelOptions: LabelOption[] = [
  { value: "Label 1", color: "#8B3DFF" }, // Purple
  { value: "Label 2", color: "#0096FF" }, // Blue
  { value: "Label 3", color: "#9BA1A6" }, // Gray
];

export const labelOptions: LabelOption[] = [
  ...defaultLabelOptions,
  { value: "Add Label", color: "bg-gray-200", isAddNewButton: true },
  { value: "Edit Labels", color: "bg-gray-100", isEditButton: true },
];

const RenderLabelCell = ({
  rowIndex,
  colIndex,
  selectedRows,
  rows,
  updateCell,
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
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingLabels, setEditingLabels] =
    useState<LabelOption[]>(defaultLabelOptions);
  const [editingLabelIndex, setEditingLabelIndex] = useState<number | null>(
    null
  );
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleLabelEdit = (index: number) => {
    setEditingLabelIndex(index);
  };

  const handleLabelChange = (value: string, index: number) => {
    const newLabels = [...editingLabels];
    newLabels[index] = { ...newLabels[index], value };
    setEditingLabels(newLabels);

    // If the current cell has this label, update it
    const currentValue = rows[rowIndex][colIndex] as string;
    if (currentValue === editingLabels[index].value) {
      updateCell(rowIndex, tableId, {
        columnId: colIndex,
        value: value,
      });
    }
  };

  const handleColorChange = (color: string, index: number) => {
    const newLabels = [...editingLabels];
    newLabels[index] = { ...newLabels[index], color };
    setEditingLabels(newLabels);

    // Update the color for any cells using this label
    const currentValue = rows[rowIndex][colIndex] as string;
    if (currentValue === editingLabels[index].value) {
      updateCell(rowIndex, tableId, {
        columnId: colIndex,
        value: currentValue, // Trigger a re-render with the same value
      });
    }

    // Ensure the dropdown options are updated
    setEditingLabels([...newLabels]); // Force update to re-render
  };

  const handleAddNewLabel = () => {
    setEditingLabels([
      ...editingLabels,
      { value: "New Label", color: "bg-[#C4C4C4]" },
    ]);
    setEditingLabelIndex(editingLabels.length);
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
            {editingLabels.map((label, index) => (
              <div key={index} className="flex items-center gap-2 relative">
                {editingLabelIndex === index ? (
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
                      value={label.value}
                      onChange={(e) => handleLabelChange(e.target.value, index)}
                      onBlur={() => setEditingLabelIndex(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setEditingLabelIndex(null);
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
                        setEditingLabelIndex(index);
                        setShowColorPicker(true);
                      }}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <PaintBucket size={20} />
                    </button>
                    <div
                      className={`flex-1 px-2 py-1 rounded cursor-pointer  text-white`}
                      style={{ backgroundColor: label.color }}
                      onClick={() => handleLabelEdit(index)}
                    >
                      {label.value}
                    </div>
                  </div>
                )}
                {showColorPicker && editingLabelIndex === index && (
                  <div
                    className="absolute left-full top-2 ml-2 z-[60] pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-white p-3 rounded-lg shadow-xl border">
                      <SketchPicker
                        color={label.color || "#000000"}
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
              onClick={handleAddNewLabel}
            >
              +Add Label
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
          value={(rows[rowIndex][colIndex] as string) || ""}
          onChange={(value) => {
            if (value === "Add Label") {
              setIsEditing(true);
              handleAddNewLabel();
            } else {<div class="status-picker-wrapper flex items-center justify-center h-full cursor-pointer" style="background-color: white; color: rgb(55, 65, 81);"></div>
              updateCell(rowIndex, tableId, {
                columnId: colIndex,
                value: value,
              });
            }
          }}
          onEdit={handleEdit}
          options={[
            ...editingLabels,
            ...labelOptions.slice(defaultLabelOptions.length),
          ]}
          isStatus={false}
        />
      )}
    </div>
  );
};

export default RenderLabelCell;
