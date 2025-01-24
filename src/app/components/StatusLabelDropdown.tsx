import React, { useState, useRef, useEffect } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBackgroundColor = (option: StatusOption | LabelOption) => {
    if ("isEditButton" in option && option.isEditButton) {
      return "#f3f4f6";
    }
    if ("isAddNewButton" in option && option.isAddNewButton) {
      return "#f3f4f6";
    }
    if (isStatus) {
      if (option.color.includes("#00C875")) return "#00C875";
      if (option.color.includes("#FDAB3D")) return "#FDAB3D";
      if (option.color.includes("#C4C4C4")) return "#C4C4C4";
      if (option.color.includes("#DF2F4A")) return "#DF2F4A";
    } else {
      // Extract hex color from bg-[#color] format
      const match = option.color.match(/bg-\[(#[A-Fa-f0-9]+)\]/);
      if (match) return match[1];
      // Fallback to tailwind colors
      if (option.color.includes("bg-gray-200")) return "#e5e7eb";
      if (option.color.includes("bg-gray-100")) return "#f3f4f6";
    }
    return "#ffffff";
  };

  const getTextColor = (option: StatusOption | LabelOption) => {
    if ("isEditButton" in option && option.isEditButton) return "#374151";
    if ("isAddNewButton" in option && option.isAddNewButton) return "#374151";
    return "white";
  };

  // const getFontWeight = (option: StatusOption | LabelOption) => {
  //   if ("isEditButton" in option && option.isEditButton) return "500";
  //   if ("isAddNewButton" in option && option.isAddNewButton) return "500";
  //   return "normal";
  // };

  const currentOption = options.find((opt) => opt.value === value);
  const backgroundColor = currentOption
    ? getBackgroundColor(currentOption)
    : "white";

  const handleSelect = (selectedValue: string) => {
    const selectedOption = options.find((opt) => opt.value === selectedValue);
    if (
      selectedOption &&
      "isEditButton" in selectedOption &&
      selectedOption.isEditButton
    ) {
      onEdit?.();
    } else {
      onChange(selectedValue);
    }
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="status-picker-container relative w-full h-full"
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="status-picker-wrapper flex items-center justify-center h-full cursor-pointer"
        style={{
          backgroundColor,
          color: currentOption ? getTextColor(currentOption) : "#374151",
        }}
      >
        {value || ""}
      </div>

      {isOpen && (
        <div className=" absolute z-50 w-[200px] bg-white shadow-2xl rounded-md mt-1 text-center">
          <div className="">
            <ul
              className="status-picker-colors-view flex items-center justify-center"
              role="listbox"
              aria-labelledby="status-picker-view-title"
              style={{
                display: "grid",
                gridTemplateRows: "repeat(auto-fit, minmax(32px, 1fr))",
                gap: "6px",
                padding: "8px",
              }}
            >
              {options.map((option, index) => (
                <li
                  key={index}
                  role="option"
                  aria-selected={value === option.value}
                  className="new-status-picker-color-option-viewing w-32"
                  onClick={() => handleSelect(option.value)}
                  style={{
                    backgroundColor: getBackgroundColor(option),
                    color: getTextColor(option),
                    padding: "8px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                    
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  {option.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusLabelDropdown;
