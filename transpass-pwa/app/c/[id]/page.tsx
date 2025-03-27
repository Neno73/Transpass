"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "../../../components/ui/ProductCard";
import { BottomNav } from "../../../components/ui/Navigation";
import { Product } from "../../../lib/products";

interface Company {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  location?: string;
  founded?: string;
  certifications?: string[];
  sustainability?: string;
  [key: string]: any;
}

interface CompanyPageProps {
  params: {
    id: string;
  };
}

export default function CompanyPage({ params }: CompanyPageProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const companyId = "0gMaAV7S5pONdRLsdbxfvTerh2r2";

  useEffect(() => {
    async function fetchCompanyData() {
      try {
        // Fetch company data
        const companyDoc = await getDoc(doc(db, "companies", companyId));

        if (companyDoc.exists()) {
          setCompany({
            id: companyDoc.id,
            ...(companyDoc.data() as Company),
          });

          // Fetch company products
          const productsQuery = query(collection(db, "products"));

          const productsSnapshot = await getDocs(productsQuery);
          const productsData = productsSnapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Product)
          );

          setProducts(productsData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setLoading(false);
      }
    }

    fetchCompanyData();
  }, [companyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-lightest flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-gray">Loading company information...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-primary-lightest flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <Image
            src="/logo.svg"
            alt="TransPass Logo"
            width={60}
            height={60}
            className="mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-gray-dark mb-4">
            Company Not Found
          </h1>
          <p className="text-gray mb-6">
            The company you are looking for could not be found or may have been
            removed.
          </p>
          <button
            onClick={() => router.back()}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-lightest flex flex-col">
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
                {company.name}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 max-w-4xl mx-auto w-full pb-20 pt-0">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          {/* Company Header with Logo */}
          <div className="p-6 flex items-center border-b border-gray-100">
            <div className="w-16 h-16 bg-primary-lightest rounded-full flex items-center justify-center mr-4 overflow-hidden">
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <span className="text-primary text-2xl font-bold">
                  {company.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-dark">
                {company.name}
              </h1>
              {company.location && (
                <p className="text-gray flex items-center mt-1">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {company.location}
                </p>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* About Section */}
            {company.description && (
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-dark mb-3">
                  About
                </h2>
                <p className="text-gray">{company.description}</p>
              </div>
            )}

            {/* Company Details */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-dark mb-3">
                Company Details
              </h2>
              <div className="space-y-3">
                {company.founded && (
                  <div className="flex justify-between">
                    <span className="text-gray">Founded</span>
                    <span className="text-gray-dark font-medium">
                      {company.founded}
                    </span>
                  </div>
                )}
                {company.website && (
                  <div className="flex justify-between">
                    <span className="text-gray">Website</span>
                    <a
                      href={
                        company.website.startsWith("http")
                          ? company.website
                          : `https://${company.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium"
                    >
                      {company.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                {company.employees && (
                  <div className="flex justify-between">
                    <span className="text-gray">Employees</span>
                    <span className="text-gray-dark font-medium">
                      {company.employees}
                    </span>
                  </div>
                )}
                {company.address && (
                  <div className="flex justify-between">
                    <span className="text-gray">Address</span>
                    <span className="text-gray-dark font-medium">
                      {company.address}
                    </span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray">Phone</span>
                    <span className="text-gray-dark font-medium">
                      {company.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Sustainability */}
            {company.sustainability && (
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-dark mb-3">
                  Sustainability
                </h2>
                <p className="text-gray">{company.sustainability}</p>
              </div>
            )}

            {/* Certifications */}
            {company.certifications && company.certifications.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-dark mb-3">
                  Certifications
                </h2>
                <div className="flex flex-wrap gap-2">
                  {company.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="bg-primary text-white px-3 py-1.5 rounded-full text-sm"
                    >
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-dark mb-3">
                Products
              </h2>
              {products.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      showStats={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-xl">
                  <svg
                    className="mx-auto h-12 w-12 text-gray"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-dark">
                    No products
                  </h3>
                  <p className="mt-1 text-sm text-gray">
                    This company doesn&apos;t have any products listed yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <BottomNav userType="consumer" />
      </div>
    </div>
  );
}
