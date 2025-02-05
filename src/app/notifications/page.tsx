"use client";
import { useState } from "react";
import { Bell, Check, Info, AlertTriangle, X } from "lucide-react";
import BackButton from "../components/BackButton";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  timestamp: string;
  isRead: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Schedule Update",
      message: "The schedule for McD int has been updated for next week.",
      type: "info",
      timestamp: "2 hours ago",
      isRead: false,
    },
    {
      id: 2,
      title: "Task Completed",
      message: "KFC int project milestone has been achieved successfully.",
      type: "success",
      timestamp: "5 hours ago",
      isRead: false,
    },
    {
      id: 3,
      title: "Attention Required",
      message: "Dom int project requires your immediate attention.",
      type: "warning",
      timestamp: "1 day ago",
      isRead: true,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "success":
        return <Check className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  return (
    <>
      <div className="m-4">
        <BackButton />
      </div>
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#f5f5f5]">Notifications</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-[#f5f5f5] ">
            {notifications.filter((n) => !n.isRead).length} unread

          </span>
          <button
            onClick={() =>
              setNotifications(
                notifications.map((n) => ({ ...n, isRead: true }))
              )
            }
            className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-600"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border dark:border-[#474a66] ${
              notification.isRead ? "bg-white dark:bg-gray-600 " : "bg-purple-50 dark:bg-gray-800 "
            }`}
          >
            <div className="flex items-start justify-between">

              <div className="flex items-start space-x-3">
                {getIcon(notification.type)}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-[#f5f5f5]">
                    {notification.title}
                  </h3>
                  <p className="text-gray-600 mt-1 dark:text-[#f5f5f5]">{notification.message}</p>
                  <span className="text-sm text-gray-500 mt-2 block dark:text-gray-100">

                    {notification.timestamp}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No notifications
            </h3>
            <p className="text-gray-500">
              You&#39;re all caught up! Check back later for new notifications.
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
