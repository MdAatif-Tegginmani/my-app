export 
interface CellProps {
  rowIndex: number;
  colIndex: number;
  selectedRows: boolean[];
  value: string;
  updateCell: (rowIndex: number, colIndex: number, value: string) => void;
}

// responses

export interface AddColumnResponse {
  message: string;
  columns: {
    id: number;
    name: string;
  }[];
}






// payloads
export interface AddColumnPayload {
  tableId: number;
  columnName: string;
}


// requests
