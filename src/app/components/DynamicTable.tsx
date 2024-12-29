"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Type,
  Hash,
  CirclePlus,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Figtree } from "next/font/google";
import LoadingSpinner from "./LoadingSpinner";
import Modal from "./Modal";

import "react-day-picker/style.css";
import RenderDateCell from "./Table/DateCell";
import RenderStatusCell, {
  StatusOption,
  statusOptions,
} from "./Table/StatusCell";
import RenderLabelCell, { LabelOption } from "./Table/LabelCell";
import { labelOptions } from "./Table/LabelCell";
import RenderOwnerCell from "./Table/OwnerCell";
import { availableColumnsWithIcons, getStatusColor } from "./Table/constants";
import type { User } from "./OwnerSelectModal";

interface CellProps {
  rowIndex: number;
  colIndex: number;
  selectedRows: boolean[];
  value: string;
  updateCell: (rowIndex: number, colIndex: number, value: string) => void;
}

const TextCell: React.FC<CellProps> = ({
  rowIndex,
  colIndex,
  selectedRows,
  value,
  updateCell,
}) => {
  return (
    <div className={`relative w-full h-full group ${selectedRows[rowIndex] ? "bg-blue-200" : ""}`}>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
        className={`w-full h-full py-0.5 px-1 border-none focus:outline-none rounded-none ${
          selectedRows[rowIndex] ? "bg-transparent" : "bg-white"
        }`}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity gap-1">
        {!value && (
          <>
            <CirclePlus size={16} color="#3c41d3" className="text-gray-400" />
            <Type size={16} className="text-gray-400" />
          </>
        )}
      </div>
    </div>
  );
};

const NumberCell: React.FC<CellProps> = ({
  rowIndex,
  colIndex,
  selectedRows,
  value,
  updateCell,
}) => {
  return (
    <div className={`relative w-full h-full group ${selectedRows[rowIndex] ? "bg-blue-200" : ""}`}>
      <input
        type="number"
        value={value || ""}
        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
        className={`w-full h-full text-center py-0.5 px-1 border-none focus:outline-none rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
          selectedRows[rowIndex] ? "bg-transparent" : "bg-white"
        }`}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity gap-1">
        {!value && (
          <>
            <CirclePlus size={16} color="#3c41d3" className="text-gray-400" />
            <Hash size={16} className="text-gray-400" />
          </>
        )}
      </div>
    </div>
  );
};

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

interface TableHeaderProps {
  columns: string[];
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
  columnWidths: { [key: string]: number };
  onStartResize: (e: React.MouseEvent, colIndex: number) => void;
  onAddColumn: (e: React.MouseEvent) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  selectAll,
  onSelectAll,
  columnWidths,
  onStartResize,
  onAddColumn,
}) => {
  return (
    <tr>
      <th className="col-checkbox border border-gray-300 p-0.5 hover:bg-gray-100 w-10">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={(e) => onSelectAll(e.target.checked)}
          className="w-4 h-4"
        />
      </th>
      {columns.map((col, colIndex) => (
        <th
          key={colIndex}
          className={`col-${col.toLowerCase().replace(/\s+/g, "-")} border border-gray-300 p-0.5 hover:bg-gray-100 text-center font-normal relative`}
          style={{ width: columnWidths[colIndex] || 150 }}
        >
          {col}
          <div
            className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-400"
            onMouseDown={(e) => onStartResize(e, colIndex)}
          />
        </th>
      ))}
      <th className="col-add border border-gray-300 p-0.5 hover:bg-gray-100">
        <button
          className="add-column-btn w-full h-full"
          onClick={onAddColumn}
          aria-label="Add column"
        >
          <Plus size={18} />
        </button>
      </th>
    </tr>
  );
};

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

interface AddTaskRowProps {
  newTaskName: string;
  onNewTaskNameChange: (value: string) => void;
  onAddTask: (taskName: string) => void;
  columnsCount: number;
}

const AddTaskRow: React.FC<AddTaskRowProps> = ({
  newTaskName,
  onNewTaskNameChange,
  onAddTask,
  columnsCount,
}) => {
  return (
    <tr>
      <td className="col-checkbox w-8 h-8 border border-gray-300 text-center p-0.5">
        <input type="checkbox" className="w-4 h-4 p-0.5" aria-label="Select all" />
      </td>
      <td colSpan={2} className="px-2 py-2">
        <input
          type="text"
          className="placeholder:text-start rounded-3xl text-start h-6 hover:border hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
          placeholder=" + Add task"
          value={newTaskName}
          onChange={(e) => onNewTaskNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newTaskName.trim()) {
              onAddTask(newTaskName.trim());
            }
          }}
        />
      </td>
      <td colSpan={columnsCount - 1}></td>
    </tr>
  );
};

const DynamicTable: React.FC = () => {
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Data states
  const initialColumns: string[] = ["Task Name", "Owner", "Due date"];
  const [columns, setColumns] = useState<string[]>(initialColumns);
  const [rows, setRows] = useState<string[][]>([
    Array(initialColumns.length).fill(""),
  ]);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  
  // Selection states
  const [selectedRows, setSelectedRows] = useState<boolean[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Resizing states
  const [isResizing, setIsResizing] = useState(false);
  const [currentResizer, setCurrentResizer] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  // Modal and input states
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState(false);

  // useEffect hooks
  useEffect(() => {
    const savedRows = localStorage.getItem("tableRows");
    const savedColumns = localStorage.getItem("tableColumns");
    const savedColumnWidths = localStorage.getItem("tableColumnWidths");

    if (savedRows) {
      setRows(JSON.parse(savedRows));
    }
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
    if (savedColumnWidths) {
      setColumnWidths(JSON.parse(savedColumnWidths));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("tableRows", JSON.stringify(rows));
    localStorage.setItem("tableColumns", JSON.stringify(columns));
    localStorage.setItem("tableColumnWidths", JSON.stringify(columnWidths));
  }, [rows, columns, columnWidths]);

  useEffect(() => {
    setSelectedRows(new Array(rows.length).fill(false));
  }, [rows.length]);

  const dropDown: Record<
    string,
    string[] | StatusOption[] | LabelOption[] | User[]
  > = {
    status: statusOptions,
    label: labelOptions,
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedRows(new Array(rows.length).fill(checked));
  };

  // selecting the rows
  const handleSelectRow = (index: number, checked: boolean) => {
    const newSelectedRows = [...selectedRows];
    newSelectedRows[index] = checked;
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.every(Boolean));
  };

  const handleRowClick = (index: number) => {
    const newSelectedRows = [...selectedRows];
    newSelectedRows[index] = !newSelectedRows[index];
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.every(Boolean));
  };

  const addRow = (taskName: string = "") => {
    const newRow = Array(columns.length).fill("");
    newRow[0] = taskName;
    setRows([...rows, newRow]);
    setSelectedRows([...selectedRows, false]);
    setNewTaskName("");
  };

  const addColumn = (selectedColumn: string) => {
    setColumns([...columns, selectedColumn]);
    setRows(rows.map((row) => [...row, ""]));
    setModalOpen(false);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][colIndex] = value;
    setRows(updatedRows);
  };

  const startResize = (e: React.MouseEvent, colIndex: number) => {
    setIsResizing(true);
    setCurrentResizer(colIndex);
    setStartX(e.pageX);
    setStartWidth(columnWidths[colIndex] || 150); // Default width if not set
  };

  const doResize = useCallback(
    (e: MouseEvent) => {
      if (isResizing && currentResizer !== null) {
        const width = Math.max(startWidth + (e.pageX - startX), 50);
        setColumnWidths((prev) => ({
          ...prev,
          [currentResizer]: width,
        }));
      }
    },
    [isResizing, currentResizer, startWidth, startX]
  );

  const stopResize = () => {
    setIsResizing(false);
    setCurrentResizer(null);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", doResize);
      window.addEventListener("mouseup", stopResize);
    }
    return () => {
      window.removeEventListener("mousemove", doResize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing, startX, startWidth, currentResizer, doResize]);

  const styles = `
    .cursor-col-resize {
      cursor: col-resize;
    }
    
    table {
      table-layout: fixed;
    }
  `;

  return (
    <div className={`p-4 font-figtree  ${figtree.variable}`}>
      <style>{styles}</style>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className=" ">
          <h1 className="text-xl font-bold mb-4 font-figtree">To-do</h1>

          <div className="flex flex-row">
            <span className="border-l-[5px] rounded-tl-md rounded-bl-md border-l-[#3874ff]"></span>
            <table className="w-auto  border-collapse  border border-gray-300 text-sm table-fixed font-figtree">
              <thead>
                <TableHeader
                  columns={columns}
                  selectAll={selectAll}
                  onSelectAll={handleSelectAll}
                  columnWidths={columnWidths}
                  onStartResize={startResize}
                  onAddColumn={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setButtonPosition({ x: rect.x, y: rect.bottom });
                    setModalOpen(true);
                  }}
                />
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    rowIndex={rowIndex}
                    columns={columns}
                    row={row}
                    selectedRows={selectedRows}
                    onSelectRow={handleSelectRow}
                    onRowClick={handleRowClick}
                    updateCell={updateCell}
                    setRows={setRows}
                    rows={rows}
                  />
                ))}
                <AddTaskRow
                  newTaskName={newTaskName}
                  onNewTaskNameChange={(value) => setNewTaskName(value)}
                  onAddTask={addRow}
                  columnsCount={columns.length}
                />
              </tbody>
            </table>
          </div>

          {isModalOpen && (
            <Modal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              buttonPosition={buttonPosition}
              availableColumnsWithIcons={availableColumnsWithIcons}
              onColumnSelect={(column) => addColumn(column)}
              existingColumns={columns}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(DynamicTable), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});
