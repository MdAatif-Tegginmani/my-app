"use client";
import { useState } from "react";
import { FaDesktop, FaMobile, FaTablet } from "react-icons/fa";
import BackButton from "../../components/BackButton";


// Mock data for demonstration
const mockSessions = [
  {
    id: 1,
    device: "Desktop",
    browser: "Chrome",
    ip: "192.168.1.1",
    location: "New York, US",
    lastActive: "2024-03-20T10:30:00",
    isCurrentSession: true,
  },
  {
    id: 2,
    device: "Mobile",
    browser: "Safari",
    ip: "192.168.1.2",
    location: "London, UK",
    lastActive: "2024-03-19T15:45:00",
    isCurrentSession: false,
  },
  // Add more sessions as needed
];

export default function SessionHistory() {
  const [sessions, setSessions] = useState(mockSessions);

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "desktop":
        return <FaDesktop className="w-5 h-5" />;
      case "mobile":
        return <FaMobile className="w-5 h-5" />;
      case "tablet":
        return <FaTablet className="w-5 h-5" />;
      default:
        return <FaDesktop className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleTerminateSession = (sessionId: number) => {
    setSessions(sessions.filter((session) => session.id !== sessionId));
  };

  return (
    <>
    <div className="mb-4">
            <BackButton />
          </div>
<div className="flex items-start max-h-screen pt-24 pl-36">
  <div className="w-full max-w-2xl bg-white dark:bg-gray-800 flex flex-col items-center rounded-xl py-16 shadow-md">
    <h2 className="text-2xl font-semibold mb-6 dark:text-white">Session History</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4 dark:text-gray-300">Active Sessions</h3>
          <div className="space-y-4  ">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-100 dark:border-[#474a66]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-gray-600 dark:text-gray-300 ">
                      {getDeviceIcon(session.device)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {session.browser} on {session.device}
                        {session.isCurrentSession && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Current Session
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {session.ip} • {session.location}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Last active: {formatDate(session.lastActive)}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrentSession && (
                    <button
                      onClick={() => handleTerminateSession(session.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Terminate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 dark:text-gray-300  ">Login History</h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden dark:bg-gray-800 dark:border-[#474a66]">
            <table className="min-w-full divide-y divide-gray-200 dark:bg-gray-800 dark:border-[#474a66]">
              <thead className="bg-gray-50 dark:bg-gray-800 dark:text-gray-100" >
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-[#474a66] dark:divide-[#474a66] ">
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900  dark:text-gray-300">
                      {formatDate(session.lastActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {session.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {session.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {session.browser} on {session.device}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}
