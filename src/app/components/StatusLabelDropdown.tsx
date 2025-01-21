import React from "react";

interface StatusOption {
  value: string;
  color: string;
}

interface LabelOption {
  value: string;
  color: string;
}

interface StatusLabelDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: StatusOption[] | LabelOption[];
  isStatus: boolean; // true for status, false for label
}

const StatusLabelDropdown: React.FC<StatusLabelDropdownProps> = ({
  value,
  onChange,
  options,
  isStatus,
}) => {
  const getBackgroundColor = (option: StatusOption | LabelOption) => {
    if (isStatus) {
      if (option.color.includes("#00C875")) return "#00C875";
      if (option.color.includes("#FDAB3D")) return "#FDAB3D";
      if (option.color.includes("#C4C4C4")) return "#C4C4C4";
      if (option.color.includes("#DF2F4A")) return "#DF2F4A";
    } else {
      if (option.color.includes("bg-[#C4C4C4]")) return "#C4C4C4";
      if (option.color.includes("bg-[#007EB5]")) return "#3b82f6";
      if (option.color.includes("bg-[#9D99B9]")) return "#a855f7";
    }
    return "white";
  };

  const currentOption = options.find((opt) => opt.value === value);
  const backgroundColor = currentOption
    ? getBackgroundColor(currentOption)
    : "white";

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{
        backgroundColor,
        color: value ? "white" : "black",
        width: "100%",
        height: "100%",
        padding: "0 12px",
        appearance: "none",
        border: "none",
        borderRadius: "0",
      }}
      className="w-full h-full absolute inset-0 cursor-pointer text-center rounded-none p-2"
    >
      <option value="" style={{ backgroundColor: "white", color: "black"   }} >
        {/* Select {isStatus ? "Status" : "Label"} */}
      </option>
      {options.map((option, index) => (
        <option
          key={`${option.value}-${index}`}
          value={option.value}
          style={{
            backgroundColor: getBackgroundColor(option),
            color: "white",
          }}
        >
          {option.value}
        </option>
      ))}
    </select>
  );
};

export default StatusLabelDropdown;
