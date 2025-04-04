"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "../../../../components/ui/Button";
import AuthProtection from "../../../../components/AuthProtection";

// Create a separate component that uses useSearchParams
function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const productName = searchParams.get("name");

  // Redirect to dashboard if no product ID is provided
  useEffect(() => {
    if (!productId) {
      router.push("/company/dashboard");
    }
  }, [productId, router]);

  return (
    <>
      {/* Success content */}
      <div className="text-center mt-8 mb-12">
        <div className="flex justify-center mb-6">
          <Image src="/checkmark.png" alt="Success" width={300} height={300} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Product Created Successfully!
        </h1>
        <p className="text-white text-opacity-80 mb-8">
          {productName ? `"${productName}"` : "Your product"} has been added to
          your inventory.
        </p>

        <div className="space-y-3 mt-10 max-w-sm mx-auto">
          <Button
            variant="secondary"
            onClick={() => router.push(`/c/${productId}`)}
            className="w-full py-2 text-sm"
          >
            View Product
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/company/products/qrcodes")}
              className="w-full py-2 text-sm bg-white text-primary border-white hover:bg-white hover:bg-opacity-10"
            >
              Generate QR Code
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/company/products/create")}
              className="w-full py-2 text-sm text-white border-white hover:bg-white hover:bg-opacity-10"
            >
              Create Another
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={() => router.push("/company/dashboard")}
            className="w-full py-2 text-sm text-white hover:bg-white hover:bg-opacity-10"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </>
  );
}

// Main component with Suspense boundary
export default function ProductSuccessPage() {
  return (
    <AuthProtection companyOnly>
      <div className="min-h-screen bg-primary pb-20 p-4 max-w-xl mx-auto">
        <Image
          src="/background-grey-logo.svg"
          alt="Background pattern"
          width={1000}
          height={1000}
          className="absolute top-0 right-0 z-0 opacity-10"
        />
        <main className="max-w-2xl mx-auto px-4 py-6 z-10 relative">
          {/* Logo */}
          <div className="flex justify-center mb-16">
            <Image
              src="/logo.svg"
              alt="TransPass Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          <Suspense
            fallback={<div className="text-center text-white">Loading...</div>}
          >
            <SuccessContent />
          </Suspense>
        </main>
      </div>
    </AuthProtection>
  );
}
