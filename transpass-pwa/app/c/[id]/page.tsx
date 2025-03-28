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

export default function CompanyPage(props: CompanyPageProps) {
  // Use React.use to unwrap the params promise
  const params = React.use(props.params);
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const companyId = params.id;

  useEffect(() => {
    async function fetchCompanyData() {
      try {
        // Fetch company data
        const companyDoc = await getDoc(doc(db, "companies", companyId));

        if (companyDoc.exists()) {
          setCompany({
            id: companyDoc.id,
            ...companyDoc.data(),
          } as Company);

          // Fetch products for this company
          const productsQuery = query(
            collection(db, "products"),
            where("companyId", "==", companyId)
          );

          const productsSnapshot = await getDocs(productsQuery);
          const productsData = productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Product[];

          setProducts(productsData);
        } else {
          console.error("Company not found");
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyData();
  }, [companyId]);

  return (
    <div className="min-h-screen bg-primary-lightest pb-20">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Company Profile</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              {/* Company header */}
              <div className="flex items-center mb-6">
                <div className="mr-4 h-16 w-16 rounded-full bg-primary-lightest flex items-center justify-center overflow-hidden">
                  {company?.logo ? (
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-primary text-xl font-bold">
                      {company?.name?.charAt(0) || "C"}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {company?.name || "Company"}
                  </h2>
                  {company?.location && (
                    <p className="text-sm text-gray-500">{company.location}</p>
                  )}
                </div>
              </div>

              {/* About */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  About
                </h3>
                <p className="text-gray-700">
                  {company?.description ||
                    "No description available for this company."}
                </p>
              </div>

              {/* Company details */}
              {(company?.website ||
                company?.founded ||
                company?.phone ||
                company?.address) && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Company Details
                  </h3>
                  <div className="space-y-2">
                    {company?.website && (
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">
                          Website:{" "}
                        </span>
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {company.website}
                        </a>
                      </p>
                    )}
                    {company?.founded && (
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">
                          Founded:{" "}
                        </span>
                        <span>{company.founded}</span>
                      </p>
                    )}
                    {company?.phone && (
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">
                          Phone:{" "}
                        </span>
                        <span>{company.phone}</span>
                      </p>
                    )}
                    {company?.address && (
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">
                          Address:{" "}
                        </span>
                        <span>{company.address}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Sustainability */}
              {company?.sustainability && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sustainability
                  </h3>
                  <p className="text-gray-700">{company.sustainability}</p>
                </div>
              )}

              {/* Certifications */}
              {company?.certifications && company.certifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {company.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-white"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Products
                </h3>
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
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <BottomNav userType="consumer" />
      </div>
    </div>
  );
}
