"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import dynamic from 'next/dynamic'

type StatusOption = {
  value: string;
  color: string;
};

type LabelOption = {
  value: string;
  color: string;
};

const DynamicTable: React.FC = () => {
  const initialColumns = ["Task Name", "Owner", "Due date"];
  
  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState<string[]>(initialColumns);
  const [rows, setRows] = useState<string[][]>([Array(initialColumns.length).fill("")]);

  React.useLayoutEffect(() => {
    try {
      const savedColumns = localStorage.getItem('tableColumns');
      const savedRows = localStorage.getItem('tableRows');
      
      if (savedColumns) {
        setColumns(JSON.parse(savedColumns));
      }
      if (savedRows) {
        setRows(JSON.parse(savedRows));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const availableColumns = [
    "Status",
    "Text",
    "Numbers",
    "Date",
    "People",
    "Label",
  ];





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




  const dropDown: Record<string, string[] | StatusOption[] | LabelOption[]> = {
    owner: ["Aakash", "Prakhar", "MSD", "Vikram"],
    status: statusOptions,
    label: labelOptions,
    people: ["Asokh", "Pratik", "MSD", "Vikram"],
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

  return (
    <div className="p-4">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1 className="text-lg font-bold mb-4">Table</h1>

          <table className="w-full  border-collapse border border-gray-300 table-fixed">
            <thead>
              <tr>
                <th className="w-10 border  border-gray-300 p-2  bg-gray-100">
                  <input type="checkbox" className="w-4  h-4 rounded" />
                </th>
                {columns.map((col, colIndex) => (
                  <th
                    key={colIndex}
                    className="border border-gray-300 p-2 bg-gray-100 w-40 text-center"
                  >
                    {col}
                  </th>
                ))}
                <th className="add-column-header">
                  <button
                    className="add-column-btn "
                    onClick={() => setModalOpen(true)}
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
                  <td className="border border-gray-300 text-center p-2 ">
                    <input type="checkbox" className="w-4 h-4  rounded" />
                  </td>

                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="border border-gray-300 p-2">
                      {typeof col === 'string' && col.toLowerCase() === "status" ? (
                        <div className="relative">
                          <select
                            value={row[colIndex] || ""}
                            onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                            style={{
                              backgroundColor: row[colIndex] ? 
                                statusOptions.find(opt => opt.value === row[colIndex])?.color.includes('green') ? '#22c55e' :
                                statusOptions.find(opt => opt.value === row[colIndex])?.color.includes('orange') ? '#fb923c' :
                                statusOptions.find(opt => opt.value === row[colIndex])?.color.includes('gray') ? '#9ca3af' :
                                statusOptions.find(opt => opt.value === row[colIndex])?.color.includes('red') ? '#ef4444' : 
                                'white' : 'white',
                              color: row[colIndex] ? 'white' : 'black'
                            }}
                            className="w-full p-1 border border-gray-300 rounded"
                          >
                            <option value="" style={{ backgroundColor: 'white', color: 'black' }}>Select Status</option>
                            {(dropDown[col.toLowerCase()] as StatusOption[]).map(
                              (option, index) => (
                                <option
                                  key={`status-${option.value}-${index}`}
                                  value={option.value}
                                  style={{ 
                                    backgroundColor: option.color.includes('green') ? '#22c55e' :
                                                            option.color.includes('orange') ? '#fb923c' :
                                                            option.color.includes('gray') ? '#9ca3af' :
                                                            option.color.includes('red') ? '#ef4444' : 
                                                            'white',
                                    color: 'white'
                                  }}
                                >
                                  {option.value}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      ) : typeof col === 'string' && col.toLowerCase() === "label" ? (
                        <select
                          value={row[colIndex] || ""}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          style={{
                            backgroundColor: row[colIndex] ? 
                              labelOptions.find(opt => opt.value === row[colIndex])?.color.split(' ')[0] === 'bg-gray-200' ? '#e5e7eb' :
                              labelOptions.find(opt => opt.value === row[colIndex])?.color.split(' ')[0] === 'bg-blue-500' ? '#3b82f6' :
                              labelOptions.find(opt => opt.value === row[colIndex])?.color.split(' ')[0] === 'bg-purple-500' ? '#a855f7' :
                              'white' : 'white',
                            color: row[colIndex] ? 
                              labelOptions.find(opt => opt.value === row[colIndex])?.color.includes('text-gray-800') ? '#1f2937' : 'white'
                              : 'black'
                          }}
                          className="w-full p-1 border border-gray-300 rounded"
                        >
                          <option value="" style={{ backgroundColor: 'white', color: 'black' }}>Select Label</option>
                          {(dropDown[col.toLowerCase()] as LabelOption[]).map(
                            (option, index) => (
                              <option
                                key={`${option.value}-${index}`}
                                value={option.value}
                                style={{ 
                                  backgroundColor: option.color.split(' ')[0] === 'bg-gray-200' ? '#e5e7eb' :
                                                          option.color.split(' ')[0] === 'bg-blue-500' ? '#3b82f6' :
                                                          option.color.split(' ')[0] === 'bg-purple-500' ? '#a855f7' :
                                                          'white',
                                  color: option.color.includes('text-gray-800') ? '#1f2937' : 'white'
                                }}
                              >
                                {option.value}
                              </option>
                            )
                          )}
                        </select>
                      ) : typeof col === 'string' && col.toLowerCase() === "numbers" ? (
                        <input
                          type="number"
                          value={row[colIndex] || ""}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          className="w-full text-center p-1 border border-gray-300 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      ) : typeof col === 'string' && (col.toLowerCase() === "date" || col.toLowerCase() === "due date") ? (
                        <input
                          type="date"
                          value={row[colIndex] || ""}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      ) : typeof col === 'string' && dropDown[col.toLowerCase()] ? (
                        <select
                          value={row[colIndex] || ""}
                          onChange={(e) =>
                            updateCell(rowIndex, colIndex, e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        >
                          <option value="">Select {col}</option>
                          {Array.isArray(dropDown[col.toLowerCase()]) && 
                            dropDown[col.toLowerCase()].map((option, index) => (
                              <option
                                key={`${col}-${index}`}
                                value={typeof option === 'string' ? option : (option as StatusOption | LabelOption).value}
                              >
                                {typeof option === 'string' ? option : (option as StatusOption | LabelOption).value}
                              </option>
                            )
                          )}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={row[colIndex] || ""}
                          onChange={(e) =>
                            updateCell(rowIndex, colIndex, e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      )}
                    </td>
                  ))}
                  <td></td>
                </tr>
              ))}
              <tr className="add-row-tr">
                <td className="border border-gray-300 text-center p-2 ">
                  <input type="checkbox" className="w-4 h-4 rounded" aria-label="Select all" id="" />
                </td>
                <td colSpan={columns.length+1}>
                  <button className="add-row-btn" onClick={addRow}>
                    + Add task
                  </button>
                </td>

              </tr>
            </tbody>
          </table>

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">Select a Column to Add</h2>
                <ul className="space-y-2">
                  {availableColumns
                    .filter((col) => !columns.includes(col))
                    .map((col) => (
                      <li key={col}>
                        <button
                          onClick={() => addColumn(col)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full text-left"
                        >
                          {col}
                        </button>
                      </li>
                    ))}
                </ul>
                <button
                  onClick={() => setModalOpen(false)}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
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
  )
});
