export 
interface CellProps {
  rowIndex: number;
  colIndex: number;
  selectedRows: boolean[];
  value: string;
  updateCell: (rowIndex: number, colIndex: number, value: string) => void;
}