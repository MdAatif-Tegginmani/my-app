import StatusLabelDropdown from "../StatusLabelDropdown";

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
      options={statusOptions}
      isStatus={true}
    />
  </div>
);

export default RenderStatusCell;