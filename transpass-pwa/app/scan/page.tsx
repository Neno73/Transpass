"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "../../components/ui/Button";
import { TopNav, BottomNav } from "../../components/ui/Navigation";
import { getProduct, logProductScan } from "../../lib/products";
import AuthProtection from "../../components/AuthProtection";
import { useAuth } from "../../lib/AuthContext";

// Dynamically import QRScanner with SSR disabled
const QRScanner = dynamic(() => import("../../components/ui/QRScanner"), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-light border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading camera...</p>
      </div>
    </div>
  ),
});

export default function ScanPage() {
  // This function would need to be imported and used in a company-specific context
  // with proper protection for company users, who don't need to access scanning functionality
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const [validatingResult, setValidatingResult] = useState(false);
  const [validProduct, setValidProduct] = useState<boolean | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [loggingHistory, setLoggingHistory] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useAuth();

  // Process scanned result
  useEffect(() => {
    if (!scanResult) return;

    async function validateScanResult() {
      setValidatingResult(true);

      try {
        // Case 1: Direct product ID
        if (scanResult.match(/^[a-zA-Z0-9-_]{20,}$/)) {
          const product = await getProduct(scanResult);
          if (product) {
            setValidProduct(true);
            setProductId(scanResult);
          } else {
            setValidProduct(false);
          }
        }
        // Case 2: URL with product ID
        else if (scanResult.includes("/p/")) {
          // Extract product ID from URL: /p/{id}
          const match = scanResult.match(/\/p\/([a-zA-Z0-9-_]+)/);
          if (match && match[1]) {
            const extractedId = match[1];
            const product = await getProduct(extractedId);
            if (product) {
              setValidProduct(true);
              setProductId(extractedId);
            } else {
              setValidProduct(false);
            }
          } else {
            setValidProduct(false);
          }
        }
        // Case 3: Invalid format
        else {
          setValidProduct(false);
        }
      } catch (error) {
        console.error("Error validating QR code:", error);
        setValidProduct(false);
      } finally {
        setValidatingResult(false);
      }
    }

    validateScanResult();
  }, [scanResult]);

  const handleScanSuccess = (decodedText: string) => {
    setScanResult(decodedText);
    setScanning(false);
  };

  const handleTryAgain = () => {
    setScanResult(null);
    setValidProduct(null);
    setProductId(null);
    setScanning(true);
  };

  const handleViewProduct = async () => {
    if (productId && user) {
      setLoggingHistory(true);
      setScanError(null);

      try {
        // Log the product scan to user history
        await logProductScan(user.uid, productId);
        router.push(`/p/${productId}`);
      } catch (error) {
        console.error("Error logging product scan:", error);
        setScanError(
          "Failed to record scan in history, but you can still view the product"
        );
        setTimeout(() => {
          router.push(`/p/${productId}`);
        }, 2000);
      } finally {
        setLoggingHistory(false);
      }
    } else if (productId) {
      // If no user is logged in, just navigate to the product
      router.push(`/p/${productId}`);
    }
  };

  return (
    <AuthProtection userOnly>
      <div className="min-h-screen bg-primary-lightest flex flex-col pb-20">
        {/* Desktop header */}
        <header className="p-4 flex items-center justify-between md:block hidden">
          <Link href="/" className="inline-flex items-center">
            <svg
              width="40"
              height="40"
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
          <Link href="/user/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </header>

        {/* Mobile header */}
        <div className="md:hidden">
          <TopNav title="Scan QR Code" />
        </div>

        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
            <h1 className="text-xl md:text-2xl font-bold text-center text-gray-dark mb-6 hidden md:block">
              Scan Product QR Code
            </h1>

            {scanning ? (
              <div className="space-y-6">
                <div className="bg-primary-lightest p-4 rounded-lg text-center text-gray mb-4">
                  Position the QR code within the frame to scan
                </div>

                <div className="scanner-container mx-auto w-full max-w-sm">
                  {/* QR Scanner */}
                  <QRScanner onScanSuccess={handleScanSuccess} />
                </div>

                <div className="text-center text-sm text-gray">
                  <p>Scanning for product QR code...</p>
                  <p className="mt-2">
                    Make sure the QR code is well-lit and clearly visible
                  </p>
                  <div className="mt-4 bg-blue-50 p-3 rounded-lg text-blue-600 text-left">
                    <h4 className="font-medium">How to scan:</h4>
                    <ol className="list-decimal pl-5 mt-1 text-sm">
                      <li>Allow camera access when prompted</li>
                      <li>Position the QR code within the frame</li>
                      <li>Hold your device steady</li>
                      <li>The scan will happen automatically</li>
                    </ol>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {validatingResult ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-primary-light border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray">Validating QR code...</p>
                  </div>
                ) : validProduct === true ? (
                  <>
                    <div className="bg-green-50 p-4 rounded-lg text-center text-green-800 mb-4">
                      <svg
                        className="mx-auto h-12 w-12 text-green-600 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <p>Valid product QR code detected!</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-dark">
                        Product ID:
                      </p>
                      <p className="text-gray break-all">{productId}</p>
                    </div>

                    <div className="flex flex-col space-y-4">
                      {scanError && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
                          {scanError}
                        </div>
                      )}

                      <Button
                        className="w-full"
                        onClick={handleViewProduct}
                        disabled={loggingHistory}
                      >
                        {loggingHistory
                          ? "Logging scan..."
                          : "View Product Details"}
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleTryAgain}
                      >
                        Scan Another QR Code
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-red-50 p-4 rounded-lg text-center text-red-800 mb-4">
                      <svg
                        className="mx-auto h-12 w-12 text-red-600 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <p>Invalid product QR code</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-dark">
                        The scanned QR code is not a valid Transpass product:
                      </p>
                      <p className="text-gray break-all mt-2">{scanResult}</p>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleTryAgain}
                    >
                      Try Again
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </main>

        <footer className="p-4 text-center text-sm text-gray hidden md:block">
          <p>
            Don't have a QR code to scan? Check out our{" "}
            <Link href="/demo" className="text-primary hover:underline">
              demo products
            </Link>
          </p>
        </footer>

        {/* Bottom Navigation - Mobile only */}
        <div>
          <BottomNav userType="user" />
        </div>
      </div>
    </AuthProtection>
  );
}
