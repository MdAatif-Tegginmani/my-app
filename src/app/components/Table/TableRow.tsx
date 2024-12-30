import RenderDateCell from "./DateCell";
import RenderLabelCell from "./LabelCell";
import NumberCell from "./NumberCell";
import RenderOwnerCell from "./OwnerCell";
import RenderStatusCell from "./StatusCell";
import TextCell from "./TableCell";

interface TableRowProps {
  rowIndex: number;
  columns: { id: number; name: string }[];
  row: Record<string, any>;
  selectedRows: boolean[];
  onSelectRow: (index: number, checked: boolean) => void;
  onRowClick: (index: number) => void;
  updateCell: (rowIndex: number, columnId: number, value: string) => void;
  setRows: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;
  rows: Record<string, any>[];
}

const TableRow: React.FC<TableRowProps> = ({
  rowIndex,
  columns,
  row,
  selectedRows,
  onSelectRow,
  onRowClick,
  updateCell,
  setRows,
  rows,
}) => {
  return (
    <tr
      className={`${
        selectedRows[rowIndex] ? "bg-blue-200" : ""
      } hover:bg-gray-50 cursor-pointer`}
      onClick={() => onRowClick(rowIndex)}
    >
      <td
        className="col-checkbox w-10 h-10 border border-gray-300 text-center p-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={selectedRows[rowIndex]}
          onChange={(e) => onSelectRow(rowIndex, e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      {columns.map((col) => (
        <td
          key={col.id}
          className={`h-10 min-w-32 col-${col.name
            .toLowerCase()
            .replace(/\s+/g, "-")} border border-gray-300 p-0 ${
            selectedRows[rowIndex] ? "bg-blue-200" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`w-full h-full ${
              selectedRows[rowIndex] ? "bg-blue-200" : ""
            }`}
          >
            {col.name.toLowerCase() === "status" ? (
              <RenderStatusCell
                rowIndex={rowIndex}
                colIndex={col.id}
                selectedRows={selectedRows}
                rows={rows}
                updateCell={updateCell}
              />
            ) : col.name.toLowerCase() === "label" ? (
              <RenderLabelCell
                rowIndex={rowIndex}
                colIndex={col.id}
                selectedRows={selectedRows}
                rows={rows}
                updateCell={updateCell}
              />
            ) : col.name.toLowerCase() === "numbers" ? (
              <NumberCell
                rowIndex={rowIndex}
                colIndex={col.id}
                selectedRows={selectedRows}
                value={row[col.id] || ""}
                updateCell={updateCell}
              />
            ) : col.name.toLowerCase() === "date" ||
              col.name.toLowerCase() === "due date" ? (
              <RenderDateCell
                rowIndex={rowIndex}
                colIndex={col.id}
                selectedRows={selectedRows}
                rows={rows}
                updateCell={updateCell}
              />
            ) : col.name.toLowerCase() === "owner" ||
              col.name.toLowerCase() === "people" ? (
              <RenderOwnerCell
                rowIndex={rowIndex}
                colIndex={col.id}
                selectedRows={selectedRows}
                rows={rows}
                updateCell={updateCell}
                setRows={setRows}
              />
            ) : col.name.toLowerCase() === "text" ? (
              <TextCell
                rowIndex={rowIndex}
                colIndex={col.id}
                selectedRows={selectedRows}
                value={row[col.id] || ""}
                updateCell={updateCell}
              />
            ) : (
              <input
                type="text"
                value={row[col.id] || ""}
                onChange={(e) => updateCell(rowIndex, col.id, e.target.value)}
                className={`w-full h-full py-0.5 px-1 border-none focus:outline-none rounded-none ${
                  selectedRows[rowIndex] ? "bg-transparent" : "bg-white"
                }`}
              />
            )}
          </div>
        </td>
      ))}
      <td className="border border-gray-300"></td>
    </tr>
  );
};

export default TableRow;
