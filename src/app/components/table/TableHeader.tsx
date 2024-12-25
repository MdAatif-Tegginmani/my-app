import { Plus } from "lucide-react";

interface TableHeaderProps {
  columns: { name: string; columnId: string }[];
  selectAll: boolean;
  handleSelectAll: (checked: boolean) => void;
  handleAddColumn: () => void;
  columnWidths: { [key: string]: number };
  startResize: (e: React.MouseEvent, colIndex: number) => void;
  currentColumnIndex: number;
  availableColumnsWithIcons: Array<{
    label: string;
    id: string;
    icon: JSX.Element;
  }>;
  handleFilterChange?: (columnId: string, value: string) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  selectAll,
  handleSelectAll,
  handleAddColumn,
  columnWidths,
  startResize,
  currentColumnIndex,
  availableColumnsWithIcons,
  handleFilterChange,
}) => {
  return (
    <thead>
      <tr>
        <th className="col-checkbox border border-gray-300 p-0.5 hover:bg-gray-100 w-10">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="w-4 h-4"
          />
        </th>
        {columns.map((col, colIndex) => (
          <th
            key={colIndex}
            className={`col-${col.name
              .toLowerCase()
              .replace(
                /\s+/g,
                "-"
              )} border border-gray-300 p-0.5 hover:bg-gray-100 text-center font-normal relative`}
            style={{ width: columnWidths[colIndex] || 150 }}
          >
            {col.name}
            <div
              className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-400"
              onMouseDown={(e) => startResize(e, colIndex)}
            />
          </th>
        ))}
        <th className="col-add border border-gray-300 p-0.5 hover:bg-gray-100">
          <button
            className="add-column-btn w-full h-full relative group"
            onClick={handleAddColumn}
            aria-label="Add column"
          >
            <div className="flex items-center justify-center">
              <Plus size={18} />
              <span className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 mt-1">
                Add{" "}
                {availableColumnsWithIcons[currentColumnIndex]?.label ||
                  "Column"}
              </span>
            </div>
          </button>
        </th>
      </tr>
      <tr>
        <th className="col-checkbox border border-gray-300 p-0.5 w-10"></th>
        {columns.map((col, colIndex) => (
          <th
            key={colIndex}
            className="border border-gray-300 p-1"
            style={{ width: columnWidths[colIndex] || 150 }}
          >
            <input
              type="text"
              className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:border-blue-500"
              placeholder={`Filter ${col.name}...`}
              onChange={(e) =>
                handleFilterChange?.(col.columnId, e.target.value)
              }
            />
          </th>
        ))}
        <th className="border border-gray-300 p-0.5"></th>
      </tr>
    </thead>
  );
};
