"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../../components/ui/Button";
import { registerUser, getUserData } from "../../../lib/auth";
import { auth } from "../../../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [isCompany, setIsCompany] = useState(true);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    setIsLoading(true);

    try {
      // Register the user
      const userCredential = await registerUser(
        email,
        password,
        name,
        isCompany ? companyName : undefined,
        isCompany
      );

      // Check if there's a returnUrl in the query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get("returnUrl");

      if (returnUrl) {
        // Redirect to the original page the user was trying to access
        router.push(returnUrl);
      } else {
        // Redirect to dashboard based on user type
        router.push(isCompany ? "/company/dashboard" : "/user/dashboard");
      }

      // Show success message (optional) - can be implemented with a toast notification
    } catch (err: any) {
      console.error("Registration error:", err);

      // Handle specific Firebase auth errors
      if (err.code === "auth/email-already-in-use") {
        setError(
          "This email is already registered. Please log in or use a different email address."
        );
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        // Generic error message for other errors
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center mb-4">
        <Image src="/logo.svg" alt="Transpass" width={80} height={80} />
        <h2 className="text-3xl mt-2 font-bold text-primary">TransPass</h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10">
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
                or register with email
              </span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="userType"
                className="block text-sm font-medium text-gray-dark"
              >
                I am registering as:
              </label>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setIsCompany(true)}
                  className={`${
                    isCompany
                      ? "bg-primary-lightest text-primary border-primary"
                      : "bg-white text-gray border-gray-300"
                  } hover:bg-primary-light hover:text-white font-medium py-2 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  A Company
                </button>
                <button
                  type="button"
                  onClick={() => setIsCompany(false)}
                  className={`${
                    !isCompany
                      ? "bg-primary-lightest text-primary border-primary"
                      : "bg-white text-gray border-gray-300"
                  } hover:bg-primary-light hover:text-white font-medium py-2 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  A User
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-dark"
              >
                Full name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-primary"
                />
              </div>
            </div>

            {isCompany && (
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-dark"
                >
                  Company name
                </label>
                <div className="mt-2">
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    autoComplete="organization"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-primary"
                  />
                </div>
              </div>
            )}

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
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-primary"
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password-confirm"
                className="block text-sm font-medium text-gray-dark"
              >
                Confirm password
              </label>
              <div className="mt-2">
                <input
                  id="password-confirm"
                  name="password-confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-500"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full py-3"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
