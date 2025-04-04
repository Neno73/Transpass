"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../../components/ui/Button";
import AuthProtection from "../../../../components/AuthProtection";
import { useAuth } from "../../../../lib/AuthContext";
import { getCompanyProducts, Product } from "../../../../lib/products";
import { BottomNav } from "../../../../components/ui/Navigation";
import {
  ArrowLeft,
  Search,
  Download,
  Printer,
  Archive,
  Check,
  X,
  Info,
} from "lucide-react";
import Image from "next/image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import QRCode from "qrcode";

export default function ProductQRCodesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [qrTemplate, setQrTemplate] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const fetchedProducts = await getCompanyProducts(user.uid);

        // Add checked property to each product
        const productsWithChecked = fetchedProducts.map((product) => ({
          ...product,
          checked: false,
        }));

        setProducts(productsWithChecked);
        setFilteredProducts(productsWithChecked);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name?.toLowerCase().includes(query) ||
        product.model?.toLowerCase().includes(query) ||
        product.id?.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      const updatedProducts = products.map((product) => ({
        ...product,
        checked: true,
      }));
      setProducts(updatedProducts);
      setSelectedProducts(updatedProducts);
    } else {
      const updatedProducts = products.map((product) => ({
        ...product,
        checked: false,
      }));
      setProducts(updatedProducts);
      setSelectedProducts([]);
    }
  }, [selectAll]);

  // Update selected products when individual checkboxes change
  useEffect(() => {
    const selected = products.filter((product) => product.checked);
    setSelectedProducts(selected);
  }, [products]);

  const handleProductSelect = (productId: string) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return { ...product, checked: !product.checked };
      }
      return product;
    });
    setProducts(updatedProducts);

    // Update filtered products as well
    setFilteredProducts((prevFiltered) =>
      prevFiltered.map((product) => {
        if (product.id === productId) {
          return { ...product, checked: !product.checked };
        }
        return product;
      })
    );
  };

  const handleGenerateQR = async (productId: string, productName: string) => {
    try {
      setGenerating(true);
      const url = `${window.location.origin}/p/${productId}`;
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 512,
        margin: 2,
        color: {
          dark: "#3D4EAD",
          light: "#FFFFFF",
        },
      });

      // Download the QR code
      const link = document.createElement("a");
      link.href = qrDataUrl;
      link.download = `${productName.replace(/\s+/g, "-")}-QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setGenerateSuccess(true);
      setTimeout(() => setGenerateSuccess(false), 3000);
    } catch (err) {
      console.error("Error generating QR code:", err);
      setError("Failed to generate QR code. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateBulkQR = async () => {
    if (selectedProducts.length === 0) return;

    try {
      setGenerating(true);
      const zip = new JSZip();

      // Create a folder for the QR codes
      const qrFolder = zip.folder("qr-codes");

      // Generate QR codes for each selected product
      for (const product of selectedProducts) {
        if (!product.id) continue;

        const url = `${window.location.origin}/p/${product.id}`;
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 512,
          margin: 2,
          color: {
            dark: "#3D4EAD",
            light: "#FFFFFF",
          },
        });

        // Convert data URL to blob
        const base64Data = qrDataUrl.split(",")[1];
        qrFolder?.file(
          `${product.name.replace(/\s+/g, "-")}-QR.png`,
          base64Data,
          { base64: true }
        );
      }

      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "product-qr-codes.zip");

      setGenerateSuccess(true);
      setTimeout(() => setGenerateSuccess(false), 3000);
    } catch (err) {
      console.error("Error generating bulk QR codes:", err);
      setError("Failed to generate QR codes. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateTemplate = async (product: Product) => {
    try {
      setGenerating(true);
      const url = `${window.location.origin}/p/${product.id}`;

      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 512,
        margin: 2,
        color: {
          dark: "#3D4EAD",
          light: "#FFFFFF",
        },
      });

      // Create a printable template with product details
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Draw background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw border
      ctx.strokeStyle = "#DDDDDD";
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Load and draw QR code
      const qrImage = new Image();
      qrImage.onload = () => {
        // Draw QR code centered at the top
        const qrSize = 600;
        ctx.drawImage(
          qrImage,
          (canvas.width - qrSize) / 2,
          100,
          qrSize,
          qrSize
        );

        // Draw company logo or placeholder
        ctx.fillStyle = "#3D4EAD";
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("TRANSPASS", canvas.width / 2, 800);

        // Draw product details
        ctx.fillStyle = "#333333";
        ctx.font = "bold 36px Arial";
        ctx.fillText(product.name, canvas.width / 2, 900);

        ctx.font = "28px Arial";
        ctx.fillText(`Model: ${product.model || "N/A"}`, canvas.width / 2, 980);

        if (product.manufacturer) {
          ctx.fillText(
            `Manufacturer: ${product.manufacturer}`,
            canvas.width / 2,
            1040
          );
        }

        // Draw instructions
        ctx.fillStyle = "#666666";
        ctx.font = "24px Arial";
        ctx.fillText(
          "Scan this QR code to view product details",
          canvas.width / 2,
          1150
        );

        // Draw product ID
        ctx.font = "18px Arial";
        ctx.fillText(`Product ID: ${product.id}`, canvas.width / 2, 1200);

        // Draw footer
        ctx.fillStyle = "#3D4EAD";
        ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "24px Arial";
        ctx.fillText(
          "Powered by Transpass - Product Transparency Platform",
          canvas.width / 2,
          canvas.height - 50
        );

        // Convert to data URL and download
        const templateUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = templateUrl;
        link.download = `${product.name.replace(/\s+/g, "-")}-QR-Template.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setGenerateSuccess(true);
        setTimeout(() => setGenerateSuccess(false), 3000);
      };

      qrImage.src = qrDataUrl;
    } catch (err) {
      console.error("Error generating QR template:", err);
      setError("Failed to generate QR template. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AuthProtection companyOnly>
      <div className="min-h-screen bg-primary-lightest pb-20 mx-auto max-w-2xl relative overflow-hidden">
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
                  Product QR Codes
                </h1>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 max-w-4xl mx-auto w-full relative z-10">
          {/* Success message */}
          {generateSuccess && (
            <div className="mb-4 bg-green-50 text-green-800 p-4 rounded-xl flex items-center">
              <Check size={20} className="mr-2 flex-shrink-0" />
              <span>QR code generated successfully!</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 bg-red-50 text-red-800 p-4 rounded-xl flex items-center">
              <X size={20} className="mr-2 flex-shrink-0" />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-800"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Search and bulk actions */}
          <div className="mb-4 space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="select-all-mobile"
                  name="select-all-mobile"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={selectAll}
                  onChange={() => setSelectAll(!selectAll)}
                />
                <label
                  htmlFor="select-all-mobile"
                  className="ml-2 text-sm text-gray-700"
                >
                  Select All ({filteredProducts.length})
                </label>
              </div>

              <div className="flex space-x-2">
                {selectedProducts.length > 0 && (
                  <Button
                    onClick={handleGenerateBulkQR}
                    disabled={generating}
                    className="flex items-center"
                    size="sm"
                  >
                    <Archive size={16} className="mr-1" />
                    <span>Bulk Download</span>
                    <span className="sm:hidden">{selectedProducts.length}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Products list */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
              <p className="mt-4 text-gray">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Archive size={24} className="text-gray" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray mb-6">
                {searchQuery
                  ? "No products match your search criteria."
                  : "You haven't created any products yet."}
              </p>
              {searchQuery ? (
                <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
              ) : (
                <Link href="/company/products/new">
                  <Button>Create Product</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center">
                      <input
                        id={`product-${product.id}`}
                        name={`product-${product.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        checked={product.checked || false}
                        onChange={() => handleProductSelect(product.id || "")}
                      />
                      <div className="ml-3 flex-grow">
                        <h3 className="text-sm font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {product.model || "No model"} • ID:{" "}
                          {product.id?.slice(0, 8)}...
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleGenerateQR(
                              product.id || "",
                              product.name || "product"
                            )
                          }
                          disabled={generating}
                          className="p-2 text-primary hover:bg-primary-lightest rounded-full transition-colors"
                          title="Download QR Code"
                        >
                          <Download size={20} />
                        </button>
                        <button
                          onClick={() =>
                            handleGenerateQR(
                              product.id || "",
                              product.name || "product"
                            )
                          }
                          disabled={generating}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          title="Print Template"
                        >
                          <Printer size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* QR Printing Guide - Always visible */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-dark mb-4">
                QR Code Printing Guide
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Download size={18} className="text-primary mr-2" />
                    <h4 className="font-medium text-primary">
                      Individual QR Codes
                    </h4>
                  </div>
                  <p className="text-sm text-gray">
                    Download individual QR codes for each product.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Printer size={18} className="text-green-600 mr-2" />
                    <h4 className="font-medium text-green-600">
                      Printable Templates
                    </h4>
                  </div>
                  <p className="text-sm text-gray">
                    Generate printable templates with product details.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Archive size={18} className="text-blue-600 mr-2" />
                    <h4 className="font-medium text-blue-600">
                      Bulk Generation
                    </h4>
                  </div>
                  <p className="text-sm text-gray">
                    Download multiple QR codes in a ZIP file.
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800">
                <h4 className="font-medium mb-2">Printing Tips</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Print at 300 DPI or higher for best results</li>
                  <li>
                    Minimum recommended size: 2.5 cm × 2.5 cm (1&quot; ×
                    1&quot;)
                  </li>
                  <li>Ensure good contrast between QR code and background</li>
                  <li>Test scan your printed QR codes before distributing</li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <BottomNav userType="company" />
        </div>
      </div>
    </AuthProtection>
  );
}
