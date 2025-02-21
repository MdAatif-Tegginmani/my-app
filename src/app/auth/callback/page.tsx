"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/app/services/auth";
import axios from "axios";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("Starting callback handler");
        console.log("Current URL:", window.location.href);

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const error = urlParams.get("error");

        console.log("URL Parameters:", {
          token: token ? "present" : "missing",
          error: error || "none",
        });

        if (error) {
          console.error("OAuth error received:", error);
          throw new Error(`OAuth error: ${error}`);
        }

        // Handle token flow
        if (token) {
          try {
            console.log("Token received:", token);

            // Handle [object Object] case
            if (
              token === "[object Object]" ||
              token.includes("%5Bobject%20Object%5D")
            ) {
              console.log(
                "Detected object token, attempting to parse from URL parameters"
              );

              try {
                // Try to get the raw token data from the URL
                const rawToken = decodeURIComponent(token);
                console.log("Decoded token:", rawToken);

                // Store the token properly
                authService.setAuthToken(rawToken);

                const redirectPath = "/"; // Force redirect to home
                console.log("Redirecting to:", redirectPath);
                router.replace(redirectPath);
                return;
              } catch (parseError) {
                console.log("Could not parse token:", parseError);
                throw new Error("Invalid token format received");
              }
            }

            // For proper string tokens
            authService.setAuthToken(token);
            // Set the Authorization header for future requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            const redirectPath = "/"; // Always redirect to home on successful token
            console.log("Token stored, redirecting to:", redirectPath);
            localStorage.removeItem("auth_referrer"); // Clean up
            router.replace(redirectPath);
            return;
          } catch (error) {
            console.error("Error storing token:", error);
            throw new Error("Failed to process authentication token");
          }
        }

        // If no token, handle code flow
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        const provider = urlParams.get("provider") || "google";

        if (!code) {
          console.error("No code or token received in callback");
          console.error("Search params:", window.location.search);
          throw new Error("No authorization data received");
        }

        console.log("Handling authorization code flow");
        console.log("Calling handleOAuthCallback with:", {
          code: code.substring(0, 10) + "...", // Only log part of the code for security
          provider,
          state: state ? "present" : "missing",
        });

        const response = await authService.handleOAuthCallback(
          code,
          provider as "google" | "microsoft",
          state || undefined
        );

        if (response.error) {
          console.error("OAuth callback returned error:", response.error);
          throw new Error(response.error);
        }

        const redirectPath = "/"; // Always redirect to home on success
        console.log("Authentication successful, redirecting to:", redirectPath);
        localStorage.removeItem("auth_referrer"); // Clean up
        router.replace(redirectPath);
      } catch (error) {
        console.error("Full error details:", error);
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
