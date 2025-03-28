"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { TopNav, BottomNav } from "../../../components/ui/Navigation";
import { getUserProducts, Product } from "../../../lib/products";
import { useAuth } from "../../../lib/AuthContext";
import AuthProtection from "../../../components/AuthProtection";
import { Menu, User, RefreshCw } from "lucide-react";
import { ProductCard } from "../../../components/ui/ProductCard";
import { Dropdown } from "../../../components/ui/Dropdown";

export default function ProductsListPage() {
  return (
    <AuthProtection companyOnly>
      <ProductsList />
    </AuthProtection>
  );
}

function ProductsList() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Function to check network status and update state
  const checkNetworkStatus = () => {
    if (typeof window !== "undefined") {
      const isOnline = window.navigator.onLine;
      setNetworkError(
        isOnline
          ? null
          : "You appear to be offline. Please check your internet connection and try again."
      );
      return isOnline;
    }
    return true;
  };

  // Add event listeners for online/offline status
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleOnline = () => {
        console.log("Browser reports online status");
        setNetworkError(null);
        // Refresh data automatically when coming back online
        if (user?.uid) {
          setLoading(true);
          getUserProducts(user.uid)
            .then((fetchedProducts) => {
              setProducts(fetchedProducts);
            })
            .finally(() => setLoading(false));
        }
      };

      const handleOffline = () => {
        console.log("Browser reports offline status");
        setNetworkError(
          "You appear to be offline. Please check your internet connection and try again."
        );
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Initial check
      checkNetworkStatus();

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (user?.uid) {
          // Check network status before attempting fetch
          if (!checkNetworkStatus()) {
            setLoading(false);
            return;
          }

          console.log("Attempting to fetch products for user:", user.uid);
          const fetchedProducts = await getUserProducts(user.uid);
          console.log("Fetched products:", fetchedProducts);
          setProducts(fetchedProducts);
          setNetworkError(null); // Clear any previous network error
        } else {
          console.log("No user UID available for fetching products");
        }
      } catch (error: any) {
        console.error("Error fetching products:", error);
        // If it's a network-related error, show user-friendly message
        if (
          error.code === "failed-precondition" ||
          error.code === "unavailable" ||
          error.message.includes("offline")
        ) {
          setNetworkError(
            "Unable to connect to the database. Please check your internet connection and try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Filter products based on search query and filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.model.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "with-components")
      return (
        matchesSearch && product.components && product.components.length > 0
      );
    if (filter === "without-components")
      return (
        matchesSearch &&
        (!product.components || product.components.length === 0)
      );

    return matchesSearch;
  });

  const refreshProducts = () => {
    console.log("Manually refreshing product list");
    setLoading(true);
    if (user?.uid) {
      getUserProducts(user.uid)
        .then((fetchedProducts) => {
          console.log("Products refreshed:", fetchedProducts);
          setProducts(fetchedProducts);
        })
        .catch((err) => console.error("Refresh error:", err))
        .finally(() => setLoading(false));
    }
  };

  // Define filter options
  const filterOptions = [
    { value: "all", label: "All Products" },
    { value: "with-components", label: "With Components" },
    { value: "without-components", label: "Without Components" },
  ];

  // Update the filter state handler
  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  return (
    <div className="min-h-screen bg-primary-lightest pb-20 p-2 max-w-xl mx-auto">
      {/* Mobile header - keep only this part */}
      <main className="py-4 md:py-10 px-4">
        {/* User greeting with avatar - similar to dashboard */}
        <div className="flex items-center justify-between mb-8 z-10 relative">
          <div>
            <h1 className="text-2xl font-semibold text-gray-dark">Products</h1>
            <p className="text-gray mt-1">
              Manage your product catalog and digital passports
            </p>
          </div>
          <div className="hidden md:block">
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
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and filters - simplified */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary transition-all duration-200"
                  placeholder="Search products"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Dropdown
                options={filterOptions}
                value={filter}
                onChange={handleFilterChange}
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* Mobile create button */}
        <div className="md:hidden mb-8">
          <Link href="/company/products/create">
            <Button className="w-full flex items-center justify-center">
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
              Create Product
            </Button>
          </Link>
        </div>

        {/* Network error message - keep existing code */}
        {networkError && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4 rounded-r-xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{networkError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Rest of the content - loading, empty states, and product grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-6 text-center border border-gray-300 border-dashed rounded-lg mb-16">
            <svg
              className="mx-auto h-12 w-12 text-gray"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-dark">
              No products
            </h3>
            <p className="mt-1 text-sm text-gray">
              Get started by creating a new product.
            </p>
            <div className="mt-6">
              <Link href="/company/products/create">
                <Button>Add New Product</Button>
              </Link>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white p-6 text-center border border-gray-300 rounded-lg mb-16">
            <svg
              className="mx-auto h-12 w-12 text-gray"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-dark">
              No matching products
            </h3>
            <p className="mt-1 text-sm text-gray">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2  gap-6 mb-16">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showStats={true}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation - Mobile only */}
      <div>
        <BottomNav userType="company" />
      </div>
    </div>
  );
}
