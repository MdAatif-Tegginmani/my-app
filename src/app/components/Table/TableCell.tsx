import { CirclePlus, Type } from "lucide-react";
import { CellProps } from "./types";

const TextCell: React.FC<CellProps> = ({
  rowIndex,
  // colIndex,
  selectedRows,
  value,
  updateCell,
  columnId,
  tableId,
}) => {
  return (
    <div
      className={`relative w-full h-full  group  ${
        selectedRows[rowIndex] ? "bg-blue-200" : ""
        
      }`}
    >
      <input
        type="text"
        value={value || ""}
        onChange={(e) => updateCell(rowIndex, tableId, {
          columnId: columnId,
          value: e.target.value
        })}
        className={`w-full h-full py-0.5 px-1 border-none focus:outline-none rounded-none bg-transparent  ${
          selectedRows[rowIndex] ? "bg-blue-200" : ""
        }`}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity gap-1">
        {!value && (
          <>
            <CirclePlus size={16} color="#3c41d3" className="text-gray-400" />
            <Type size={16} className="text-gray-400" />
          </>
        )}
      </div>
    </div>
  );
};

export default TextCell;
