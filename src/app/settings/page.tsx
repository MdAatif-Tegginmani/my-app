"use client";
import Link from "next/link";
import { FaUser, FaClock, FaKey, FaHistory } from "react-icons/fa";

const settingsLinks = [
  {
    href: "/settings/profile",
    label: "Profile",
    icon: FaUser,
    description: "Manage your personal information and profile settings",
  },
  {
    href: "/settings/timezone",
    label: "Timezone",
    icon: FaClock,
    description: "Configure your timezone and time display preferences",
  },
  {
    href: "/settings/password",
    label: "Password",
    icon: FaKey,
    description: "Change your password and security settings",
  },
  {
    href: "/settings/session-history",
    label: "Session History",
    icon: FaHistory,
    description: "View your login history and manage active sessions",
  },
];

export default function SettingsPage() {
  return (
    <div className= "p-6">
      <h1 className="text-2xl font-semibold mb-8">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-purple-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <Icon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {link.label}
                  </h3>
                  <p className="text-gray-600">{link.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 