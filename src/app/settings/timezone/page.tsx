"use client";
import { useState } from "react";

const timezones = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Asia/Tokyo",
  "Asia/Dubai",
  "Australia/Sydney",
  // Add more timezones as needed
];

export default function TimezoneSettings() {
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const [timeFormat, setTimeFormat] = useState("24h");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle timezone update
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Timezone Settings</h2>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
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

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Current time in {selectedTimezone}:{" "}
            <span className="font-medium">
              {new Date().toLocaleTimeString("en-US", {
                timeZone: selectedTimezone,
                hour12: timeFormat === "12h",
              })}
            </span>
          </p>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
