"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Menu,
  Type,
  UserRound,
  Hash,
  Calendar,
  // CircleUserRound,
  CirclePlus,
  CircleUserRound,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Figtree } from "next/font/google";
import LoadingSpinner from "./LoadingSpinner";
import Modal from "./Modal";
import OwnerSelectModal from "./OwnerSelectModal";
import UnifiedDatePicker from "./UnifiedDatePicker";
import StatusLabelDropdown from "./StatusLabelDropdown";
import { HiMiniUserCircle } from "react-icons/hi2";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

type StatusOption = {
  value: string;
  color: string;
};

type LabelOption = {
  value: string;
  color: string;
};

// type UserOption = {
//   name: string;
//   avatar?: React.ReactNode;
// };

const DynamicTable: React.FC = () => {
  const initialColumns: string[] = ["Task Name", "Owner", "Due date"];

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [columns, setColumns] = useState<string[]>(initialColumns);
  const [rows, setRows] = useState<string[][]>([
    Array(initialColumns.length).fill(""),
  ]);

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

  const users = [
    { id: 1, name: "Md Aatif", time: "7:57 PM+", address: "Ekaterinburg" },
    // { id: 2, name: "John Doe" },
    // Add more users as needed
  ];

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

  const styles = `
    .cursor-col-resize {
      cursor: col-resize;
    }
    
    table {
      table-layout: fixed;
    }
  `;

  interface User {
    id: number;

    name: string;
  }

  const handleUserSelect = (user: User | null) => {
    if (currentRowIndex !== null && user) {
      updateCell(
        currentRowIndex,
        /* column index for owner/people */ 1,
        user.name
      );
      // Update the row to show the CircleUserRound icon
      const updatedRows = [...rows];
      updatedRows[currentRowIndex][1] = user;
      setRows(updatedRows);
    }
  };

  const openOwnerModal = (
    rowIndex: number,
    iconPosition: { x: number; y: number }
  ) => {
    setCurrentRowIndex(rowIndex);
    setButtonPosition(iconPosition);
    setOwnerModalOpen(true);
  };

  const renderDateCell = (rowIndex: number, colIndex: number) => (
    <div
      className={`w-full h-full ${selectedRows[rowIndex] ? "bg-blue-200" : ""}`}
    >
      <UnifiedDatePicker
        selectedDate={
          rows[rowIndex][colIndex] ? new Date(rows[rowIndex][colIndex]) : null
        }
        onChange={(date) =>
          updateCell(
            rowIndex,
            colIndex,
            date ? date.toISOString().split("T")[0] : ""
          )
        }
      />
    </div>
  );

  const renderOwnerCell = (rowIndex: number, colIndex: number) => {
    const owner = rows[rowIndex][colIndex]; // Get the owner object
    return (
      <div
        className={`relative w-full h-full ${
          selectedRows[rowIndex] ? "bg-blue-200" : ""
        }`}
      >
        <div
          className="w-full h-full flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click event
            openOwnerModal(rowIndex, {
              x: e.currentTarget.getBoundingClientRect().x,
              y: e.currentTarget.getBoundingClientRect().bottom,
            });
          }}
          onMouseEnter={() => setHoveredUser(owner)}
          onMouseLeave={() => setHoveredUser(null)}
        >
          <div className="relative group">
            <CircleUserRound size={24} className="text-gray-400" />
          </div>
        </div>
        {hoveredUser && hoveredUser.id === owner.id && (
          <div
            className="absolute bg-white border rounded-xl shadow-xl p-4 w-60"
            style={{
              top: -100,
              left: 50,
            }}
          >
            <div className="flex  items-center w-80 ">
              <span>
                <HiMiniUserCircle size={72} />
              </span>
              <div className="ml-2 space-y-1">
                <span className="text-md ">{hoveredUser.name}</span>
                <div className="text-xs text-gray-600">
                  {hoveredUser.time}

                  {hoveredUser.address}
                </div>
                <div className="text-xs text-gray-600 border px-2 py-1  bg-[#cce5ff] w-fit h-fit rounded-sm">
                  <span>Admin</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStatusCell = (rowIndex: number, colIndex: number) => (
    <div
      className={`relative h-full w-full ${
        selectedRows[rowIndex] ? "bg-blue-200" : ""
      }`}
    >
      <StatusLabelDropdown
        value={rows[rowIndex][colIndex] || ""}
        onChange={(value) => updateCell(rowIndex, colIndex, value)}
        options={statusOptions}
        isStatus={true}
      />
    </div>
  );

  const renderLabelCell = (rowIndex: number, colIndex: number) => (
    <div
      className={`relative h-full w-full ${
        selectedRows[rowIndex] ? "bg-blue-200" : ""
      }`}
    >
      <StatusLabelDropdown
        value={rows[rowIndex][colIndex] || ""}
        onChange={(value) => updateCell(rowIndex, colIndex, value)}
        options={labelOptions}
        isStatus={false}
      />
    </div>
  );

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
                <tr>
                  <th className="col-checkbox border border-gray-300 p-0.5 hover:bg-gray-100   w-10">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </th>
                  {columns.map((col, colIndex) => (
                    <th
                      key={colIndex}
                      className={`col-${col
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          "-"
                        )} border border-gray-300 p-0.5 hover:bg-gray-100 text-center font-normal relative`}
                      style={{ width: columnWidths[colIndex] || 150 }}
                    >
                      {col}
                      <div
                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-400"
                        onMouseDown={(e) => startResize(e, colIndex)}
                      />
                    </th>
                  ))}
                  <th className="col-add border border-gray-300 p-0.5 hover:bg-gray-100">
                    <button
                      className="add-column-btn w-full h-full"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setButtonPosition({ x: rect.x, y: rect.bottom });
                        setModalOpen(true);
                      }}
                      aria-label="Add column"
                    >
                      <Plus size={18} />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => {
                  console.log(selectedRows[rowIndex]);
                  console.log(row);
                  return (
                    <tr
                      key={rowIndex}
                      className={`${
                        selectedRows[rowIndex] ? "bg-blue-200" : ""
                      } hover:bg-gray-50 cursor-pointer`}
                      onClick={() => handleRowClick(rowIndex)}
                    >
                      <td
                        className="col-checkbox w-10 h-10 border border-gray-300 text-center p-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRows[rowIndex]}
                          onChange={(e) =>
                            handleSelectRow(rowIndex, e.target.checked)
                          }
                          className="w-4 h-4"
                        />
                      </td>
                      {columns.map((col, colIndex) => (
                        <td
                          key={colIndex}
                          className={` h-10 min-w-32
                          
                          col-${col
                            .toLowerCase()
                            .replace(/\s+/g, "-")} border border-gray-300 p-0 ${
                            selectedRows[rowIndex] ? "bg-blue-200" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              col.toLowerCase() === "owner" ||
                              col.toLowerCase() === "people"
                            ) {
                              renderOwnerCell(rowIndex, colIndex);
                            } else if (
                              col.toLowerCase() === "due date" ||
                              col.toLowerCase() === "date"
                            ) {
                              renderDateCell(rowIndex, colIndex);
                            } else if (col.toLowerCase() === "status") {
                              renderStatusCell(rowIndex, colIndex);
                            } else if (col.toLowerCase() === "label") {
                              renderLabelCell(rowIndex, colIndex);
                            }
                          }}
                        >
                          <div
                            className={`w-full h-full ${
                              selectedRows[rowIndex] ? "bg-blue-200" : ""
                            }`}
                          >
                            {typeof col === "string" &&
                            col.toLowerCase() === "status" ? (
                              <div
                                className={`relative h-full w-full ${
                                  selectedRows[rowIndex] ? "bg-blue-200" : ""
                                }`}
                              >
                                <select
                                  value={row[colIndex] || ""}
                                  onChange={(e) =>
                                    updateCell(
                                      rowIndex,
                                      colIndex,
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    backgroundColor: row[colIndex]
                                      ? getStatusColor(
                                          row[colIndex],
                                          statusOptions
                                        )
                                      : selectedRows[rowIndex]
                                      ? "transparent"
                                      : "white",
                                    color: row[colIndex] ? "white" : "black",
                                    width: "100%",
                                    height: "100%",
                                    padding: "0 12px",
                                    appearance: "none",
                                    border: "none",
                                    borderRadius: "0",
                                  }}
                                  className=" w-full h-full absolute inset-0 cursor-pointer text-center rounded-none "
                                >
                                  <option
                                    value=""
                                    style={{
                                      backgroundColor: "white",
                                      color: "black",
                                    }}
                                  >
                                    {/* Select Status */}
                                  </option>
                                  {(
                                    dropDown[
                                      col.toLowerCase()
                                    ] as StatusOption[]
                                  ).map((option, index) => (
                                    <option
                                      key={`status-${option.value}-${index}`}
                                      value={option.value}
                                      style={{
                                        backgroundColor: option.color.includes(
                                          "#00C875"
                                        )
                                          ? "#00C875"
                                          : option.color.includes("#FDAB3D")
                                          ? "#FDAB3D"
                                          : option.color.includes("#C4C4C4")
                                          ? "#C4C4C4"
                                          : option.color.includes("#DF2F4A")
                                          ? "#DF2F4A"
                                          : "white",
                                        color: "white",
                                      }}
                                    >
                                      {option.value}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : typeof col === "string" &&
                              col.toLowerCase() === "label" ? (
                              <div className="relative h-full w-full">
                                <select
                                  value={row[colIndex] || ""}
                                  onChange={(e) =>
                                    updateCell(
                                      rowIndex,
                                      colIndex,
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    backgroundColor: row[colIndex]
                                      ? labelOptions
                                          .find(
                                            (opt) => opt.value === row[colIndex]
                                          )
                                          ?.color.split(" ")[0] ===
                                        "bg-[#C4C4C4]"
                                        ? "#C4C4C4"
                                        : labelOptions
                                            .find(
                                              (opt) =>
                                                opt.value === row[colIndex]
                                            )
                                            ?.color.split(" ")[0] ===
                                          "bg-[#007EB5]"
                                        ? "#3b82f6"
                                        : labelOptions
                                            .find(
                                              (opt) =>
                                                opt.value === row[colIndex]
                                            )
                                            ?.color.split(" ")[0] ===
                                          "bg-[#9D99B9]"
                                        ? "#a855f7"
                                        : selectedRows[rowIndex]
                                        ? "rgb(191 219 254)"
                                        : "white"
                                      : selectedRows[rowIndex]
                                      ? "rgb(191 219 254)"
                                      : "white",
                                    color: row[colIndex]
                                      ? labelOptions
                                          .find(
                                            (opt) => opt.value === row[colIndex]
                                          )
                                          ?.color.includes("text-gray-800")
                                        ? "#1f2937"
                                        : "white"
                                      : "black",
                                    width: "100%",
                                    height: "100%",
                                    padding: "0 12px",
                                    appearance: "none",
                                    border: "none",
                                    borderRadius: "0",
                                  }}
                                  className="w-full h-full absolute inset-0 cursor-pointer text-center rounded-none"
                                >
                                  <option
                                    value=""
                                    style={{
                                      backgroundColor: "white",
                                      color: "black",
                                    }}
                                  >
                                    {/* Select Label */}
                                  </option>
                                  {(
                                    dropDown[col.toLowerCase()] as LabelOption[]
                                  ).map((option, index) => (
                                    <option
                                      key={`${option.value}-${index}`}
                                      value={option.value}
                                      style={{
                                        backgroundColor:
                                          option.color.split(" ")[0] ===
                                          "bg-[#C4C4C4]"
                                            ? "#C4C4C4"
                                            : option.color.split(" ")[0] ===
                                              "bg-[#007EB5]"
                                            ? "#3b82f6"
                                            : option.color.split(" ")[0] ===
                                              "bg-[#9D99B9]"
                                            ? "#a855f7"
                                            : "white",
                                        color: option.color.includes(
                                          "text-gray-800"
                                        )
                                          ? "#1f2937"
                                          : "white",
                                      }}
                                    >
                                      {option.value}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : typeof col === "string" &&
                              col.toLowerCase() === "numbers" ? (
                              <div
                                className={`relative w-full h-full group ${
                                  selectedRows[rowIndex] ? "bg-blue-200" : ""
                                }`}
                              >
                                <input
                                  type="number"
                                  value={row[colIndex] || ""}
                                  onChange={(e) =>
                                    updateCell(
                                      rowIndex,
                                      colIndex,
                                      e.target.value
                                    )
                                  }
                                  className={`w-full h-full text-center py-0.5 px-1 border-none focus:outline-none rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                    selectedRows[rowIndex]
                                      ? "bg-transparent"
                                      : "bg-white"
                                  }`}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                  {!row[colIndex] && (
                                    <>
                                      <CirclePlus
                                        size={16}
                                        color="#3c41d3"
                                        className="text-gray-400"
                                      />

                                      <Hash
                                        size={16}
                                        className="text-gray-400"
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                            ) : typeof col === "string" &&
                              (col.toLowerCase() === "date" ||
                                col.toLowerCase() === "due date") ? (
                              <div
                                className={`w-full h-full ${
                                  selectedRows[rowIndex] ? "bg-blue-200" : ""
                                }`}
                              >
                                <UnifiedDatePicker
                                  selectedDate={
                                    rows[rowIndex][colIndex]
                                      ? new Date(rows[rowIndex][colIndex])
                                      : null
                                  }
                                  onChange={(date) =>
                                    updateCell(
                                      rowIndex,
                                      colIndex,
                                      date
                                        ? date.toISOString().split("T")[0]
                                        : ""
                                    )
                                  }
                                />
                              </div>
                            ) : typeof col === "string" &&
                              (col.toLowerCase() === "owner" ||
                                col.toLowerCase() === "people") ? (
                              renderOwnerCell(rowIndex, colIndex)
                            ) : typeof col === "string" &&
                              col.toLowerCase() === "text" ? (
                              <div
                                className={`relative w-full h-full group ${
                                  selectedRows[rowIndex] ? "bg-blue-200" : ""
                                }`}
                              >
                                <input
                                  type="text"
                                  value={row[colIndex] || ""}
                                  onChange={(e) =>
                                    updateCell(
                                      rowIndex,
                                      colIndex,
                                      e.target.value
                                    )
                                  }
                                  className={`w-full h-full py-0.5 px-1 border-none focus:outline-none rounded-none ${
                                    selectedRows[rowIndex]
                                      ? "bg-transparent"
                                      : "bg-white"
                                  }`}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                  {!row[colIndex] && (
                                    <>
                                      <CirclePlus
                                        size={16}
                                        color="#3c41d3"
                                        className="text-gray-400"
                                      />
                                      <Type
                                        size={16}
                                        className="text-gray-400"
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={row[colIndex] || ""}
                                onChange={(e) =>
                                  updateCell(rowIndex, colIndex, e.target.value)
                                }
                                className={`w-full h-full py-0.5 px-1 border-none focus:outline-none rounded-none ${
                                  selectedRows[rowIndex]
                                    ? "bg-transparent"
                                    : "bg-white"
                                }`}
                              />
                            )}
                          </div>
                        </td>
                      ))}
                      <td className="border border-gray-300"></td>
                    </tr>
                  );
                })}
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
                      className=" placeholder:text-start rounded-3xl text-start h-6 hover:border hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
                      placeholder=" + Add task"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newTaskName.trim()) {
                          addRow(newTaskName.trim());
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
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(DynamicTable), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});
