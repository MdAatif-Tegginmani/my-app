import UnifiedDatePicker from "../UnifiedDatePicker";
import { TableRowData } from "./types";

const RenderDateCell = ({
  rowIndex,
  colIndex,
  selectedRows,
  rows,
  updateCell,
  columnId,
  tableId,
}: {
  rowIndex: number;
  colIndex: number;
  selectedRows: boolean[];
  rows: TableRowData[];
  columnId: number;
  tableId: number;
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
          updateCell(rowIndex, tableId, {
            columnId: colIndex,
            value: date ? date.toISOString().split("T")[0] : "",
          })
        }
      />
    </div>
  );
};

export default RenderDateCell;
