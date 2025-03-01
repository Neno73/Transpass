'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../../../../../components/ui/Button';
import { getProduct, updateProduct, Product, ProductComponentInfo } from '../../../../../../../lib/products';

export default function EditComponentPage({ params }: { params: { id: string; componentId: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Use React.use() to safely access params
  const unwrappedParams = React.use(params);
  const productId = unwrappedParams.id;
  const componentId = unwrappedParams.componentId;
  const [componentData, setComponentData] = useState<ProductComponentInfo>({
    name: '',
    description: '',
    material: '',
    weight: 0,
    recyclable: false
  });
  const [certifications, setCertifications] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const availableCertifications = [
    'Craftsmanship',
    'Small business',
    'Ethical labor',
    'Slow fashion',
    'Vegan',
    'Organic',
    'Recycled',
    'Fair Trade',
    'GOTS'
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(productId);
        setProduct(productData);
        
        // Get the component being edited
        const componentIndex = parseInt(componentId);
        
        if (productData?.components && productData.components[componentIndex]) {
          const component = productData.components[componentIndex];
          setComponentData(component);
          
          // Extract certifications if they exist
          if (component.certifications) {
            setCertifications(component.certifications);
          }
        } else {
          // Component not found
          console.error('Component not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, componentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      setComponentData({
        ...componentData,
        [name]: isChecked
      });
    } else if (type === 'number') {
      setComponentData({
        ...componentData,
        [name]: Number(value)
      });
    } else {
      setComponentData({
        ...componentData,
        [name]: value
      });
    }
  };

  const toggleCertification = (cert: string) => {
    if (certifications.includes(cert)) {
      setCertifications(certifications.filter(c => c !== cert));
    } else {
      setCertifications([...certifications, cert]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !product.components) return;
    
    setSubmitting(true);
    
    try {
      // Add certification data to the component
      const componentWithCerts = {
        ...componentData,
        certifications
      };

      // Create updated components array
      const updatedComponents = [...product.components];
      const componentIndex = parseInt(componentId);
      updatedComponents[componentIndex] = componentWithCerts;

      // Update the product with the updated component
      await updateProduct(productId, {
        components: updatedComponents
      });

      // Redirect back to the product detail page
      router.push(`/company/products/${productId}?tab=components`);
    } catch (error) {
      console.error('Error updating component:', error);
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!product || !product.components) return;
    
    setSubmitting(true);
    
    try {
      // Remove the component from the array
      const updatedComponents = [...product.components];
      const componentIndex = parseInt(componentId);
      updatedComponents.splice(componentIndex, 1);

      // Update the product without the component
      await updateProduct(productId, {
        components: updatedComponents
      });

      // Redirect back to the product detail page
      router.push(`/company/products/${productId}?tab=components`);
    } catch (error) {
      console.error('Error deleting component:', error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-lightest flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-gray">Loading component information...</p>
      </div>
    );
  }

  if (!product || !product.components || !product.components[parseInt(componentId)]) {
    return (
      <div className="min-h-screen bg-primary-lightest flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-dark mb-4">Component Not Found</h1>
          <p className="text-gray mb-6">The component you are trying to edit could not be found.</p>
          <Link href={`/company/products/${productId}?tab=components`}>
            <Button>Return to Product</Button>
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

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-dark mb-4">Confirm Delete</h3>
            <p className="text-gray mb-6">Are you sure you want to delete this component? This action cannot be undone.</p>
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

      <main className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link 
                  href={`/company/products/${productId}?tab=components`}
                  className="inline-flex items-center mr-4 text-primary hover:text-primary-dark"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Product
                </Link>
                <h1 className="text-2xl font-bold text-gray-dark">Edit Component</h1>
              </div>
              <Button 
                variant="outline" 
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => setDeleteConfirm(true)}
              >
                Delete
              </Button>
            </div>
            <p className="mt-1 text-sm text-gray">
              Editing component for: {product.name}
            </p>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-dark">
                  Component Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={componentData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="e.g. Main Fabric, Button, Zipper"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-dark">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={componentData.description}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Provide a detailed description of this component"
                />
              </div>

              <div>
                <label htmlFor="material" className="block text-sm font-medium text-gray-dark">
                  Material <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="material"
                  id="material"
                  value={componentData.material}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="e.g. 100% GOTS Certified Organic Cotton"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-dark">
                  Weight (grams) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  value={componentData.weight}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="recyclable"
                  id="recyclable"
                  checked={componentData.recyclable}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="recyclable" className="ml-2 block text-sm text-gray-dark">
                  Recyclable
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-dark mb-2">
                  Select certifications that apply to this component
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCertifications.map((cert) => (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => toggleCertification(cert)}
                      className={`rounded-full px-4 py-2 flex items-center gap-2 ${
                        certifications.includes(cert)
                          ? 'bg-primary-light text-primary border-none'
                          : 'border border-gray-300 text-gray-dark hover:border-primary hover:text-primary'
                      }`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill={certifications.includes(cert) ? 'currentColor' : 'none'} />
                        {certifications.includes(cert) && (
                          <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        )}
                      </svg>
                      {cert}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-dark mb-2">
                  Documentation
                </label>
                <div className="flex items-center">
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-12 px-4 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    Upload document
                  </Button>
                  <span className="ml-4 text-gray-500 text-sm">No file chosen</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Upload material data sheets, certification documents, etc. (PDF, max 5MB)</p>
              </div>

              <div className="pt-5 flex justify-between">
                <Link href={`/company/products/${productId}?tab=components`}>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className={submitting ? 'opacity-70 cursor-not-allowed' : ''}
                >
                  {submitting ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}