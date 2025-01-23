export interface CellProps {
  rowIndex: number;
  colIndex: number;
  columnId: number;
  tableId: number;
  selectedRows: boolean[];
  value: string | number | null | undefined;
  updateCell: (
    rowIndex: number,
    tableId: number,
    rowData: {
      columnId: number;
      value: string | number | boolean | null | undefined;
    }
  ) => void;
  rows?: TableRowData[];
  setRows?: React.Dispatch<React.SetStateAction<TableRowData[]>>;
}

export interface TableRowData {
  [key: number]: string | number | boolean | null | undefined; // Specify more precise types instead of 'any'
}

export interface TableColumnData {
  id: number;
  name: string;
  tableId: number;
}

export interface Table {
  id: number;
  columns: TableColumnData[];
  rows: TableRowData[];
}

// responses
// export interface FetchTableResponse s Table {}
export interface FetchTableResponse {
  message: string;
  columns: TableColumnData[];
  rows: TableRowData[];
}

export interface AddColumnResponse {
  message: string;
  columns: TableColumnData[];
}

export interface AddRowResponse {
  message: string;
  rows: TableRowData[];
}

export interface UpdateRowResponse {
  message: string;
  rows: TableRowData[];
}

export interface UpdateColumnResponse {
  message: string;
  columns: TableColumnData[];
}

export interface DeleteColumnResponse {
  message: string;
  columns: TableColumnData[];
  rows: TableRowData[];
}

export interface DeleteRowResponse {
  message: string;
  columns: TableColumnData[];
  rows: TableRowData[];
}

export interface DeleteSingleValueResponse {
  message: string;
  rows: TableRowData[];
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
  rowData: TableRowData;
}

export interface UpdateRowPayload {
  tableId: number;
  rowIndex: number;
  rowData: TableRowData;
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
