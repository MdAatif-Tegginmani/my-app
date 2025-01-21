import { Plus, Trash2  } from "lucide-react";

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
          className="w-4 h-4 appearance-none border-[1px] border-solid border-gray-300
      checked:border-blue-500 checked:bg-blue-500
      transition-all duration-300 ease-out
      relative after:content-['✓'] after:text-white after:text-xs
      after:absolute after:top-[-1px] after:left-[2px]
      after:opacity-0 checked:after:opacity-100
      after:transition-opacity after:duration-200
      hover:border-blue-400   !rounded-sm"
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
            )} border border-gray-300 p-0.5 hover:bg-gray-100 text-center font-normal relative group`}
          style={{ width: columnWidths[col.id] || 150 }}
        >
          {col.name}
          <button
            onClick={() => onDeleteColumn(col.id)}
            className="absolute top-0 right-4 h-full w-1 cursor-pointer invisible group-hover:visible"
          >
            <Trash2 size={16} />
          </button>
          <div
            className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-400 invisible group-hover:visible"
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
          <Plus size={18} className="text-[#622BD9] opacity-80" />
        </button>
      </th>
    </tr>
  );
};

export default TableHeader;
