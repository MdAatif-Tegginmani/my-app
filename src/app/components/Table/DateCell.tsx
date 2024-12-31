import UnifiedDatePicker from "../UnifiedDatePicker";
import { TableRowData } from "./TableRow";

const RenderDateCell = ({
  rowIndex,
  colIndex,
  selectedRows,
  rows,
  updateCell,
  columnId,
}: {
  rowIndex: number;
  colIndex: number;
  selectedRows: boolean[];
  rows: Record<string, TableRowData>[];
  columnId: number;
  updateCell: (
    rowIndex: number,
    tableId: number,
    rowData: {
      columnId: number;
      value: string;
    }
  ) => void;
}) => {
  return (
    <div
      className={`w-full h-full ${selectedRows[rowIndex] ? "bg-blue-200" : ""}`}
    >
      <UnifiedDatePicker
        selectedDate={
          rows[rowIndex][colIndex]
            ? new Date(rows[rowIndex][colIndex] as string)
            : undefined
        }
        onChange={(date) =>
          updateCell(rowIndex, colIndex, {
            columnId,
            value: date ? date.toISOString().split("T")[0] : "",
          })
        }
      />
    </div>
  );
};

export default RenderDateCell;
