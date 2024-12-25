import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_URL; 

interface ColumnResponse {
  columnId: string;
  name: string;
  // ... other properties
}

export const createTable = async () => {
    try {
        const response = await axios.post(`${API_URL}/create-table`, {
            
        });
        console.log(response.data.id)
        return response.data;
    } catch (error) {
        console.error('Error creating table:', error);
        throw error;
    }
};

export const addColumnToTable = async (tableId: string, columnName: string): Promise<ColumnResponse> => {
   try {
       const response = await axios.post(`${API_URL}/add-column`, {
           columnName: columnName,
           tableId: tableId
       });
       return {
           columnId: response.data.columns[0].id,
           name: columnName,
           // ... other properties
       };
   } catch (error) {
       console.error('Error adding column:', error);
       throw error;
   }
};




export const addRowToTable = async (tableId: string, rowData: any) => {
    try {
        const response = await axios.post(`${API_URL}/add-row`, {
            tableId,
            rowData
        });
        return response.data;
    } catch (error:any) {
        console.error('Error adding row:', error?.response?.data || error.message);
        throw new Error(error?.response?.data?.message || 'Failed to add row to table'); // Provide a user-friendly error message
    }
};

  













// export const fetchData = async () => {
//     try {
//         const response = await axios.get(`${API_URL}/`);
//         console.log('API_URL:', API_URL);
//         console.log('Response data:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// };

