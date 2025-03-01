import React from 'react';
import Image from 'next/image';

export const HowItWorksSection = () => {
  const steps = [
    {
      step: "STEP 1",
      title: "Scan the QR code on the garment label",
      icon: "/icons/scan-icon.svg",
      iconFallback: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 3H3v4h4V3z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 3h-4v4h4V3z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 17H3v4h4v-4z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 17h-4v4h4v-4z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      step: "STEP 2",
      title: "View all product details and story",
      icon: "/icons/details-icon.svg",
      iconFallback: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 7v6l4 2M12 22a10 10 0 100-20 10 10 0 000 20z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      step: "STEP 3",
      title: "Have your profile with your scanned garments",
      icon: "/icons/profile-icon.svg",
      iconFallback: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy-800 mb-16">How it works</h2>
        
        <div className="flex flex-col md:flex-row justify-between items-start">
          {steps.map((item, index) => (
            <div key={index} className="w-full md:w-1/3 px-4 mb-12 md:mb-0 flex flex-col items-center">
              <div className="bg-white rounded-full p-6 mb-6 relative shadow-md">
                {item.iconFallback}
                
                {/* Connecting lines */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-light-blue"></div>
                )}
              </div>
              
              <h3 className="text-sm font-semibold text-accent-blue mb-2">{item.step}</h3>
              <p className="text-center text-gray-800 font-medium">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};