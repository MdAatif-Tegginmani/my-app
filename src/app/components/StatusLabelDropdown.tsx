import React from "react";

interface StatusOption {
  value: string;
  color: string;
}

interface LabelOption {
  value: string;
  color: string;
  isEditButton?: boolean;
  isAddNewButton?: boolean;
}

interface StatusLabelDropdownProps {
  value: string;
  onChange: (value: string) => void;
  onEdit?: () => void;
  options: StatusOption[] | LabelOption[];
  isStatus: boolean; // true for status, false for label
}

const StatusLabelDropdown: React.FC<StatusLabelDropdownProps> = ({
  value,
  onChange,
  onEdit,
  options,
  isStatus,
}) => {
  const getBackgroundColor = (option: StatusOption | LabelOption) => {
    if ("isEditButton" in option && option.isEditButton) {
      return "#f3f4f6";
    }
    if ("isAddNewButton" in option && option.isAddNewButton) {
      return "#000000"; // green-500
    }
    if (isStatus) {
      if (option.color.includes("#00C875")) return "#00C875";
      if (option.color.includes("#FDAB3D")) return "#FDAB3D";
      if (option.color.includes("#C4C4C4")) return "#C4C4C4";
      if (option.color.includes("#DF2F4A")) return "#DF2F4A";
    } else {
      if (option.color.includes("bg-[#C4C4C4]")) return "#C4C4C4";
      if (option.color.includes("bg-[#007EB5]")) return "#3b82f6";
      if (option.color.includes("bg-[#9D99B9]")) return "#a855f7";
      if (option.color.includes("bg-red-500")) return "#ef4444";
      if (option.color.includes("bg-black")) return "#000000";
    }
  };

  const getTextColor = (option: StatusOption | LabelOption) => {
    if ("isEditButton" in option && option.isEditButton) return "black";
    if ("isAddNewButton" in option && option.isAddNewButton) return "white";
    return value ? "black" : "white";
  };

  const getFontWeight = (option: StatusOption | LabelOption) => {
    if ("isEditButton" in option && option.isEditButton) return "bold";
    if ("isAddNewButton" in option && option.isAddNewButton) return "bold";
    return "normal";
  };

  const currentOption = options.find((opt) => opt.value === value);
  const backgroundColor = currentOption
    ? getBackgroundColor(currentOption)
    : "white";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = options.find((opt) => opt.value === e.target.value);
    if (
      selectedOption &&
      "isEditButton" in selectedOption &&
      selectedOption.isEditButton
    ) {
      onEdit?.();
      // Reset the select to the current value
      e.target.value = value;
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <select
      value={value || ""}
      onChange={handleChange}
      style={{
        backgroundColor,
        color: currentOption ? getTextColor(currentOption) : "black",
        width: "100%",
        height: "100%",
        padding: "0 12px",
        appearance: "none",
        border: "none",
        borderRadius: "0",
      }}
      className="w-full h-full absolute inset-0 cursor-pointer text-center rounded-none p-2 gap-2"
    >
      <option value="" style={{ backgroundColor: "white", color: "black" }}>
        {/* Select {isStatus ? "Status" : "Label"} */}
      </option>
      {options.map((option, index) => (
        <option
          key={`${option.value}-${index}`}
          value={option.value}
          style={{
            backgroundColor: getBackgroundColor(option),
            color: getTextColor(option),
            fontWeight: getFontWeight(option),
          }}
        >
          {option.value}
        </option>
      ))}
    </select>
    // <button>Edit label</button>
  );
};

export default StatusLabelDropdown;
