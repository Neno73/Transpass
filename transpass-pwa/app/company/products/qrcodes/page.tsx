'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../../../components/ui/Button';
import { useAuth } from '../../../../lib/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { 
  downloadQRCode, 
  generatePrintableQRTemplate, 
  bulkGenerateQRCodes 
} from '../../../../lib/qrcode';

interface Product {
  id: string;
  name: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  checked?: boolean;
}

export default function ProductQRCodesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [qrTemplate, setQrTemplate] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [generateSuccess, setGenerateSuccess] = useState(false);

  // Fetch products on load
  useEffect(() => {
    async function fetchProducts() {
      if (!user?.uid) return;
      
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where("companyId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const fetchedProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          const product = { id: doc.id, ...doc.data() } as Product;
          product.checked = false; // Initialize checked state for each product
          fetchedProducts.push(product);
        });
        
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [user]);

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.model?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle single product selection
  const handleProductSelect = (productId: string) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return { ...product, checked: !product.checked };
      }
      return product;
    }));
    
    updateSelectedProducts();
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    setProducts(products.map(product => ({
      ...product,
      checked: newSelectAll
    })));
    
    updateSelectedProducts();
  };

  // Update the selected products array
  const updateSelectedProducts = () => {
    const selected = products.filter(product => product.checked);
    setSelectedProducts(selected);
  };

  // Generate individual QR code
  const handleGenerateQR = async (productId: string, productName: string) => {
    try {
      await downloadQRCode(productId, productName);
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError('Failed to generate QR code. Please try again.');
    }
  };

  // Generate printable template
  const handleGenerateTemplate = async (product: Product) => {
    try {
      setGenerating(true);
      setSelectedProductId(product.id);
      
      const templateUrl = await generatePrintableQRTemplate(product.id, {
        name: product.name,
        manufacturer: product.manufacturer,
        model: product.model
      });
      
      setQrTemplate(templateUrl);
    } catch (err) {
      console.error('Error generating QR template:', err);
      setError('Failed to generate printable QR template. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Bulk generate QR codes for selected products
  const handleGenerateBulkQR = async () => {
    if (selectedProducts.length === 0) {
      setError('Please select at least one product.');
      return;
    }
    
    try {
      setGenerating(true);
      await bulkGenerateQRCodes(selectedProducts.map(product => ({
        id: product.id,
        name: product.name
      })));
      setGenerateSuccess(true);
      
      // Reset success message after a delay
      setTimeout(() => {
        setGenerateSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error generating bulk QR codes:', err);
      setError('Failed to generate QR codes. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

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
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-center text-gray-dark mb-8">QR Code Management</h1>
          
          {/* Search and bulk actions */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full sm:w-64">
                  <label htmlFor="search" className="sr-only">Search Products</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Search products"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleGenerateBulkQR}
                  disabled={selectedProducts.length === 0 || generating}
                  className="w-full sm:w-auto"
                >
                  {generating ? 'Generating...' : `Generate QR Codes (${selectedProducts.length})`}
                </Button>
              </div>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {generateSuccess && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">QR codes successfully generated and downloaded!</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Products table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <input
                            id="select-all"
                            name="select-all"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            checked={selectAll}
                            onChange={handleSelectAll}
                          />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Model
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray">
                          <svg className="inline-block animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading products...
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray">
                          {searchQuery ? 'No products match your search criteria.' : 'No products found. Create your first product to generate QR codes.'}
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                id={`product-${product.id}`}
                                name={`product-${product.id}`}
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                checked={product.checked || false}
                                onChange={() => handleProductSelect(product.id)}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{product.id.slice(0, 8)}...</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.model || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleGenerateQR(product.id, product.name)}
                                className="text-primary hover:text-primary-dark"
                              >
                                Download QR
                              </button>
                              <button
                                onClick={() => handleGenerateTemplate(product)}
                                className="text-primary hover:text-primary-dark"
                              >
                                Printable
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* QR Printing Guide */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-dark mb-4">QR Code Printing Guide</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">Individual QR Codes</h4>
                  <p className="text-sm text-gray">Download individual QR codes for each product. These are basic QR codes that link directly to your product page.</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-white">
                      High Quality PNG
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">Printable Templates</h4>
                  <p className="text-sm text-gray">Generate printable templates that include your QR code along with product details, perfect for labels and packaging.</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Print-Ready
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">Bulk Generation</h4>
                  <p className="text-sm text-gray">Select multiple products and download a ZIP file containing all their QR codes at once, saving you time.</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      ZIP Archive
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800">
                <h4 className="font-medium mb-2">Printing Tips</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Print at 300 DPI or higher for best results</li>
                  <li>Minimum recommended size: 2.5 cm × 2.5 cm (1" × 1")</li>
                  <li>Ensure good contrast between QR code and background</li>
                  <li>Avoid placing QR codes on curved surfaces when possible</li>
                  <li>Test scan your printed QR codes before distributing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}