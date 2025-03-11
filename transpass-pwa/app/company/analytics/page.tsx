'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import AuthProtection from '../../../components/AuthProtection';
import { useAuth } from '../../../lib/AuthContext';
import { getCompanyScanAnalytics } from '../../../lib/products';
import { ProductComponentInfo } from '../../../lib/products';

interface ChartDataPoint {
  date: string;
  count: number;
}

interface ProductAnalytic {
  productId: string;
  productName: string;
  scanCount: number;
}

interface ScanHistoryRecord {
  id?: string;
  userId: string;
  productId: string;
  productName?: string;
  scannedAt: any;
  imageUrl?: string;
}

interface ComponentAnalytic {
  material: string;
  totalWeight: number;
  count: number;
  recyclableCount: number;
  recyclablePercentage: number;
}

interface MaterialSummary {
  [material: string]: ComponentAnalytic;
}

export default function CompanyAnalytics() {
  const { user, userData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<{
    totalScans: number;
    productAnalytics: ProductAnalytic[];
    recentScans: ScanHistoryRecord[];
    timeSeriesData: ChartDataPoint[];
  }>({
    totalScans: 0,
    productAnalytics: [],
    recentScans: [],
    timeSeriesData: []
  });
  const [timeRange, setTimeRange] = useState<'7' | '14' | '30'>('14');
  const [componentsData, setComponentsData] = useState<{[productId: string]: ProductComponentInfo[]}>({});

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const data = await getCompanyScanAnalytics(user.uid);
          setAnalyticsData(data);
          
          // Extract component data from all products returned
          const productComponentsData: {[productId: string]: ProductComponentInfo[]} = {};
          
          // Use the products data directly from the analytics response
          if (data.products && data.products.length > 0) {
            data.products.forEach(product => {
              if (product.id && product.components && product.components.length > 0) {
                productComponentsData[product.id] = product.components;
              }
            });
          }
          
          setComponentsData(productComponentsData);
        } catch (error) {
          console.error('Error fetching analytics:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAnalytics();
  }, [user]);

  // Calculate the maximum y-axis value for the chart
  const maxCount = Math.max(
    2, // Minimum value to avoid empty charts
    ...analyticsData.timeSeriesData.map(d => d.count)
  );

  // Filter time series data based on selected range
  const filteredTimeSeriesData = analyticsData.timeSeriesData
    .slice(-parseInt(timeRange))
    .map(point => ({
      ...point,
      // Add percentage for bar height
      percentage: Math.round((point.count / maxCount) * 100)
    }));
    
  // Calculate component analytics data
  const componentAnalytics = useMemo(() => {
    const materialSummary: MaterialSummary = {};
    
    // Process all components across all products
    Object.values(componentsData).forEach(components => {
      components.forEach(component => {
        const material = component.material || 'Unknown';
        const weight = component.weight || 0;
        const isRecyclable = component.recyclable || false;
        
        if (!materialSummary[material]) {
          materialSummary[material] = {
            material,
            totalWeight: 0,
            count: 0,
            recyclableCount: 0,
            recyclablePercentage: 0
          };
        }
        
        materialSummary[material].totalWeight += weight;
        materialSummary[material].count++;
        
        if (isRecyclable) {
          materialSummary[material].recyclableCount++;
        }
      });
    });
    
    // Calculate recyclable percentages
    Object.values(materialSummary).forEach(summary => {
      summary.recyclablePercentage = summary.count > 0 
        ? Math.round((summary.recyclableCount / summary.count) * 100) 
        : 0;
    });
    
    // Convert to array and sort by total weight
    return Object.values(materialSummary).sort((a, b) => b.totalWeight - a.totalWeight);
  }, [componentsData]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    
    // Handle Firebase Timestamp or Date object
    let date: Date;
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }
    
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
                    href="/company/analytics"
                    className="border-b-2 border-primary text-primary inline-flex items-center px-1 pt-1 text-sm font-medium"
                  >
                    Analytics
                  </Link>
                  <Link
                    href="/company/profile"
                    className="border-transparent text-gray hover:text-gray-dark hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Page header */}
            <div className="px-4 sm:px-0 mb-8">
              <h1 className="text-2xl font-bold text-gray-dark">Analytics Dashboard</h1>
              <p className="mt-1 text-sm text-gray">
                Track scans and performance of your digital passports
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-primary">Loading analytics data...</div>
              </div>
            ) : (
              <>
                {/* Key Metrics */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3 px-4 sm:px-0">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dl>
                        <dt className="text-sm font-medium text-gray truncate">Total Scans</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-dark">{analyticsData.totalScans.toLocaleString()}</dd>
                      </dl>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dl>
                        <dt className="text-sm font-medium text-gray truncate">Total Products</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-dark">{analyticsData.productAnalytics.length.toLocaleString()}</dd>
                      </dl>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dl>
                        <dt className="text-sm font-medium text-gray truncate">Avg. Scans Per Product</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-dark">
                          {analyticsData.productAnalytics.length > 0 
                            ? (analyticsData.totalScans / analyticsData.productAnalytics.length).toFixed(1) 
                            : '0'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                {/* Scans Over Time Chart */}
                <div className="mt-8 bg-white shadow rounded-lg px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-dark">Scans Over Time</h2>
                    <div className="flex space-x-2">
                      <button 
                        className={`px-2 py-1 text-xs rounded ${timeRange === '7' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-dark'}`}
                        onClick={() => setTimeRange('7')}
                      >
                        7 Days
                      </button>
                      <button 
                        className={`px-2 py-1 text-xs rounded ${timeRange === '14' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-dark'}`}
                        onClick={() => setTimeRange('14')}
                      >
                        14 Days
                      </button>
                      <button 
                        className={`px-2 py-1 text-xs rounded ${timeRange === '30' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-dark'}`}
                        onClick={() => setTimeRange('30')}
                      >
                        30 Days
                      </button>
                    </div>
                  </div>
                  
                  {/* Simple bar chart */}
                  <div className="relative h-64">
                    <div className="absolute inset-0 flex items-end pb-6">
                      {filteredTimeSeriesData.map((data, index) => (
                        <div 
                          key={index} 
                          className="flex-1 flex flex-col items-center justify-end h-full"
                        >
                          <div 
                            className="w-4/5 bg-primary rounded-t" 
                            style={{ height: `${data.percentage}%`, minHeight: '4px' }}
                            title={`${data.count} scans on ${data.date}`}
                          ></div>
                          <div className="mt-2 text-xs text-gray rotate-45 origin-top-left -ml-1 w-6 truncate">
                            {formatDate(data.date)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Y-axis labels */}
                    <div className="absolute top-0 left-0 h-full flex flex-col justify-between pb-8 text-xs text-gray">
                      <div>{maxCount}</div>
                      <div>{Math.floor(maxCount / 2)}</div>
                      <div>0</div>
                    </div>
                  </div>
                </div>

                {/* Top Products */}
                <div className="mt-8 bg-white shadow rounded-lg px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-dark mb-4">Top Scanned Products</h2>
                  
                  {analyticsData.productAnalytics.length === 0 ? (
                    <p className="text-gray text-sm">No scan data available for your products yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product Name
                            </th>
                            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Scan Count
                            </th>
                            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              % of Total
                            </th>
                            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analyticsData.productAnalytics.map((product, index) => (
                            <tr key={product.productId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {product.productName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                {product.scanCount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                {analyticsData.totalScans > 0 
                                  ? Math.round((product.scanCount / analyticsData.totalScans) * 100) 
                                  : 0}%
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                <Link href={`/company/products/${product.productId}`}>
                                  <Button size="sm" variant="outline">View</Button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Component Analytics Section */}
                <div className="mt-8 bg-white shadow rounded-lg px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-dark mb-4">Component Analytics</h2>
                  
                  {componentAnalytics.length === 0 ? (
                    <p className="text-gray text-sm">No component data available. Add components to your products to see analytics.</p>
                  ) : (
                    <>
                      {/* Materials and weight summary */}
                      <div className="mb-6">
                        <h3 className="text-md font-medium text-gray-dark mb-2">Materials Summary</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Material
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Components
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Total Weight (g)
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  % Recyclable
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {componentAnalytics.map((material, index) => (
                                <tr key={material.material} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {material.material}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                    {material.count}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                    {material.totalWeight.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                    <span 
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        material.recyclablePercentage >= 75 ? 'bg-green-100 text-green-800' : 
                                        material.recyclablePercentage >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {material.recyclablePercentage}%
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {/* Sustainability metrics */}
                      <div className="mt-6">
                        <h3 className="text-md font-medium text-gray-dark mb-4">Sustainability Metrics</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Total recyclable percentage */}
                          <div className="bg-primary-lightest rounded-lg p-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-sm font-medium text-gray-dark">Recyclable Components</h4>
                                <div className="mt-1 text-2xl font-semibold text-primary">
                                  {Math.round(
                                    (componentAnalytics.reduce((sum, mat) => sum + mat.recyclableCount, 0) /
                                    componentAnalytics.reduce((sum, mat) => sum + mat.count, 0)) * 100
                                  )}%
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Total components count */}
                          <div className="bg-primary-lightest rounded-lg p-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-sm font-medium text-gray-dark">Total Components</h4>
                                <div className="mt-1 text-2xl font-semibold text-primary">
                                  {componentAnalytics.reduce((sum, mat) => sum + mat.count, 0)}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Total weight */}
                          <div className="bg-primary-lightest rounded-lg p-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-sm font-medium text-gray-dark">Total Weight</h4>
                                <div className="mt-1 text-2xl font-semibold text-primary">
                                  {componentAnalytics.reduce((sum, mat) => sum + mat.totalWeight, 0).toFixed(2)}g
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Recent Scans */}
                <div className="mt-8 bg-white shadow rounded-lg px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-dark mb-4">Recent Scan Activity</h2>
                  
                  {analyticsData.recentScans.length === 0 ? (
                    <p className="text-gray text-sm">No recent scan activity to display.</p>
                  ) : (
                    <div className="flow-root">
                      <ul className="-my-5 divide-y divide-gray-200">
                        {analyticsData.recentScans.map((scan) => (
                          <li key={scan.id} className="py-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-lightest flex items-center justify-center">
                                <span className="text-primary font-medium">
                                  {scan.productName?.[0] || 'P'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {scan.productName || 'Unknown Product'}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  Scanned at {formatTimestamp(scan.scannedAt)}
                                </p>
                              </div>
                              <div>
                                <Link href={`/p/${scan.productId}`}>
                                  <Button size="sm" variant="ghost">View Product</Button>
                                </Link>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </AuthProtection>
  );
}