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
import { Menu, User } from "lucide-react";

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
  //  Testa
  return (
    <AuthProtection companyOnly>
      <div className="min-h-screen bg-primary-lightest pb-20">
        {/* Desktop header */}
        <header className="bg-white shadow-sm hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="inline-flex items-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="60"
                        height="60"
                        rx="8"
                        fill="#3D4EAD"
                        fillOpacity="0.2"
                      />
                      <circle cx="12" cy="12" r="6" fill="#3D4EAD" />
                      <circle cx="30" cy="12" r="6" fill="#3D4EAD" />
                      <circle cx="48" cy="12" r="6" fill="#3D4EAD" />
                      <circle cx="12" cy="30" r="6" fill="#3D4EAD" />
                      <circle cx="30" cy="30" r="6" fill="#FFFFFF" />
                      <circle cx="48" cy="30" r="6" fill="#3D4EAD" />
                      <circle cx="12" cy="48" r="6" fill="#3D4EAD" />
                      <circle cx="30" cy="48" r="6" fill="#3D4EAD" />
                      <circle cx="48" cy="48" r="6" fill="#3D4EAD" />
                    </svg>
                    <span className="ml-2 text-xl font-bold text-primary">
                      Transpass
                    </span>
                  </Link>
                </div>
                <nav className="ml-6 flex space-x-8">
                  <Link
                    href="/company/dashboard"
                    className="border-b-2 border-primary text-primary inline-flex items-center px-1 pt-1 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/company/products"
                    className="border-transparent text-gray hover:text-gray-dark hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Products
                  </Link>
                  <Link
                    href="/company/analytics"
                    className="border-transparent text-gray hover:text-gray-dark hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Analytics
                  </Link>
                  <Link
                    href="/company/profile"
                    className="border-transparent text-gray hover:text-gray-dark hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Profile
                  </Link>
                </nav>
              </div>
              <div className="flex items-center">
                <div className="ml-3 relative flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-dark">
                    {userData?.companyName ||
                      userData?.displayName ||
                      "Company"}
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary-lightest flex items-center justify-center text-primary font-medium">
                    {userData?.companyName
                      ? userData.companyName.charAt(0)
                      : "C"}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing out..." : "Sign out"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile header */}
        <div className="md:hidden">
          <TopNav
            title="Dashboard"
            rightAction={
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center justify-center w-8 h-8 rounded-full focus:outline-none"
                >
                  <Menu size={20} />
                </button>
                <Link href="/company/profile">
                  <div className="h-8 w-8 rounded-full bg-primary-lightest flex items-center justify-center text-primary">
                    <User size={18} />
                  </div>
                </Link>
              </div>
            }
          />

          {mobileMenuOpen && (
            <div className="bg-white shadow-md py-2 px-4 absolute right-0 mt-2 z-50 rounded-md">
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
          <div className="max-w-7xl mx-auto">
            {/* Page header */}
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-dark">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray">
                  Welcome back to your company dashboard! Manage your products
                  and view analytics here.
                </p>
              </div>
              <div className="mt-4 md:mt-0 hidden md:block">
                <Link href="/company/products/create">
                  <Button className="flex items-center">
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
                    Add New Product
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray truncate">
                      Total Products
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-dark">
                      {loading ? "..." : products.length}
                    </dd>
                  </dl>
                </div>
                <div className="bg-primary-lightest px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link
                      href="/company/products"
                      className="font-medium text-primary hover:text-primary-dark"
                    >
                      View all products
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray truncate">
                      Total Scans
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-dark">
                      1,284
                    </dd>
                  </dl>
                </div>
                <div className="bg-primary-lightest px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link
                      href="/company/analytics"
                      className="font-medium text-primary hover:text-primary-dark"
                    >
                      View analytics
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray truncate">
                      Recent Activity
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-dark">
                      {recentActivities.length}
                    </dd>
                  </dl>
                </div>
                <div className="bg-primary-lightest px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link
                      href="/company/analytics"
                      className="font-medium text-primary hover:text-primary-dark"
                    >
                      View activity
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent products or Empty state */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-dark mb-4">
                Recent Products
              </h2>
              <div className="bg-white shadow overflow-hidden rounded-md">
                {loading ? (
                  <div className="py-12 px-6 flex justify-center">
                    <div className="w-12 h-12 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : products.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {products.slice(0, 3).map((product) => (
                      <li key={product.id}>
                        <div className="px-4 py-4 sm:px-6 flex items-center">
                          <div className="min-w-0 flex-1 flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-primary-lightest rounded-md flex items-center justify-center">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-primary font-medium">
                                  {product.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1 px-4">
                              <div>
                                <p className="text-sm font-medium text-primary truncate">
                                  {product.name}
                                </p>
                                <p className="mt-1 flex items-center text-sm text-gray">
                                  <span className="truncate">
                                    {product.model || "No model"}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-5 flex-shrink-0 flex items-center space-x-4">
                            <span className="hidden sm:flex items-center text-sm text-gray">
                              <svg
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-primary"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path
                                  fillRule="evenodd"
                                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {Math.floor(Math.random() * 500)} scans
                            </span>
                            <Link href={`/company/products/${product.id}`}>
                              <Button variant="outline" className="text-sm">
                                Edit
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-12 px-6 text-center">
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
              {products.length > 0 && (
                <div className="mt-4 text-center">
                  <Link
                    href="/company/products"
                    className="text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    View all products →
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="mt-8 mb-16">
              <h2 className="text-lg font-medium text-gray-dark mb-4">
                Recent Activity
              </h2>
              <div className="bg-white shadow overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <li key={activity.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-lightest flex items-center justify-center">
                              {activity.type === "product_created" && (
                                <svg
                                  className="h-4 w-4 text-primary"
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
                                  className="h-4 w-4 text-primary"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                  />
                                </svg>
                              )}
                              {activity.type === "component_added" && (
                                <svg
                                  className="h-4 w-4 text-primary"
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
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-dark">
                                {activity.type === "product_created" &&
                                  "Product Created"}
                                {activity.type === "product_scanned" &&
                                  "Product Scanned"}
                                {activity.type === "component_added" &&
                                  "Component Added"}
                              </p>
                              <p className="text-sm text-gray">
                                {activity.type === "product_created" &&
                                  `Created ${activity.productName}`}
                                {activity.type === "product_scanned" &&
                                  `Someone scanned ${activity.productName}`}
                                {activity.type === "component_added" &&
                                  `Added ${activity.componentName} to ${activity.productName}`}
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-lightest text-primary">
                              {formatTimeAgo(activity.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick actions - Only show on desktop */}
            <div className="mt-8 hidden md:block">
              <h2 className="text-lg font-medium text-gray-dark mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-primary">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-lightest flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-primary"
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
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href="/company/products/create"
                      className="focus:outline-none"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-dark">
                        Create New Product
                      </p>
                      <p className="text-sm text-gray truncate">
                        Add a new product to your catalog
                      </p>
                    </Link>
                  </div>
                </div>

                <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-primary">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-lightest flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href="/company/analytics"
                      className="focus:outline-none"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-dark">
                        View Analytics
                      </p>
                      <p className="text-sm text-gray truncate">
                        See how your products are performing
                      </p>
                    </Link>
                  </div>
                </div>

                <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-primary">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-lightest flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href="/company/profile"
                      className="focus:outline-none"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-dark">
                        Company Profile
                      </p>
                      <p className="text-sm text-gray truncate">
                        Update your company information
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation - Mobile only */}
        <div className="md:hidden">
          <BottomNav userType="company" />
        </div>
      </div>
    </AuthProtection>
  );
}
