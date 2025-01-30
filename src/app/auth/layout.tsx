"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-start py-12 justify-center bg-gray-50">
      {children}
    </div>
  );
}
