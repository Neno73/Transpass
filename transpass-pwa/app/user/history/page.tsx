"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import AuthProtection from "../../../components/AuthProtection";
import { useAuth } from "../../../lib/AuthContext";
import { getUserScanHistory, ScanHistoryRecord } from "../../../lib/products";
import { BottomNav } from "../../../components/ui/Navigation";
import { ArrowLeft, Clock, Search } from "lucide-react";
import { ScanCard } from "../../../components/ui/ScanCard";
import Link from "next/link";
import Image from "next/image";

export default function ScanHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [scanHistory, setScanHistory] = useState<ScanHistoryRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ScanHistoryRecord[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScanHistory = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const history = await getUserScanHistory(user.uid);
        setScanHistory(history);
        setFilteredHistory(history);
      } catch (err) {
        console.error("Error fetching scan history:", err);
        setError("Failed to load scan history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchScanHistory();
  }, [user]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHistory(scanHistory);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = scanHistory.filter(
      (scan) =>
        scan.productName?.toLowerCase().includes(query) ||
        scan.manufacturer?.toLowerCase().includes(query) ||
        scan.model?.toLowerCase().includes(query)
    );
    setFilteredHistory(filtered);
  }, [searchQuery, scanHistory]);

  // Format time ago function
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  };

  return (
    <AuthProtection userOnly>
      <div className="min-h-screen bg-primary-lightest pb-20 mx-auto max-w-2xl relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Image
            src="/logo-icon.svg"
            alt="Decorative logo"
            width={300}
            height={300}
          />
        </div>
        <div className="absolute bottom-20 -left-20 opacity-10 pointer-events-none rotate-45">
          <Image
            src="/logo-icon.svg"
            alt="Decorative logo"
            width={200}
            height={200}
          />
        </div>
        <div className="absolute top-1/3 -left-10 opacity-5 pointer-events-none">
          <Image
            src="/logo-icon.svg"
            alt="Decorative logo"
            width={150}
            height={150}
          />
        </div>

        {/* Header */}
        <header>
          <div className="max-w-4xl mx-auto px-4 pt-3">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center justify-center">
              <div className="bg-white p-4 mt-4 px-6 rounded-full w-full text-center">
                <h1 className="text-background-dark font-medium">
                  My Scans {scanHistory.length > 0 && `(${scanHistory.length})`}
                </h1>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 max-w-4xl mx-auto w-full relative z-10">
          {/* Search field */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray" />
              </div>
              <input
                type="text"
                placeholder="Search scans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchQuery("")}
                >
                  <span className="text-gray hover:text-gray-dark">✕</span>
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
              <p className="mt-4 text-gray">Loading scan history...</p>
            </div>
          ) : (
            <div>
              {scanHistory.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Clock size={18} className="text-gray mr-2" />
                      <h2 className="text-lg font-medium text-gray-dark">
                        Recent Scans
                      </h2>
                    </div>
                    {filteredHistory.length !== scanHistory.length && (
                      <span className="text-sm text-gray">
                        Showing {filteredHistory.length} of {scanHistory.length}
                      </span>
                    )}
                  </div>

                  {filteredHistory.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {filteredHistory.map((scan) => (
                        <ScanCard
                          key={scan.id}
                          scan={scan}
                          formatTimeAgo={formatTimeAgo}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden p-6 text-center">
                      <p className="text-gray">No results match your search.</p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-2 text-primary hover:underline"
                      >
                        Clear search
                      </button>
                    </div>
                  )}

                  <div className="mt-8 text-center">
                    <Link href="/scan">
                      <Button>Scan Another Product</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary-lightest rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock size={24} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-dark mb-2">
                      No scan history
                    </h3>
                    <p className="text-gray mb-6">
                      You haven&apos;t scanned any products yet.
                    </p>
                    <Link href="/scan">
                      <Button>Scan Your First Product</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <BottomNav userType="consumer" />
        </div>
      </div>
    </AuthProtection>
  );
}
