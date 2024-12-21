import React from 'react';

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
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{
        backgroundColor: isStatus
          ? options.find((opt) => opt.value === value)?.color.split(" ")[0]
          : "white",
        color: isStatus && value ? "white" : "black",
        width: "100%",
        height: "100%",
        padding: "0 12px",
        appearance: "none",
        border: "none",
        borderRadius: "0",
      }}
      className="w-full h-full absolute inset-0 cursor-pointer text-center rounded-none"
    >
      <option value="" style={{ backgroundColor: "white", color: "black" }}>
        {/* Select {isStatus ? "Status" : "Label"} */}
      </option>
      {options.map((option, index) => (
        <option
          key={`${option.value}-${index}`}
          value={option.value}
          style={{
            backgroundColor: option.color.split(" ")[0],
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