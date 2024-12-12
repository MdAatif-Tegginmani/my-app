"use client";

import React, { useState } from "react";
import {
  Plus,
  Menu,
  Type,
  UserRound,
  Hash,
  Calendar,
  CircleUserRound,
  CirclePlus,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Figtree } from "next/font/google";
import SearchBar from "./Table/SearchBar";
import Navbar from "./Table/Navbar";

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

type UserOption = {
  name: string;
  avatar?: React.ReactNode;
};

const DynamicTable: React.FC = () => {
  const initialColumns: string[] = ["Task Name", "Owner", "Due date"];

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [columns, setColumns] = useState<string[]>(initialColumns);
  const [rows, setRows] = useState<string[][]>([
    Array(initialColumns.length).fill(""),
  ]);

  const [selectedRows, setSelectedRows] = useState<boolean[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [isResizing, setIsResizing] = useState(false);
  const [currentResizer, setCurrentResizer] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  React.useLayoutEffect(() => {
    try {
      const savedColumns = localStorage.getItem("tableColumns");
      const savedRows = localStorage.getItem("tableRows");
      const savedColumnWidths = localStorage.getItem("tableColumnWidths");

      if (savedColumns) {
        setColumns(JSON.parse(savedColumns));
      }
      if (savedRows) {
        setRows(JSON.parse(savedRows));
      }
      if (savedColumnWidths) {
        setColumnWidths(JSON.parse(savedColumnWidths));
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    setSelectedRows(new Array(rows.length).fill(false));
  }, [rows.length]);

  React.useEffect(() => {
    try {
      localStorage.setItem("tableColumnWidths", JSON.stringify(columnWidths));
    } catch (error) {
      console.error("Error saving column widths:", error);
    }
  }, [columnWidths]);

  const statusOptions: StatusOption[] = [
    { value: "Done", color: "bg-[#00C875] text-white" },
    { value: "Working on it", color: "bg-[#FDAB3D] text-white" },
    { value: "Not Started", color: "bg-[#C4C4C4] text-white" },
    { value: "Stuck", color: "bg-[#DF2F4A] text-white" },
  ];

  const labelOptions: LabelOption[] = [
    { value: "Label 1", color: "bg-[#C4C4C4] text-gray-800" },
    { value: "Label 2", color: "bg-[#007EB5] text-white" },
    { value: "Label 3", color: "bg-[#9D99B9] text-white" },
  ];

  const dropDown: Record<
    string,
    string[] | StatusOption[] | LabelOption[] | UserOption[]
  > = {
    owner: [
      { name: "Aakash", avatar: <CircleUserRound size={16} /> },
      { name: "Prakhar", avatar: <CircleUserRound size={16} /> },
      { name: "MSD", avatar: <CircleUserRound size={16} /> },
      { name: "Vikram", avatar: <CircleUserRound size={16} /> },
    ],
    status: statusOptions,
    label: labelOptions,
    people: [
      { name: "Asokh", avatar: <CircleUserRound size={16} /> },
      { name: "Pratik", avatar: <CircleUserRound size={16} /> },
      { name: "MSD", avatar: <CircleUserRound size={16} /> },
      { name: "Vikram", avatar: <CircleUserRound size={16} /> },
    ],
  };
  const [isModalOpen, setModalOpen] = useState(false);

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

  const addRow = () => {
    setRows([...rows, Array(columns.length).fill("")]);
    setSelectedRows([...selectedRows, false]);
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

  const userSelectStyles = {
    container: "relative flex items-center justify-center h-full",
    iconWrapper: "relative group cursor-pointer flex items-center justify-center h-full",
    tooltip: "absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10",
    select: "w-full h-full opacity-0 absolute inset-0 cursor-pointer",
  };

  const startResize = (e: React.MouseEvent, colIndex: number) => {
    setIsResizing(true);
    setCurrentResizer(colIndex);
    setStartX(e.pageX);
    setStartWidth(columnWidths[colIndex] || 150); // Default width if not set
  };

  const doResize = React.useCallback((e: MouseEvent) => {
    if (isResizing && currentResizer !== null) {
      const width = Math.max(startWidth + (e.pageX - startX), 50);
      setColumnWidths(prev => ({
        ...prev,
        [currentResizer]: width
      }));
    }
  }, [isResizing, currentResizer, startWidth, startX]);

  const stopResize = () => {
    setIsResizing(false);
    setCurrentResizer(null);
  };

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', doResize);
      window.addEventListener('mouseup', stopResize);
    }
    return () => {
      window.removeEventListener('mousemove', doResize);
      window.removeEventListener('mouseup', stopResize);
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
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Navbar />
          <h1 className="text-xl font-bold mb-4 font-figtree">To-do</h1>

          <table className="w-auto  border-collapse border border-gray-300 table-fixed font-figtree">
            <thead>
              <tr>
                <th className="col-checkbox border border-gray-300 p-0.5 hover:bg-gray-100 border-l-[5px] border-l-[#3874ff] w-10">
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
                    className={`col-${col.toLowerCase().replace(/\s+/g, "-")} border border-gray-300 p-0.5 hover:bg-gray-100 text-center font-normal relative`}
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
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${
                    selectedRows[rowIndex] ? "bg-blue-200" : ""
                  } hover:bg-gray-50 cursor-pointer`}
                  onClick={() => handleRowClick(rowIndex)}
                >
                  <td
                    className="col-checkbox w-10 h-10 border border-gray-300 text-center p-0.5 border-l-[5px] border-l-[#3874ff]"
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
                      className={`col-${col
                        .toLowerCase()
                        .replace(/\s+/g, "-")} border border-gray-300 p-0`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className={`w-full h-full ${
                          selectedRows[rowIndex] ? "bg-blue-50" : ""
                        }`}
                      >
                        {typeof col === "string" &&
                        col.toLowerCase() === "status" ? (
                          <div className="relative h-full w-full ">
                            <select
                              value={row[colIndex] || ""}
                              onChange={(e) =>
                                updateCell(rowIndex, colIndex, e.target.value)
                              }
                              style={{
                                backgroundColor: row[colIndex]
                                  ? getStatusColor(row[colIndex], statusOptions)
                                  : "white",
                                color: row[colIndex] ? "white" : "black",
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
                                {/* Select Status */}
                              </option>
                              {(
                                dropDown[col.toLowerCase()] as StatusOption[]
                              ).map((option, index) => (
                                <option
                                  key={`status-${option.value}-${index}`}
                                  value={option.value}
                                  style={{
                                    backgroundColor: option.color.includes("#00C875")
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
                                updateCell(rowIndex, colIndex, e.target.value)
                              }
                              style={{
                                backgroundColor: row[colIndex]
                                  ? labelOptions
                                      .find(
                                        (opt) => opt.value === row[colIndex]
                                      )
                                      ?.color.split(" ")[0] === "bg-[#9AADBD]"
                                    ? "#e5e7eb"
                                    : labelOptions
                                        .find(
                                          (opt) => opt.value === row[colIndex]
                                        )
                                        ?.color.split(" ")[0] === "bg-[#007EB5]"
                                    ? "#3b82f6"
                                    : labelOptions
                                        .find(
                                          (opt) => opt.value === row[colIndex]
                                        )
                                        ?.color.split(" ")[0] ===
                                      "bg-[#9D99B9]"
                                    ? "#a855f7"
                                    : "white"
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
                          <div className="relative w-full h-full group">
                            <input
                              type="number"
                              value={row[colIndex] || ""}
                              onChange={(e) =>
                                updateCell(rowIndex, colIndex, e.target.value)
                              }
                              className="w-full h-full text-center py-0.5 px-1 border-none focus:outline-none rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                              {!row[colIndex] && (
                                <>
                                  <CirclePlus
                                    size={16}
                                    color="#3c41d3"
                                    className="text-gray-400"
                                  />
                                  <Hash size={16} className="text-gray-400" />
                                </>
                              )}
                            </div>
                          </div>
                        ) : typeof col === "string" &&
                          (col.toLowerCase() === "date" ||
                            col.toLowerCase() === "due date") ? (
                          <input
                            type="date"
                            value={row[colIndex] || ""}
                            onChange={(e) =>
                              updateCell(rowIndex, colIndex, e.target.value)
                            }
                            className="w-full h-full py-0.5 px-1 border-none focus:outline-none opacity-50 rounded-none"
                          />
                        ) : typeof col === "string" &&
                          (col.toLowerCase() === "owner" ||
                            col.toLowerCase() === "people") ? (
                          <div className={userSelectStyles.container}>
                            <div className={userSelectStyles.iconWrapper}>
                              {row[colIndex] && (
                                <>
                                  <CircleUserRound size={20} />
                                  <span className={userSelectStyles.tooltip}>
                                    {row[colIndex]}
                                  </span>
                                </>
                              )}
                              <select
                                value={row[colIndex] || ""}
                                onChange={(e) =>
                                  updateCell(rowIndex, colIndex, e.target.value)
                                }
                                className={userSelectStyles.select}
                              >
                                <option value="">Select {col}</option>
                                {(
                                  dropDown[col.toLowerCase()] as UserOption[]
                                ).map((option, index) => (
                                  <option
                                    key={`${col}-${index}`}
                                    value={option.name}
                                  >
                                    {option.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ) : typeof col === "string" &&
                          col.toLowerCase() === "text" ? (
                          <div className="relative w-full h-full group">
                            <input
                              type="text"
                              value={row[colIndex] || ""}
                              onChange={(e) =>
                                updateCell(rowIndex, colIndex, e.target.value)
                              }
                              className="w-full h-full py-0.5 px-1 border-none focus:outline-none rounded-none"
                              placeholder=""
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                              {!row[colIndex] && (
                                <>
                                  <CirclePlus
                                    size={16}
                                    color="#3c41d3"
                                    className="text-gray-400"
                                  />
                                  <Type size={16} className="text-gray-400" />
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
                            className="w-full h-full py-0.5 px-1 border-none focus:outline-none rounded-none"
                          />
                        )}
                      </div>
                    </td>
                  ))}
                  <td className="border border-gray-300"></td>
                </tr>
              ))}
              <tr className="add-row-tr h-10">
                <td className="col-checkbox w-10 h-10 border border-gray-300 text-center p-0.5 border-l-[3px] border-l-[#3874ff]">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    aria-label="Select all"
                    id=""
                  />
                </td>
                <td colSpan={columns.length + 1} className="h-10">
                  <button className="add-row-btn h-full" onClick={addRow}>
                    + Add task
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {isModalOpen && (
            <div
              className="fixed inset-0 z-50"
              onClick={() => setModalOpen(false)}
            >
              <div
                className="absolute bg-white p-4 rounded-lg shadow-lg w-72"
                style={{
                  top: `${buttonPosition.y}px`,
                  left: `${buttonPosition.x - 280}px`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4">
                  <h3 className="text-sm text-gray-500 mb-2">Add Column</h3>
                  <SearchBar
                    availableColumns={availableColumnsWithIcons}
                    onColumnSelect={(column) => addColumn(column.label)}
                    existingColumns={columns}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(DynamicTable), {
  ssr: false,
  loading: () => (
    <div className="p-4">
      <div>Loading...</div>
    </div>
  ),
});
