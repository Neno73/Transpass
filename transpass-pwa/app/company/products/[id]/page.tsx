'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../../../../components/ui/Button';
import { getProduct, updateProduct, deleteProduct, Product } from '../../../../lib/products';
import { useRouter } from 'next/navigation';
import ProductQRCode from '../../../../components/ui/ProductQRCode';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [componentFilter, setComponentFilter] = useState('all');
  const [componentSortBy, setComponentSortBy] = useState('name');
  
  // Use React.use() to safely access params
  const productId = React.use(params).id;
  
  // Function to switch tabs and update URL
  const switchTab = (tab: string) => {
    setActiveTab(tab);
    // Update URL query parameter without full page navigation
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url);
  };
  const [editData, setEditData] = useState<Partial<Product>>({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(productId);
        setProduct(productData);
        setEditData(productData || {});
        
        // Check if there's a tab query parameter and set the active tab
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam && ['details', 'components', 'analytics'].includes(tabParam)) {
          setActiveTab(tabParam);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleSave = async () => {
    if (!product) return;
    
    try {
      setLoading(true);
      const updatedProduct = await updateProduct(product.id!, editData);
      setProduct(updatedProduct);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    
    try {
      setLoading(true);
      await deleteProduct(product.id!);
      router.push('/company/dashboard');
    } catch (error) {
      console.error('Error deleting product:', error);
      setLoading(false);
    }
  };

  const handleAddComponent = () => {
    if (!product) return;
    
    router.push(`/company/products/${product.id}/components/add`);
  };
  
  const handleEditComponent = (index: number) => {
    if (!product) return;
    
    router.push(`/company/products/${product.id}/components/${index}/edit`);
  };
  
  const handleDeleteComponent = async (index: number) => {
    if (!product || !product.components) return;
    
    setLoading(true);
    
    try {
      // Create a copy of the components array and remove the component at the specified index
      const updatedComponents = [...product.components];
      updatedComponents.splice(index, 1);
      
      // Update the product with the new components array
      const updatedProduct = await updateProduct(product.id!, {
        components: updatedComponents
      });
      
      setProduct(updatedProduct);
    } catch (error) {
      console.error('Error deleting component:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-lightest flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-gray">Loading product information...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-primary-lightest flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-dark mb-4">Product Not Found</h1>
          <p className="text-gray mb-6">The product you are looking for could not be found.</p>
          <Link href="/company/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

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
          {/* Page header */}
          <div className="px-4 sm:px-0 mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-dark">{product.name}</h1>
              <p className="mt-1 text-sm text-gray">
                Product ID: {product.id}
              </p>
            </div>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => setDeleteConfirm(true)}
                  >
                    Delete
                  </Button>
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Product
                  </Button>
                </>
              )}
            </div>
          </div>

          {deleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-dark mb-4">Confirm Delete</h3>
                <p className="text-gray mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="px-4 sm:px-6 flex space-x-8">
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'details'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray hover:text-gray-dark hover:border-gray-300'
                  }`}
                  onClick={() => switchTab('details')}
                >
                  Product Details
                </button>
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'components'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray hover:text-gray-dark hover:border-gray-300'
                  }`}
                  onClick={() => switchTab('components')}
                >
                  Components
                </button>
                <button
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'analytics'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray hover:text-gray-dark hover:border-gray-300'
                  }`}
                  onClick={() => switchTab('analytics')}
                >
                  Analytics
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="px-4 py-5 sm:p-6">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-dark">
                        Product Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={editData.name || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-dark">{product.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="model" className="block text-sm font-medium text-gray-dark">
                        Model
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="model"
                          id="model"
                          value={editData.model || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-dark">{product.model}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-dark">
                        Description
                      </label>
                      {isEditing ? (
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={editData.description || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-dark">{product.description}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-dark">
                        Manufacturer
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="manufacturer"
                          id="manufacturer"
                          value={editData.manufacturer || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-dark">{product.manufacturer}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-dark">
                        Serial Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="serialNumber"
                          id="serialNumber"
                          value={editData.serialNumber || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-dark">{product.serialNumber || 'N/A'}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-dark">
                        Category
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="category"
                          id="category"
                          value={editData.category || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-dark">{product.category || 'Uncategorized'}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="warrantyInfo" className="block text-sm font-medium text-gray-dark">
                        Warranty Information
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="warrantyInfo"
                          id="warrantyInfo"
                          value={editData.warrantyInfo || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-dark">{product.warrantyInfo || 'No warranty information'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-dark mb-3">Product Image</h3>
                    {product.imageUrl ? (
                      <div className="mt-2 relative">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="max-w-md rounded-lg shadow"
                        />
                        {isEditing && (
                          <div className="mt-2">
                            <Button variant="outline" size="sm">
                              Replace Image
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                            >
                              <span>Upload an image</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-dark mb-3">QR Code</h3>
                    {product.id && (
                      <div className="mt-2">
                        {/* Use the new ProductQRCode component */}
                        <ProductQRCode 
                          productId={product.id} 
                          productName={product.name}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'components' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-dark">Components</h3>
                    <Button onClick={handleAddComponent}>
                      Add Component
                    </Button>
                  </div>

                  {/* Filters and sorting */}
                  {product.components && product.components.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <div className="sm:w-1/2">
                        <label htmlFor="componentFilter" className="block text-sm font-medium text-gray-dark mb-1">
                          Filter components
                        </label>
                        <select
                          id="componentFilter"
                          value={componentFilter}
                          onChange={(e) => setComponentFilter(e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        >
                          <option value="all">All Components</option>
                          <option value="recyclable">Recyclable Only</option>
                          <option value="non-recyclable">Non-Recyclable Only</option>
                          <option value="certified">With Certifications</option>
                          <option value="uncertified">Without Certifications</option>
                        </select>
                      </div>
                      <div className="sm:w-1/2">
                        <label htmlFor="componentSortBy" className="block text-sm font-medium text-gray-dark mb-1">
                          Sort by
                        </label>
                        <select
                          id="componentSortBy"
                          value={componentSortBy}
                          onChange={(e) => setComponentSortBy(e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        >
                          <option value="name">Name (A-Z)</option>
                          <option value="name-desc">Name (Z-A)</option>
                          <option value="weight">Weight (Low to High)</option>
                          <option value="weight-desc">Weight (High to Low)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {product.components && product.components.length > 0 ? (
                    <>
                      {/* Apply filtering and sorting logic */}
                      {(() => {
                        let filteredComponents = [...product.components];
                        
                        // Apply filters
                        if (componentFilter === 'recyclable') {
                          filteredComponents = filteredComponents.filter(c => c.recyclable);
                        } else if (componentFilter === 'non-recyclable') {
                          filteredComponents = filteredComponents.filter(c => !c.recyclable);
                        } else if (componentFilter === 'certified') {
                          filteredComponents = filteredComponents.filter(c => c.certifications && c.certifications.length > 0);
                        } else if (componentFilter === 'uncertified') {
                          filteredComponents = filteredComponents.filter(c => !c.certifications || c.certifications.length === 0);
                        }
                        
                        // Apply sorting
                        if (componentSortBy === 'name') {
                          filteredComponents.sort((a, b) => a.name.localeCompare(b.name));
                        } else if (componentSortBy === 'name-desc') {
                          filteredComponents.sort((a, b) => b.name.localeCompare(a.name));
                        } else if (componentSortBy === 'weight') {
                          filteredComponents.sort((a, b) => a.weight - b.weight);
                        } else if (componentSortBy === 'weight-desc') {
                          filteredComponents.sort((a, b) => b.weight - a.weight);
                        }
                        
                        // If no components match the filter criteria
                        if (filteredComponents.length === 0) {
                          return (
                            <div className="bg-white p-6 text-center border border-gray-300 rounded-lg">
                              <svg className="mx-auto h-12 w-12 text-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <h3 className="mt-2 text-sm font-medium text-gray-dark">No matching components</h3>
                              <p className="mt-1 text-sm text-gray">Try adjusting your filter to see more components.</p>
                              <div className="mt-6">
                                <Button variant="outline" onClick={() => setComponentFilter('all')}>
                                  Clear Filter
                                </Button>
                              </div>
                            </div>
                          );
                        }
                        
                        // Map components to the original array to get the correct index for edit/delete operations
                        const componentIndexMap = filteredComponents.map(fc => {
                          return product.components!.findIndex(pc => pc === fc);
                        });
                        
                        return (
                          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-dark sm:pl-6">Name</th>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-dark">Material</th>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-dark">Weight</th>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-dark">Recyclable</th>
                                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredComponents.map((component, idx) => {
                                  const originalIndex = componentIndexMap[idx];
                                  return (
                                    <tr key={originalIndex}>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-dark sm:pl-6">
                                        {component.name}
                                        {component.certifications && component.certifications.length > 0 && (
                                          <div className="mt-1 flex flex-wrap gap-1">
                                            {component.certifications.map((cert, i) => (
                                              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                {cert}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray">{component.material}</td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray">{component.weight}g</td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray">
                                        {component.recyclable ? (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Yes
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            No
                                          </span>
                                        )}
                                      </td>
                                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <button 
                                          onClick={() => handleEditComponent(originalIndex)} 
                                          className="text-primary hover:text-primary-dark mr-4"
                                        >
                                          Edit
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteComponent(originalIndex)} 
                                          className="text-red-600 hover:text-red-900"
                                        >
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="bg-white p-6 text-center border border-gray-300 border-dashed rounded-lg">
                      <svg
                        className="mx-auto h-12 w-12 text-gray"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-dark">No components</h3>
                      <p className="mt-1 text-sm text-gray">Get started by adding a component to this product.</p>
                      <div className="mt-6">
                        <Button onClick={handleAddComponent}>
                          Add Component
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-dark">Product Analytics</h3>
                  
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <dl>
                          <dt className="text-sm font-medium text-gray truncate">Total Scans</dt>
                          <dd className="mt-1 text-3xl font-semibold text-gray-dark">243</dd>
                        </dl>
                      </div>
                    </div>
                    
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <dl>
                          <dt className="text-sm font-medium text-gray truncate">Last 7 Days</dt>
                          <dd className="mt-1 text-3xl font-semibold text-gray-dark">37</dd>
                        </dl>
                      </div>
                    </div>
                    
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <dl>
                          <dt className="text-sm font-medium text-gray truncate">Unique Users</dt>
                          <dd className="mt-1 text-3xl font-semibold text-gray-dark">126</dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-base font-medium text-gray-dark mb-4">Scan Activity</h4>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray">Chart placeholder - scan activity over time</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-base font-medium text-gray-dark mb-4">Geographic Distribution</h4>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray">Map placeholder - scan locations</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}