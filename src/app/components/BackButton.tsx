"use client";
import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show the back button on the home page
  if (pathname === "/") return null;

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label="Go back"
    >
      <ChevronLeft className="w-5 h-5 mr-1" />
      Back
    </button>
  );
};

export default BackButton;
