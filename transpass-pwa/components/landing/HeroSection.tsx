import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FeaturePills from './FeaturePills';
import ProductShowcase from './ProductShowcase';

export const HeroSection = () => {
  return (
    <section id="hero" className="relative overflow-hidden py-16 md:py-24">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -left-[300px] -top-[200px] w-[900px] h-[900px] rounded-full bg-blue-100 opacity-10"></div>
        <div className="absolute right-[10%] top-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-light-blue to-accent-blue opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-[400px] left-[10%] w-[800px] h-[800px] rounded-full bg-light-blue opacity-10 blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Column - Text Content */}
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-indigo-900 leading-tight mb-6">
              Get ready for the<br />EU Digital Product Passport
            </h1>
            <p className="text-base md:text-xl text-gray-600 mb-8 max-w-2xl">
              Connecting fashion brands and suppliers through simplified ESG compliance, 
              streamlined data collection and engaging storytelling
            </p>
            <Link href="/auth/register" className="inline-block">
              <button className="bg-indigo-900 text-white px-8 py-3 rounded-[1251px] text-xl font-medium hover:bg-indigo-800 transition-all">
                Sign up now
              </button>
            </Link>
          </div>
          
          {/* Center - Feature Pills */}
          <div className="hidden lg:block">
            <FeaturePills />
          </div>
          
          {/* Right Column - Product Showcase */}
          <div className="w-full lg:w-auto">
            <ProductShowcase />
          </div>
        </div>
        
        {/* Mobile Feature Pills (only visible on mobile) */}
        <div className="lg:hidden mt-16">
          <FeaturePills />
        </div>
      </div>
    </section>
  );
};