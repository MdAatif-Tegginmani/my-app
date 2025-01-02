import { X } from "lucide-react";

const TaskDetailModal = ({isModalOpen, setIsModalOpen}:{isModalOpen:boolean, setIsModalOpen:React.Dispatch<React.SetStateAction<boolean>>}) => {


  return (
    <div
      className={`fixed top-0 right-0 w-[600px] h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isModalOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center gap-8 p-4 border-b">
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          <h2 className="text-xl font-semibold">Task Details</h2>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Tabs */}
          <div className="flex gap-4 border-b mb-4">
            <button className="px-4 py-2 text-blue-500 border-b-2 border-blue-500">
              Updates
            </button>
            <button className="px-4 py-2 text-gray-500">Files</button>
            <button className="px-4 py-2 text-gray-500">Activity Log</button>
          </div>

          {/* Text Editor Area */}
          <div className="border rounded-lg p-4">
            <div className="flex gap-2 mb-4">
              <button className="p-2 hover:bg-gray-100 rounded">
                <span className="font-bold">B</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <span className="italic">I</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <span className="underline">U</span>
              </button>
            </div>
            <textarea
              placeholder="Write an update..."
              className="w-full h-32 resize-none focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
