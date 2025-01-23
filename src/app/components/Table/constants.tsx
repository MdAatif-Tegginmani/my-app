import { Calendar, FileText, Hash, Menu, Type, UserRound } from "lucide-react";
import { StatusOption } from "./StatusCell";

export const availableColumnsWithIcons = [
  {
    id: "status",
    label: "Status",
    icon: (
      <span className="inline-block w-auto p-1  bg-green-400 rounded-md">
        <Menu color="#ffffff" size={16} strokeWidth={4} />
      </span>
    ),
  },
  {
    id: "text",
    label: "Text",
    icon: (
      <span className="inline-block w-auto p-1  bg-yellow-300 rounded-md">
        <Type color="#ffffff" size={16} strokeWidth={4} />
      </span>
    ),
  },
  {
    id: "people",
    label: "People",
    icon: (
      <span className="inline-block w-auto p-1  bg-blue-400 rounded-md">
        <UserRound color="#ffffff" strokeWidth={3} size={16} />
      </span>
    ),
  },
  {
    id: "label",
    label: "Label",
    icon: (
      <span className="inline-block w-auto p-1  bg-purple-400 rounded-md">
        <Menu color="#ffffff" size={16} strokeWidth={4} />
      </span>
    ),
  },
  {
    id: "date",
    label: "Date",
    icon: (
      <span className="inline-block w-auto p-1  bg-purple-400 rounded-md">
        <Calendar color="#ffffff" size={16} strokeWidth={4} />
      </span>
    ),
  },
  {
    id: "numbers",
    label: "Numbers",
    icon: (
      <span className="inline-block w-auto p-1  bg-yellow-400 rounded-md">
        <Hash color="#ffffff" size={16} strokeWidth={4} />
      </span>
    ),
  },
  {
    id: "Owner",
    label: "Owner",
    icon: (
      <span className="inline-block w-auto p-1  bg-blue-400 rounded-md">
        <UserRound color="#ffffff" size={16} strokeWidth={4} />
      </span>
    ),
  },
  
  {
    id: "Task Name",
    label: "Task Name",
    icon: (
      <span className="inline-block w-auto p-1  bg-slate-950 rounded-md">
        <FileText color="#ffffff" size={16} strokeWidth={4} />
      </span>
    ),
  },
];

export const getStatusColor = (value: string, options: StatusOption[]) => {
  const option = options.find((opt) => opt.value === value);
  if (!option) return "white";

  if (option.color.includes("#00C875")) return "#00C875";
  if (option.color.includes("#FDAB3D")) return "#FDAB3D";
  if (option.color.includes("#C4C4C4")) return "#C4C4C4";
  if (option.color.includes("#DF2F4A")) return "#DF2F4A";
  return "white";
};
