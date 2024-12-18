import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import { CirclePlus, Calendar as CalendarIcon } from "lucide-react";

interface UnifiedDatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
}

const UnifiedDatePicker: React.FC<UnifiedDatePickerProps> = ({
  selectedDate,
  onChange,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      // If you need to do something when selectedDate changes, you can add logic here
    }
  }, [selectedDate]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onChange(date);
    }
    setShowCalendar(false);
  };

  return (
    <div className="relative group w-full h-full">
      <div
        className=" p-2 rounded cursor-pointer w-full h-full "
        onClick={() => setShowCalendar((prev) => !prev)}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      >
        {selectedDate ? moment(selectedDate).format("DD/MM/YYYY") : ""}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity gap-1 ${
            inputFocused || selectedDate
              ? "opacity-0"
              : " opacity-0 group-hover:opacity-100"
          }`}
        >
          <CirclePlus size={16} color="#3c41d3" className="text-gray-400" />
          <CalendarIcon size={16} className="text-gray-400" />
        </div>
      </div>
      {showCalendar && (
        <div className="absolute z-10 bg-white border rounded shadow-lg p-2 mt-1">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            // You can customize the DayPicker here with additional props
          />
        </div>
      )}
    </div>
  );
};

export default UnifiedDatePicker;
