"use client";

import React, { useState, useEffect, useCallback } from "react";

import dynamic from "next/dynamic";
import { Figtree } from "next/font/google";
import LoadingSpinner from "./LoadingSpinner";
import Modal from "./Modal";

import "react-day-picker/style.css";
import  {
  StatusOption,
  statusOptions,
} from "./Table/StatusCell";
import { LabelOption, labelOptions } from "./Table/LabelCell";
import { availableColumnsWithIcons } from "./Table/constants";
import type { User } from "./OwnerSelectModal";
import TableHeader from "./Table/TableHeader";
import TableRow from "./Table/TableRow";
import AddTaskRow from "./Table/AddTaskRow";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});


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
