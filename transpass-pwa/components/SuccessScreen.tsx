import React from 'react';
import Link from 'next/link';

interface SuccessScreenProps {
  children?: React.ReactNode;
  title?: string;
}

export function SuccessScreen({ children, title = "Product successfully submitted!" }: SuccessScreenProps) {
  return (
    <div className="min-h-screen bg-primary p-6 flex flex-col items-center justify-center max-w-md mx-auto">
      {/* Logo */}
      <div className="mb-12">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="8" fill="#A3B1F6" fillOpacity="0.2"/>
          <circle cx="12" cy="12" r="6" fill="#A3B1F6"/>
          <circle cx="30" cy="12" r="6" fill="#A3B1F6"/>
          <circle cx="48" cy="12" r="6" fill="#A3B1F6"/>
          <circle cx="12" cy="30" r="6" fill="#A3B1F6"/>
          <circle cx="30" cy="30" r="6" fill="#FFFFFF"/>
          <circle cx="48" cy="30" r="6" fill="#A3B1F6"/>
          <circle cx="12" cy="48" r="6" fill="#A3B1F6"/>
          <circle cx="30" cy="48" r="6" fill="#A3B1F6"/>
          <circle cx="48" cy="48" r="6" fill="#A3B1F6"/>
        </svg>
      </div>
      
      {/* Success Animation */}
      <div className="relative mb-8">
        {/* Animated dots and squiggles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="60" r="4" fill="#A3B1F6" fillOpacity="0.6"/>
            <circle cx="160" cy="60" r="4" fill="#A3B1F6" fillOpacity="0.6"/>
            <circle cx="100" cy="40" r="4" fill="#A3B1F6" fillOpacity="0.6"/>
            <circle cx="60" cy="140" r="4" fill="#A3B1F6" fillOpacity="0.6"/>
            <circle cx="140" cy="140" r="4" fill="#A3B1F6" fillOpacity="0.6"/>
            <path d="M40 80 C 30 90, 30 110, 50 120" stroke="#A3B1F6" strokeWidth="3" strokeLinecap="round"/>
            <path d="M160 80 C 170 90, 170 110, 150 120" stroke="#A3B1F6" strokeWidth="3" strokeLinecap="round"/>
            <path d="M70 40 C 60 50, 50 60, 60 70" stroke="#A3B1F6" strokeWidth="3" strokeLinecap="round"/>
            <path d="M130 40 C 140 50, 150 60, 140 70" stroke="#A3B1F6" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        
        {/* Success checkmark */}
        <div className="relative z-10 bg-white rounded-full p-4 w-24 h-24 flex items-center justify-center shadow-lg mx-auto">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12L10 17L19 8" stroke="#3D4EAD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {/* Success Text */}
      <h1 className="text-2xl font-bold text-white text-center mb-16">
        {title}
      </h1>
      
      {/* Render children if provided */}
      {children}
      
      {/* Contact Link */}
      <div className="mt-auto pt-16 text-white text-sm">
        Have any questions? <Link href="/contact" className="underline">Contact us</Link>
      </div>
    </div>
  );
}

// Default export for backwards compatibility
export default function DefaultSuccessScreen() {
  return (
    <SuccessScreen>
      {/* This will be replaced by the component implementation */}
    </SuccessScreen>
  );
}