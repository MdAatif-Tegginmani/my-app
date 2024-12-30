import { Plus } from "lucide-react";

interface TableHeaderProps {
    columns: string[];
    selectAll: boolean;
    onSelectAll: (checked: boolean) => void;
    columnWidths: { [key: string]: number };
    onStartResize: (e: React.MouseEvent, colIndex: number) => void;
    onAddColumn: (e: React.MouseEvent) => void;
  }
  
  const TableHeader: React.FC<TableHeaderProps> = ({
    columns,
    selectAll,
    onSelectAll,
    columnWidths,
    onStartResize,
    onAddColumn,
  }) => {
    return (
      <tr>
        <th className="col-checkbox border border-gray-300 p-0.5 hover:bg-gray-100 w-10">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-4 h-4"
          />
        </th>
        {columns.map((col, colIndex) => (
          <th
            key={colIndex}
            className={`col-${col.toLowerCase().replace(/\s+/g, "-")} border border-gray-300 p-0.5 hover:bg-gray-100 text-center font-normal relative`}
            style={{ width: columnWidths[colIndex] || 150 }}
          >
            {col}
            <div
              className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-400"
              onMouseDown={(e) => onStartResize(e, colIndex)}
            />
          </th>
        ))}
        <th className="col-add border border-gray-300 p-0.5 hover:bg-gray-100">
          <button
            className="add-column-btn w-full h-full"
            onClick={onAddColumn}
            aria-label="Add column"
          >
            <Plus size={18} />
          </button>
        </th>
      </tr>
    );
  };

  export default TableHeader;
          