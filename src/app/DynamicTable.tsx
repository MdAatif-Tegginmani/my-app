"use client";

import React, { useState } from "react";
import { Plus } from 'lucide-react';

const DynamicTable: React.FC = () => {
  const initialColumns = ["Task Name", "Owner" , "Due date" , ];
  const [columns, setColumns] = useState<string[]>([...initialColumns]);

  const availableColumns = [ "Status", "Text", "Numbers", "Date", "People", "Label" , ];


    const dropDown: Record<string, string[]> = {
        owner:["Ak", "Pk" , "MSD", "Vk"],
        status:["Done", "WOrking on it" , "Stuck", "Not Started"],
        label:["Label 1", "Label 2" , "Label 3", "Label 4"],
        people:["Ak", "Pk" , "MSD", "Vk"],
    }


  const [isModalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState<string[][]>([Array(initialColumns.length).fill("")]);

  const addRow = () => {
    setRows([...rows, Array(columns.length).fill("")]);
  };

  const addColumn = (selectedColumn: string) => {
    setColumns([...columns, selectedColumn]);
    setRows(rows.map(row => [...row, ""])); // Add empty cells to all rows
    setModalOpen(false); // Close modal after adding column
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][colIndex] = value;
    setRows(updatedRows);
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Table</h1>

      {/* <div className="flex gap-4 mb-4">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Column
        </button>
        <button
          onClick={addRow}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Row
        </button>
      </div> */}
      

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {columns.map((col, colIndex) => (
              <th
                key={colIndex}
                className="border border-gray-300 p-2 bg-gray-100 text-left"
              >
                {col}
              </th>
            ))}
            <th className="add-column-header">
              <button 
                className="add-column-btn"
                onClick={() => setModalOpen(true)}
                aria-label="Add column"
              >
                
                <Plus size={16} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="border border-gray-300 p-2">

                   {dropDown[col.toLowerCase()]? (
                    <select
                      value={row[colIndex] || ""}
                      onChange={(e) =>
                        updateCell(rowIndex, colIndex, e.target.value)
                      }
                      className="w-full p-1 border border-gray-300 rounded"
                    >
                      <option value="" >Select {col}</option>
                      
                      {dropDown[col.toLowerCase()].map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={row[colIndex] || ""}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  )}
                </td>
              ))}
              <td></td>
            </tr>
          ))}
          <tr className="add-row-tr">
            <td colSpan={columns.length + 1}>
              <button 
                className="add-row-btn"
                onClick={addRow}
              >
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
  );
};

export default DynamicTable;
