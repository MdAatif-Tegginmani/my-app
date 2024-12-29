import RenderDateCell from "./DateCell";
import RenderLabelCell from "./LabelCell";
import NumberCell from "./NumberCell";
import RenderOwnerCell from "./OwnerCell";
import RenderStatusCell from "./StatusCell";
import TextCell from "./TableCell";


interface TableRowProps {
    rowIndex: number;
    columns: string[];
    row: string[];
    selectedRows: boolean[];
    onSelectRow: (index: number, checked: boolean) => void;
    onRowClick: (index: number) => void;
    updateCell: (rowIndex: number, colIndex: number, value: string) => void;
    setRows: (rows: string[][]) => void;
    rows: string[][];
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
        className={`${selectedRows[rowIndex] ? "bg-blue-200" : ""} hover:bg-gray-50 cursor-pointer`}
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
        {columns.map((col, colIndex) => (
          <td
            key={colIndex}
            className={`h-10 min-w-32 col-${col.toLowerCase().replace(/\s+/g, "-")} border border-gray-300 p-0 ${
              selectedRows[rowIndex] ? "bg-blue-200" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-full h-full ${selectedRows[rowIndex] ? "bg-blue-200" : ""}`}>
              {typeof col === "string" && col.toLowerCase() === "status" ? (
                <RenderStatusCell
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  selectedRows={selectedRows}
                  rows={rows}
                  updateCell={updateCell}
                />
              ) : typeof col === "string" && col.toLowerCase() === "label" ? (
                <RenderLabelCell
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  selectedRows={selectedRows}
                  rows={rows}
                  updateCell={updateCell}
                />
              ) : typeof col === "string" && col.toLowerCase() === "numbers" ? (
                <NumberCell
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  selectedRows={selectedRows}
                  value={row[colIndex] || ""}
                  updateCell={updateCell}
                />
              ) : typeof col === "string" && (col.toLowerCase() === "date" || col.toLowerCase() === "due date") ? (
                <RenderDateCell
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  selectedRows={selectedRows}
                  rows={rows}
                  updateCell={updateCell}
                />
              ) : typeof col === "string" && (col.toLowerCase() === "owner" || col.toLowerCase() === "people") ? (
                <RenderOwnerCell
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  selectedRows={selectedRows}
                  rows={rows}
                  updateCell={updateCell}
                  setRows={setRows}
                />
              ) : typeof col === "string" && col.toLowerCase() === "text" ? (
                <TextCell
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  selectedRows={selectedRows}
                  value={row[colIndex] || ""}
                  updateCell={updateCell}
                />
              ) : (
                <input
                  type="text"
                  value={row[colIndex] || ""}
                  onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
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