"use client";
import { useState, useEffect } from "react";
import timezonesData from "./timezones.json"; // Import the timezones from JSON
import BackButton from "../../components/BackButton";

const timezones = timezonesData.timezones; // Use the timezones from the JSON

export default function TimezoneSettings() {
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const [timeFormat, setTimeFormat] = useState("24h");
  const [currentTime, setCurrentTime] = useState("");

  // Update time every 30 seconds instead of every second
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: selectedTimezone,
          hour12: timeFormat === "12h",
        })
      );
    };

    // Update immediately
    updateTime();

    // Then update every 30 seconds
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [selectedTimezone, timeFormat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle timezone update
  };

  return (
    <>
    <div className="mb-4">
            <BackButton />
          </div>
    <div className="w-full max-w-md p-16">
      <h2 className="text-2xl font-semibold mb-6">Timezone Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Timezone
          </label>
          <select
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {timezones.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Format
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="24h"
                checked={timeFormat === "24h"}
                onChange={(e) => setTimeFormat(e.target.value)}
                className="mr-2"
              />
              24-hour
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="12h"
                checked={timeFormat === "12h"}
                onChange={(e) => setTimeFormat(e.target.value)}
                className="mr-2"
              />
              12-hour
            </label>
          </div>
        </div>

        {currentTime && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Current time in {selectedTimezone}:{" "}
              <span className="font-medium">{currentTime}</span>
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#622BD9] bg-opacity-80 text-white rounded-lg hover:bg-purple-500 focus:outline-none focus:ring-1 "
        >
          Save Changes
        </button>
      </form>
    </div>
    </>
  );
}
