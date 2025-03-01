'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import AuthProtection from '../../../components/AuthProtection';
import { useAuth } from '../../../lib/AuthContext';
import { signOut } from '../../../lib/auth';
import { useRouter } from 'next/navigation';

export default function UserProfilePage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userData?.displayName || '',
    email: userData?.email || '',
  });
  
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update profile logic would go here
    alert('Profile update functionality would go here');
  };

  return (
    <AuthProtection userOnly>
      <div className="min-h-screen bg-primary-lightest">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="inline-flex items-center">
                    <svg width="32" height="32" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="60" height="60" rx="8" fill="#3D4EAD" fillOpacity="0.2"/>
                      <circle cx="12" cy="12" r="6" fill="#3D4EAD"/>
                      <circle cx="30" cy="12" r="6" fill="#3D4EAD"/>
                      <circle cx="48" cy="12" r="6" fill="#3D4EAD"/>
                      <circle cx="12" cy="30" r="6" fill="#3D4EAD"/>
                      <circle cx="30" cy="30" r="6" fill="#FFFFFF"/>
                      <circle cx="48" cy="30" r="6" fill="#3D4EAD"/>
                      <circle cx="12" cy="48" r="6" fill="#3D4EAD"/>
                      <circle cx="30" cy="48" r="6" fill="#3D4EAD"/>
                      <circle cx="48" cy="48" r="6" fill="#3D4EAD"/>
                    </svg>
                    <span className="ml-2 text-xl font-bold text-primary">Transpass</span>
                  </Link>
                </div>
                <nav className="ml-6 flex space-x-8">
                  <Link
                    href="/user/dashboard"
                    className="border-transparent text-gray hover:text-gray-dark hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/user/history"
                    className="border-transparent text-gray hover:text-gray-dark hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Scan History
                  </Link>
                  <Link
                    href="/scan"
                    className="border-transparent text-gray hover:text-gray-dark hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Scan
                  </Link>
                </nav>
              </div>
              <div className="flex items-center">
                <div className="ml-3 relative flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-dark">
                    {userData?.displayName || 'User'}
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary-lightest flex items-center justify-center text-primary font-medium">
                    {userData?.displayName ? userData.displayName.charAt(0) : 'U'}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing out...' : 'Sign out'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="py-10">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Page header */}
            <div className="px-4 sm:px-0 mb-8">
              <h1 className="text-2xl font-bold text-gray-dark">Your Profile</h1>
              <p className="mt-1 text-sm text-gray">
                Update your profile information
              </p>
            </div>

            {/* Profile form */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-dark">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      id="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-dark">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                    />
                    <p className="mt-1 text-sm text-gray">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="pt-5">
                    <Button type="submit" className="w-full sm:w-auto">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthProtection>
  );
}