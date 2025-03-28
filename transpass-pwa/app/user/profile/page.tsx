"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import AuthProtection from "../../../components/AuthProtection";
import { useAuth } from "../../../lib/AuthContext";
import { updateUserProfile } from "../../../lib/auth";
import { BottomNav } from "../../../components/ui/Navigation";
import { ArrowLeft, Check } from "lucide-react";

export default function UserProfilePage() {
  const { user, userData, refreshUserData } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
  });

  // Initialize form with user data when available
  useEffect(() => {
    if (userData) {
      setFormData({
        displayName: userData.displayName || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      await updateUserProfile(user, {
        displayName: formData.displayName,
        phone: formData.phone,
      });

      // Refresh user data to reflect changes
      await refreshUserData();
      setFormSubmitted(true);

      // Reset form submission status after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthProtection userOnly>
      <div className="min-h-screen bg-primary-lightest pb-20 mx-auto max-w-2xl">
        {/* Header */}
        <header>
          <div className="max-w-4xl mx-auto px-4 py-3">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center justify-center">
              <div className="bg-white p-4 px-6 rounded-full mr-4">
                <h1 className="text-background-dark font-medium truncate">
                  Your Profile
                </h1>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 max-w-4xl mx-auto w-full">
          {/* Success message */}
          {formSubmitted && (
            <div className="mb-6 rounded-xl bg-green-50 p-4 flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Check size={18} className="text-green-600" />
              </div>
              <p className="text-green-800 font-medium">
                Profile updated successfully
              </p>
            </div>
          )}

          {/* Profile form */}
          <div className="bg-white shadow-md rounded-2xl overflow-hidden">
            <div className="p-6 flex items-center border-b border-gray-100">
              <div className="w-16 h-16 bg-primary-lightest rounded-full flex items-center justify-center mr-4">
                <span className="text-primary text-2xl font-bold">
                  {userData?.displayName?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-dark">
                  {userData?.displayName || "User"}
                </h2>
                <p className="text-gray text-sm mt-1">
                  {userData?.email || "user@example.com"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-dark mb-1"
                  >
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    id="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-dark mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray focus:outline-none"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-dark mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </main>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <BottomNav userType="consumer" />
        </div>
      </div>
    </AuthProtection>
  );
}
