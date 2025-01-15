"use client";
import { useState } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const previousMonthDays = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  ).getDate();

  const days = [];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      day: previousMonthDays - i,
      isCurrentMonth: false,
      isSelected: false,
    });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      isSelected: i === 15,
    });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isSelected: false,
    });
  }

  return (
    <div className="w-full">
      <h2 className="text-[#622BD9] opacity-80 text-xl font-semibold mb-4">
        Calendar
      </h2>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {/* Weekday headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center h-8 text-sm font-medium text-gray-600 flex items-center justify-center border-r border-b border-gray-200"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => (
            <div
              key={index}
              className={`
                relative h-8 text-center text-sm flex items-center justify-center
                ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                ${day.isSelected ? "bg-blue-100" : ""}
                hover:bg-gray-50 cursor-pointer
                border-r border-b border-gray-200
                ${(index + 1) % 7 === 0 ? "border-r-0" : ""}
                ${index >= 35 ? "border-b-0" : ""}
              `}
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day.day
                  )
                )
              }
            >
              {day.day}
              {day.isSelected && (
                <div className="absolute bottom-1 left-3 transform -translate-x-1/2">
                  <div className="w-3 h-3 text-white text-xs/[12px] bg-purple-600 rounded-full">
                    2
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
