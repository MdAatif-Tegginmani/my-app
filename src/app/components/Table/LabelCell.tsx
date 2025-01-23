import StatusLabelDropdown from "../StatusLabelDropdown";
import { TableRowData } from "./types";


export type LabelOption = {
  value: string;
  color: string;
};

export const labelOptions: LabelOption[] = [
  { value: "Label 1", color: "bg-[#C4C4C4]" },
  { value: "Label 2", color: "bg-[#007EB5]" },
  { value: "Label 3", color: "bg-[#9D99B9]" },

];

const RenderLabelCell = ({
  rowIndex,
  colIndex,
  selectedRows,
  rows,
  updateCell,
  tableId,
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
}) => (
  <div
    className={`relative h-full w-full ${
      selectedRows[rowIndex] ? "bg-blue-200" : ""
    }`}
  >
    <StatusLabelDropdown
      value={(rows[rowIndex][colIndex] as string) || ""}
      onChange={(value) =>
        updateCell(rowIndex, tableId, {
          columnId: colIndex,
          value: value,
        })
      }
      options={labelOptions}
      isStatus={false}
    />

  </div>
);

export default RenderLabelCell;
