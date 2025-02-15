"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/app/services/auth";

export default function MicrosoftCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("Starting Microsoft callback handler");
        console.log("Current URL:", window.location.href);

        // Clear any existing tokens first for security
        authService.removeAuthToken();

        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (error) {
          console.error("Microsoft OAuth error:", error);
          console.error("Error description:", errorDescription);
          throw new Error(errorDescription || error);
        }

        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code) {
          console.error("No authorization code received");
          console.error("Search params:", window.location.search);
          throw new Error("No authorization code received");
        }

        console.log("Processing Microsoft OAuth callback");
        console.log("Parameters received:", {
          code: code.substring(0, 10) + "...", // Only log part of the code for security
          state: state ? "present" : "missing",
        });

        // Process the OAuth callback
        const response = await authService.handleOAuthCallback(
          code,
          "microsoft",
          state || undefined
        );

        if (response.error) {
          console.error("Microsoft OAuth callback error:", response.error);
          throw new Error(response.error);
        }

        // Clear URL parameters for security
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        // Get the stored redirect path or default to home
        const redirectPath = localStorage.getItem("auth_referrer") || "/";
        console.log("Redirecting to:", redirectPath);
        localStorage.removeItem("auth_referrer");

        // Use replace instead of push to prevent back button from showing the callback URL
        router.replace(redirectPath);
      } catch (error) {
        console.error("Microsoft authentication error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Authentication failed";
        router.replace(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Completing Microsoft Sign In
        </h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}
