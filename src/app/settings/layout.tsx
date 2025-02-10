"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaGlobe, FaKey, FaHistory } from "react-icons/fa";
import { ThemeToggle } from "../components/ThemeToggle";

const settingsLinks = [
  {
    href: "/settings/profile",
    label: "Personal info",
    icon: FaUser,
  },
  {
    href: "/settings/timezone",
    label: "Timezone",
    icon: FaGlobe,
  },
  {
    href: "/settings/password",
    label: "Password",
    icon: FaKey,
  },
  {
    href: "/settings/session-history",
    label: "Session history",
    icon: FaHistory,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Settings
          </h2>
        </div>
        <nav className="space-y-1">
          {settingsLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-6 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 ${
                    isActive
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
