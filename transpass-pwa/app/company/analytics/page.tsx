"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { BottomNav } from "../../../components/ui/Navigation";
import AuthProtection from "../../../components/AuthProtection";
import { useAuth } from "../../../lib/AuthContext";
import { getCompanyScanAnalytics } from "../../../lib/products";
import { ArrowLeft } from "lucide-react";

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
    timeSeriesData: [],
  });
  const [timeRange, setTimeRange] = useState<"7" | "14" | "30">("14");
  const [componentsData, setComponentsData] = useState<{
    [productId: string]: any[];
  }>({});

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const data = await getCompanyScanAnalytics(user.uid);
          setAnalyticsData(data);

          // Extract component data from all products returned
          const productComponentsData: { [productId: string]: any[] } = {};

          // Use the products data directly from the analytics response
          if (data.products && data.products.length > 0) {
            data.products.forEach((product) => {
              if (
                product.id &&
                product.components &&
                product.components.length > 0
              ) {
                productComponentsData[product.id] = product.components;
              }
            });
          }

          setComponentsData(productComponentsData);
        } catch (error) {
          console.error("Error fetching analytics:", error);
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
    ...analyticsData.timeSeriesData.map((d) => d.count)
  );

  // Filter time series data based on selected range
  const filteredTimeSeriesData = analyticsData.timeSeriesData
    .slice(-parseInt(timeRange))
    .map((point) => ({
      ...point,
      // Add percentage for bar height
      percentage: Math.round((point.count / maxCount) * 100),
    }));

  // Calculate component analytics data
  const componentAnalytics = useMemo(() => {
    const materialSummary: { [material: string]: ComponentAnalytic } = {};

    // Process all components across all products
    Object.values(componentsData).forEach((components) => {
      components.forEach((component) => {
        const material = component.material || "Unknown";
        const weight = component.weight || 0;
        const isRecyclable = component.recyclable || false;

        if (!materialSummary[material]) {
          materialSummary[material] = {
            material,
            totalWeight: 0,
            count: 0,
            recyclableCount: 0,
            recyclablePercentage: 0,
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
    Object.values(materialSummary).forEach((summary) => {
      summary.recyclablePercentage =
        summary.count > 0
          ? Math.round((summary.recyclableCount / summary.count) * 100)
          : 0;
    });

    // Convert to array and sort by total weight
    return Object.values(materialSummary).sort(
      (a, b) => b.totalWeight - a.totalWeight
    );
  }, [componentsData]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Unknown";

    // Handle Firebase Timestamp or Date object
    let date: Date;
    if (timestamp.toDate && typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <AuthProtection companyOnly>
      <div className="min-h-screen bg-white pb-20 p-4 max-w-xl mx-auto">
        <Image
          src="/background-grey-logo.svg"
          alt="Background pattern"
          width={1000}
          height={1000}
          className="absolute top-0 right-0 z-0"
        />
        <main className="max-w-2xl mx-auto px-4 py-6 z-10 relative">
          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-dark hover:text-primary"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.svg"
              alt="TransPass Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Track your product performance and sustainability metrics
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Scans
                  </h3>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {analyticsData.totalScans.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500">
                    Products
                  </h3>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {analyticsData.productAnalytics.length}
                  </p>
                </div>
              </div>

              {/* Scan Activity Chart */}
              {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-dark">
                    Scan Activity
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setTimeRange("7")}
                      className={`px-2 py-1 text-xs rounded ${
                        timeRange === "7"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      7 Days
                    </button>
                    <button
                      onClick={() => setTimeRange("14")}
                      className={`px-2 py-1 text-xs rounded ${
                        timeRange === "14"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      14 Days
                    </button>
                    <button
                      onClick={() => setTimeRange("30")}
                      className={`px-2 py-1 text-xs rounded ${
                        timeRange === "30"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      30 Days
                    </button>
                  </div>
                </div>

                {filteredTimeSeriesData.length === 0 ? (
                  <div className="h-40 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      No scan data available for this period
                    </p>
                  </div>
                ) : (
                  <div className="h-40 relative">
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-32">
                      {filteredTimeSeriesData.map((point, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className="bg-primary w-full max-w-[18px] mx-auto rounded-t"
                            style={{ height: `${point.percentage}%` }}
                          ></div>
                          <div
                            className="text-xs text-gray-500 mt-1 truncate w-full text-center"
                            style={{ fontSize: "0.65rem" }}
                          >
                            {formatDate(point.date)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div> */}

              {/* Product Performance */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-medium text-gray-dark mb-4">
                  Product Performance
                </h2>

                {analyticsData.productAnalytics.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No product data available yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto -mx-6">
                    <div className="inline-block min-w-full align-middle px-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Scans
                            </th>
                            <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              % of Total
                            </th>
                            <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analyticsData.productAnalytics.map(
                            (product, index) => (
                              <tr
                                key={product.productId}
                                className={
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }
                              >
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {product.productName}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                  {product.scanCount.toLocaleString()}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                  {analyticsData.totalScans > 0
                                    ? Math.round(
                                        (product.scanCount /
                                          analyticsData.totalScans) *
                                          100
                                      )
                                    : 0}
                                  %
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                                  <Link
                                    href={`/company/products/${product.productId}`}
                                  >
                                    <Button size="sm" variant="outline">
                                      View
                                    </Button>
                                  </Link>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Scans */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-medium text-gray-dark mb-4">
                  Recent Scan Activity
                </h2>

                {analyticsData.recentScans.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No recent scan activity to display.
                  </p>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {analyticsData.recentScans.map((scan) => (
                        <li key={scan.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-lightest flex items-center justify-center">
                              <span className="text-primary font-medium">
                                {scan.productName?.[0] || "P"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {scan.productName || "Unknown Product"}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                Scanned at {formatTimestamp(scan.scannedAt)}
                              </p>
                            </div>
                            <div>
                              <Link href={`/p/${scan.productId}`}>
                                <Button size="sm" variant="ghost">
                                  View
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Component Analytics Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-gray-dark mb-4">
                  Sustainability Metrics
                </h2>

                {componentAnalytics.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No component data available. Add components to your products
                    to see analytics.
                  </p>
                ) : (
                  <>
                    {/* Sustainability metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {/* Total recyclable percentage */}
                      <div className="bg-primary-lightest rounded-lg p-3">
                        <div className="flex items-center">
                          <div className="ml-1">
                            <h4 className="text-xs font-medium text-gray-700">
                              Recyclable
                            </h4>
                            <div className="mt-1 text-lg font-semibold text-primary">
                              {Math.round(
                                (componentAnalytics.reduce(
                                  (sum, mat) => sum + mat.recyclableCount,
                                  0
                                ) /
                                  componentAnalytics.reduce(
                                    (sum, mat) => sum + mat.count,
                                    0
                                  )) *
                                  100
                              )}
                              %
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Total components count */}
                      <div className="bg-primary-lightest rounded-lg p-3">
                        <div className="flex items-center">
                          <div className="ml-1">
                            <h4 className="text-xs font-medium text-gray-700">
                              Components
                            </h4>
                            <div className="mt-1 text-lg font-semibold text-primary">
                              {componentAnalytics.reduce(
                                (sum, mat) => sum + mat.count,
                                0
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Total weight */}
                      <div className="bg-primary-lightest rounded-lg p-3">
                        <div className="flex items-center">
                          <div className="ml-1">
                            <h4 className="text-xs font-medium text-gray-700">
                              Weight
                            </h4>
                            <div className="mt-1 text-lg font-semibold text-primary">
                              {componentAnalytics
                                .reduce((sum, mat) => sum + mat.totalWeight, 0)
                                .toFixed(1)}
                              g
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Materials and weight summary */}
                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-2">
                        Materials Summary
                      </h3>
                      <div className="overflow-x-auto -mx-6">
                        <div className="inline-block min-w-full align-middle px-6">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Material
                                </th>
                                <th className="px-2 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Qty
                                </th>
                                <th className="px-2 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Weight
                                </th>
                                <th className="px-2 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Recycl.
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {componentAnalytics.map((material, index) => (
                                <tr
                                  key={material.material}
                                  className={
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                  }
                                >
                                  <td className="px-3 py-3 whitespace-nowrap text-xs font-medium text-gray-900">
                                    {material.material}
                                  </td>
                                  <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500 text-right">
                                    {material.count}
                                  </td>
                                  <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500 text-right">
                                    {material.totalWeight.toFixed(1)}g
                                  </td>
                                  <td className="px-2 py-3 whitespace-nowrap text-xs text-right">
                                    <span
                                      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                        material.recyclablePercentage >= 75
                                          ? "bg-green-100 text-green-800"
                                          : material.recyclablePercentage >= 40
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
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
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </main>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <BottomNav userType="company" />
        </div>
      </div>
    </AuthProtection>
  );
}
