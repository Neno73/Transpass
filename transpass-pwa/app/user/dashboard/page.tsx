'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import AuthProtection from '../../../components/AuthProtection';
import { useAuth } from '../../../lib/AuthContext';
import { signOut } from '../../../lib/auth';
import { useRouter } from 'next/navigation';
import { getUserScanHistory, ScanHistoryRecord } from '../../../lib/products';

export default function UserDashboard() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistoryRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  
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
  
  useEffect(() => {
    const fetchScanHistory = async () => {
      if (!user) return;
      
      try {
        setHistoryLoading(true);
        const history = await getUserScanHistory(user.uid);
        setScanHistory(history);
      } catch (err) {
        console.error("Error fetching scan history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };
    
    fetchScanHistory();
  }, [user]);

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
                    className="border-b-2 border-primary text-primary inline-flex items-center px-1 pt-1 text-sm font-medium"
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
          <div className="px-4 sm:px-0 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-dark">User Dashboard</h1>
              <p className="mt-1 text-sm text-gray">
                Welcome to your dashboard! Track your scanned products and manage your preferences.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link href="/scan">
                <Button className="flex items-center">
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zm9-2a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2h1v1h-1V5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zm9-2a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3zm1 2h1v1h-1v-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Scan Product
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray truncate">Total Scans</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-dark">
                    {historyLoading ? (
                      <div className="h-8 w-8 border-2 border-primary-light border-t-primary rounded-full animate-spin"></div>
                    ) : (
                      scanHistory.length
                    )}
                  </dd>
                </dl>
              </div>
              <div className="bg-primary-lightest px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link href="/user/history" className="font-medium text-primary hover:text-primary-dark">
                    View scan history
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray truncate">Recent Activity</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-dark">
                    {historyLoading ? (
                      <div className="h-8 w-8 border-2 border-primary-light border-t-primary rounded-full animate-spin"></div>
                    ) : (
                      scanHistory.filter(item => {
                        const date = item.scannedAt?.toDate ? 
                          item.scannedAt.toDate() : 
                          new Date(item.scannedAt);
                        return date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
                      }).length
                    )}
                  </dd>
                </dl>
              </div>
              <div className="bg-primary-lightest px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link href="/scan" className="font-medium text-primary hover:text-primary-dark">
                    Scan a product
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent scans */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-dark mb-4">Recent Scans</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {historyLoading ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 border-4 border-primary-light border-t-primary rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-gray">Loading recent scans...</p>
                </div>
              ) : scanHistory.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {scanHistory.slice(0, 5).map((scan) => (
                    <li key={scan.id}>
                      <Link 
                        href={`/p/${scan.productId}`}
                        className="block hover:bg-primary-lightest transition"
                      >
                        <div className="px-4 py-4 sm:px-6 flex items-center">
                          <div className="min-w-0 flex-1 flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-primary-lightest rounded-md flex items-center justify-center overflow-hidden">
                              {scan.imageUrl ? (
                                <img src={scan.imageUrl} alt={scan.productName} className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-primary font-medium">{scan.productName?.charAt(0) || 'P'}</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1 px-4">
                              <div>
                                <p className="text-sm font-medium text-primary truncate">{scan.productName || 'Product'}</p>
                                <p className="mt-1 flex items-center text-sm text-gray">
                                  <span className="truncate">
                                    Scanned: {scan.scannedAt?.toDate ? 
                                      scan.scannedAt.toDate().toLocaleString() : 
                                      new Date(scan.scannedAt).toLocaleString()}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-5 flex-shrink-0">
                            <svg className="h-5 w-5 text-gray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 px-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-dark">No scan history yet</h3>
                  <p className="mt-1 text-sm text-gray">
                    Start by scanning a product QR code to see its details.
                  </p>
                  <div className="mt-6">
                    <Link href="/scan">
                      <Button size="sm" className="inline-flex items-center">
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zm9-2a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2h1v1h-1V5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zm9-2a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3zm1 2h1v1h-1v-1z" clipRule="evenodd" />
                        </svg>
                        Scan a product
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-dark mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-primary">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-lightest flex items-center justify-center">
                    <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <Link href="/scan" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-dark">Scan Product</p>
                    <p className="text-sm text-gray truncate">Scan a QR code to view product details</p>
                  </Link>
                </div>
              </div>

              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-primary">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-lightest flex items-center justify-center">
                    <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <Link href="/user/profile" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-dark">Update Profile</p>
                    <p className="text-sm text-gray truncate">Edit your profile information</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </AuthProtection>
  );
}