import { CircleUserRound } from "lucide-react";
import { useState } from "react";
import { HiMiniUserCircle } from "react-icons/hi2";
import OwnerSelectModal from "../OwnerSelectModal";
import { User } from "../OwnerSelectModal";
import { TableRowData } from "./types";


const users = [
  { id: 1, name: "Md Aatif", time: "7:57 PM+", address: "Ekaterinburg" },
  { id: 2, name: "John Doe", time: "8:00 PM+", address: "Moscow" },
];

const RenderOwnerCell = ({
  rowIndex,
  colIndex,
  selectedRows,
  rows,
  updateCell,
  tableId,
}: {
  rowIndex: number;
  colIndex: number;
  selectedRows: boolean[];
  rows: TableRowData[];
  tableId: number;
  updateCell: (
    rowIndex: number,
    tableId: number,
    rowData: {
      columnId: number;
      value: string | number | boolean | null | undefined;  
    }
  ) => void;
  setRows: (rows: TableRowData[]) => void;
}) => {
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);
  const [isOwnerModalOpen, setOwnerModalOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  // Find the user based on the name in the cell
  const cellValue = rows[rowIndex][colIndex];
  const currentUser = cellValue
    ? users.find((user) => user.name === cellValue)
    : null;

  const handleUserSelect = (user: User | null) => {
    if (user) {
      updateCell(rowIndex, tableId, { columnId: colIndex, value: user.name });
    }
  };

  return (
    <>
      <div
        className={`relative w-full h-full ${
          selectedRows[rowIndex] ? "bg-blue-200" : ""
        }`}
      >
        <div
          className="w-full h-full flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setButtonPosition({
              x: e.currentTarget.getBoundingClientRect().x,
              y: e.currentTarget.getBoundingClientRect().bottom,
            });
            setOwnerModalOpen(true);
          }}
          onMouseEnter={() => currentUser && setHoveredUser(currentUser)}
          onMouseLeave={() => setHoveredUser(null)}
        >
          <div className="relative group">
            {currentUser ? (
              <div className="flex items-center justify-center">
                <HiMiniUserCircle size={24} className="text-gray-600" />
                <span className="ml-1 text-sm">{currentUser.name}</span>
              </div>
            ) : (
              <CircleUserRound size={24} className="text-gray-400" />
            )}
          </div>
        </div>
        {hoveredUser && (
          <div
            className="absolute bg-white border rounded-xl shadow-xl p-4 w-60 z-10"
            style={{
              top: -100,
              left: 50,
            }}
          >
            <div className="flex items-center w-80">
              <span>
                <HiMiniUserCircle size={72} />
              </span>
              <div className="ml-2 space-y-1">
                <span className="text-md">{hoveredUser.name}</span>
                <div className="text-xs text-gray-600">
                  {hoveredUser.time} {hoveredUser.address}
                </div>
                <div className="text-xs text-gray-600 border px-2 py-1 bg-[#cce5ff] w-fit h-fit rounded-sm">
                  <span>Admin</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <OwnerSelectModal
        isOpen={isOwnerModalOpen}
        onClose={() => setOwnerModalOpen(false)}
        onSelect={handleUserSelect}
        users={users}
        position={buttonPosition}
      />
    </>
  );
};

export default RenderOwnerCell;
