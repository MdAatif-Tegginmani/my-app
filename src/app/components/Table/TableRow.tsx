import { MessageCirclePlus, Trash2, X } from "lucide-react";
import RenderDateCell from "./DateCell";
import RenderLabelCell from "./LabelCell";
import NumberCell from "./NumberCell";
import RenderOwnerCell from "./OwnerCell";
import RenderStatusCell from "./StatusCell";
import TextCell from "./TableCell";
import { TableColumnData } from "./types";
import { TableRowData } from "./types";
import { useState } from "react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
                <div className="relative  w-full h-full flex ">
                  <input
                    type="text"
                    value={String(row[col.id] ?? "")}
                    onChange={(e) =>
                      updateCell(rowIndex, tableId, {
                        columnId: col.id,
                        value: e.target.value,
                      })
                    }
                    className={`w-full h-full py-0.5 px-2 ml-2 border-none focus:outline-none rounded-none bg-transparent !text-left ${
                      selectedRows[rowIndex] ? "bg-blue-200" : ""
                    }`}
                  />
                  <div className="border-l  border-gray-200 flex items-center">
                    <button
                      className="px-3 "
                      onClick={() => setIsModalOpen(true)}
                    >
                      <MessageCirclePlus
                        size={16}
                        className="text-[#6e6f7f] hover:text-blue-500 transition-colors"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
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

      {/* Slide-in Modal */}
      <div
        className={`fixed top-0 right-0 w-[600px] h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isModalOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center gap-8 p-4 border-b">
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-semibold">Task Details</h2>
          </div>

          {/* Modal Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Tabs */}
            <div className="flex gap-4 border-b mb-4">
              <button className="px-4 py-2 text-blue-500 border-b-2 border-blue-500">
                Updates
              </button>
              <button className="px-4 py-2 text-gray-500">Files</button>
              <button className="px-4 py-2 text-gray-500">Activity Log</button>
            </div>

            {/* Text Editor Area */}
            <div className="border rounded-lg p-4">
              <div className="flex gap-2 mb-4">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <span className="font-bold">B</span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <span className="italic">I</span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <span className="underline">U</span>
                </button>
              </div>
              <textarea
                placeholder="Write an update..."
                className="w-full h-32 resize-none focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default TableRow;
