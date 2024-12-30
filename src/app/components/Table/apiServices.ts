import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_URL;

interface ColumnResponse {
  id: number;
  name: string;
}

interface Table {
  id: number;
  columns: {
    id: number;
    name: string;
  }[];
  rows: {
    [key: string]: string | null;
  }[];
}

export const createTable = async (): Promise<Table> => {
  const initialColumns = [
    { id: Date.now(), name: "Task Name" },
    { id: Date.now() + 1, name: "Owner" },
    { id: Date.now() + 2, name: "Due Date" },
  ];

  try {
    const response = await axios.post(`${API_URL}/create-table`, {
      columns: initialColumns,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error creating table:", error);
    throw error;
  }
};

export const fetchTable = async (tableId: string): Promise<Table> => {
  try {
    const response = await axios.get(`${API_URL}?tableId=${tableId}`);
    console.log(response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching table:", error);
    throw error;
  }
};

export const addColumnToTable = async (
  tableId: string,
  columnName: string
): Promise<ColumnResponse> => {
  try {
    const response = await axios.post(`${API_URL}/add-column`, {
      columnName: columnName,
      tableId: tableId,
    });
    return {
      id: response.data.columns[0].id,
      name: columnName,
    };
  } catch (error: unknown) {
    console.error("Error adding column:", error);
    throw error;
  }
};

export const addRowToTable = async (
  tableId: string,
  rowData: Record<string, string | null>
): Promise<{ id: string }> => {
  try {
    const formattedRowData = Object.fromEntries(
      Object.entries(rowData).filter(([, value]) => value !== undefined)
    );

    const request = {
      tableId: parseInt(tableId),
      rowData: formattedRowData,
    };

    console.log("Sending row data:", request);

    const response = await axios.post(`${API_URL}/add-row`, request);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error adding row:", error.response?.data || error.message);
      throw error;
    }
    console.error("Unexpected error:", error);
    throw new Error("Failed to add row to table");
  }
};

export const updateRow = async (
  tableId: string,
  rowIndex: number,
  updatedRowData: Record<string, string | null>
): Promise<{ message: string; rows: Record<string, string | null>[] }> => {
  try {
    const response = await axios.post(`${API_URL}/update-row`, {
      tableId,
      rowIndex,
      updatedRowData,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error updating row:", error);
    throw error;
  }
};

export const updateColumn = async (tableId: string, columnId: number, columnName: string): Promise<{ message: string }> => {  
  try{
    const response = await axios.post(`${API_URL}/update-column`, {
      tableId,
      columnId,
      columnName,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error updating column:", error);
    throw error;
  }
};


export const deleteColumn = async (tableId: string, columnId: number): Promise<{ message: string }> => {
  try{
    const response = await axios.post(`${API_URL}/delete-column`, {
      tableId,
      columnId,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error deleting column:", error);
    throw error;
  }
};



export const deleteRow = async (tableId: string, rowIndex: number): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/delete-row`, {
      tableId,
      rowIndex,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error deleting row:", error);
    throw error;
  }
};

export const deleteSingleValue = async (tableId: string, rowIndex: number, columnId: number): Promise<{ message: string }> => {
  try{
    const response = await axios.post(`${API_URL}/delete-single-value`, {
      tableId,
      rowIndex,
      columnId,
      
    }); 
    return response.data;
  } catch (error: unknown) {
    console.error("Error deleting single value:", error);
    throw error;
  }
};

export default {
  createTable,
  fetchTable,
  addColumnToTable,
  addRowToTable,
  updateRow,
  updateColumn,
  deleteColumn,
  deleteRow,
  deleteSingleValue,
};
