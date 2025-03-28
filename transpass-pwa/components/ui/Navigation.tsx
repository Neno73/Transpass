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
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
              <Image src="/home.svg" alt="Home" width={20} height={20} />
            </div>
          </Link>

          {/* Scan (Center Button) */}
          <Link href="/scan" className="flex flex-col items-center flex-1">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <svg
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.25 10.9688C1.78875 10.9688 1.40625 10.5862 1.40625 10.125V7.3125C1.40625 4.05 4.06125 1.40625 7.3125 1.40625H10.125C10.5862 1.40625 10.9688 1.78875 10.9688 2.25C10.9688 2.71125 10.5862 3.09375 10.125 3.09375H7.3125C4.98375 3.09375 3.09375 4.98375 3.09375 7.3125V10.125C3.09375 10.5862 2.71125 10.9688 2.25 10.9688Z"
                  fill="#F5F4F0"
                />
                <path
                  d="M24.75 10.9688C24.2888 10.9688 23.9062 10.5862 23.9062 10.125V7.3125C23.9062 4.98375 22.0162 3.09375 19.6875 3.09375H16.875C16.4138 3.09375 16.0312 2.71125 16.0312 2.25C16.0312 1.78875 16.4138 1.40625 16.875 1.40625H19.6875C22.9388 1.40625 25.5938 4.05 25.5938 7.3125V10.125C25.5938 10.5862 25.2112 10.9688 24.75 10.9688Z"
                  fill="#F5F4F0"
                />
                <path
                  d="M19.6875 25.5938H18C17.5388 25.5938 17.1562 25.2112 17.1562 24.75C17.1562 24.2888 17.5388 23.9062 18 23.9062H19.6875C22.0162 23.9062 23.9062 22.0162 23.9062 19.6875V18C23.9062 17.5388 24.2888 17.1562 24.75 17.1562C25.2112 17.1562 25.5938 17.5388 25.5938 18V19.6875C25.5938 22.95 22.9388 25.5938 19.6875 25.5938Z"
                  fill="#F5F4F0"
                />
                <path
                  d="M10.125 25.5938H7.3125C4.06125 25.5938 1.40625 22.95 1.40625 19.6875V16.875C1.40625 16.4138 1.78875 16.0312 2.25 16.0312C2.71125 16.0312 3.09375 16.4138 3.09375 16.875V19.6875C3.09375 22.0162 4.98375 23.9062 7.3125 23.9062H10.125C10.5862 23.9062 10.9688 24.2888 10.9688 24.75C10.9688 25.2112 10.5862 25.5938 10.125 25.5938Z"
                  fill="#F5F4F0"
                />
                <path
                  d="M15.75 20.5312H11.25C8.5275 20.5312 7.03125 19.035 7.03125 16.3125V10.6875C7.03125 7.965 8.5275 6.46875 11.25 6.46875H15.75C18.4725 6.46875 19.9688 7.965 19.9688 10.6875V16.3125C19.9688 19.035 18.4725 20.5312 15.75 20.5312ZM11.25 8.15625C9.4725 8.15625 8.71875 8.91 8.71875 10.6875V16.3125C8.71875 18.09 9.4725 18.8438 11.25 18.8438H15.75C17.5275 18.8438 18.2812 18.09 18.2812 16.3125V10.6875C18.2812 8.91 17.5275 8.15625 15.75 8.15625H11.25Z"
                  fill="#F5F4F0"
                />
                <path
                  d="M21.375 14.3438H5.625C5.16375 14.3438 4.78125 13.9612 4.78125 13.5C4.78125 13.0388 5.16375 12.6562 5.625 12.6562H21.375C21.8362 12.6562 22.2188 13.0388 22.2188 13.5C22.2188 13.9612 21.8362 14.3438 21.375 14.3438Z"
                  fill="#F5F4F0"
                />
              </svg>
            </div>
          </Link>

          {/* Products */}
          <Link
            href="/user/history"
            className="flex flex-col items-center flex-1"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm ${
                isActive("/consumer/products") ? "text-primary" : "text-gray"
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
              <Image src="/profile.svg" alt="Profile" width={20} height={20} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
