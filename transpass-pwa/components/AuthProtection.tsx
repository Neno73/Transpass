'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';

interface AuthProtectionProps {
  children: React.ReactNode;
  companyOnly?: boolean;
  userOnly?: boolean;
  hideScanOption?: boolean;
}

export default function AuthProtection({ 
  children, 
  companyOnly = false,
  userOnly = false,
  hideScanOption = false 
}: AuthProtectionProps) {
  const { user, userData, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // User is not authenticated, redirect to login with return URL
        const currentPath = window.location.pathname;
        router.push(`/auth/login?returnUrl=${encodeURIComponent(currentPath)}`);
      } else if (companyOnly && userData && !userData.isCompany) {
        // If company-only route but user is not a company, redirect to user dashboard
        router.push('/user/dashboard');
      } else if (userOnly && userData && userData.isCompany) {
        // If user-only route but user is a company, redirect to company dashboard
        router.push('/company/dashboard');
      }
    }
  }, [user, userData, isLoading, router, companyOnly, userOnly]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authentication check is complete and user is authenticated
  if (!isLoading && user) {
    // For company-only routes, check if user is a company
    if (companyOnly && userData && !userData.isCompany) {
      return null; // Will be redirected by the useEffect
    }
    
    // For user-only routes, check if user is not a company
    if (userOnly && userData && userData.isCompany) {
      return null; // Will be redirected by the useEffect
    }
    
    // If we need to hide scan option for companies
    if (hideScanOption && userData?.isCompany) {
      // This can be used by parent components to check this prop
      // and conditionally render scan-related UI elements
    }
    
    // Otherwise, render children
    return <>{children}</>;
  }

  // User is not authenticated (will be redirected by useEffect)
  return null;
}