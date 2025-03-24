"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../lib/AuthContext";
import AuthProtection from "../../../components/AuthProtection";
import { BottomNav } from "../../../components/ui/Navigation";
import { ProductCard } from "../../../components/ui/ProductCard";
import { Product } from "../../../lib/products";

export default function ScansPage() {
  return (
    <AuthProtection>
      <ScannedProducts />
    </AuthProtection>
  );
}

function ScannedProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Implement fetching scanned products
  useEffect(() => {
    // Placeholder for fetching scanned products
    setLoading(false);
  }, [user]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-primary-lightest pb-20 p-2">
      <main className="py-4 md:py-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-dark">
              My Products
            </h1>
            <p className="text-gray mt-1">View your scanned products</p>
          </div>
        </div>

        <div className="mb-8">
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

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : products.length === 0 ? (
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-dark">
              No scanned products
            </h3>
            <p className="mt-1 text-sm text-gray">
              Scan a product to start building your collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showStats={false}
              />
            ))}
          </div>
        )}
      </main>

      <div className="md:hidden">
        <BottomNav userType="user" />
      </div>
    </div>
  );
}
