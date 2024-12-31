import axios from "axios";
import { AddColumnPayload, AddColumnResponse, AddRowPayload, AddRowResponse, UpdateRowResponse, UpdateRowPayload, UpdateColumnResponse, UpdateColumnPayload, DeleteColumnPayload, DeleteColumnResponse, DeleteRowResponse, DeleteRowPayload, DeleteSingleValueResponse, DeleteSingleValuePayload, Table } from "./types";

const API_URL = process.env.NEXT_PUBLIC_URL;





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

export const fetchTable = async (tableId:number): Promise<Table> => {
  try {
    const response = await axios.get(`${API_URL}?tableId=${tableId}`);
    console.log(response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching table:", error);
    throw error;
  }
};



export const addColumnToTable = async ({tableId, columnName}: AddColumnPayload): Promise<AddColumnResponse> => {
  try {
    const response = await axios.post(`${API_URL}/add-column`, {
      columnName,
      tableId
    });
    return response.data
  } catch (error: unknown) {
    console.error("Error adding column:", error);
    throw error;
  }
};

export const addRowToTable = async ({tableId, rowData}: AddRowPayload): Promise<AddRowResponse> => {
  try {
    const formattedRowData = Object.fromEntries(
      Object.entries(rowData).filter(([, value]) => value !== undefined)
    );

    const request = {
      tableId,
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

export const updateRow = async ({tableId, rowIndex, rowData}: UpdateRowPayload): Promise<UpdateRowResponse> => {
  try {
    const response = await axios.put(`${API_URL}/update-row`, {
      tableId,
      rowIndex,
      rowData,
    });
    return response.data;
    console.log(response.data, "this is updated row")
  } catch (error: unknown) {
    console.error("Error updating row:", error);
    throw error;
  }
};

export const updateColumn = async ({tableId, columnId, columnName}: UpdateColumnPayload): Promise<UpdateColumnResponse> => {
  try{
    const response = await axios.put(`${API_URL}/update-column`, {
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


export const deleteColumn = async ({tableId, columnId}: DeleteColumnPayload): Promise<DeleteColumnResponse> => {
  try{
    const response = await axios.delete(`${API_URL}/delete-column`, {
      data: {
        tableId,
        columnId,
      }
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error deleting column:", error);
    throw error;
  }
};



export const deleteRow = async ({tableId, rowIndex}: DeleteRowPayload): Promise<DeleteRowResponse> => {
  try {
    const response = await axios.delete(`${API_URL}/delete-row`, {
      data: {
        tableId: tableId,
        rowIndex: rowIndex,
      }
    });
    console.log(response.data, "this is deleted row")
    return response.data;
  } catch (error: unknown) {
    console.error("Error deleting row:", error);
    throw error;
  }
};

export const deleteSingleValue = async ({tableId, rowIndex, columnId}: DeleteSingleValuePayload): Promise<DeleteSingleValueResponse> => {
  try{
    const response = await axios.delete(`${API_URL}/delete-single-value`, {
      data: {
        tableId,
        rowIndex,
        columnId,
      }
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error deleting single value:", error);
    throw error;
  }
};


