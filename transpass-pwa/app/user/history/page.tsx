'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import AuthProtection from '../../../components/AuthProtection';
import { useAuth } from '../../../lib/AuthContext';
import { getUserScanHistory, ScanHistoryRecord } from '../../../lib/products';

export default function ScanHistoryPage() {
  const { user, userData } = useAuth();
  const [scanHistory, setScanHistory] = useState<ScanHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchScanHistory = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const history = await getUserScanHistory(user.uid);
        setScanHistory(history);
      } catch (err) {
        console.error("Error fetching scan history:", err);
        setError("Failed to load scan history. Please try again later.");
      } finally {
        setLoading(false);
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
                    className="border-transparent text-gray hover:text-gray-dark hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/user/history"
                    className="border-b-2 border-primary text-primary inline-flex items-center px-1 pt-1 text-sm font-medium"
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
            </div>
          </div>
        </header>

        <main className="py-10">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Page header */}
            <div className="px-4 sm:px-0 mb-8">
              <h1 className="text-2xl font-bold text-gray-dark">Scan History</h1>
              <p className="mt-1 text-sm text-gray">
                Your history of scanned products
              </p>
            </div>

            {/* Scan history */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                  <p>{error}</p>
                </div>
              )}
              
              {loading ? (
                <div className="py-12 px-6 text-center">
                  <div className="w-12 h-12 border-4 border-primary-light border-t-primary rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4 text-gray">Loading scan history...</p>
                </div>
              ) : scanHistory.length > 0 ? (
                <div>
                  <ul className="divide-y divide-gray-200">
                    {scanHistory.map((scan) => (
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
                  
                  <div className="p-4 text-center">
                    <Link href="/scan">
                      <Button>
                        Scan Another Product
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-12 px-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-dark">No scan history</h3>
                  <p className="mt-1 text-sm text-gray">
                    You haven't scanned any products yet.
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
        </main>
      </div>
    </AuthProtection>
  );
}