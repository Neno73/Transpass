import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export const Navbar = () => {
  return (
    <nav className="bg-white py-4 sticky top-0 shadow-sm z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg width="66" height="64" viewBox="0 0 66 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 w-auto">
              <path d="M33 0C14.775 0 0 14.775 0 33s14.775 33 33 33 33-14.775 33-33S51.225 0 33 0z" fill="#3D4EAD" fillOpacity="0.1"/>
              <rect x="15" y="15" width="12" height="12" rx="2" fill="#3D4EAD"/>
              <rect x="15" y="31" width="12" height="12" rx="2" fill="#3D4EAD"/>
              <rect x="15" y="47" width="12" height="12" rx="2" fill="#3D4EAD"/>
              <rect x="31" y="15" width="12" height="12" rx="2" fill="#3D4EAD"/>
              <rect x="31" y="31" width="12" height="12" rx="2" fill="#FFFFFF"/>
              <rect x="31" y="47" width="12" height="12" rx="2" fill="#3D4EAD"/>
              <rect x="47" y="15" width="12" height="12" rx="2" fill="#3D4EAD"/>
              <rect x="47" y="31" width="12" height="12" rx="2" fill="#3D4EAD"/>
              <rect x="47" y="47" width="12" height="12" rx="2" fill="#3D4EAD"/>
            </svg>
            <span className="text-xl font-bold ml-2 uppercase">TRANSPASS</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#how-it-works" className="text-gray-800 flex items-center">
              How it works
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#our-solutions" className="text-gray-800 flex items-center">
              Our solutions
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#why-use-transpass" className="text-gray-800 flex items-center">
              Why should you use Transpass
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#contact" className="text-gray-800 flex items-center">
              Contact
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>

            <Link href="/auth/register" className="hidden sm:block">
              <Button size="sm">
                Sign up
              </Button>
            </Link>
            
            <div className="md:hidden">
              <button className="text-gray-800">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};