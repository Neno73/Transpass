"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/Button";
import Image from "next/image";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 600;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (mobileMenuOpen && !target.closest(".mobile-menu-container")) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        className={`py-6 fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "py-4 shadow-md" : "py-10"
        }`}
        style={{
          backgroundColor: scrolled ? "#0F172A" : "transparent",
          backgroundImage: scrolled ? "url('/background-logo.svg')" : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-center">
            <Image
              src="/logo-horizontal.svg"
              alt="Transpass"
              width={250}
              height={250}
              className="md:block hidden"
            />
            <Image
              src="/logo.png"
              alt="Transpass"
              width={40}
              height={40}
              className="md:hidden block"
            />

            <div className="hidden md:flex space-x-8 md:text-sm lg:text-base text-primary-lightBlue">
              <a
                href="#how-it-works"
                className="flex items-center hover:text-white transition-colors"
              >
                How it works
                {/* <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg> */}
              </a>
              <a
                href="#our-solutions"
                className="flex items-center hover:text-white transition-colors"
              >
                Our solutions
                {/* <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg> */}
              </a>
              <a
                href="#why-use-transpass"
                className="flex items-center hover:text-white transition-colors"
              >
                Why should you use Transpass
                {/* <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg> */}
              </a>
              <a
                href="#contact"
                className="flex items-center hover:text-white transition-colors"
              >
                Contact
                {/* <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg> */}
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="hidden sm:block">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary-lightBlue border-primary-lightBlue hover:bg-primary-lightBlue hover:text-white"
                >
                  Log in
                </Button>
              </Link>

              <Link href="/auth/register" className="hidden sm:block">
                <Button size="sm">Sign up</Button>
              </Link>

              <div className="md:hidden">
                <button
                  className="text-primary-lightBlue p-2"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 18L18 6M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6h16M4 12h16M4 18h16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu - separate from the navbar */}
      {mobileMenuOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 md:hidden mobile-menu-container">
          <div className="bg-background-dark shadow-lg">
            <div className="container mx-auto px-8 py-6">
              <div className="flex justify-between items-center mb-6">
                <Image src="/logo.png" alt="Transpass" width={40} height={40} />
                <button
                  className="text-primary-lightBlue p-2"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <a
                  href="#how-it-works"
                  className="block py-3 text-primary-lightBlue hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How it works
                </a>
                <a
                  href="#our-solutions"
                  className="block py-3 text-primary-lightBlue hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Our solutions
                </a>
                <a
                  href="#why-use-transpass"
                  className="block py-3 text-primary-lightBlue hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Why should you use Transpass
                </a>
                <a
                  href="#contact"
                  className="block py-3 text-primary-lightBlue hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>

                <div className="pt-4 flex flex-col space-y-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full text-primary-lightBlue border-primary-lightBlue hover:bg-primary-lightBlue hover:text-white"
                    >
                      Log in
                    </Button>
                  </Link>

                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
