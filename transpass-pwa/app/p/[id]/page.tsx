'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { getProduct } from '../../../lib/products';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// Define types for our product data
interface Component {
  id?: string;
  name: string;
  type?: string;
  description: string;
  material: string;
  weight: number;
  recyclable: boolean;
  location?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  certifications?: string[];
  documentUrl?: string;
}

interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
}

interface Care {
  washing?: string;
  drying?: string;
  ironing?: string;
  bleaching?: string;
  dishwasher?: string;
  cleaning?: string;
  waterResistance?: string;
}

interface Product {
  id: string;
  name: string;
  images?: string[];
  imageUrl?: string;
  description: string;
  manufacturer: string;
  model: string;
  category?: string;
  manufactureDate?: string;
  warrantyInfo?: string;
  care?: Care;
  company?: Company;
  components?: Component[];
  colors?: Array<{name: string, hex: string}>;
  sizes?: string[];
  collection?: string;
  SKU?: string;
  madeIn?: string;
  producedBy?: string;
  companyId?: string;
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [activeComponent, setActiveComponent] = useState(0);
  
  // Use React.use() to safely access params
  const productId = React.use(params).id;

  // Fetch product from Firestore
  useEffect(() => {
    async function fetchData() {
      try {
        // Get the product data
        const fetchedProduct = await getProduct(productId);
        
        if (fetchedProduct) {
          setProduct(fetchedProduct as Product);
          
          // If product has a companyId, fetch the company details
          if (fetchedProduct.companyId) {
            const companyDoc = await getDoc(doc(db, 'companies', fetchedProduct.companyId));
            if (companyDoc.exists()) {
              setCompany({
                id: companyDoc.id,
                ...companyDoc.data() as Company
              });
            }
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setLoading(false);
      }
    }
    
    fetchData();
  }, [productId]);

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
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Use company data either from the company fetch or from the product's embedded company data
  const companyData = company || product.company;

  return (
    <div className="min-h-screen bg-primary-lightest flex flex-col">
      <header className="p-4 flex items-center justify-between bg-white shadow-sm">
        <Link href="/" className="inline-flex items-center">
          <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <Link href="/auth/login">
          <Button variant="outline">
            Log in
          </Button>
        </Link>
      </header>

      <main className="flex-grow p-4 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Product Header */}
          <div className="p-6 border-b border-gray-200">
            {companyData && (
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-lightest rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-semibold">{companyData.name.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-dark">{companyData.name}</h2>
                  <p className="text-sm text-gray">{companyData.description}</p>
                </div>
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-dark">{product.name}</h1>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray hover:text-gray-dark hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Product Details
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'components'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray hover:text-gray-dark hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('components')}
              >
                Components
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'care'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray hover:text-gray-dark hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('care')}
              >
                Care Instructions
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="aspect-w-16 aspect-h-9 bg-primary-lightest rounded-lg h-64 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="object-contain h-full w-full" />
                  ) : (
                    <div className="text-primary">No Product Image Available</div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-dark mb-2">Description</h3>
                  <p className="text-gray">{product.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-dark mb-2">Details</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-gray">Manufacturer:</span>
                        <span className="font-medium text-gray-dark">{product.manufacturer}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray">Model:</span>
                        <span className="font-medium text-gray-dark">{product.model}</span>
                      </li>
                      {product.category && (
                        <li className="flex justify-between">
                          <span className="text-gray">Category:</span>
                          <span className="font-medium text-gray-dark">{product.category}</span>
                        </li>
                      )}
                      {product.manufactureDate && (
                        <li className="flex justify-between">
                          <span className="text-gray">Manufacture Date:</span>
                          <span className="font-medium text-gray-dark">{product.manufactureDate}</span>
                        </li>
                      )}
                      {product.warrantyInfo && (
                        <li className="flex justify-between">
                          <span className="text-gray">Warranty:</span>
                          <span className="font-medium text-gray-dark">{product.warrantyInfo}</span>
                        </li>
                      )}
                      {product.collection && (
                        <li className="flex justify-between">
                          <span className="text-gray">Collection:</span>
                          <span className="font-medium text-gray-dark">{product.collection}</span>
                        </li>
                      )}
                      {product.SKU && (
                        <li className="flex justify-between">
                          <span className="text-gray">SKU:</span>
                          <span className="font-medium text-gray-dark">{product.SKU}</span>
                        </li>
                      )}
                      {product.madeIn && (
                        <li className="flex justify-between">
                          <span className="text-gray">Made in:</span>
                          <span className="font-medium text-gray-dark">{product.madeIn}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    {product.colors && product.colors.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-dark mb-2">Available Options</h3>
                        <h4 className="text-sm font-medium text-gray mb-2">Colors:</h4>
                        <div className="flex space-x-2">
                          {product.colors.map((color: any, index: number) => (
                            <div 
                              key={index}
                              className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            ></div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {product.sizes && product.sizes.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray mb-2">Sizes:</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size: string, index: number) => (
                            <div 
                              key={index}
                              className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-dark cursor-pointer hover:border-primary hover:text-primary"
                            >
                              {size}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {product.tags && product.tags.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray mb-2">Tags:</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'components' && (
              <div>
                {product.components && product.components.length > 0 ? (
                  <>
                    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                      {product.components.map((component: Component, idx: number) => (
                        <button
                          key={idx}
                          className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${
                            activeComponent === idx
                              ? 'text-primary border-b-2 border-primary'
                              : 'text-gray hover:text-gray-dark'
                          }`}
                          onClick={() => setActiveComponent(idx)}
                        >
                          {component.name || component.type}
                        </button>
                      ))}
                    </div>
                    
                    <div className="space-y-6">
                      {product.components[activeComponent] && (
                        <>
                          <div>
                            <h3 className="text-lg font-medium text-gray-dark mb-2">{product.components[activeComponent].name || product.components[activeComponent].type}</h3>
                            <p className="text-gray">{product.components[activeComponent].description}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-medium text-gray mb-2">Details:</h4>
                              <ul className="space-y-2 text-sm">
                                <li className="flex justify-between">
                                  <span className="text-gray">Material:</span>
                                  <span className="font-medium text-gray-dark">{product.components[activeComponent].material}</span>
                                </li>
                                <li className="flex justify-between">
                                  <span className="text-gray">Weight:</span>
                                  <span className="font-medium text-gray-dark">{product.components[activeComponent].weight}g</span>
                                </li>
                                <li className="flex justify-between">
                                  <span className="text-gray">Recyclable:</span>
                                  <span className="font-medium text-gray-dark">
                                    {product.components[activeComponent].recyclable ? 'Yes' : 'No'}
                                  </span>
                                </li>
                                {product.components[activeComponent].location && (
                                  <li className="flex justify-between">
                                    <span className="text-gray">Location:</span>
                                    <span className="font-medium text-gray-dark">{product.components[activeComponent].location}</span>
                                  </li>
                                )}
                                {product.components[activeComponent].manufacturer && (
                                  <li className="flex justify-between">
                                    <span className="text-gray">Manufacturer:</span>
                                    <span className="font-medium text-gray-dark">{product.components[activeComponent].manufacturer}</span>
                                  </li>
                                )}
                                {product.components[activeComponent].countryOfOrigin && (
                                  <li className="flex justify-between">
                                    <span className="text-gray">Country of origin:</span>
                                    <span className="font-medium text-gray-dark">{product.components[activeComponent].countryOfOrigin}</span>
                                  </li>
                                )}
                              </ul>
                            </div>
                            
                            <div>
                              {product.components[activeComponent].certifications && 
                               product.components[activeComponent].certifications.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-gray mb-2">Certifications:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {product.components[activeComponent].certifications.map((cert: string, idx: number) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-lightest text-primary"
                                      >
                                        {cert}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {product.components[activeComponent].documentUrl && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray mb-2">Documentation:</h4>
                                  <a
                                    href={product.components[activeComponent].documentUrl}
                                    className="inline-flex items-center text-primary hover:text-primary-dark"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                    View documentation
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Environmental Impact Section */}
                          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                            <h4 className="text-sm font-medium text-green-800 mb-2">Environmental Impact</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="bg-white p-3 rounded-md shadow-sm">
                                <div className="text-green-600 font-medium text-lg">{product.components[activeComponent].recyclable ? 'Recyclable' : 'Not Recyclable'}</div>
                                <div className="text-xs text-gray">End of life disposal</div>
                              </div>
                              <div className="bg-white p-3 rounded-md shadow-sm">
                                <div className="text-green-600 font-medium text-lg">{product.components[activeComponent].weight}g</div>
                                <div className="text-xs text-gray">Material weight</div>
                              </div>
                              <div className="bg-white p-3 rounded-md shadow-sm">
                                <div className="text-green-600 font-medium text-lg">
                                  {product.components[activeComponent].material?.toLowerCase().includes('recycled') ? 'Recycled' : 
                                   product.components[activeComponent].certifications?.includes('Organic') ? 'Organic' : 'Standard'}
                                </div>
                                <div className="text-xs text-gray">Material type</div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray">No component information available for this product.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-dark mb-4">Care Instructions</h3>
                
                {product.care ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {product.care.washing && (
                        <div className="flex items-start">
                          <div className="bg-primary-lightest p-2 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                              <circle cx="12" cy="13" r="3"></circle>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-dark">Washing</h4>
                            <p className="text-sm text-gray">{product.care.washing}</p>
                          </div>
                        </div>
                      )}
                      
                      {product.care.drying && (
                        <div className="flex items-start">
                          <div className="bg-primary-lightest p-2 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <path d="M20.8 14.2 13.4 18l-2.2-4.9-5.1 6.4"></path>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-dark">Drying</h4>
                            <p className="text-sm text-gray">{product.care.drying}</p>
                          </div>
                        </div>
                      )}
                      
                      {product.care.dishwasher && (
                        <div className="flex items-start">
                          <div className="bg-primary-lightest p-2 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-dark">Dishwasher</h4>
                            <p className="text-sm text-gray">{product.care.dishwasher}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {product.care.ironing && (
                        <div className="flex items-start">
                          <div className="bg-primary-lightest p-2 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                              <path d="M12 11V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h12"></path>
                              <path d="m12 7 5-5 5 5"></path>
                              <path d="M17 2v8"></path>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-dark">Ironing</h4>
                            <p className="text-sm text-gray">{product.care.ironing}</p>
                          </div>
                        </div>
                      )}

                      {product.care.bleaching && (
                        <div className="flex items-start">
                          <div className="bg-primary-lightest p-2 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-dark">Bleaching</h4>
                            <p className="text-sm text-gray">{product.care.bleaching}</p>
                          </div>
                        </div>
                      )}
                      
                      {product.care.cleaning && (
                        <div className="flex items-start">
                          <div className="bg-primary-lightest p-2 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                              <path d="m9 11 6 6m-6 0 6-6"></path>
                              <circle cx="12" cy="12" r="9"></circle>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-dark">Cleaning</h4>
                            <p className="text-sm text-gray">{product.care.cleaning}</p>
                          </div>
                        </div>
                      )}
                      
                      {product.care.waterResistance && (
                        <div className="flex items-start">
                          <div className="bg-primary-lightest p-2 rounded-full mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-dark">Water Resistance</h4>
                            <p className="text-sm text-gray">{product.care.waterResistance}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray">No care instructions available for this product.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-gray border-t border-gray-200 bg-white">
        <p>
          &copy; 2025 Transpass. All rights reserved.
        </p>
      </footer>
    </div>
  );
}