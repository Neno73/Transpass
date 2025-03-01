import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const HeroSection = () => {
  return (
    <section id="hero" className="relative overflow-hidden py-16 md:py-24">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -left-[300px] -top-[200px] w-[900px] h-[900px] rounded-full bg-blue-100 opacity-10"></div>
        <div className="absolute right-[10%] top-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-light-blue to-accent-blue opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-[400px] left-[10%] w-[800px] h-[800px] rounded-full bg-light-blue opacity-10 blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center relative z-10">
        {/* Left Column - Text Content */}
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-navy-800 leading-tight mb-6">
            Get ready for the<br />EU Digital Product Passport
          </h1>
          <p className="text-base md:text-xl text-gray-700 opacity-70 mb-8 max-w-2xl">
            Connecting fashion brands and suppliers through simplified ESG compliance, 
            streamlined data collection and engaging storytelling
          </p>
          <Link href="/auth/register" className="inline-block">
            <button className="bg-gray-800 bg-opacity-70 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-opacity-80 transition-all">
              Sign up now
            </button>
          </Link>
        </div>
        
        {/* Right Column - App Preview */}
        <div className="w-full lg:w-1/2 relative">
          <div className="relative flex items-center justify-center">
            {/* Mobile App Preview */}
            <div className="w-64 md:w-80 bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="w-full h-full bg-gray-100">
                {/* Placeholder for app preview */}
                <div className="aspect-[9/16] bg-white flex items-center justify-center">
                  <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-6">
                    <div className="w-40 h-40 bg-primary-lightest rounded-lg mb-4 flex items-center justify-center">
                      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9h18M9 21V9m6 0v12M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-gray-800 text-xl font-semibold mb-1">Product Passport</h3>
                    <p className="text-sm text-gray-500 text-center">Scan QR code to access product details</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Feature Cards */}
            <div className="absolute top-[10%] -right-16 bg-blue-50 bg-opacity-60 border border-blue-200 rounded-lg p-4 shadow-lg w-64">
              <h3 className="text-primary font-medium text-sm">Track product's lifecycle</h3>
            </div>
            
            <div className="absolute top-[40%] -right-12 bg-blue-50 bg-opacity-60 border border-blue-200 rounded-lg p-4 shadow-lg w-64">
              <h3 className="text-gray-700 opacity-70 font-medium text-sm">Collect ESG data</h3>
            </div>
            
            <div className="absolute top-[70%] -right-16 bg-blue-50 bg-opacity-60 border border-blue-200 rounded-lg p-4 shadow-lg w-64">
              <h3 className="text-gray-700 opacity-70 font-medium text-sm">Easy and accessible</h3>
            </div>
            
            {/* Product Example Card */}
            <div className="absolute -left-16 top-[20%] bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg w-64 flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-primary-lightest flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.3992 9.7C20.3992 14.6 12.3992 21.5 12.3992 21.5C12.3992 21.5 4.39922 14.6 4.39922 9.7C4.39922 5.6 8.09922 2 12.3992 2C16.6992 2 20.3992 5.7 20.3992 9.7Z" stroke="#3D4EAD" strokeWidth="2"/>
                  <circle cx="12.3992" cy="9.7" r="2.5" stroke="#3D4EAD" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <h4 className="text-primary text-sm font-medium">Premium wool jumper</h4>
                <p className="text-gray-600 text-xs">by LEAP CONCEPT</p>
                <div className="flex mt-1">
                  <div className="w-3 h-3 rounded-full bg-white mr-1"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-800 opacity-70 mr-1"></div>
                  <div className="w-3 h-3 rounded-full bg-navy-800"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};