interface AddTaskRowProps {
  newTaskName: string;
  onNewTaskNameChange: (value: string) => void;
  onAddTask: (taskName: string) => void;
  columnsCount: number;
}

const AddTaskRow: React.FC<AddTaskRowProps> = ({
  newTaskName,
  onNewTaskNameChange,
  onAddTask,
  columnsCount,
}) => {
  return (
    <tr>
      <td className="col-checkbox w-8 h-8 border border-gray-300 text-center p-0.5">
        <input
          type="checkbox"
          className="w-4 h-4 p-0.5"
          aria-label="Select all"
          disabled
        />
      </td>
      <td colSpan={2} className="px-2 py-2">
        <input
          type="text"
          className="placeholder:text-start rounded-3xl text-start h-6 hover:border hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
          placeholder=" + Add task"
          value={newTaskName}
          onChange={(e) => onNewTaskNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newTaskName.trim()) {
              onAddTask(newTaskName.trim());
            }
          }}
        />
      </td>
      <td colSpan={columnsCount - 1}></td>
    </tr>
  );
};

export default AddTaskRow;
