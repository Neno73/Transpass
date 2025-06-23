"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { getProduct, Product } from "../../../lib/products";
import { BottomNav } from "../../../components/ui/Navigation";
import { ArrowLeft } from "lucide-react";
import ironingsvg from "../../../public/Ironing (1).svg";  
import washingsvg from "../../../public/Washing (1).svg";  
import dryingsvg from "../../../public/Drying (1).svg";  
import bleachingsvg from "../../../public/Bleaching (1).svg";  
import profCaresvg from "../../../public/Textile Care.svg";  




interface Company {
  id: string;
  name: string;
  description?: string;
  websiteLink?:string;
  logo?: string;
  [key: string]: any;
}

interface Component {
  id: string;
  name: string;
  description: string;
  websiteLink?:string;
  material: string;
  origin: string;
  imageUrl?: string;
}


interface ProductPageProps {
  params: Promise<{ id: string }>; // params is a Promise now
}
export default function ProductPage({ params }: ProductPageProps) {
  const { id: productId } = use(params); // ✅ unwrap the Promise

  const [product, setProduct] = useState<Product | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [activeComponent, setActiveComponent] = useState(0);

  const router = useRouter();

  // Fetch product from Firestore
  useEffect(() => {
    async function fetchData() {
      try {
        // Get the product data
        const fetchedProduct = await getProduct(productId);

        if (fetchedProduct) {
          setProduct(fetchedProduct as Product);

          // If product has a companyId, fetch the company details
          if (fetchedProduct.companyId) {
            const companyDoc = await getDoc(
              doc(db, "companies", fetchedProduct.companyId)
            );

            if (companyDoc.exists()) {
              setCompany({
                id: companyDoc.id,
                ...(companyDoc.data() as Company),
              });
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-lightest flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-gray">Loading product information...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-primary-lightest flex flex-col items-center justify-center p-4">
        <div className="p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <Image
            src="/logo.svg"
            alt="TransPass Logo"
            width={60}
            height={60}
            className="mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-gray-dark mb-4">
            Product Not Found
          </h1>
          <p className="text-gray mb-6">
            The product you are looking for could not be found or may have been
            removed.
          </p>
          {/* //deploy */}
          <Link href="/">
            <Button className="w-full">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Use company data either from the company fetch or from the product's embedded company data
  const companyData = company || product.company;

  return (
    <div className="min-h-screen bg-primary-lightest flex flex-col">
      {/* Updated minimal header */}
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
            <div className="bg-white p-4 px-6 rounded-full mr-4 ">
              <h1 className="text-background-dark font-medium truncate">
                {product.name}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 max-w-4xl mx-auto w-full pb-20 pt-0">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          {/* Tabs */}
          <div className="border-b border-gray-100 px-6">
            <div className="flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "details"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray hover:text-gray-dark hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Product
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "components"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray hover:text-gray-dark hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("components")}
              >
                Components
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "care"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray hover:text-gray-dark hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("care")}
              >
                Care
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "details" && (
              <div className="space-y-6">
                <div className="aspect-w-16 aspect-h-9 relative bg-primary-lightest rounded-xl overflow-hidden h-64 flex items-center justify-center">
                  {product.imageUrl ? (
                  <Link target="_blank" href={product.websiteLink ?? ''}>
                  <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="relative object-contain"
                    />
                    </Link>
                  ) : (
                    <div className="text-primary flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <span className="mt-2">No Product Image Available</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <p className="text-gray">
                    By{" "}
                    <Link
                      href={`/c/${companyData?.id}`}
                      className="text-primary underline"
                    >
                      {companyData?.name || "Verified Manufacturer"}
                    </Link>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-dark mb-2">
                    Description
                  </h3>
                  <p className="text-gray">
                    {product.description ||
                      "No description available for this product."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-dark mb-2">
                      Details
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {product.sku && (
                        <li className="flex justify-between">
                          <span className="text-gray">SKU</span>
                          <span className="text-gray-dark font-medium">
                            {product.sku}
                          </span>
                        </li>
                      )}
                      {product.model && (
                        <li className="flex justify-between">
                          <span className="text-gray">Model</span>
                          <span className="text-gray-dark font-medium">
                            {product.model}
                          </span>
                        </li>
                      )}
                      {product.manufacturer && (
                        <li className="flex justify-between">
                          <span className="text-gray">Manufacturer</span>
                          <span className="text-gray-dark font-medium">
                            {product.manufacturer}
                          </span>
                        </li>
                      )}
                      {product.origin && (
                        <li className="flex justify-between">
                          <span className="text-gray">Origin</span>
                          <span className="text-gray-dark font-medium">
                            {product.origin}
                          </span>
                        </li>
                      )}
                      {product.material && (
                        <li className="flex justify-between">
                          <span className="text-gray">Material</span>
                          <span className="text-gray-dark font-medium">
                            {product.material}
                          </span>
                        </li>
                      )}
                      {product.weight && (
                        <li className="flex justify-between">
                          <span className="text-gray">Weight</span>
                          <span className="text-gray-dark font-medium">
                            {product.weight}
                          </span>
                        </li>
                      )}
                      {product.dimensions && (
                        <li className="flex justify-between">
                          <span className="text-gray">Dimensions</span>
                          <span className="text-gray-dark font-medium">
                            {product.dimensions}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div>
                    {product.colors && product.colors.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-dark mb-2">
                          Available Options
                        </h3>
                        <h4 className="text-sm font-medium text-gray mb-2">
                          Colors:
                        </h4>
                        <div className="flex space-x-2">
                          {product.colors.map((color: any, index: number) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition-transform hover:scale-110"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            ><span className="pl-10">{color.name}</span></div>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.sizes && product.sizes.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray mb-2">
                          Sizes:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size: string, index: number) => (
                            <div
                              key={index}
                              className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-dark cursor-pointer hover:border-primary hover:text-primary transition-colors"
                            >
                              {size}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.tags && product.tags.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray mb-2">
                          Tags:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-lightest text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "components" && (
              <div>
                {product.components && product.components.length > 0 ? (
                  <div>
                    <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide">
                      <div className="flex space-x-2">
                        {product.components.map(
                          (component: Component, index: number) => (
                            <button
                              key={index}
                              className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium ${
                                activeComponent === index
                                  ? "bg-primary text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              onClick={() => setActiveComponent(index)}
                            >
                              {component.name}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="bg-primary-lightest rounded-xl p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          {product.components[activeComponent].imageUrl ? (
                            <div className="aspect-square relative rounded-lg overflow-hidden">
                              <Image
                                src={
                                  product.components[activeComponent].imageUrl
                                }
                                alt={product.components[activeComponent].name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="hidden"></div>
                            // <div className="aspect-square bg-white rounded-lg flex items-center justify-center">
                            //   <div className="text-primary">No Image</div>
                            // </div>
                          )}
                        </div>

                        <div className="md:w-2/3">
                          <h3 className="text-xl font-bold text-gray-dark mb-2">
                            {product.components[activeComponent].name}
                          </h3>
                          <p className="text-gray mb-4">
                            {product.components[activeComponent].description}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray mb-1">
                                Material
                              </h4>
                              <p className="text-gray-dark">
                                {product.components[activeComponent].material ||
                                  "Not specified"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray mb-1">
                                Origin
                              </h4>
                              <p className="text-gray-dark">
                                {product.components[activeComponent].origin ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-dark">
                      No components
                    </h3>
                    <p className="mt-1 text-sm text-gray">
                      This product doesn't have any components listed.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "care" && (
              <div>
                {product.care ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {product.care.washing && (
                        <div className="flex items-start">
                          <div className="bg-primary-lightest p-2 rounded-full mr-3">
                           <Image width={28} height={28} src={washingsvg} alt="washing image"></Image>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-dark">
                              Washing
                            </h4>
                            <p className="text-sm text-gray">
                              {product.care.washing}
                            </p>
                          </div>
                        </div>
                      )}

                      {product.care.drying && (
                        <div className="flex items-start">
                          <div className="bg-primary-lightest p-2 rounded-full mr-3">
                         <Image width={28} height={28} src={dryingsvg} alt="drying image"></Image>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-dark">
                              Drying
                            </h4>
                            <p className="text-sm text-gray">
                              {product.care.drying}
                            </p>
                          </div>
                        </div>
                      )}

                      {product.care.bleaching && (
                        <div className="flex items-start">
                          <div className="bg-primary-lightest p-2 rounded-full mr-3">
                           <Image width={28} height={28} src={bleachingsvg} alt="bleaching image"></Image>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-dark">
                              Bleaching
                            </h4>
                            <p className="text-sm text-gray">
                              {product.care.bleaching}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {product.care.ironing && (
                        <div className="flex items-start">
                          <div className="bg-primary-lightest p-2 rounded-full mr-3">
                           <Image width={28} height={28} src={ironingsvg} alt="iron image"></Image>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-dark">
                              Ironing
                            </h4>
                            <p className="text-sm text-gray">
                              {product.care.ironing}
                            </p>
                          </div>
                        </div>
                      )}

                      {product.care.professionalCare && (
                        <div className="flex items-start">
                          <div className="bg-primary-lightest p-2 rounded-full mr-3">
                           <Image width={28} height={28} src={profCaresvg} alt="professional care image"></Image>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-dark">
                              Professional Care
                            </h4>
                            <p className="text-sm text-gray">
                              {product.care.professionalCare}
                            </p>
                          </div>
                        </div>
                      )}

                      {product.care.cleaning && (
                        <div className="flex items-start">
                          <div className="bg-primary-lightest p-2 rounded-full mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-primary"
                            >
                              <path d="m9 11 6 6m-6 0 6-6"></path>
                              <circle cx="12" cy="12" r="9"></circle>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-dark">
                              Cleaning
                            </h4>
                            <p className="text-sm text-gray">
                              {product.care.cleaning}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-dark">
                      No care instructions
                    </h3>
                    <p className="mt-1 text-sm text-gray">
                      This product doesn't have any care instructions listed.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* QR Code Section */}
        {/* <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h2 className="text-lg font-medium text-gray-dark mb-4">
            Share this product
          </h2>
          <div className="flex flex-col items-center">
            <div className="bg-white p-2 rounded-lg shadow-sm mb-4">
              <svg
                className="w-32 h-32"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="100" height="100" fill="white" />
                <path d="M30 30H40V40H30V30Z" fill="black" />
                <path d="M50 30H60V40H50V30Z" fill="black" />
                <path d="M70 30H80V40H70V30Z" fill="black" />
                <path d="M30 50H40V60H30V50Z" fill="black" />
                <path d="M50 50H60V60H50V50Z" fill="black" />
                <path d="M70 50H80V60H70V50Z" fill="black" />
                <path d="M30 70H40V80H30V70Z" fill="black" />
                <path d="M50 70H60V80H50V70Z" fill="black" />
                <path d="M70 70H80V80H70V70Z" fill="black" />
              </svg>
            </div>
            <p className="text-sm text-gray mb-4">
              Scan this QR code to view this product on your mobile device
            </p>
            <div className="flex space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Copy Link
              </button>
            </div>
          </div>
        </div> */}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <BottomNav userType="consumer" />
      </div>
    </div>
  );
}
