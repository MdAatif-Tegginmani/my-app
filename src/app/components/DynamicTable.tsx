"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Menu,
  Type,
  UserRound,
  Hash,
  Calendar,
  CircleUserRound,
} from "lucide-react";
import { Figtree } from "next/font/google";
import Modal from "./Modal";
import OwnerSelectModal from "./OwnerSelectModal";
import UnifiedDatePicker from "./UnifiedDatePicker";
import StatusLabelDropdown from "./StatusLabelDropdown";
import { HiMiniUserCircle } from "react-icons/hi2";
import "react-day-picker/style.css";
import { addColumnToTable, addRowToTable, createTable } from "./apiService";
import { TableHeader } from "./table/TableHeader";
import { TableRow } from "./table/TableRow";
import { TableCell } from "./table/TableCell";
import { User, TableRowType, StatusOption, LabelOption } from "./types";
import axios from "axios";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const DynamicTable: React.FC = () => {
  const initialColumns: { name: string; columnId: string }[] = [
    { name: "Task Name", columnId: "task_name" },
    { name: "Owner", columnId: "owner" },
    { name: "Due date", columnId: "due_date" },
  ];

  const [columns, setColumns] =
    useState<{ name: string; columnId: string }[]>(initialColumns);
  const [rows, setRows] = useState<TableRowType[]>([]);

  const [selectedRows, setSelectedRows] = useState<boolean[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    {}
  );
  const [isResizing, setIsResizing] = useState(false);
  const [currentResizer, setCurrentResizer] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const [newTaskName, setNewTaskName] = useState<string>("");

  const [isModalOpen, setModalOpen] = useState(false);
  const [isOwnerModalOpen, setOwnerModalOpen] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);

  //
  const [tableId, setTableId] = useState<string | null>(null);

  const users = [
    { id: 1, name: "Md Aatif", time: "7:57 PM+", address: "Ekaterinburg" },
  ];

  // Fetch data when the component mounts

  const handleCreateTable = async () => {
    try {
      if (tableId) {
        console.log("Using existing table ID:", tableId);
        return; // Skip creating a new table if tableId exists
      }

      const tableData = await createTable();
      setTableId(tableData.id); // Store tableId in state
      console.log("Table created with ID:", tableData.id);
    } catch (error) {
      console.error("Error creating table:", error);
    }
  };

  const [currentColumnIndex, setCurrentColumnIndex] = useState<number>(0);

  const handleAddColumn = async () => {
    if (!tableId) {
      console.error("Table ID not found. Create a table first.");
      return;
    }

    try {
      const columnType = availableColumnsWithIcons[currentColumnIndex];
      if (!columnType) {
        console.error("No more column types available");
        return;
      }

      const columnData = await addColumnToTable(tableId, columnType.label);
      console.log("Column added:", columnData);

      setColumns((prev) => [
        ...prev,
        {
          name: columnType.label,
          columnId: columnData.columnId,
        },
      ]);

      setRows((prev) =>
        prev.map((row) => ({
          ...row,
          [columnData.columnId]: "",
        }))
      );

      setCurrentColumnIndex(
        (prev) => (prev + 1) % availableColumnsWithIcons.length
      );
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  const handleAddRow = async () => {
    try {
      if (!tableId || !newTaskName.trim()) {
        console.error("Table ID and task name are required");
        return;
      }

      // Create row data with proper structure using column IDs
      const rowData: TableRowType = {
        taskName: newTaskName,
        owner: "",
        dueDate: "",
      };

      // Convert to the format expected by the API
      const apiRowData: Record<string, string> = {};

      // Find the task_name column and use its ID
      const taskNameColumn = columns.find(
        (col) => col.columnId === "task_name"
      );
      const ownerColumn = columns.find((col) => col.columnId === "owner");
      const dueDateColumn = columns.find((col) => col.columnId === "due_date");

      if (taskNameColumn) {
        apiRowData[taskNameColumn.columnId] = rowData.taskName;
      }
      if (ownerColumn) {
        apiRowData[ownerColumn.columnId] = rowData.owner;
      }
      if (dueDateColumn) {
        apiRowData[dueDateColumn.columnId] = rowData.dueDate;
      }

      // Add empty values for other columns
      columns.forEach((col) => {
        if (
          col.columnId &&
          col.columnId !== "task_name" &&
          col.columnId !== "owner" &&
          col.columnId !== "due_date" &&
          !apiRowData[col.columnId]
        ) {
          apiRowData[col.columnId] = "";
        }
      });

      console.log("Sending row data:", { tableId, apiRowData }); // Debug log

      const response = await addRowToTable(tableId, apiRowData);
      if (response) {
        setRows((prev) => [...prev, rowData]);
        setNewTaskName("");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data);
      } else {
        console.error("Error adding row:", error);
      }
    }
  };

  React.useEffect(() => {
    setSelectedRows(new Array(rows.length).fill(false));
  }, [rows.length]);

  const statusOptions: StatusOption[] = [
    { value: "Done", color: "bg-[#00C875] text-white" },
    { value: "Working on it", color: "bg-[#FDAB3D] text-white" },
    { value: "Not Started", color: "bg-[#C4C4C4] text-white" },
    { value: "Stuck", color: "bg-[#DF2F4A] text-white" },
  ];

  const labelOptions: LabelOption[] = [
    { value: "Label 1", color: "bg-[#C4C4C4] text-white" },
    { value: "Label 2", color: "bg-[#007EB5] text-white" },
    { value: "Label 3", color: "bg-[#9D99B9] text-white" },
  ];

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

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][colIndex] = value;
    setRows(updatedRows);
  };

  const availableColumnsWithIcons = [
    {
      id: "status",
      label: "Status",
      icon: (
        <span className="inline-block w-auto p-1  bg-green-400 rounded-md">
          <Menu color="#ffffff" size={16} strokeWidth={4} />
        </span>
      ),
    },
    {
      id: "text",
      label: "Text",
      icon: (
        <span className="inline-block w-auto p-1  bg-yellow-300 rounded-md">
          <Type color="#ffffff" size={16} strokeWidth={4} />
        </span>
      ),
    },
    {
      id: "people",
      label: "People",
      icon: (
        <span className="inline-block w-auto p-1  bg-blue-400 rounded-md">
          <UserRound color="#ffffff" strokeWidth={3} size={16} />
        </span>
      ),
    },
    {
      id: "label",
      label: "Label",
      icon: (
        <span className="inline-block w-auto p-1  bg-purple-400 rounded-md">
          <Menu color="#ffffff" size={16} strokeWidth={4} />
        </span>
      ),
    },
    {
      id: "date",
      label: "Date",
      icon: (
        <span className="inline-block w-auto p-1  bg-purple-400 rounded-md">
          <Calendar color="#ffffff" size={16} strokeWidth={4} />
        </span>
      ),
    },
    {
      id: "numbers",
      label: "Numbers",
      icon: (
        <span className="inline-block w-auto p-1  bg-yellow-400 rounded-md">
          <Hash color="#ffffff" size={16} strokeWidth={4} />
        </span>
      ),
    },
  ];

  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  const getStatusColor = (value: string, options: StatusOption[]) => {
    const option = options.find((opt) => opt.value === value);
    if (!option) return "white";

    if (option.color.includes("#00C875")) return "#00C875";
    if (option.color.includes("#FDAB3D")) return "#FDAB3D";
    if (option.color.includes("#C4C4C4")) return "#C4C4C4";
    if (option.color.includes("#DF2F4A")) return "#DF2F4A";
    return "white";
  };

  const startResize = (e: React.MouseEvent, colIndex: number) => {
    setIsResizing(true);
    setCurrentResizer(colIndex);
    setStartX(e.pageX);
    setStartWidth(columnWidths[colIndex] || 150); // Default width if not set
  };

  const doResize = React.useCallback(
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

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", doResize);
      window.addEventListener("mouseup", stopResize);
    }
    return () => {
      window.removeEventListener("mousemove", doResize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing, startX, startWidth, currentResizer, doResize]);

  // const styles = `
  //   .cursor-col-resize {
  //     cursor: col-resize;
  //   }

  //   table {
  //     table-layout: fixed;
  //   }
  // `;

  // interface User {
  //   id: number;

  //   name: string;
  // }

  const handleUserSelect = (user: User | null) => {
    if (currentRowIndex !== null && user) {
      const updatedRows = [...rows];
      updatedRows[currentRowIndex] = {
        ...updatedRows[currentRowIndex],
        owner: user.name,
      };
      setRows(updatedRows);
      setOwnerModalOpen(false);
    }
  };

  const openOwnerModal = (
    rowIndex: number,
    position: { x: number; y: number }
  ) => {
    setCurrentRowIndex(rowIndex);
    setButtonPosition(position);
    setOwnerModalOpen(true);
  };

  const renderCell = (
    rowIndex: number,
    colIndex: number,
    col: { columnId: string },
    value: string | null
  ) => {
    switch (col.columnId) {
      case "owner":
        return (
          <div
            className="w-full h-full flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              openOwnerModal(rowIndex, {
                x: e.currentTarget.getBoundingClientRect().x,
                y: e.currentTarget.getBoundingClientRect().bottom,
              });
            }}
          >
            <CircleUserRound size={24} className="text-gray-400" />
          </div>
        );
      case "due_date":
        return (
          <UnifiedDatePicker
            selectedDate={value ? new Date(value) : null}
            onChange={(date) => {
              const updatedRows = [...rows];
              updatedRows[rowIndex] = {
                ...updatedRows[rowIndex],
                dueDate: date ? date.toISOString().split("T")[0] : "",
              };
              setRows(updatedRows);
            }}
          />
        );
      default:
        return <span>{value}</span>;
    }
  };

  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  // Filter rows based on input values
  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      return Object.entries(filters).every(([columnId, filterValue]) => {
        if (!filterValue) return true;
        const cellValue = String(row[columnId] || "").toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      });
    });
  }, [rows, filters]);

  return (
    <div className={`p-4 font-figtree  ${figtree.variable}`}>
      {/* <style>{styles}</style> */}

      <button
        className="bg-blue-500 text-white p-2 rounded-md mb-4"
        onClick={handleCreateTable}
      >
        {tableId ? "Use Existing Table" : "Create Table"}
      </button>

      <div className=" ">
        <h1 className="text-xl font-bold mb-4 font-figtree">To-do</h1>

        <div className="flex flex-row">
          <span className="border-l-[5px] rounded-tl-md rounded-bl-md border-l-[#3874ff]"></span>
          <table className="w-auto  border-collapse  border border-gray-300 text-sm table-fixed font-figtree">
            <TableHeader
              columns={columns}
              selectAll={selectAll}
              handleSelectAll={handleSelectAll}
              handleAddColumn={handleAddColumn}
              columnWidths={columnWidths}
              startResize={startResize}
              currentColumnIndex={currentColumnIndex}
              availableColumnsWithIcons={availableColumnsWithIcons}
              handleFilterChange={handleFilterChange}
            />
            <tbody>
              {filteredRows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  row={row}
                  rowIndex={rowIndex}
                  columns={columns}
                  selectedRows={selectedRows}
                  handleRowClick={handleRowClick}
                  handleSelectRow={handleSelectRow}
                  TableCell={TableCell}
                />
              ))}
              <tr className="">
                <td className="col-checkbox w-8 h-8  border border-gray-300 text-center p-0.5 ">
                  <input
                    type="checkbox"
                    className="w-4 h-4 p-0.5"
                    aria-label="Select all"
                    id=""
                  />
                </td>
                <td colSpan={2} className=" px-2 py-2  ">
                  <input
                    type="text"
                    className="placeholder:text-start rounded-3xl text-start h-6 hover:border hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
                    placeholder=" + Add task"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTaskName.trim()) {
                        handleAddRow();
                      }
                    }}
                  />
                </td>
                <td colSpan={columns.length - 1}></td>
              </tr>
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
        <OwnerSelectModal
          isOpen={isOwnerModalOpen}
          onClose={() => setOwnerModalOpen(false)}
          onSelect={handleUserSelect}
          users={users}
          position={buttonPosition}
        />
      </div>
    </div>
  );
};

export default DynamicTable;
