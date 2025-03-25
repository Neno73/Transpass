import React from "react";
import Image from "next/image";
import Link from "next/link";

export const SolutionsSection = () => {
  return (
    <section id="our-solutions" className="py-24 bg-gray-50 relative">
      <div className="container mx-auto px-6 z-10 relative">
        <h2 className="text-2xl sm:text-5xl md:text-4xl font-bold text-center text-background-dark mb-20">
          Our solutions
        </h2>

        {/* For Suppliers & Brands */}
        <div className="max-w-6xl mx-auto mb-24">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="w-full lg:w-1/2 relative">
              <div
                className="rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-500 hover:scale-[1.02] aspect-[4/3]"
                style={{
                  boxShadow:
                    "0 20px 100px -10px var(--light-blue-1), 0 10px 20px -10px var(--light-blue-1)",
                }}
              >
                <Image
                  src="/scan-clothing.png"
                  alt="Suppliers and Brands"
                  width={1000}
                  height={1000}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover h-[101%]"
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
              <div className="inline-block px-4 py-1 bg-primary-lightest rounded-full mb-4">
                <p className="text-primary-lightBlue text-sm font-semibold">
                  FOR SUPPLIERS & BRANDS
                </p>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
                Join your company
              </h3>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                The EU Digital Product Passport is coming — is your business
                prepared to meet and thrive under these new regulations?
                Let&apos;s ensure you&apos;re ahead of the curve. Easily fill
                out a form and join your company in our growing community.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full font-medium transition-colors hover:bg-primary-dark"
              >
                Learn more
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
          </div>
        </div>

        {/* For Brands */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
              <div className="inline-block px-4 py-1 bg-primary-lightest rounded-full mb-4">
                <p className="text-primary-lightBlue text-sm font-semibold">
                  FOR BRANDS
                </p>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
                Add your products
              </h3>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Use our platform to easily manage all products, batches and
                suppliers. You may not know your full supply chain from the
                beginning, but you can use Transpass to collect ESG data for
                your products. Use a digital tag for customers to access your
                product&apos;s lifecycle.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full font-medium transition-colors hover:bg-primary-dark"
              >
                Learn more
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

            <div className="w-full lg:w-1/2 relative">
              <div
                className="rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-500 hover:scale-[1.02] aspect-[4/3]"
                style={{
                  boxShadow:
                    "0 20px 100px -10px var(--light-blue-1), 0 10px 20px -10px var(--light-blue-1)",
                }}
              >
                <Image
                  src="/digital-product.png"
                  alt="For Brands"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image
        src="/background-logo.svg"
        alt="Landing Background"
        width={1000}
        height={1000}
        className="object-cover absolute bottom-0  z-0"
      />
    </section>
  );
};
