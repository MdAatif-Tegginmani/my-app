import { useState } from "react";
import StatusLabelDropdown from "../StatusLabelDropdown";
import { TableRowData } from "./types";

export type LabelOption = {
  value: string;
  color: string;
  isEditButton?: boolean;
  isAddNewButton?: boolean;
};

const defaultLabelOptions: LabelOption[] = [
  { value: "Label 1", color: "bg-[#C4C4C4]" },
  { value: "Label 2", color: "bg-[#007EB5]" },
  { value: "Label 3", color: "bg-[#9D99B9]" },
];

export const labelOptions: LabelOption[] = [
  ...defaultLabelOptions,
  { value: "Add Label", color: "bg-black", isAddNewButton: true },
  { value: "Edit Labels", color: "bg-red-500", isEditButton: true },
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

  const handleAddNewLabel = () => {
    setEditingLabels([
      ...editingLabels,
      { value: "New Label", color: "bg-[#C4C4C4]" },
    ]);
    setEditingLabelIndex(editingLabels.length);
  };

  return (
    <div
      className={`relative h-full w-full ${
        selectedRows[rowIndex] ? "bg-blue-200" : ""
      }`}
    >
      {isEditing ? (
        <div className="absolute inset-0 bg-white z-50 p-2 shadow-lg">
          <div className="flex flex-col gap-2 h-full">
            {editingLabels.map((label, index) => (
              <div key={index} className="flex items-center gap-2">
                {editingLabelIndex === index ? (
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
                ) : (
                  <div
                    className={`flex-1 px-2 py-1 rounded cursor-pointer ${label.color} text-white`}
                    onClick={() => handleLabelEdit(index)}
                  >
                    {label.value}
                  </div>
                )}
              </div>
            ))}
            <button
              className="mt-auto w-full py-1 bg-black  text-white rounded"
              onClick={handleAddNewLabel}
            >
              Add Label
            </button>
            <button
              className="w-full py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mt-2"
              onClick={() => setIsEditing(false)}
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
            } else {
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
