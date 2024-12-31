import { Trash2 } from "lucide-react";
import RenderDateCell from "./DateCell";
import RenderLabelCell from "./LabelCell";
import NumberCell from "./NumberCell";
import RenderOwnerCell from "./OwnerCell";
import RenderStatusCell from "./StatusCell";
import TextCell from "./TableCell";
import { TableColumnData } from "./types";
import { TableRowData } from "./types";

interface TableRowProps {
  rowIndex: number;
  columns: TableColumnData[];
  row: TableRowData;
  selectedRows: boolean[];
  // columnId: number;
  // onDeleteRows:(  tableId: number,rowIndex: number)
  onSelectRow: (index: number, checked: boolean) => void;
  onRowClick: (index: number) => void;
  updateCell: (
    rowIndex: number,
    tableId: number,
    rowData: {
      columnId: number;
      value: string | number | boolean | null | undefined;
    }
  ) => void;
  setRows: React.Dispatch<React.SetStateAction<TableRowData[]>>;
  rows: TableRowData[];
  onDeleteRow: (rowIndex: number, tableId: number) => void;
  tableId: number;
}

const TableRow: React.FC<TableRowProps> = ({
  rowIndex,
  columns,
  row,
  selectedRows,
  onRowClick,
  updateCell,
  setRows,
  rows,
  onSelectRow,
  onDeleteRow,
  tableId,
  // columnId,
}) => {
  return (
    <tr
      className={` ${
        selectedRows[rowIndex] ? "bg-blue-200" : ""
      } hover:bg-gray-50 cursor-pointer `}
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
          className="w-4 h-4 appearance-none border-[1px] border-solid border-gray-300
      checked:border-blue-500 checked:bg-blue-500
      transition-all duration-300 ease-out
      relative after:content-['✓'] after:text-white after:text-xs
      after:absolute after:top-[-1px] after:left-[2px]
      after:opacity-0 checked:after:opacity-100
      after:transition-opacity after:duration-200
      hover:border-blue-400   !rounded-sm"
        />
      </td>
      {columns.map((col) => (
        <td
          key={col.id}
          className={`h-10 min-w-32 col-${col.name
            .toLowerCase()
            .replace(/\s+/g, "-")} border border-gray-300  p-0 ${
            selectedRows[rowIndex] ? "bg-blue-200" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`w-full  h-full ${
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
                columnId={col.id}
                tableId={tableId}
              />
            ) : col.name.toLowerCase() === "label" ? (
              <RenderLabelCell
                rowIndex={rowIndex}
                colIndex={col.id}
                selectedRows={selectedRows}
                rows={rows}
                updateCell={updateCell}
                tableId={tableId}
              />
            ) : col.name.toLowerCase() === "numbers" ? (
              <NumberCell
                rowIndex={rowIndex}
                colIndex={col.id}
                selectedRows={selectedRows}
                value={Number(row[col.id] ?? 0)}
                updateCell={updateCell}
                columnId={col.id}
                tableId={tableId}
              />
            ) : col.name.toLowerCase() === "date" ||
              col.name.toLowerCase() === "due date" ? (
              <RenderDateCell
                rowIndex={rowIndex}
                colIndex={col.id}
                selectedRows={selectedRows}
                rows={rows}
                updateCell={updateCell}
                columnId={col.id}
                tableId={tableId}
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
                tableId={tableId}
              />
            ) : col.name.toLowerCase() === "text" ? (
              <TextCell
                rowIndex={rowIndex}
                colIndex={col.id}
                selectedRows={selectedRows}
                value={String(row[col.id] ?? "")}
                updateCell={updateCell}
                columnId={col.id}
                tableId={tableId}
              />
            ) : (
              
              <input
                type="text"
                value={String(row[col.id] ?? "")}
                onChange={(e) =>
                  updateCell(rowIndex, tableId, {
                    columnId: col.id,
                    value: e.target.value,
                  })
                }
                className={`w-full h-full py-0.5 px-1 border-none focus:outline-none rounded-none  bg-transparent   ${
                  selectedRows[rowIndex] ? "bg-blue-200" : ""
                }`}
              />
            )}
          </div>

          {/* <button onClick={() => onDeleteRow(rowIndex)}>delete</button> */}
        </td>
      ))}
      <td className="border border-gray-300 ">
        {selectedRows[rowIndex] && (
          <button
            className="w-full h-full flex justify-center items-center"
            onClick={() => onDeleteRow(rowIndex, tableId)}
          >
            <Trash2 size={16} />
          </button>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
