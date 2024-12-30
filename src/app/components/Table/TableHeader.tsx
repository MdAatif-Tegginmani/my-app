import { Plus } from "lucide-react";

interface TableHeaderProps {
  columns: { id: number; name: string }[];
  onDeleteColumn: (columnId: number) => Promise<void>;
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
  columnWidths: Record<number, number>;
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
  onDeleteColumn,
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
      {columns.map((col) => (
        <th
          key={col.id}
          className={`col-${col.name
            .toLowerCase()
            .replace(
              /\s+/g,
              "-"
            )} border border-gray-300 p-0.5 hover:bg-gray-100 text-center font-normal relative`}
          style={{ width: columnWidths[col.id] || 150 }}
        >
          {col.name}
          <button
            onClick={() => onDeleteColumn(col.id)}
            className="absolute top-0 right-4 h-full w-1 cursor-pointer"
          >
            ...
          </button>
          <div
            className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-400"
            onMouseDown={(e) => onStartResize(e, col.id)}
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
