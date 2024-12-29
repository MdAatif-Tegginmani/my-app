"use client";

import React, { useState, useEffect } from "react";
import { Menu, Type, UserRound, Hash, Calendar } from "lucide-react";
import { Figtree } from "next/font/google";
import Modal from "./Modal";
import "react-day-picker/style.css";
import { addColumnToTable, addRowToTable, fetchTable, updateRow } from "./apiService";
import Table from "./table/Table";
import { TableColumn, TableRow, User } from "./types";
// import UnifiedDatePicker from "./UnifiedDatePicker";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

interface DynamicTableProps {
  tableId?: string | null;
}





const DynamicTable: React.FC<DynamicTableProps> = () => {
  const initialColumns: TableColumn[] = [
    { id: Date.now(), name: "Task Name", columnId: "task_name", icon: null },
    { id: Date.now() + 1, name: "Owner", columnId: "owner", icon: null },
    { id: Date.now() + 2, name: "Due Date", columnId: "due_date", icon: null },
  ];

  const availableColumnsWithIcons: TableColumn[] = [
    {
      id: 1,
      name: "Status",
      columnId: "status",
      icon: (
        <span className="inline-block w-auto p-1  bg-green-400 rounded-md">
          <Menu color="#ffffff" size={16} strokeWidth={4} />
        </span>
      ),
    },
    {
        id: 2,
      name: "Text",
      columnId: "text",
      icon: (
        <span className="inline-block w-auto p-1  bg-yellow-300 rounded-md">
          <Type color="#ffffff" size={16} strokeWidth={4} />
        </span>
      ),
    },
    {
      id: 3,
      name: "People",
      columnId: "people",
      icon: (
        <span className="inline-block w-auto p-1  bg-blue-400 rounded-md">
          <UserRound color="#ffffff" strokeWidth={3} size={16} />
        </span>
      ),
    },
    {
        id: 4,
      name: "Label",
      columnId: "label",
      icon: (
        <span className="inline-block w-auto p-1  bg-purple-400 rounded-md">
          <Menu color="#ffffff" size={16} strokeWidth={4} />
        </span>
      ),
    },
    {
      id: 5,
      name: "Date",
      columnId: "date",
      icon: (
        <span className="inline-block w-auto p-1  bg-purple-400 rounded-md">
          <Calendar color="#ffffff" size={16} strokeWidth={4} />
        </span>
      ),
    },
    {
      id: 6,
      name: "Numbers",
      columnId: "numbers",
      icon: (
        <span className="inline-block w-auto p-1  bg-yellow-400 rounded-md">
          <Hash color="#ffffff" size={16} strokeWidth={4} />
        </span>
      ),
    },
  ];

  const [columns, setColumns] = useState<TableColumn[]>(initialColumns);
  const [rows, setRows] = useState<TableRow[]>([]);
  const [selectedRows] = useState<boolean[]>([]);
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [tableId] = useState<string>("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentColumnIndex] = useState<number>(0);
  
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setModalOpen] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchTable(tableId);
        // Transform the columns to match the Table component's expected format
        const transformedColumns = data.columns.map((col) => ({
          id: col.id,
          name: col.name,
          columnId: col.id.toString(),
          icon:
            availableColumnsWithIcons.find((ac) => ac.name === col.name)
              ?.icon || null,
        }));
        setColumns(transformedColumns);
        setRows(data.rows || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch table data");
        setLoading(false);
      }
    };
    fetchData();
  }, [tableId]);

  const users: User[] = [
    { id: 1, name: "Md Aatif", time: "7:57 PM+", address: "Ekaterinburg" },
  ];

  const columnWidths: { [key: string]: number } = {};
  columns.forEach((col) => {
    columnWidths[col.columnId] = 150;
  });

  const handleAddColumn = async (tableColumn: TableColumn) => {
    try {
     
      const newColumn = await addColumnToTable(tableId, tableColumn.name);
      if (newColumn) {
        setColumns([
          ...columns,
          {
            id: newColumn.id,
            name: newColumn.name,
            columnId: newColumn.id.toString(),
            icon: tableColumn.icon,
          },
        ]);
      }
    } catch (error) {
      console.error("Error adding column:", error);
      setError("Failed to add column");
    }
  };

  const handleAddRow = async () => {
    // Find the Task Name column ID
    const taskNameColumn = columns.find((col) => col.name === "Task Name");
    if (!taskNameColumn) {
      console.error("Task Name column not found");
      return;
    }

    const newRowData = {
      [taskNameColumn.id.toString()]: newTaskName || "New Task",
    };

    try {
      await addRowToTable(tableId, newRowData);
      // When adding to the local state, we still use the column name for display
      setRows([
        ...rows,
        {
          "Task Name": newTaskName || "New Task",
        },
      ]);
      setNewTaskName("");
    } catch (error) {
      console.error("Error adding row:", error);
      setError("Failed to add row");
    }
  };

  const handleUpdateRow = async (rowIndex: number, updatedRowData: Record<string, string | null>) => {
    try {
      await updateRow(tableId, rowIndex, updatedRowData);
    } catch (error) {
      console.error("Error updating row:", error);
      setError("Failed to update row");
    }
  };






  if (loading) {
    return <div className="p-4">Loading table data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className={`p-4 font-figtree ${figtree.variable}`}>
      <div>
        <h1 className="text-xl font-bold mb-4 font-figtree">To-do</h1>

        <div className="flex flex-row">
          <span className="border-l-[5px] rounded-tl-md rounded-bl-md border-l-[#3874ff]"></span>
          <div className="w-full">
            <Table
              headers={columns}
              data={rows}
              currentColumnIndex={currentColumnIndex}
              availableColumnsWithIcons={availableColumnsWithIcons as TableColumn[]}
              setButtonPosition={setButtonPosition}
              setModalOpen={setModalOpen}

            />

            <div className="border border-gray-300 border-t-0">
              <div className="flex items-center">
                <div className="w-8 h-8 border-r border-gray-300 text-center p-0.5">
                  <input
                    type="checkbox"
                    className="w-4 h-4 p-0.5"
                    aria-label="Select all"
                  />
                </div>
                <div className="flex-grow px-2 py-2">
                  <input
                    type="text"
                    className="w-full placeholder:text-start rounded-3xl text-start h-6 hover:border hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
                    placeholder=" + Add task"
                    value={newTaskName}
                    onClick={() => !newTaskName && handleAddRow()}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTaskName.trim()) {
                        handleAddRow();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          availableColumnsWithIcons={availableColumnsWithIcons as TableColumn[]}
          onColumnSelect={handleAddColumn}
          existingColumns={columns.map((col) => col.name)}
          buttonPosition={buttonPosition}
        />
      )}
     
    </div>
  );
};

export default DynamicTable;
