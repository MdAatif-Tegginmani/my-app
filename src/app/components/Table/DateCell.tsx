import UnifiedDatePicker from "../UnifiedDatePicker";

const RenderDateCell = ({
  rowIndex,
  colIndex,
  selectedRows,
  rows,
  updateCell,
}: {
  rowIndex: number;
  colIndex: number;
  selectedRows: boolean[];
  rows: string[][];
  updateCell: (rowIndex: number, colIndex: number, value: string) => void;
}) => {
  return (
    <div
      className={`w-full h-full ${selectedRows[rowIndex] ? "bg-blue-200" : ""}`}
    >
      <UnifiedDatePicker
        selectedDate={
          rows[rowIndex][colIndex]
            ? new Date(rows[rowIndex][colIndex])
            : undefined
        }
        onChange={(date) =>
          updateCell(
            rowIndex,
            colIndex,
            date ? date.toISOString().split("T")[0] : ""
          )
        }
      />
    </div>
  );
};

export default RenderDateCell;
