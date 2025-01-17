"use client";
import { useState } from "react";
import { DateTime } from "luxon";
import { ChevronLeft , ChevronRight } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(DateTime.now());
  const today = DateTime.now();

  const daysInMonth = currentDate.daysInMonth;
  const firstDayOfMonth = currentDate.startOf("month").weekday;

  const previousMonth = currentDate.minus({ months: 1 });
  const previousMonthDays = previousMonth.daysInMonth;

  const days = [];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      day: previousMonthDays - i,
      isCurrentMonth: false,
      isSelected: false,
      date: previousMonth.set({ day: previousMonthDays - i }),
    });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      isSelected: i === currentDate.day,
      date: currentDate.set({ day: i }),
    });
  }

  const remainingDays = 42 - days.length;
  const nextMonth = currentDate.plus({ months: 1 });
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isSelected: false,
      date: nextMonth.set({ day: i }),
    });
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(currentDate.plus({ months: direction === "next" ? 1 : -1 }));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Calendar Header */}
        <div className="p-2 bg-gradient-to-r from-purple-500 to-[#865fdb] opacity-80 text-white">
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={() => navigateMonth("prev")}
              className="text-white hover:bg-white/10 rounded-full p-2 transition-colors"
            >
             <ChevronLeft />
            </button>
            <h2 className="text-white text-xl font-semibold">
              {currentDate.toFormat("MMMM yyyy")}
            </h2>
            <button
              onClick={() => navigateMonth("next")}
              className="text-white hover:bg-white/10 rounded-full p-2 transition-colors"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="p-2">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center py-2 text-sm font-medium text-gray-600"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isToday =
                day.isCurrentMonth &&
                day.date.hasSame(today, "day") &&
                day.date.hasSame(today, "month") &&
                day.date.hasSame(today, "year");

              return (
                <div
                  key={index}
                  className={`
                    relative h-12 pt-1 flex flex-col items-center justify-start 
                    rounded-lg transition-all duration-200
                    ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                    ${day.isSelected ? "bg-purple-100" : "hover:bg-gray-50"}
                    ${isToday ? "ring-2 ring-purple-500" : ""}
                  `}
                  onClick={() => setCurrentDate(day.date)}
                >
                  <span
                    className={`
                    text-sm font-medium
                    ${day.isSelected ? "text-purple-700" : ""}
                  `}
                  >
                    {day.day}
                  </span>

                  {/* Task indicator - hardcoded for the 15th */}
                  {day.day === 15 && (
                    <div className="absolute bottom-1 left-4 transform -translate-x-1/2">
                      <div className="w-4 h-4 bg-slate-600 flex items-center justify-center text-white text-xs/[10px] rounded-full">3</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
