"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  useEffect(() => {
    redirect("/settings/profile");
  }, []);

  return null; // Return null or a loading indicator if needed
}
