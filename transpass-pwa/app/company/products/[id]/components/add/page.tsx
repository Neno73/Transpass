'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../../../../components/ui/Button';
import { getProduct, updateProduct, Product, ProductComponentInfo } from '../../../../../../lib/products';

export default function AddComponentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Use React.use() to safely access params
  const productId = React.use(params).id;

  const [componentData, setComponentData] = useState<ProductComponentInfo>({
    name: '',
    description: '',
    material: '',
    weight: 0,
    recyclable: false
  });

  const [certifications, setCertifications] = useState<string[]>([]);
  const availableCertifications = [
   "Recycled",
  "Organic",
  "Vegan",
  "Fair Trade",
  "Ethical",
  "Durable",
   "Small Business",
  "Slow Fashion",
  "Craftsmanship",
  "Minority Owned",
  "Other"
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(productId);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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
    
    if (!product) return;
    
    setSubmitting(true);
    
    try {
      // Add certification data to the component
      const componentWithCerts = {
        ...componentData,
        certifications
      };

      // Create updated product object with the new component
      const updatedComponents = [
        ...(product.components || []),
        componentWithCerts
      ];

      // Update the product with the new component
      await updateProduct(productId, {
        components: updatedComponents
      });

      // Redirect back to the product detail page
      router.push(`/company/products/${productId}?tab=components`);
    } catch (error) {
      console.error('Error adding component:', error);
      setSubmitting(false);
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
          <p className="text-gray mb-6">The product you are trying to add a component to could not be found.</p>
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
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0 mb-8">
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
              <h1 className="text-2xl font-bold text-gray-dark">Add Component</h1>
            </div>
            <p className="mt-1 text-sm text-gray">
              Adding component to: {product.name}
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
                  Documentation (Optional)
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
                  {submitting ? 'Adding Component...' : 'Add Component'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}