import { CircleUserRound } from "lucide-react";
import { useState } from "react";
import { HiMiniUserCircle } from "react-icons/hi2";
import OwnerSelectModal, { User } from "../OwnerSelectModal";


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
  setRows,
}: {
  rowIndex: number;
  colIndex: number;
  selectedRows: boolean[];
  rows: string[][];
  updateCell: (rowIndex: number, colIndex: number, value: string) => void;
  setRows: (rows: string[][]) => void;
}) => {
 const [hoveredUser, setHoveredUser] = useState<{ id: number; name: string } | null>(null);
 const owner = rows[rowIndex][colIndex]; // Get the owner object
 const [isOwnerModalOpen, setOwnerModalOpen] = useState(false);

 const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

 const handleUserSelect = (user: User | null) => {
    if (rowIndex !== null && user) {
      updateCell(
        rowIndex,
        /* column index for owner/people */ 1,
        user.name
      );
      // Update the row to show the CircleUserRound icon
      const updatedRows = [...rows];
      updatedRows[rowIndex][1] = user;
      setRows(updatedRows);
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
                e.stopPropagation(); // Prevent row click event
                setButtonPosition({
                  x: e.currentTarget.getBoundingClientRect().x,
                  y: e.currentTarget.getBoundingClientRect().bottom,
                });
                setOwnerModalOpen(true);
              }}
              onMouseEnter={() => setHoveredUser(owner)}
              onMouseLeave={() => setHoveredUser(null)}
            >
              <div className="relative group">  
                <CircleUserRound size={24} className="text-gray-400" />
              </div>
            </div>
            {hoveredUser && hoveredUser.id === owner.id && (
              <div
                className="absolute bg-white border rounded-xl shadow-xl p-4 w-60"
                style={{
                  top: -100,
                  left: 50,
                }}
              >
                <div className="flex  items-center w-80 ">
                  <span>
                    <HiMiniUserCircle size={72} />
                  </span>
                  <div className="ml-2 space-y-1">
                    <span className="text-md ">{hoveredUser.name}</span>
                    <div className="text-xs text-gray-600">
                      {hoveredUser.time}
                      {hoveredUser.address}
                    </div>
                    <div className="text-xs text-gray-600 border px-2 py-1  bg-[#cce5ff] w-fit h-fit rounded-sm">
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