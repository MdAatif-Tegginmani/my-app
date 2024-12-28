import React, { useState, useEffect } from "react";
import { addColumnToTable, addRowToTable, fetchTable } from "./apiService";
import { TableRowType } from "./types";

interface Column {
  name: string;
  columnId: string;
}

const availableColumns: string[] = [
  "Status",
  "Text",
  "Number",
  "Date",
  "Label",
  "People",
];

const TestTable = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<TableRowType[]>([]);
  const [tableId] = useState("1");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTable(tableId);
        setColumns(data.columns);
        setRows(data.rows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [tableId]);

  const handleAddColumn = async () => {
    try {
      const newColumn = await addColumnToTable(
        tableId,
        availableColumns[Math.floor(Math.random() * availableColumns.length)]
      );
      setColumns([...columns, newColumn]);
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  const handleAddRow = async () => {
    const newRowData = {
      tableId: tableId,
      rowData: {
        [columns[0].name]: "New Task",
        ...Object.fromEntries(columns.slice(1).map((col) => [col.name, ""])),
      },
    };

    const newRow = await addRowToTable(tableId, newRowData);
    setRows([...rows, newRow]);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <table border={1}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th className="border w-40 border-gray-300" key={col.columnId}>
                {col.name}
              </th>
            ))}
            <button
              className="bg-blue-500 text-white px-2 py-2 rounded-md"
              onClick={handleAddColumn}
            >
              {" "}
              +
            </button>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr className="" key={row.id || rowIndex}>
              {columns.map((col) => (
                <td className="border border-gray-300" key={col.columnId}>
                  {row[col.name]?.toString() || ""}
                </td>
              ))}
            </tr>
          ))}
          <input
            className="border border-gray-300  px-2 py-2 "
            onClick={handleAddRow}
            placeholder="+ Add Row"
          />
        </tbody>
      </table>
    </div>
  );
};

export default TestTable;
