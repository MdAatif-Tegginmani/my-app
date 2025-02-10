"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-h-screen h-full w-full flex items-start py-12 justify-center bg-gray-50">
      {children}
    </div>
  );
}
