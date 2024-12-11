"use client";

import React, { useState } from "react";
import {
  Plus,
  Menu,
  Search,
  Type,
  UserRound,
  Hash,
  Calendar,
  CircleUserRound,
  CirclePlus,
} from "lucide-react";
import dynamic from "next/dynamic";

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

  React.useLayoutEffect(() => {
    try {
      const savedColumns = localStorage.getItem("tableColumns");
      const savedRows = localStorage.getItem("tableRows");

      if (savedColumns) {
        setColumns(JSON.parse(savedColumns));
      }
      if (savedRows) {
        setRows(JSON.parse(savedRows));
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // const availableColumns = [
  //   "Status",
  //   "Text",
  //   "Numbers",
  //   "Date",
  //   "People",
  //   "Label",
  // ];

  const statusOptions: StatusOption[] = [
    { value: "Done", color: "bg-green-500 text-white" },
    { value: "Working on it", color: "bg-orange-400 text-white" },
    { value: "Not Started", color: "bg-gray-400 text-white" },
    { value: "Stuck", color: "bg-red-500 text-white" },
  ];

  const labelOptions: LabelOption[] = [
    { value: "Label 1", color: "bg-gray-200 text-gray-800" },
    { value: "Label 2", color: "bg-blue-500 text-white" },
    { value: "Label 3", color: "bg-purple-500 text-white" },
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

  const addRow = () => {
    setRows([...rows, Array(columns.length).fill("")]);
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

  // Define the available columns with icons
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

  // Add this state for button position
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  const getStatusColor = (value: string, options: StatusOption[]) => {
    const option = options.find((opt) => opt.value === value);
    if (!option) return "white";

    if (option.color.includes("green")) return "#22c55e";
    if (option.color.includes("orange")) return "#fb923c";
    if (option.color.includes("gray")) return "#9ca3af";
    if (option.color.includes("red")) return "#ef4444";
    return "white";
  };

  const userSelectStyles = {
    container: "relative flex items-center",
    iconWrapper:
      "relative group cursor-pointer w-full h-full flex items-center justify-center",
    tooltip:
      "absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10",
    select: "w-full h-full opacity-0 absolute inset-0 cursor-pointer",
  };

  return (
    <div className="p-4 ">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1 className="text-lg font-bold mb-4">Table</h1>

          <table className="w-auto border-collapse border border-gray-300 table-fixed">
            <thead>
              <tr>
                <th className="w-10 border border-gray-300 p-0.5 hover:bg-gray-100">
                  <input type="checkbox" className="" />
                </th>
                {columns.map((col, colIndex) => (
                  <th
                    key={colIndex}
                    className="border border-gray-300 p-0.5 hover:bg-gray-100 w-auto text-center"
                  >
                    {col}
                  </th>
                ))}
                <th className="add-column-header border border-gray-300 p-0.5 hover:bg-gray-100">
                  <button
                    className="add-column-btn w-full h-full"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setButtonPosition({ x: rect.x, y: rect.bottom });
                      setModalOpen(true);
                    }}
                    aria-label="Add column"
                  >
                    <Plus size={18} className="" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border border-gray-300 text-center   p-0.5">
                    <input type="checkbox" className="" />
                  </td>

                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="border border-gray-300  p-0 ">
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
                              Select Status
                            </option>
                            {(
                              dropDown[col.toLowerCase()] as StatusOption[]
                            ).map((option, index) => (
                              <option
                                key={`status-${option.value}-${index}`}
                                value={option.value}
                                style={{
                                  backgroundColor: option.color.includes(
                                    "green"
                                  )
                                    ? "#22c55e"
                                    : option.color.includes("orange")
                                    ? "#fb923c"
                                    : option.color.includes("gray")
                                    ? "#9ca3af"
                                    : option.color.includes("red")
                                    ? "#ef4444"
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
                                    .find((opt) => opt.value === row[colIndex])
                                    ?.color.split(" ")[0] === "bg-gray-200"
                                  ? "#e5e7eb"
                                  : labelOptions
                                      .find(
                                        (opt) => opt.value === row[colIndex]
                                      )
                                      ?.color.split(" ")[0] === "bg-blue-500"
                                  ? "#3b82f6"
                                  : labelOptions
                                      .find(
                                        (opt) => opt.value === row[colIndex]
                                      )
                                      ?.color.split(" ")[0] === "bg-purple-500"
                                  ? "#a855f7"
                                  : "white"
                                : "white",
                              color: row[colIndex]
                                ? labelOptions
                                    .find((opt) => opt.value === row[colIndex])
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
                              Select Label
                            </option>
                            {(dropDown[col.toLowerCase()] as LabelOption[]).map(
                              (option, index) => (
                                <option
                                  key={`${option.value}-${index}`}
                                  value={option.value}
                                  style={{
                                    backgroundColor:
                                      option.color.split(" ")[0] ===
                                      "bg-gray-200"
                                        ? "#e5e7eb"
                                        : option.color.split(" ")[0] ===
                                          "bg-blue-500"
                                        ? "#3b82f6"
                                        : option.color.split(" ")[0] ===
                                          "bg-purple-500"
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
                              )
                            )}
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
                              <CirclePlus size={16} color="#3c41d3"  className="text-gray-400" />
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
                                <CirclePlus size={16} color="#3c41d3"  className="text-gray-400" />
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
                    </td>
                  ))}
                  <td className="border border-gray-300"></td>
                </tr>
              ))}
              <tr className="add-row-tr">
                <td className="border border-gray-300 text-center p-0.5">
                  <input
                    type="checkbox"
                    className="w-3 h-3 rounded"
                    aria-label="Select all"
                    id=""
                  />
                </td>
                <td colSpan={columns.length + 1}>
                  <button className="add-row-btn" onClick={addRow}>
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
                {/* Search Bar */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md pl-8"
                    />
                    <span className="absolute right-2 top-2.5 text-gray-400">
                      <Search />
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm text-gray-500 mb-2">Essentials</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {availableColumnsWithIcons.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => addColumn(item.label)}
                        className="flex items-center gap-2 p-2  hover:bg-gray-100 rounded-md w-full text-left"
                        disabled={columns.includes(item.label)}
                      >
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>
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
