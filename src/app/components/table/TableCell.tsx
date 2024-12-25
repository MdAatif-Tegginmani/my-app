import StatusLabelDropdown from "../StatusLabelDropdown";
import UnifiedDatePicker from "../UnifiedDatePicker";
import { CircleUserRound } from "lucide-react";
// import { User } from "../types";

interface TableCellProps {
  col: { name: string; columnId: string };
  row: any;
  rowIndex: number;
  colIndex: number;
  selectedRows: boolean[];
  renderOwnerCell: (rowIndex: number, colIndex: number) => JSX.Element;
  renderDateCell: (rowIndex: number, colIndex: number) => JSX.Element;
  renderStatusCell: (rowIndex: number, colIndex: number) => JSX.Element;
  renderLabelCell: (rowIndex: number, colIndex: number) => JSX.Element;
}

export const TableCell: React.FC<TableCellProps> = ({
  col,
  row,
  rowIndex,
  colIndex,
  selectedRows,
  renderOwnerCell,
  renderDateCell,
  renderStatusCell,
  renderLabelCell,
}) => {
  const handleCellClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (col.columnId === "owner" || col.columnId === "people") {
      renderOwnerCell(rowIndex, colIndex);
    } else if (col.columnId === "due_date" || col.columnId === "date") {
      renderDateCell(rowIndex, colIndex);
    } else if (col.columnId === "status") {
      renderStatusCell(rowIndex, colIndex);
    } else if (col.columnId === "label") {
      renderLabelCell(rowIndex, colIndex);
    }
  };

  const renderCellContent = () => {
    switch (col.columnId) {
      case "owner":
        return <CircleUserRound />;
      case "due_date":
      case "date":
        return (
          <UnifiedDatePicker
            selectedDate={row[col.columnId]}
            onChange={() => {}}
          />
        );
      case "status":
        return (
          <StatusLabelDropdown
            value={row[col.columnId]}
            options={[]}
            onChange={() => {}}
            isStatus={true}
          />
        );
      case "label":
        return <span>{row[col.columnId]}</span>;
      default:
        return <span>{row[col.columnId]}</span>;
    }
  };

  return (
    <td
      className={`h-10 min-w-32 col-${col.name
        .toLowerCase()
        .replace(/\s+/g, "-")} border border-gray-300 p-0 ${
        selectedRows[rowIndex] ? "bg-blue-200" : ""
      }`}
      onClick={handleCellClick}
    >
      <div
        className={`w-full h-full ${
          selectedRows[rowIndex] ? "bg-blue-200" : ""
        }`}
      >
        {renderCellContent()}
      </div>
    </td>
  );
};
