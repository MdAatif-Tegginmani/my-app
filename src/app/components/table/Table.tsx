import React from "react";
import { Plus } from "lucide-react";

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

const Table: React.FC<TableProps> = ({
  headers,
  data,
  currentColumnIndex,
  availableColumnsWithIcons,
  setButtonPosition,
  setModalOpen,
}) => {
  return (
    <table className="w-auto border-collapse border border-gray-300 text-sm table-fixed font-figtree">
      <thead>
        <tr>
          <th className="col-checkbox border border-gray-300 p-0.5 hover:bg-gray-100 w-10">
            <input type="checkbox" className="w-4 h-4" />
          </th>
          {headers.map((col, colIndex) => (
            <th
              key={colIndex}
              className={`col-${col.name
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
                <span className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 mt-1">
                  Add{" "}
                  {availableColumnsWithIcons[currentColumnIndex]?.name ||
                    "Column"}
                </span>
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
              <td className="border border-gray-300" key={col.columnId}>
                {row[col.name]?.toString() || ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
