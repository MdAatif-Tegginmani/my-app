import StatusLabelDropdown from "../StatusLabelDropdown";

export type LabelOption = {
  value: string;
  color: string;
};


export const labelOptions: LabelOption[] = [
    { value: "Label 1", color: "bg-[#C4C4C4] text-white" },
    { value: "Label 2", color: "bg-[#007EB5] text-white" },
    { value: "Label 3", color: "bg-[#9D99B9] text-white" },
  ];

const RenderLabelCell = ({
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
}) => (
  <div
    className={`relative h-full w-full ${
      selectedRows[rowIndex] ? "bg-blue-200" : ""
      }`}
    >
      <StatusLabelDropdown
        value={rows[rowIndex][colIndex] || ""}
        onChange={(value) => updateCell(rowIndex, colIndex, value)}
        options={labelOptions}
        isStatus={false}
      />
    </div>
  );


export default RenderLabelCell;