"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Figtree } from "next/font/google";
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
  deleteColumn,
  deleteRow,
  // updateColumn,
  // deleteColumn,
  // createTable,
} from "./Table/apiServices";
import { availableColumnsWithIcons } from "./Table/constants";
import { TableRowData, TableColumnData } from "./Table/types";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const DynamicTable: React.FC = () => {
  const [tableId] = useState<number>(16);

  // Data states
  const [columns, setColumns] = useState<TableColumnData[]>([]);
  const [rows, setRows] = useState<TableRowData[]>([]);
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

  const initializeTable = useCallback(async () => {
    try {
      const data = await fetchTable(tableId);
      setRows(data.rows );
      setColumns(data.columns );
    } catch (error) {
      console.log("Error fetching ", error);
    }
  }, [tableId]);


  // Initialize or fetch table data
  useEffect(() => {
    initializeTable();
  }, [tableId, setRows, setColumns, initializeTable]);

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
        [columns[0]?.id]: taskName,
      };

      console.log("Adding row with data:", rowData); // Debug log

      const response = await addRowToTable({
        tableId,
        rowData,
      });
      console.log("Response from server:", response); // Debug log
      await initializeTable();
      // setRows((prevRows) => [...prevRows, response.rows]);

      setNewTaskName("");
    } catch (error) {
      console.error("Error adding row:", error);
    }
  };

  const addColumn = async (selectedColumn: string, tableId: number) => {
    if (!tableId) return;

    try {
      const response = await addColumnToTable({
        tableId,
        columnName: selectedColumn,
      });
      await initializeTable();
      setColumns(response.columns);
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  const updateCell = async (
    rowIndex: number,
    tableId: number,
    rowData: {
      columnId: number;
      value: string | number | boolean | null | undefined 
      }
  ) => {
    if (!tableId) return;

    try {
      const formattedRowData: TableRowData = {
        [rowData.columnId]: rowData.value,
      };

      const response = await updateRow({
        tableId,
        rowIndex: rowIndex,
        rowData: formattedRowData,
      });
      await initializeTable();
      setRows(response.rows);
    } catch (error) {
      console.error("Error updating cell:", error);
    }
  };

  // const updDateColumName = async (columnId: number, newName: string) => {
  //   if (!tableId) return;

  //   const response = await updateColumn({ tableId, columnId, newName });
  //   await initializeTable();
  //   setColumns(response.columns);
  // };



  const handleDeleteColumn = async (columnId: number) => {
    if (!tableId) return;

    const response = await deleteColumn({ tableId, columnId });
    await initializeTable();
    setColumns(response.columns);
  };

  const handleDeleteRow = async (rowIndex: number, tableId: number) => {
    try {
      if (!tableId) return;

       await deleteRow({
        tableId,
        rowIndex,
      });
      await initializeTable();  
      
      
      
    } catch (error) {
      console.error("Error deleting row:", error);
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
          <span className="border-l-[5px] rounded-tl-md rounded-bl-md border-l-[#579bfc]"></span>
          <table className="w-auto border-collapse border border-gray-300 text-sm table-fixed font-figtree">
            <thead>
              <TableHeader
                columns={columns}
                onDeleteColumn={handleDeleteColumn}
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
                  tableId={tableId}
                  rows={rows}
                  row={row}
                  setRows={setRows}
                  key={rowIndex}
                  rowIndex={rowIndex}
                  columns={columns}
                  selectedRows={selectedRows}
                  onSelectRow={handleSelectRow}
                  onRowClick={handleRowClick}
                  updateCell={updateCell}
                  onDeleteRow={handleDeleteRow}

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
            onColumnSelect={(column) => addColumn(column, tableId)}
            existingColumns={columns.map((col) => col.name)}
          />
        )}
      </div>
     
     
    </div>
  );
};

export default DynamicTable;
