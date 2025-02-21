"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/app/services/auth";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("Starting Google callback handler");
        console.log("Current URL:", window.location.href);

        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");
        const token = searchParams.get("token");

        if (error) {
          throw new Error(errorDescription || error);
        }

        // If we received a token directly in the URL
        if (token) {
          try {
            const tokenData = JSON.parse(decodeURIComponent(token));
            authService.setAuthToken(tokenData);
            const redirectPath = localStorage.getItem("auth_referrer") || "/";
            localStorage.removeItem("auth_referrer");
            router.replace(redirectPath);
            return;
          } catch (e) {
            console.error("Error parsing token from URL:", e);
            // Continue with code flow if token parsing fails
          }
        }

        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code) {
          throw new Error("No authorization code received");
        }

        if (!state) {
          throw new Error("No state parameter received");
        }

        // Process the OAuth callback and get response
        const response = await authService.handleOAuthCallback(
          code,
          "google",
          state
        );

        if (response.error) {
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
        console.log("redirectPath", redirectPath);
        localStorage.removeItem("auth_referrer");

        // Use replace instead of push to prevent back button from showing the callback URL
        router.replace(redirectPath);
      } catch (error) {
        console.error("Google authentication error:", error);
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
        <h2 className="text-2xl font-semibold mb-4">Completing Sign In</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}
