import React from "react";
import Image from "next/image";
import Link from "next/link";

export const FooterSection = () => {
  const footerLinks = [
    { name: "How it works", href: "#how-it-works" },
    { name: "Our solutions", href: "#our-solutions" },
    { name: "Why use TransPass", href: "#why-use" },
    { name: "Contact us", href: "#contact" },
  ];

  return (
    <footer className="bg-background-dark py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/background-logo.svg"
          alt="Background Pattern"
          fill
          className="object-cover"
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center">
          {/* Logo and Tagline */}
          <div className="mb-12 text-center">
            <Image
              src="/logo.svg"
              alt="TransPass Logo"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-white">TRANSPASS</h3>
            <p className="text-primary-lightBlue mt-1">from atom to attire</p>
          </div>

          {/* Navigation Links */}
          <nav className="mb-12">
            <ul className="flex flex-wrap justify-center gap-8">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm md:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Divider */}
          <div className="w-full h-px bg-primary-lightBlue mb-8"></div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} TransPass. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-gray-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-gray-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
