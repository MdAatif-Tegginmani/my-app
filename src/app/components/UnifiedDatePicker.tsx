import React, { useState, useEffect, useId } from "react";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import "react-day-picker/style.css";
import { CirclePlus, Calendar as CalendarIcon, Clock } from "lucide-react";

interface UnifiedDatePickerProps {
  selectedDate: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

const UnifiedDatePicker: React.FC<UnifiedDatePickerProps> = ({
  selectedDate,
  onChange,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const inputId = useId();
  const [inputValue, setInputValue] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    if (selectedDate) {
      setInputValue(moment(selectedDate).format("DD/MM/YYYY"));
    }
  }, [selectedDate]);

  const handleDateChange = (date: Date | undefined) => {
    onChange(date);
    setShowCalendar(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const parsedDate = moment(e.target.value, "DD/MM/YYYY", true).toDate();
    if (moment(parsedDate).isValid()) {
      handleDateChange(parsedDate);
    } else {
      handleDateChange(undefined);
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setInputValue(moment(today).format("DD/MM/YYYY"));
    handleDateChange(today);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  return (
    <div className="relative group w-full h-full ">
      <div
        className="p-2 rounded cursor-pointer w-full h-full flex justify-center items-center"
        onClick={() => setShowCalendar((prev) => !prev)}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      >
        <div className="text-center">
          {selectedDate ? moment(selectedDate).format("DD/MM/YYYY") : ""}
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity gap-1 ${
              inputFocused || selectedDate
                ? "opacity-0"
                : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <CirclePlus size={16} color="#3c41d3" className="text-gray-400" />
            <CalendarIcon size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
      {showCalendar && (
        <div className="absolute z-10 bg-white border rounded shadow-lg p-2 mt-1">
          <button onClick={handleTodayClick} className="border border-gray-300 rounded-md px-2 py-1">
            Today
          </button>
          <button onClick={() => setShowTimePicker((prev) => !prev)} className="ml-2 absolute right-6 top-4">
            <Clock size={16} />
          </button>
          <div className="flex flex-row mt-2 border border-gray-300 rounded-sm">
            <input
              style={{ fontSize: "inherit" }}
              id={inputId}
              type="text"
              value={inputValue}
              placeholder="DD/MM/YYYY"
              onChange={handleInputChange}
            />
            {showTimePicker && (
              <input
                type="time"
                value={selectedTime}
                onChange={handleTimeChange}
                className="ml-12"
              />
            )}
          </div>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
          />
        </div>
      )}
    </div>
  );
};

export default UnifiedDatePicker;
