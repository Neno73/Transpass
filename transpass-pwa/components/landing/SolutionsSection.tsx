import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const SolutionsSection = () => {
  return (
    <section id="our-solutions" className="py-16">
      <div className="container mx-auto px-6 mb-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy-800 text-center mb-16">Our solutions</h2>
      </div>
      
      {/* For Suppliers & Brands */}
      <div className="relative overflow-hidden mb-20">
        {/* Background decorative elements */}
        <div className="absolute left-0 bottom-0 w-full h-full">
          <div className="absolute right-1/4 top-0 w-[600px] h-[600px] rounded-full 
                          bg-gradient-to-br from-light-blue to-accent-blue opacity-10 blur-3xl">
          </div>
          <div className="absolute -left-64 bottom-0 w-[500px] h-[400px] rounded-full 
                          bg-accent-blue opacity-40 blur-3xl">
          </div>
        </div>
        
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0 relative z-10">
            <div className="w-full h-80 bg-gray-200 rounded-lg shadow-xl overflow-hidden flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5117 15.0117C22.5117 16.6152 21.2031 17.9531 19.5586 17.9531H17.3789V21.4219C17.3789 23.0547 16.0703 24.3633 14.4375 24.3633H4.67578C3.07227 24.3633 1.76367 23.0547 1.76367 21.4219V3.17578C1.76367 1.57227 3.07227 0.263672 4.67578 0.263672H14.4375C16.0703 0.263672 17.3789 1.57227 17.3789 3.17578V6.64453H19.5586C21.2031 6.64453 22.5117 7.95312 22.5117 9.58594V15.0117ZM14.4375 22.5938C15.0859 22.5938 15.6094 22.0703 15.6094 21.4219V3.17578C15.6094 2.55664 15.0859 2.00391 14.4375 2.00391H4.67578C4.05664 2.00391 3.50391 2.55664 3.50391 3.17578V21.4219C3.50391 22.0703 4.05664 22.5938 4.67578 22.5938H14.4375ZM20.7422 9.58594C20.7422 8.9375 20.2188 8.41406 19.5586 8.41406H17.3789V16.1836H19.5586C20.2188 16.1836 20.7422 15.6602 20.7422 15.0117V9.58594Z" fill="#3D4EAD"/>
              </svg>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 lg:pl-16 relative z-10">
            <p className="text-accent-blue text-xl font-semibold mb-2">FOR SUPPLIERS & BRANDS</p>
            <h3 className="text-3xl sm:text-5xl font-bold text-primary mb-6">Join your company</h3>
            <p className="text-xl sm:text-2xl text-gray-700 opacity-70 mb-8">
              The EU Digital Product Passport is coming — is your business prepared to meet and 
              thrive under these new regulations? Let's ensure you're ahead of the curve. Easily 
              fill out a form and join your company in our growing community.
            </p>
            <Link href="/auth/register" className="inline-block">
              <button className="bg-primary text-white px-8 py-3 rounded-lg text-xl font-semibold 
                            hover:bg-primary-dark transition-all">
                Learn more
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* For Brands */}
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute left-0 bottom-0 w-full h-full">
          <div className="absolute left-1/4 top-0 w-[600px] h-[600px] rounded-full 
                          bg-gradient-to-br from-light-blue to-accent-blue opacity-10 blur-3xl">
          </div>
          <div className="absolute -right-64 bottom-0 w-[500px] h-[400px] rounded-full 
                          bg-accent-blue opacity-40 blur-3xl">
          </div>
        </div>
        
        <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center">
          <div className="w-full lg:w-1/2 lg:pr-16 relative z-10">
            <p className="text-accent-blue text-xl font-semibold mb-2">FOR BRANDS</p>
            <h3 className="text-3xl sm:text-5xl font-bold text-primary mb-6">Add your products</h3>
            <p className="text-xl sm:text-2xl text-gray-700 opacity-70 mb-8">
              Use our platform to easily manage all products, batches and suppliers. You may not 
              know your full supply chain from the beginning, but you can use Transpass to collect 
              ESG data for your products. Use a digital tag for customers to access your product's 
              lifecycle.
            </p>
            <Link href="/auth/register" className="inline-block">
              <button className="bg-primary text-white px-8 py-3 rounded-lg text-xl font-semibold 
                            hover:bg-primary-dark transition-all">
                Learn more
              </button>
            </Link>
          </div>
          
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0 relative z-10">
            <div className="w-full h-80 bg-gray-200 rounded-lg shadow-xl overflow-hidden flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9h18M9 21V9m6 0v12M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};