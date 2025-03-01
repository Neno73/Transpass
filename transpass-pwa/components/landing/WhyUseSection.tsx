import React from 'react';
import Image from 'next/image';

export const WhyUseSection = () => {
  const benefits = [
    {
      title: "EU Regulations",
      description: "The DPP (Digital Product Passport) will soon become mandatory for the textile industry. Brands need it to ensure transparency, enhance sustainability, and comply with EU regulations.",
      icon: "/icons/eu-regulations.svg",
      iconFallback: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 8c-.49-.7-1.29-1-2-1-1.48 0-3 1.11-3 2.5 0 .83.47 1.21 1.76 1.67C11.85 11.53 13 11.9 13 13.5c0 1.39-1.51 2.5-3 2.5-.74 0-1.49-.27-2-.75M12 6v1m0 11v-1" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Sustainability",
      description: "Gain more insight into your ecological footprint with each product you buy so that you can make environmental improvements",
      icon: "/icons/sustainability.svg",
      iconFallback: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8v7m-2-2h4m4-2c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm5 0c0 7.18-5.82 13-13 13S1 15.18 1 8 6.82-5 14-5" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Digital records",
      description: "Transpass provides a digital record of a product's lifecycle, including materials, production processes, and recycling information",
      icon: "/icons/digital-records.svg",
      iconFallback: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 21h10a2 2 0 002-2V9.41a1 1 0 00-.29-.7l-5.83-5.83a1 1 0 00-.7-.29H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 2v6a1 1 0 001 1h6" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <section id="why-use-transpass" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy-800 text-center mb-20">
          Why should you use Transpass?
        </h2>
        
        <div className="flex flex-col md:flex-row justify-between">
          {benefits.map((benefit, index) => (
            <div key={index} className="w-full md:w-1/3 px-6 mb-12 md:mb-0">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 flex items-center justify-center">
                  {benefit.iconFallback}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-accent-blue text-center mb-4">{benefit.title}</h3>
              <p className="text-lg text-gray-700 opacity-70 text-center">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};