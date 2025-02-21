import axios from "axios";

const API_BASE_URL = "https://b264-2409-40f2-204e-968a-c5bf-78b4-53ee-9fb7.ngrok-free.app/auth";
// ";

interface ServerError {
  message?: string;
  error?: string;
}

interface TokenObject {
  access_token?: string;
  token?:
    | string
    | {
        access_token?: string;
        token?: string;
      };
}

export interface AuthResponse {
  token?: string | TokenObject;
  access_token?: string;
  message?: string;
  error?: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  error?: string;
}

export type SignInResponse = AuthResponse | ServerError;

export type OAuthProvider = "google" | "microsoft";

export const authService = {
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        email,
        password,
      });

      console.log("Signup success response:", response.data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Signup error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        return {
          error:
            error.response?.data?.message || "Signup failed. Please try again.",
        };
      }
      return { error: "An unexpected error occurred" };
    }
  },

  async signIn(email: string, password: string): Promise<SignInResponse> {
    try {
      console.log("Attempting to sign in with email:", email);
      const response = await axios.post(`${API_BASE_URL}/signin`, {
        email,
        password,
      });

      console.log("Sign in response:", response.data);

      const data = response.data as AuthResponse;
      // Check for either token or access_token in the response
      const token = data.token || data.access_token;

      if (!token) {
        console.error("No token received in response:", response.data);
        return { error: "Invalid response from server" };
      }

      
      // Store the token immediately upon successful sign in
      this.setAuthToken(token);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const serverError: ServerError = {
          message: error.response?.data?.message,
          error: error.response?.data?.error,
        };
        console.error("Signin error details:", serverError);
        return serverError;
      } else if (error instanceof Error) {
        console.error("Unexpected error:", error.message);
        return { error: "An unexpected error occurred" };
      }
      return { error: "An unexpected error occurred" };
    }
  },

  generateOAuthState(provider: OAuthProvider): string {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem(`oauth_state_${provider}`, state);
    return state;
  },

  async googleSignIn(): Promise<AuthResponse> {
    try {
      console.log("Starting Google sign-in process");

      // Store the current path for redirect after authentication
      const currentPath = window.location.pathname;
      console.log("Storing current path for later:", currentPath);
      localStorage.setItem("auth_referrer", currentPath);

      // Set up the callback URL - use the current origin
      const redirectUri = `${window.location.origin}/auth/callback?provider=google`;
      console.log("Setting redirect URI:", redirectUri);

      // Generate state for CSRF protection
      const state = this.generateOAuthState("google");
      console.log("Generated OAuth state:", state);

      // Store the redirect URI for validation
      localStorage.setItem("oauth_redirect_uri", redirectUri);

      // Construct and log the full auth URL
      const authUrl = `${API_BASE_URL}/google?redirect_uri=${encodeURIComponent(
        redirectUri
      )}&state=${state}`;
      console.log("Redirecting to auth URL:", authUrl);

      window.location.href = authUrl;
      return { token: "placeholder" };
    } catch (error) {
      console.error("Error initiating Google sign-in:", error);
      throw error;
    }
  },

  async microsoftSignIn(): Promise<AuthResponse> {
    try {
      // Store the current path for redirect after authentication
      localStorage.setItem("auth_referrer", window.location.pathname);

      // Use a dedicated Microsoft callback endpoint
      const redirectUri = `${window.location.origin}/auth/callback?provider=microsoft`;
      console.log("Microsoft auth redirect URI:", redirectUri);

      // Generate state for CSRF protection
      const state = this.generateOAuthState("microsoft");

      // Store the redirect URI for validation
      localStorage.setItem("oauth_redirect_uri", redirectUri);

      // Redirect to backend's Microsoft auth endpoint
      const authUrl = `${API_BASE_URL}/microsoft?redirect_uri=${encodeURIComponent(
        redirectUri
      )}&state=${state}`;
      console.log("Redirecting to Microsoft auth URL:", authUrl);

      window.location.href = authUrl;
      return { token: "placeholder" };
    } catch (error) {
      console.error("Error initiating Microsoft sign-in:", error);
      throw error;
    }
  },

  async handleOAuthCallback(
    code: string,
    provider: OAuthProvider,
    state?: string
  ): Promise<AuthResponse> {
    try {
      // Verify state if provided
      if (state) {
        const savedState = localStorage.getItem(`oauth_state_${provider}`);
        console.log("State verification:", {
          received: state,
          saved: savedState,
        });
        if (!savedState || state !== savedState) {
          throw new Error("Invalid state parameter");
        }
        localStorage.removeItem(`oauth_state_${provider}`);
      }

      // Get the stored redirect URI
      const redirectUri = localStorage.getItem("oauth_redirect_uri");
      console.log("Stored redirect URI:", redirectUri);
      if (!redirectUri) {
        throw new Error("Missing redirect URI");
      }
      localStorage.removeItem("oauth_redirect_uri");

      // Exchange the code for tokens
      console.log("Making callback request with:", { code, redirectUri });
      const response = await axios.post(
        `${API_BASE_URL}/${provider}-callback`,
        {
          code,
          redirect_uri: redirectUri,
        }
      );

      console.log("Callback response:", response.data);

      // Directly use the response data as the token
      if (response.data) {
        this.setAuthToken(response.data);
        return { token: response.data };
      }

      throw new Error("Empty response from server");
    } catch (error) {
      console.error(`${provider} authentication error:`, error);
      if (axios.isAxiosError(error)) {
        console.error("Full error response:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });
        return {
          error:
            error.response?.data?.message ||
            `${provider} authentication failed`,
        };
      }
      return { error: "An unexpected error occurred" };
    }
  },

  async handleGoogleCallback(code: string): Promise<AuthResponse> {
    const state = localStorage.getItem("oauth_state_google");
    return this.handleOAuthCallback(code, "google", state || undefined);
  },

  async handleMicrosoftCallback(code: string): Promise<AuthResponse> {
    return this.handleOAuthCallback(code, "microsoft");
  },

  setAuthToken(token: string | TokenObject): void {
    let tokenString: string | undefined;

    console.log("Setting auth token:", token);

    if (typeof token === "string") {
      // Handle the case where we get "[object Object]"
      if (token === "[object Object]") {
        console.error(
          "Received stringified object notation instead of actual object"
        );
        throw new Error(
          "Invalid token format: received [object Object] string"
        );
      }
      tokenString = token;
    } else if (token && typeof token === "object") {
      // Try to extract token from object
      tokenString = token.access_token || token.token;

      // If token is nested one level deeper
      if (!tokenString && token.token && typeof token.token === "object") {
        tokenString = token.token.access_token || token.token.token;
      }
    }

    if (!tokenString) {
      console.error("Invalid token format:", token);
      throw new Error("Invalid token format: could not extract token string");
    }

    console.log("Using token string:", tokenString);
    localStorage.setItem("auth_token", tokenString);
    // Also set it as the default Authorization header for future requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${tokenString}`;
  },

  getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  },

  removeAuthToken(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    // Remove the Authorization header
    delete axios.defaults.headers.common["Authorization"];
  },

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token;
  },

  async requestOTP(email: string): Promise<OTPResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/request-otp`, {
        email,
      });

      return {
        success: true,
        message: response.data.message || "OTP sent successfully",
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          message: error.response.data.message || "Failed to send OTP",
          error: error.response.data.error,
        };
      }
      return {
        success: false,
        message: "An unexpected error occurred",
        error: "Failed to send OTP",
      };
    }
  },

  async verifyOTP(email: string, otp: string): Promise<SignInResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        email,
        otp,
      });

      const data = response.data as AuthResponse;
      const token = data.token || data.access_token;

      if (!token) {
        console.error("No token received in response:", response.data);
        return { error: "Invalid response from server" };
      }

      this.setAuthToken(token);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          error: error.response.data.message || "Invalid OTP",
        };
      }
      return { error: "An unexpected error occurred" };
    }
  },
};
