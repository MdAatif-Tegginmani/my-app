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
  const [inputValue, setInputValue] = useState<string>("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [calendarPosition, setCalendarPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const maxDate = moment().add(6, "months").toDate();

  useEffect(() => {
    if (selectedDate) {
      setInputValue(moment(selectedDate).format("DD/MM/YYYY"));
    } else {
      setInputValue("");
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
      onChange(parsedDate);
    } else {
      onChange(undefined);
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

  const handleCalendarToggle = (event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setCalendarPosition({ top: rect.bottom, left: rect.left });
    setShowCalendar((prev) => !prev);
  };

  return (
    <div className="relative group w-full h-full ">
      <div
        className="p-2 rounded cursor-pointer w-full h-full flex justify-center items-center"
        onClick={handleCalendarToggle}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      >
        <div className="text-center  ">
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
      {showCalendar && calendarPosition && (
        <div
          className="fixed z-50 bg-white border rounded w-74 shadow-lg p-2 mt-1 dark:bg-gray-800 dark:border-[#474a66] dark:text-[#c0c3cd]"
          style={{ top: calendarPosition.top, left: calendarPosition.left }}
        >
          <button
            onClick={handleTodayClick}
            className="border border-gray-300 dark:border-[#474a66] rounded-md px-2 py-1 text-sm"
          >
            Today
          </button>
          <button
            onClick={() => setShowTimePicker((prev) => !prev)}
            className="ml-2 absolute right-6 top-4"
          >
            <Clock size={16} />
          </button>
          <div className="flex flex-row mt-2 border border-gray-300 dark:bg-gray-800 dark:border-[#474a66] dark:text-[#c0c3cd]  rounded-sm">
            <input
              style={{ fontSize: "inherit" }}
              id={inputId}
              type="text"
              className="bg-transparent w-full p-2 rounded-sm text-center placeholder:text-center"
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
            captionLayout="dropdown"
            selected={selectedDate}
            onSelect={handleDateChange}
            className="date-picker custom-day-picker"
            disabled={{ after: maxDate }}
          />
        </div>
      )}
    </div>
  );
};

export default UnifiedDatePicker;
