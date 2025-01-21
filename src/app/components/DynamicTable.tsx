"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Figtree } from "next/font/google";
import Modal from "./Modal";
import LoadingSpinner from "./LoadingSpinner";

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
} from "./Table/apiServices";
import { availableColumnsWithIcons } from "./Table/constants";
import { TableRowData, TableColumnData } from "./Table/types";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const DynamicTable: React.FC = () => {
  const [tableId] = useState<number>(16);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      setIsLoading(true);
      const data = await fetchTable(tableId);
      setRows((prevRows) => {
        // Only update if data is different
        if (JSON.stringify(prevRows) !== JSON.stringify(data.rows)) {
          return data.rows;
        }
        return prevRows;
      });
      setColumns((prevColumns) => {
        // Only update if data is different
        if (JSON.stringify(prevColumns) !== JSON.stringify(data.columns)) {
          return data.columns;
        }
        return prevColumns;
      });
    } catch (error) {
      console.log("Error fetching ", error);
    } finally {
      setIsLoading(false);
    }
  }, [tableId]);

  useEffect(() => {
    initializeTable();
  }, [initializeTable]);

  useEffect(() => {
    setSelectedRows(new Array(rows.length).fill(false));
  }, [rows.length]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectAll(checked);
      setSelectedRows(new Array(rows.length).fill(checked));
    },
    [rows.length]
  );

  const handleSelectRow = useCallback((index: number, checked: boolean) => {
    setSelectedRows((prev) => {
      const newSelectedRows = [...prev];
      newSelectedRows[index] = checked;
      return newSelectedRows;
    });
    setSelectAll((prev) => (!prev ? false : prev));
  }, []);

  const handleRowClick = useCallback((index: number) => {
    setSelectedRows((prev) => {
      const newSelectedRows = [...prev];
      newSelectedRows[index] = !newSelectedRows[index];
      return newSelectedRows;
    });
    setSelectAll(false);
  }, []);

  const addRow = useCallback(
    async (taskName: string = "") => {
      if (!tableId) return;

      try {
        const rowData = {
          [columns[0]?.id]: taskName,
        };

        await addRowToTable({
          tableId,
          rowData,
        });

        // Fetch only the latest row instead of the entire table
        const data = await fetchTable(tableId);
        setRows((prevRows) => [...prevRows, data.rows[data.rows.length - 1]]);
        setNewTaskName("");
      } catch (error) {
        console.error("Error adding row:", error);
      }
    },
    [tableId, columns]
  );

  const addColumn = useCallback(
    async (selectedColumn: string, tableId: number) => {
      if (!tableId) return;

      try {
        const response = await addColumnToTable({
          tableId,
          columnName: selectedColumn,
        });

        // Update only columns without fetching entire table
        setColumns(response.columns);
        setModalOpen(false);
      } catch (error) {
        console.error("Error adding column:", error);
      }
    },
    []
  );

  const updateCell = useCallback(
    async (
      rowIndex: number,
      tableId: number,
      rowData: {
        columnId: number;
        value: string | number | boolean | null | undefined;
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

        // Update only the specific row
        setRows((prevRows) => {
          const newRows = [...prevRows];
          newRows[rowIndex] = response.rows[rowIndex];
          return newRows;
        });
      } catch (error) {
        console.error("Error updating cell:", error);
      }
    },
    []
  );

  const handleDeleteColumn = useCallback(
    async (columnId: number) => {
      if (!tableId) return;

      try {
        const response = await deleteColumn({ tableId, columnId });
        setColumns(response.columns);
      } catch (error) {
        console.error("Error deleting column:", error);
      }
    },
    [tableId]
  );

  const handleDeleteRow = useCallback(
    async (rowIndex: number, tableId: number) => {
      try {
        if (!tableId) return;

        await deleteRow({
          tableId,
          rowIndex,
        });

        // Update rows locally instead of fetching
        setRows((prevRows) =>
          prevRows.filter((_, index) => index !== rowIndex)
        );
      } catch (error) {
        console.error("Error deleting row:", error);
      }
    },
    []
  );

  const startResize = useCallback(
    (e: React.MouseEvent, colIndex: number) => {
      setIsResizing(true);
      setCurrentResizer(colIndex);
      setStartX(e.pageX);
      setStartWidth(columnWidths[colIndex] || 150);
    },
    [columnWidths]
  );

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

  const stopResize = useCallback(() => {
    setIsResizing(false);
    setCurrentResizer(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", doResize);
      window.addEventListener("mouseup", stopResize);
    }
    return () => {
      window.removeEventListener("mousemove", doResize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing, doResize, stopResize]);

  const memoizedTableHeader = useMemo(
    () => (
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
    ),
    [
      columns,
      selectAll,
      columnWidths,
      handleDeleteColumn,
      handleSelectAll,
      startResize,
    ]
  );

  const memoizedTableRows = useMemo(
    () =>
      rows.map((row, rowIndex) => (
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
      )),
    [
      rows,
      columns,
      selectedRows,
      tableId,
      handleSelectRow,
      handleRowClick,
      updateCell,
      handleDeleteRow,
    ]
  );

  const styles = `
    .cursor-col-resize {
      cursor: col-resize;
    }
    
  

    /* Custom scrollbar styling */
    .table-container::-webkit-scrollbar {
      height: 6px; /* Horizontal scrollbar height */
      width: 6px; /* Vertical scrollbar width */
    }

    .table-container::-webkit-scrollbar-track {
      background: transparent;
    }

    .table-container::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }

    .table-container::-webkit-scrollbar-thumb:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }

  `;

  return (
    <div className={` font-figtree ${figtree.variable}`}>
      <style>{styles}</style>

      <div className="">
        <h2 className="text-xl text-[#622BD9] opacity-80  font-semibold mb-4">
          Item List
        </h2>

        {/* <h1 className="text-xl font-bold mb-4 font-figtree">To-do</h1> */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-row">
            <span className="border-l-[5px] rounded-tl-md rounded-bl-md border-l-[#622BD9] opacity-80"></span>
            <div className="relative overflow-x-auto max-w-[calc(100vw-4rem)] max-h-[360px] overflow-y-auto table-container">
            <div className="flex flex-col ">
            <table className="w-full border-collapse border border-gray-300 text-sm table-fixed font-figtree">
                  <colgroup>
                    <col /> {/* First sticky column */}
                    <col /> {/* Second sticky column */}
                    {columns.slice(2).map((_, index) => (
                      <col
                        key={index}
                        className="w-auto"
                      /> /* Default width for other columns */
                    ))}
                  </colgroup>
                  <thead
                    className="
                  sticky top-0 z-10 bg-gray-10
                  [&>tr>th:first-child]:sticky [&>tr>th:first-child]:left-0 [&>tr>th:first-child]:z-20 [&>tr>th:first-child]:bg-white
                  [&>tr>th:nth-child(2)]:sticky [&>tr>th:nth-child(2)]:left-10 [&>tr>th:nth-child(2)]:z-20 [&>tr>th:nth-child(2)]:bg-white
                "
                  >
                    {memoizedTableHeader}
                  </thead>
                  <tbody
                    className="
                  [&>tr>td:first-child]:sticky [&>tr>td:first-child]:left-0 [&>tr>td:first-child]:z-10 [&>tr>td:first-child]:bg-white 
                  [&>tr>td:nth-child(2)]:sticky [&>tr>td:nth-child(2)]:left-10 [&>tr>td:nth-child(2)]:z-10 [&>tr>td:nth-child(2)]:bg-white
                "
                  >
                    {memoizedTableRows}
                    <AddTaskRow
                      newTaskName={newTaskName}
                      onNewTaskNameChange={setNewTaskName}
                      onAddTask={addRow}
                      columnsCount={columns.length}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

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

export default React.memo(DynamicTable);
