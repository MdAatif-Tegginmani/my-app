export interface CellProps {
  rowIndex: number;
  colIndex: number;
  columnId: number;
  selectedRows: boolean[];
  value: string |number;
  updateCell: (rowIndex: number, tableId: number, rowData: {
    columnId: number;
    value: string;
}) => void;
  rows?: Record<string, any>[];
  setRows?: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;
}

export interface Table {
  id: number;
  columns: {
    id: number;
    name: string;
  }[];
  rows: Record<string, any>[];
}

// responses
// export interface FetchTableResponse s Table {}

export interface AddColumnResponse {
  message: string;
  columns: {
    id: number;
    name: string;
  }[];
}

export interface AddRowResponse {
  message: string;
  rows: Record<string, any>[];
}

export interface UpdateRowResponse {
  message: string;
  rows: Record<string, any>[];
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
  rows: Record<string, any>[];
}

export interface DeleteRowResponse {
  message: string;
  columns: {
    id: number;
    name: string;
  }[];
  rows: Record<string, any>[];
}


      

export interface DeleteSingleValueResponse {
  message: string;
  rows: Record<string, any>[];
}

// payloads
export interface FetchTablePayload {
  query: {
    tableId: number;
  };
}

export interface AddColumnPayload {
  tableId: number;
  columnName: string;
}

export interface AddRowPayload {
  tableId: number;
  rowData: Record<string, any>;
}

export interface UpdateRowPayload {
  tableId: number;
  rowIndex: number;
  rowData: Record<string, any>;
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
