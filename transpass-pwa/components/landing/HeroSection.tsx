import React from "react";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden py-16 md:py-24 bg-background-dark h-screen flex items-center"
      style={{
        backgroundImage: "url('/background-logo.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h1 className="text-white text-5xl font-bold md:mt-16">
          Your Digital Product Passport
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 md:mb-0 mt-4 md:mt-2 leading-relaxed">
          Connecting fashion brands and suppliers through simplified ESG
          compliance, streamlined data collection and engaging storytelling
        </p>

        <div className="mt-10 md:hidden block">
          <Link
            href="/auth/register"
            className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 inline-flex items-center"
          >
            Get Started
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
        <div className="md:block hidden max-w-4xl mx-auto relative">
          <div className="mt-10 md:block hidden absolute top-16 right-1/2 translate-x-1/2">
            <Link
              href="/auth/register"
              className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 inline-flex items-center"
            >
              Get Started
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
          <Image
            src="/hero-image.png"
            alt="Hero Image"
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};
