"use client";

import React, { useState, useEffect, useCallback } from "react";
// import dynamic from "next/dynamic";
import { Figtree } from "next/font/google";
// import LoadingSpinner from "./LoadingSpinner";
import Modal from "./Modal";

import "react-day-picker/style.css";
import TableHeader from "./Table/TableHeader";
import TableRow from "./Table/TableRow";
import AddTaskRow from "./Table/AddTaskRow";
import {
  fetchTable,
  addColumnToTable,
  addRowToTable,
  updateRow,
  // createTable,
} from "./Table/apiServices";
import { availableColumnsWithIcons } from "./Table/constants";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

interface TableData {
  [key: string]: string | number | boolean | null;
}

const DynamicTable: React.FC = () => {
  // Loading state
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableId, setTableId] = useState<number >(1);

  // Data states
  const [columns, setColumns] = useState<{ id: number; name: string }[]>([]);
  const [rows, setRows] = useState<Record<string, TableData>[]>([]);
  const [columnWidths, setColumnWidths] = useState<Record<number, number>>({});

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

  // Initialize or fetch table data
  useEffect(() => {
    const initializeTable = async () => {
      try {
        const data = await fetchTable(tableId);
        console.log(data);
      } catch (error) {
        console.log("Error fetching ", error);
      }
    };

    initializeTable();
  }, []);

  useEffect(() => {
    setSelectedRows(new Array(rows.length).fill(false));
  }, [rows.length]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedRows(new Array(rows.length).fill(checked));
  };

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

  const addRow = async (taskName: string = "") => {
    if (!tableId) return;

    try {
      const rowData = {
        [columns[0].id]: taskName,
      };

      const response = await addRowToTable({
        tableId,
        rowData,
      });

      setRows(response.rows);
      setNewTaskName("");
    } catch (error) {
      console.error("Error adding row:", error);
    }
  };

  const addColumn = async (selectedColumn: string) => {
    if (!tableId) return;

    try {
      const response = await addColumnToTable({
        tableId,
        columnName: selectedColumn,
      });

      setColumns(response.columns);
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  const updateCell = async (
    rowIndex: number,
    columnId: number,
    value: string
  ) => {
    if (!tableId) return;

    try {
      const rowData = {
        [columnId]: value,
      };

      const response = await updateRow({
        tableId,
        rowIndex,
        rowData,
      });

      setRows(response.rows);
    } catch (error) {
      console.error("Error updating cell:", error);
    }
  };

  const startResize = (e: React.MouseEvent, colIndex: number) => {
    setIsResizing(true);
    setCurrentResizer(colIndex);
    setStartX(e.pageX);
    setStartWidth(columnWidths[colIndex] || 150);
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
    <div className={`p-4 font-figtree ${figtree.variable}`}>
      <style>{styles}</style>
     
        <div className="">
          <h1 className="text-xl font-bold mb-4 font-figtree">To-do</h1>
          <div className="flex flex-row">
            <span className="border-l-[5px] rounded-tl-md rounded-bl-md border-l-[#3874ff]"></span>
            <table className="w-auto border-collapse border border-gray-300 text-sm table-fixed font-figtree">
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
              existingColumns={columns.map((col) => col.name)}
            />
          )}
        </div>
      
    </div>
  );
}


export default DynamicTable;
