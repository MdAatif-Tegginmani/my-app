interface TableRowProps {
  row: any;
  rowIndex: number;
  columns: { name: string; columnId: string }[];
  selectedRows: boolean[];
  handleRowClick: (index: number) => void;
  handleSelectRow: (index: number, checked: boolean) => void;
  TableCell: React.ComponentType<any>;
}

export const TableRow: React.FC<TableRowProps> = ({
  row,
  rowIndex,
  columns,
  selectedRows,
  handleRowClick,
  handleSelectRow,
  TableCell,
}) => {
  return (
    <tr
      className={`${
        selectedRows[rowIndex] ? "bg-blue-200" : ""
      } hover:bg-gray-50 cursor-pointer`}
      onClick={() => handleRowClick(rowIndex)}
    >
      <td
        className="col-checkbox w-10 h-10 border border-gray-300 text-center p-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={selectedRows[rowIndex]}
          onChange={(e) => handleSelectRow(rowIndex, e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      {columns.map((col, colIndex) => (
        <TableCell
          key={colIndex}
          col={col}
          row={row}
          rowIndex={rowIndex}
          colIndex={colIndex}
          selectedRows={selectedRows}
        />
      ))}
    </tr>
  );
}; 