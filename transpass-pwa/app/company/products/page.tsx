'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { getUserProducts, Product } from '../../../lib/products';
import { useAuth } from '../../../lib/AuthContext';
import AuthProtection from '../../../components/AuthProtection';

export default function ProductsListPage() {
  return (
    <AuthProtection companyOnly>
      <ProductsList />
    </AuthProtection>
  );
}

function ProductsList() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [networkError, setNetworkError] = useState<string | null>(null);
  
  // Function to check network status and update state
  const checkNetworkStatus = () => {
    if (typeof window !== 'undefined') {
      const isOnline = window.navigator.onLine;
      setNetworkError(isOnline ? null : "You appear to be offline. Please check your internet connection and try again.");
      return isOnline;
    }
    return true;
  };
  
  // Add event listeners for online/offline status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => {
        console.log('Browser reports online status');
        setNetworkError(null);
        // Refresh data automatically when coming back online
        if (user?.uid) {
          setLoading(true);
          getUserProducts(user.uid)
            .then(fetchedProducts => {
              setProducts(fetchedProducts);
            })
            .finally(() => setLoading(false));
        }
      };
      
      const handleOffline = () => {
        console.log('Browser reports offline status');
        setNetworkError("You appear to be offline. Please check your internet connection and try again.");
      };
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      // Initial check
      checkNetworkStatus();
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [user]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (user?.uid) {
          // Check network status before attempting fetch
          if (!checkNetworkStatus()) {
            setLoading(false);
            return;
          }
          
          console.log('Attempting to fetch products for user:', user.uid);
          const fetchedProducts = await getUserProducts(user.uid);
          console.log('Fetched products:', fetchedProducts);
          setProducts(fetchedProducts);
          setNetworkError(null); // Clear any previous network error
        } else {
          console.log('No user UID available for fetching products');
        }
      } catch (error: any) {
        console.error('Error fetching products:', error);
        // If it's a network-related error, show user-friendly message
        if (error.code === 'failed-precondition' || 
            error.code === 'unavailable' || 
            error.message.includes('offline')) {
          setNetworkError("Unable to connect to the database. Please check your internet connection and try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Filter products based on search query and filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'with-components') return matchesSearch && product.components && product.components.length > 0;
    if (filter === 'without-components') return matchesSearch && (!product.components || product.components.length === 0);
    
    return matchesSearch;
  });

  return (
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
                  className="border-primary text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Products
                </Link>
                <Link
                  href="/scan"
                  className="border-transparent text-gray hover:text-gray-dark hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  <svg 
                    className="mr-1 h-4 w-4" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <path d="M8 7v4h4V7H8z"></path>
                    <path d="M12 7v4h4V7h-4z"></path>
                    <path d="M8 11v4h4v-4H8z"></path>
                    <path d="M12 11v4h4v-4h-4z"></path>
                  </svg>
                  Scan
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  console.log('Manually refreshing product list');
                  setLoading(true);
                  if (user?.uid) {
                    getUserProducts(user.uid)
                      .then(fetchedProducts => {
                        console.log('Products refreshed:', fetchedProducts);
                        setProducts(fetchedProducts);
                      })
                      .catch(err => console.error('Refresh error:', err))
                      .finally(() => setLoading(false));
                  }
                }}
              >
                Refresh Products
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="px-4 sm:px-0 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-dark">Products</h1>
              <p className="mt-1 text-sm text-gray">
                Manage your product catalog and digital product passports
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <Link href="/company/products/qrcodes">
                <Button variant="outline" className="flex items-center w-full sm:w-auto justify-center">
                  <svg 
                    className="-ml-1 mr-2 h-5 w-5" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <path d="M8 7v4h4V7H8z"></path>
                    <path d="M12 7v4h4V7h-4z"></path>
                    <path d="M8 11v4h4v-4H8z"></path>
                    <path d="M12 11v4h4v-4h-4z"></path>
                  </svg>
                  QR Codes
                </Button>
              </Link>
              <Link href="/company/products/create">
                <Button className="flex items-center w-full sm:w-auto justify-center">
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add New Product
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and filters */}
          <div className="px-4 sm:px-0 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Search products"
                  />
                </div>
              </div>
              <div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option value="all">All Products</option>
                  <option value="with-components">With Components</option>
                  <option value="without-components">Without Components</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product list */}
          {networkError && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    {networkError}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-6 text-center border border-gray-300 border-dashed rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-dark">No products</h3>
              <p className="mt-1 text-sm text-gray">Get started by creating a new product.</p>
              <div className="mt-6">
                <Link href="/company/products/create">
                  <Button>
                    Add New Product
                  </Button>
                </Link>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white p-6 text-center border border-gray-300 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-dark">No matching products</h3>
              <p className="mt-1 text-sm text-gray">Try adjusting your search or filter to find what you're looking for.</p>
              <div className="mt-6">
                <Button variant="outline" onClick={() => { setSearchQuery(''); setFilter('all'); }}>
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <li key={product.id}>
                    <Link 
                      href={`/company/products/${product.id}`}
                      className="block hover:bg-primary-lightest transition"
                    >
                      <div className="px-4 py-4 sm:px-6 flex items-center">
                        <div className="min-w-0 flex-1 flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-primary-lightest rounded-md flex items-center justify-center overflow-hidden">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-primary font-medium">{product.name.charAt(0)}</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1 px-4">
                            <div>
                              <p className="text-sm font-medium text-primary truncate">{product.name}</p>
                              <p className="mt-1 flex items-center text-sm text-gray">
                                <span className="truncate">{product.model}</span>
                              </p>
                            </div>
                            <div className="mt-1">
                              {product.components && product.components.length > 0 ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {product.components.length} {product.components.length === 1 ? 'Component' : 'Components'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  No Components
                                </span>
                              )}
                              {product.category && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {product.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0 flex items-center space-x-4">
                          <span className="flex items-center text-sm text-gray">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            {Math.floor(Math.random() * 500)} scans
                          </span>
                          <svg className="h-5 w-5 text-gray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}