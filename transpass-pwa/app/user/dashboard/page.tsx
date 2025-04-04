"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { TopNav, BottomNav } from "../../../components/ui/Navigation";
import AuthProtection from "../../../components/AuthProtection";
import { useAuth } from "../../../lib/AuthContext";
import { signOut } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import { getUserScanHistory, ScanHistoryRecord } from "../../../lib/products";
import { Menu, User, Settings, Scan } from "lucide-react";
import Image from "next/image";
import { ProductCard } from "../../../components/ui/ProductCard";
import { ScanCard } from "../../../components/ui/ScanCard";

export default function UserDashboard() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistoryRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchScanHistory = async () => {
      if (!user) return;

      try {
        setHistoryLoading(true);
        const history = await getUserScanHistory(user.uid);
        setScanHistory(history);
      } catch (err) {
        console.error("Error fetching scan history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchScanHistory();
  }, [user]);

  // Function to format time ago
  function formatTimeAgo(date: Date) {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }

    const months = Math.floor(days / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }

  // Get recent scans (last 7 days)
  const recentScans = scanHistory.filter((item) => {
    const date = item.scannedAt?.toDate
      ? item.scannedAt.toDate()
      : new Date(item.scannedAt);
    return date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  });

  return (
    <AuthProtection userOnly>
      <div className="min-h-screen bg-primary-lightest pb-20 p-2">
        <div className="mx-auto max-w-[600px]">
          <Image
            src="/logo-bg.png"
            alt="logo background"
            width={1000}
            height={1000}
            className="absolute top-0 left-0 z-0"
          />

          {/* Mobile header */}
          <div className=" p-4 mt-4 relative">
            <Settings
              className="cursor-pointer  ml-auto"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />

            {mobileMenuOpen && (
              <div className="bg-white shadow-md py-2 px-4 absolute right-4 mt-2 z-50 rounded-md">
                <Link
                  href="/user/profile"
                  className="block py-2 text-sm text-gray-dark"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block py-2 text-sm text-red-600 w-full text-left"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing out..." : "Sign out"}
                </button>
              </div>
            )}
          </div>

          <main className="py-4 md:py-10 px-4">
            {/* User greeting with avatar */}
            <div className="flex items-center my-8 mb-12 z-10 relative">
              <div className="h-20 w-20 rounded-full bg-primary-light flex items-center justify-center text-white font-medium text-2xl shadow-md">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="ml-4">
                <p className="text-gray text-lg">Hello,</p>
                <p className="text-gray-dark font-semibold text-2xl">
                  {user?.displayName || user?.email?.split("@")[0] || "User"}
                </p>
              </div>
            </div>

            {/* Scan a product button with icon */}
            <Link href="/scan">
              <Button className="z-10 relative w-full my-8 mb-12 flex items-center justify-center">
                <Image
                  src="/scan.svg"
                  alt="Scan"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Scan a product
              </Button>
            </Link>

            {/* My Scans Section - Updated with ScanCard */}
            {!historyLoading && scanHistory.length > 0 && (
              <div className="mb-8 z-10 relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="inline">My Scans</p>
                    <span className="text-gray text-sm ml-2">
                      ({scanHistory.length})
                    </span>
                  </div>

                  <Link
                    href="/user/history"
                    className="text-sm text-primary font-medium"
                  >
                    View all
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {scanHistory.slice(0, 4).map((scan) => (
                    <ScanCard
                      key={scan.id}
                      scan={scan}
                      formatTimeAgo={formatTimeAgo}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="max-w-7xl mx-auto">
              {/* Stats - Circular Design with Primary Background */}
              <div className="mt-12 grid grid-cols-1 gap-6 relative z-10 ">
                {/* Total Scans */}
                <div className="bg-primary rounded-3xl overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg">
                  <div className="p-6 flex items-center">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mr-4 shadow-sm">
                      <svg
                        className="h-8 w-8 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white opacity-90">
                        Total Scans
                      </h3>
                      <div className="mt-1 text-3xl font-semibold text-white">
                        {historyLoading ? (
                          <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          scanHistory.length
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-primary-dark">
                    <Link
                      href="/user/history"
                      className="text-sm font-medium text-white flex items-center"
                    >
                      View scan history
                    </Link>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-primary rounded-3xl overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg">
                  <div className="p-6 flex items-center">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mr-4 shadow-sm">
                      <svg
                        className="h-8 w-8 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20v-6M6 20V10M18 20V4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white opacity-90">
                        Recent Activity
                      </h3>
                      <div className="mt-1 text-3xl font-semibold text-white">
                        {historyLoading ? (
                          <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          recentScans.length
                        )}
                      </div>
                      <div className="mt-1 flex items-center text-xs text-white opacity-90">
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Last 7 days</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-primary-dark">
                    <Link
                      href="/scan"
                      className="text-sm font-medium text-white flex items-center"
                    >
                      Scan a product
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Bottom Navigation - Mobile only */}
          <div>
            <BottomNav userType="consumer" />
          </div>
        </div>
      </div>
    </AuthProtection>
  );
}
