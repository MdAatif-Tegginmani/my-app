import { CirclePlus, Hash } from "lucide-react";
import { CellProps } from "./types";

const NumberCell: React.FC<CellProps> = ({
    rowIndex,
    colIndex,
    selectedRows,
    value,
    updateCell,
    tableId,
  }) => {
    return (
      <div className={`relative w-full h-full group ${selectedRows[rowIndex] ? "bg-blue-200" : ""}`}>
        <input
          type="number"
          value={value || ""}
          onChange={(e) => updateCell(rowIndex, tableId, {
            columnId: colIndex,
            value: e.target.value
          })}
          className={`w-full h-full text-center py-0.5 px-1 border-none focus:outline-none rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            selectedRows[rowIndex] ? "bg-transparent" : "bg-white"
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity gap-1">
          {!value && (
            <>
              <CirclePlus size={16} color="#3c41d3" className="text-gray-400" />
              <Hash size={16} className="text-gray-400" />
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default NumberCell;