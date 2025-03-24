import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  User,
  QrCode,
  ChevronLeft,
  Plus,
  Search,
  Scan,
} from "lucide-react";
import Image from "next/image";
// Top Navigation
interface TopNavProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export function TopNav({
  title,
  showBackButton = false,
  onBack,
  rightAction,
  className = "",
}: TopNavProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div
      className={`h-[60px] bg-white border-b border-gray-300 flex items-center justify-center relative ${className}`}
    >
      {showBackButton && (
        <button
          className="absolute left-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-800"
          onClick={handleBack}
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <h1 className="text-lg font-semibold">{title}</h1>

      {rightAction && <div className="absolute right-4">{rightAction}</div>}
    </div>
  );
}

// Bottom Navigation
interface BottomNavProps {
  userType: "company" | "consumer";
}

export function BottomNav({ userType }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  if (userType === "company") {
    return (
      <div className="fixed bottom-4 left-0 right-0 z-50">
        <div className="mx-auto max-w-fit flex justify-center items-center bg-primary-lightest rounded-full px-2 py-1">
          <div className="flex justify-center items-center max-w-[80%] gap-4">
            {/* Home */}
            <Link
              href="/company/dashboard"
              className="flex flex-col items-center flex-1"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm ${
                  isActive("/company/dashboard") ? "text-primary" : "text-gray"
                }`}
              >
                <Image src="/home.svg" alt="Home" width={20} height={20} />
              </div>
            </Link>

            {/* Products */}
            <Link
              href="/company/products"
              className="flex flex-col items-center flex-1"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm ${
                  isActive("/company/products") ? "text-primary" : "text-gray"
                }`}
              >
                <Image
                  src="/products.svg"
                  alt="Products"
                  width={20}
                  height={20}
                />
              </div>
            </Link>

            {/* Create (Center Button) */}
            <Link
              href="/company/products/create"
              className="flex flex-col items-center flex-1"
            >
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Plus size={24} className="text-white" />
              </div>
            </Link>

            {/* QR Codes */}
            <Link
              href="/company/products/qrcodes"
              className="flex flex-col items-center flex-1"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm ${
                  isActive("/company/products/qrcodes")
                    ? "text-primary"
                    : "text-gray"
                }`}
              >
                <QrCode size={20} />
              </div>
            </Link>

            {/* Profile */}
            <Link
              href="/company/profile"
              className="flex flex-col items-center flex-1"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm ${
                  isActive("/company/profile") ? "text-primary" : "text-gray"
                }`}
              >
                <Image
                  src="/profile.svg"
                  alt="Profile"
                  width={20}
                  height={20}
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Consumer navigation
  return (
    <div className="fixed bottom-4 left-0 right-0 z-50">
      <div className="px-2 py-1 mx-auto flex justify-center items-center bg-primary-lightest max-w-fit rounded-full">
        <div className="flex justify-center items-center max-w-[80%] gap-4">
          {/* Home */}
          <Link
            href="/user/dashboard"
            className="flex flex-col items-center flex-1"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm ${
                isActive("/user/dashboard") ? "text-primary" : "text-gray"
              }`}
            >
              <Home size={20} />
            </div>
          </Link>

          {/* Search */}
          <Link
            href="/consumer/search"
            className="flex flex-col items-center flex-1"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm ${
                isActive("/consumer/search") ? "text-primary" : "text-gray"
              }`}
            >
              <Search size={20} />
            </div>
          </Link>

          {/* Scan (Center Button) */}
          <Link
            href="/consumer/scan"
            className="flex flex-col items-center flex-1"
          >
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Scan size={24} className="text-white" />
            </div>
          </Link>

          {/* Products */}
          <Link
            href="/consumer/products"
            className="flex flex-col items-center flex-1"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm ${
                isActive("/consumer/products") ? "text-primary" : "text-gray"
              }`}
            >
              <Package size={20} />
            </div>
          </Link>

          {/* Profile */}
          <Link
            href="/consumer/profile"
            className="flex flex-col items-center flex-1"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm ${
                isActive("/consumer/profile") ? "text-primary" : "text-gray"
              }`}
            >
              <User size={20} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
