"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../../components/ui/Button";
import { signIn, resetPassword, getUserData } from "../../../lib/auth";
import { auth } from "../../../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if there's a returnUrl in the query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get("returnUrl");

      if (returnUrl) {
        // Redirect to the original page the user was trying to access
        router.push(returnUrl);
      } else {
        // Default redirect based on user type
        if (result.user) {
          // Get user data to determine if company or regular user
          const userDoc = await getUserData(result.user);
          if (userDoc && userDoc.isCompany) {
            router.push("/company/dashboard");
          } else {
            router.push("/user/dashboard");
          }
        } else {
          router.push("/company/dashboard"); // Fallback
        }
      }
    } catch (err: any) {
      console.error("Google sign-in error:", err);

      // Handle specific Firebase auth errors for Google sign-in
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError(
          "Pop-up was blocked by your browser. Please allow pop-ups for this site."
        );
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError(
          "An account already exists with the same email address but different sign-in credentials. Try signing in using a different method."
        );
      } else if (err.code === "auth/user-disabled") {
        setError(
          "This account has been disabled. Please contact support for assistance."
        );
      } else {
        // Generic error message for other errors
        setError(
          err.message || "Failed to sign in with Google. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn(email, password, remember);

      // Check if there's a returnUrl in the query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get("returnUrl");

      if (returnUrl) {
        // Redirect to the original page the user was trying to access
        router.push(returnUrl);
      } else {
        // Default redirect based on user type
        if (result.user) {
          // Get user data to determine if company or regular user
          const userDoc = await getUserData(result.user);
          if (userDoc && userDoc.isCompany) {
            router.push("/company/dashboard");
          } else {
            router.push("/user/dashboard");
          }
        } else {
          router.push("/company/dashboard"); // Fallback
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);

      // Handle specific Firebase auth errors
      if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError(
          "Too many unsuccessful login attempts. Please try again later or reset your password."
        );
      } else if (err.code === "auth/user-disabled") {
        setError(
          "This account has been disabled. Please contact support for assistance."
        );
      } else {
        // Generic error message for other errors
        setError(err.message || "Failed to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setIsResetSent(true);
      setError("");
    } catch (err: any) {
      console.error("Password reset error:", err);

      // Detailed logging to help debug the issue
      console.log("Password reset error details:", {
        code: err.code,
        message: err.message,
        fullError: err,
      });

      // Handle specific Firebase auth errors for password reset
      if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/user-not-found") {
        // For security reasons, we still show success message even if email doesn't exist
        setIsResetSent(true);
        setError("");
      } else if (
        err.code === "auth/invalid-api-key" ||
        err.code === "auth/api-key-expired"
      ) {
        setError(
          "There is an issue with the authentication service. Please contact support."
        );
      } else if (err.code === "auth/network-request-failed") {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        setError(
          err.message ||
            "Failed to send password reset email. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-12 md:px-0 ">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center justify-center mb-4">
          <Image
            src="/logo.svg"
            alt="Transpass"
            width={80}
            height={80}
            className="cursor-pointer"
            onClick={() => router.push("/")}
          />
          <h2 className="text-3xl mt-2 font-bold text-primary">TransPass</h2>
          <h3 className="text-xl mt-6 mb-2 font-medium text-center text-gray-dark">
            Welcome Back
          </h3>
          <p className="text-sm text-gray-400 text-center max-w-xs mt-2 mb-6">
            Sign in to your account to continue your journey with TransPass
          </p>
        </div>

        <div className="mt-4">
          <div>
            {/* Google Sign In Button */}

            {isResetSent ? (
              <div className="rounded-md bg-green-50 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Password reset email sent! Check your inbox for further
                      instructions.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-dark"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400  focus:border-primary focus:outline-none focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-dark"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400  focus:border-primary focus:outline-none focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-500"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="font-medium text-primary hover:text-primary-dark"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              <div className="mb-8">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex justify-center items-center border-gray-200 py-3"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg
                    className="mr-3 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-400">
                    or continue with email
                  </span>
                </div>
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-primary hover:text-primary-dark"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
