"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { TopNav, BottomNav } from "../../../components/ui/Navigation";
import AuthProtection from "../../../components/AuthProtection";
import { useAuth } from "../../../lib/AuthContext";
import { signOut } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import { getUserProducts, Product } from "../../../lib/products";
import { Menu, User, Settings } from "lucide-react";
import Image from "next/image";
import { ProductCard } from "../../../components/ui/ProductCard";

// Example recent activity data
const recentActivities = [
  {
    id: 1,
    type: "product_created",
    productName: "Carbon Fiber Bicycle Frame",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    type: "product_scanned",
    productName: "Aluminum Alloy Wheelset",
    date: new Date(Date.now() - 36 * 60 * 60 * 1000),
  },
  {
    id: 3,
    type: "component_added",
    productName: "Titanium Road Bike",
    componentName: "Brake System",
    date: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 4,
    type: "product_scanned",
    productName: "Carbon Fiber Bicycle Frame",
    date: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 5,
    type: "product_created",
    productName: "Mountain Bike Suspension Fork",
    date: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

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

export default function CompanyDashboard() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch user products
  useEffect(() => {
    const fetchProducts = async () => {
      if (user?.uid) {
        try {
          const fetchedProducts = await getUserProducts(user.uid);
          setProducts(fetchedProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [user]);

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

  return (
    <AuthProtection companyOnly>
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
          <div className="p-4 mt-4">
            <Settings
              className="cursor-pointer relative ml-auto"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />

            {mobileMenuOpen && (
              <div className="bg-white shadow-md py-2 px-4 absolute right-4 mt-2 z-50 rounded-md">
                <Link
                  href="/company/profile"
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
            {/* User greeting with avatar - BIGGER VERSION */}
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

            <Button className="z-10 relative w-full my-8 mb-12">
              Create product
            </Button>

            <div className="max-w-7xl mx-auto">
              {/* Recent products or Empty state */}
              <div className="mt-8 relative z-10">
                <div className="text-lg font-medium text-gray-dark mb-4 flex justify-between">
                  <p>
                    My Products{" "}
                    <span className="text-primary ml-1">
                      ({products.length})
                    </span>
                  </p>

                  <Link
                    href="/company/products"
                    className="text-primary text-right"
                  >
                    View all
                  </Link>
                </div>

                {loading ? (
                  <div className="py-12 px-6 flex justify-center">
                    <div className="w-12 h-12 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-2 gap-6 ">
                    {products.slice(0, 4).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        showStats={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white py-12 px-6 text-center rounded-lg shadow">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-dark">
                      No products yet
                    </h3>
                    <p className="mt-1 text-sm text-gray">
                      Get started by creating your first product.
                    </p>
                    <div className="mt-6">
                      <Link href="/company/products/create">
                        <Button size="sm" className="inline-flex items-center">
                          <svg
                            className="-ml-1 mr-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Create a product
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats - Circular Design with Primary Background */}
              <div className="mt-8 grid grid-cols-1 gap-6 relative z-10">
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
                      <p className="mt-1 text-3xl font-semibold text-white">
                        1,284
                      </p>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-primary-dark">
                    <Link
                      href="/company/analytics"
                      className="text-sm font-medium text-white flex items-center"
                    >
                      View analytics
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-primary rounded-3xl overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg">
                  <div className="p-6 flex items-center">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mr-4 shadow-sm">
                      <svg
                        className="h-8 w-8 text-blue-2"
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
                      <p className="mt-1 text-3xl font-semibold text-white">
                        {recentActivities.length}
                      </p>
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
                        <span>
                          Last activity{" "}
                          {formatTimeAgo(recentActivities[0]?.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-primary-dark">
                    <Link
                      href="/company/analytics"
                      className="text-sm font-medium text-white flex items-center"
                    >
                      View activity
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Activity - Redesigned */}
              <div className="mt-8 mb-16">
                <h2 className="text-lg font-medium text-gray-dark mb-4">
                  Recent Activity
                </h2>
                <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
                  <ul className="divide-y divide-gray-100">
                    {recentActivities.map((activity) => (
                      <li
                        key={activity.id}
                        className="hover:bg-primary-lightest transition-colors duration-200"
                      >
                        <div className="px-6 py-4 flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-white">
                              {activity.type === "product_created" && (
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              )}
                              {activity.type === "product_scanned" && (
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                  />
                                </svg>
                              )}
                              {activity.type === "component_added" && (
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-dark">
                                {activity.type === "product_created" &&
                                  "Product Created"}
                                {activity.type === "product_scanned" &&
                                  "Product Scanned"}
                                {activity.type === "component_added" &&
                                  "Component Added"}
                              </p>
                              <p className="text-xs text-gray">
                                {formatTimeAgo(activity.date)}
                              </p>
                            </div>
                            <p className="text-sm text-primary mt-1">
                              {activity.productName}
                              {activity.componentName &&
                                ` • ${activity.componentName}`}
                            </p>
                          </div>
                          <div className="ml-4">
                            <svg
                              className="h-5 w-5 text-gray"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-primary-lightest px-6 py-3 text-center">
                    <Link
                      href="/company/analytics"
                      className="text-sm font-medium text-primary inline-flex items-center"
                    >
                      View all activity
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Bottom Navigation - Mobile only */}
          <div>
            <BottomNav userType="company" />
          </div>
        </div>
      </div>
    </AuthProtection>
  );
}
