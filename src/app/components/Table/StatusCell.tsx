import StatusLabelDropdown from "../StatusLabelDropdown";
import { TableRowData } from "./types";

export type StatusOption = {
  value: string;
  color: string;
};

export const statusOptions: StatusOption[] = [
  { value: "Done", color: "#00C875" },
  { value: "Working on it", color: "#FDAB3D" },
  { value: "Not Started", color: "#C4C4C4" },
  { value: "Stuck", color: "#DF2F4A" },
];

const RenderStatusCell = ({
  rowIndex,
  // colIndex,
  selectedRows,
  rows,
  updateCell,
  columnId,
  tableId

}: {
  rowIndex: number;
  colIndex: number;
  selectedRows: boolean[];
  rows: TableRowData[];
  tableId: number;
  updateCell: (
    rowIndex: number,
    tableId: number,
    rowData: {
      columnId: number;
      value: string | number | boolean | null | undefined;
    }
  ) => void;
  columnId: number;
}) => {
  return (
    <div
      className={`relative h-full w-full ${
        selectedRows[rowIndex] ? "bg-blue-200" : ""
      }`}
    >
      <StatusLabelDropdown
        value={(rows[rowIndex][columnId] as string) || ""}
        onChange={(value) =>
          updateCell(rowIndex, tableId, {
            columnId: columnId,
            value: value,
          })
        }
        options={statusOptions}
        isStatus={true}
      />
    </div>
  );
};

export default RenderStatusCell;
