export 
interface CellProps {
  rowIndex: number;
  colIndex: number;
  selectedRows: boolean[];
  value: string;
  updateCell: (rowIndex: number, colIndex: number, value: string) => void;
}




// responses


export interface Table {
  id: number;
  columns: {
    id: number;
    name: string;
  }[];
  rows: {
    [key: string]: any;
  }[];
}


export interface FetchTableResponse {
  id: number;
  columns: {
    id: number;
    name: string;
  }[];
  rows: {
    [key: string]: any;
  }[];
}        

export interface AddColumnResponse {
  message: string;
  columns: {
    id: number;
    name: string;
  }[];
}

export interface AddRowResponse {
  message: string;
  rows: {
    [key: string]: any;
  }[];
}

export interface UpdateRowResponse {
  message: string;
  rows: {
    [key: string]: any;
  }[];
}
      
export interface UpdateColumnResponse {
  message: string;
  columns: {
    id: number;
    name: string;
  }[];
}

export interface DeleteColumnResponse {
  message: string;
  columns: {
    id: number;
    name: string;
  }[];
}
export interface DeleteRowResponse {
  message: string;
  columns: {
    id: number;
    name: string;
  }[];
}

export interface DeleteSingleValueResponse {
  message: string;  
  rows: {
    [key: string]: any;
  }[];
}
        






// payloads

export interface FetchTablePayload {
  tableId: number;
}



export interface AddColumnPayload {
  tableId: number;
  columnName: string;
}

export interface AddRowPayload {
  tableId: number;
  rowData: Record<number, any>;
}

export interface UpdateRowPayload {
  tableId: number;
  rowIndex: number;
  rowData: Record<number, any>;
}

export interface UpdateColumnPayload {
  tableId: number;
  columnId: number;
  columnName: string;
}

export interface DeleteColumnPayload {
  tableId: number;
  columnId: number;
}

export interface DeleteRowPayload {
  tableId: number;
  rowIndex: number;
}

export interface DeleteSingleValuePayload {
  tableId: number;
  rowIndex: number;
  columnId: number;
}

