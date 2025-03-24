import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ScanHistoryRecord } from "../../lib/products";

interface ScanCardProps {
  scan: ScanHistoryRecord;
  formatTimeAgo: (date: Date) => string;
}

export function ScanCard({ scan, formatTimeAgo }: ScanCardProps) {
  const date = scan.scannedAt?.toDate
    ? scan.scannedAt.toDate()
    : new Date(scan.scannedAt);

  return (
    <Link href={`/p/${scan.productId}`} className="block">
      <div className="transition-all duration-200 hover:opacity-90"></div>
      <div className="aspect-square w-full relative bg-primary-lightest rounded-xl overflow-hidden">
        {scan.imageUrl ? (
          <Image
            src={scan.imageUrl}
            alt={scan.productName || "Product"}
            fill
            className="object-cover rounded-xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-primary text-2xl font-medium">
              {scan.productName?.charAt(0).toUpperCase() || "P"}
            </div>
          </div>
        )}
      </div>
      <div className="pt-3 px-1">
        <h3 className="text-gray-dark font-medium text-xl truncate pr-2">
          {scan.productName || "Unknown Product"}
        </h3>
        <p className="text-xs text-gray mt-1 truncate">
          {scan.manufacturer || scan.model || "Scanned product"}
        </p>
        <div className="flex items-center text-xs text-gray shrink-0 mt-2">
          <div className="h-5 w-5 rounded-full bg-primary-light flex items-center justify-center text-white mr-2">
            <svg
              className="h-3 w-3"
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
          </div>
          <p className="text-xs text-primary font-medium">
            {formatTimeAgo(date)}
          </p>
        </div>
      </div>
    </Link>
  );
}
