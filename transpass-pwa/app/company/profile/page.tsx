'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/Button';
import AuthProtection from '../../../components/AuthProtection';
import { useAuth } from '../../../lib/AuthContext';
import { updateUserProfile } from '../../../lib/auth';
import Link from 'next/link';

export default function CompanyProfile() {
  const { user, userData, refreshUserData } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    displayName: '',
    email: '',
    website: '',
    description: '',
    phone: '',
    address: ''
  });

  // Initialize form with user data when available
  useEffect(() => {
    if (userData) {
      setFormData({
        companyName: userData.companyName || '',
        displayName: userData.displayName || '',
        email: userData.email || '',
        website: userData.website || '',
        description: userData.description || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      await updateUserProfile(user, {
        companyName: formData.companyName,
        displayName: formData.displayName,
        website: formData.website,
        description: formData.description,
        phone: formData.phone,
        address: formData.address
      });
      
      // Refresh user data to reflect changes
      await refreshUserData();
      setFormSubmitted(true);
      
      // Reset form submission status after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthProtection companyOnly>
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
                    href="/company/dashboard"
                    className="border-transparent text-gray hover:text-gray-dark hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/company/products"
                    className="border-transparent text-gray hover:text-gray-dark hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Products
                  </Link>
                  <Link
                    href="/company/profile"
                    className="border-b-2 border-primary text-primary inline-flex items-center px-1 pt-1 text-sm font-medium"
                  >
                    Profile
                  </Link>
                </nav>
              </div>
              <div className="flex items-center">
                <div className="ml-3 relative flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-dark">
                    {userData?.companyName || userData?.displayName || 'Company'}
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary-lightest flex items-center justify-center text-primary font-medium">
                    {userData?.companyName ? userData.companyName.charAt(0) : 'C'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="py-10">
          <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
            {/* Page header */}
            <div className="px-4 sm:px-0 mb-8">
              <h1 className="text-2xl font-bold text-gray-dark">Company Profile</h1>
              <p className="mt-1 text-sm text-gray">
                Manage your company information and settings
              </p>
            </div>

            {/* Success message */}
            {formSubmitted && (
              <div className="mb-6 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Profile updated successfully</h3>
                  </div>
                </div>
              </div>
            )}

            {/* Profile form */}
            <div className="bg-white shadow sm:rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-dark">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-dark">
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      id="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      required
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-gray-50"
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray">Email cannot be changed</p>
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-dark">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      id="website"
                      placeholder="https://example.com"
                      value={formData.website}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-dark">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-dark">
                      Business Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-dark">
                    Company Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="Describe your company, products, and services"
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <Link href="/company/dashboard">
                    <Button variant="outline" className="mr-3">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </AuthProtection>
  );
}