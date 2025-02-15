"use client";
import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show the back button on the home page
  if (pathname === "/") return null;

  const handleBack = () => {
    // For footer pages (about, terms, privacy), redirect to appropriate auth page
    if (["/about", "/terms", "/privacy"].includes(pathname)) {
      // Get the referrer path from localStorage if it exists
      const referrer = localStorage.getItem("auth_referrer") || "/auth/login";
      router.push(referrer);
    } else {
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      aria-label="Go back"
    >
      <ChevronLeft className="w-5 h-5 mr-1" />
      Back
    </button>
  );
};

export default BackButton;
