import React from "react";
import { Plus } from "lucide-react";
import UnifiedDatePicker from "../UnifiedDatePicker";
import { User } from "../types";
// import { , User } from "../types";

interface TableProps {
  headers: { name: string; columnId: string }[];
  data: any;
  // selectAll: boolean;
  // columnWidths: { [key: string]: number };
  // startResize: (e: React.MouseEvent, colIndex: number) => void;
  currentColumnIndex: number;
  availableColumnsWithIcons: Array<{
    id: string;
    name: string;
    columnId: string;
    icon: JSX.Element;
  }>;
}

const Table: React.FC<TableProps> = ({
  headers,
  data,
  // columnWidths,
  // startResize,
  currentColumnIndex,
  availableColumnsWithIcons,
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
              // style={{ width: columnWidths[col.columnId] || 150 }}
            >
              {col.name}
              <div
                className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-400"
                // onMouseDown={(e) => startResize(e, colIndex)}
              />
            </th>
          ))}
          <th className="col-add border border-gray-300 p-0.5 hover:bg-gray-100">
            <button
              className="add-column-btn w-full h-full relative group"
              // onClick={handleAddColumn}
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
        <tr>
          <th className="col-checkbox border border-gray-300 p-0.5 w-10"></th>
          {headers.map((col, colIndex) => (
            <th
              key={colIndex}
              className="border border-gray-300 p-1"
              // style={{ width: columnWidths[col.columnId] || 150 }}
            >
              <input
                type="text"
                className="w-full px-1 py-0.5 text-sm border rounded focus:outline-none focus:border-blue-500"
                // placeholder={`${col.name}...`}
                // onChange={(e) =>
                //   handleFilterChange?.(col.columnId, e.target.value)
                // }
              />
            </th>
          ))}
          <th className="border border-gray-300 p-0.5"></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => {
          console.log("this is riow",row);
          return (
          <tr key={rowIndex || row.id}>
            <td  className="w-8 h-8  border border-gray-300 text-center p-0.5">
              <input type="checkbox" className="w-4 h-4" />
            </td>
            {headers.map((col) => (
                <td className="border border-gray-300" key={col.columnId}>
                  {row[col.name]?.toString() || ""}
              
                  {/* {renderCellContent(col, row)} */}

              </td>
            ))}
          </tr>
        )})}
      </tbody>
    </table>
  );
};

const renderCellContent = (col: { columnId: string }, row: any) => {
  const getStringValue = (value: string | User | null | undefined): string => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && "name" in value)
      return value.name;
    return "";
  };

  switch (col.columnId) {
    case "task_name":
      return <span>{row.taskName || getStringValue(row[col.columnId])}</span>;
    case "owner":
      return (
        <span>
          {typeof row.owner === "string" ? row.owner : row.owner?.name || ""}
        </span>
      );
    case "due_date":
      return (
        <UnifiedDatePicker
          selectedDate={
            typeof row.dueDate === "string" && row.dueDate
              ? new Date(row.dueDate)
              : undefined
          }
          onChange={() => {
            /* handle date change */
          }}
        />
      );
    case "status":
      return (
        <span
          className="px-2 py-1 rounded-full text-sm"
          style={{ backgroundColor: "#10B981", color: "white" }}
        >
          {getStringValue(row[col.columnId]) || "Not Started"}
        </span>
      );
    case "label":
      return (
        <span
          className="px-2 py-1 rounded-full text-sm"
          style={{ backgroundColor: "#6366F1", color: "white" }}
        >
          {getStringValue(row[col.columnId]) || "No Label"}
        </span>
      );
    case "text":
      return <span>{getStringValue(row[col.columnId])}</span>;
    case "numbers":
      return <span>{getStringValue(row[col.columnId])}</span>;
    case "people":
      return <span>{getStringValue(row[col.columnId])}</span>;
    case "date":
      const dateValue = getStringValue(row[col.columnId]);
      return (
        <UnifiedDatePicker
          selectedDate={dateValue ? new Date(dateValue) : undefined}
          onChange={() => {
            /* handle date change */
          }}
        />
      );
    default:
      return <span>{getStringValue(row[col.columnId])}</span>;
  }
};

export default Table;
