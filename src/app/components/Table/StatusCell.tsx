import StatusLabelDropdown from "../StatusLabelDropdown";



export type StatusOption = {
    value: string;
    color: string;
  };

export const statusOptions: StatusOption[] = [
    { value: "Done", color: "bg-[#00C875] text-white" },
    { value: "Working on it", color: "bg-[#FDAB3D] text-white" },
    { value: "Not Started", color: "bg-[#C4C4C4] text-white" },
    { value: "Stuck", color: "bg-[#DF2F4A] text-white" },
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