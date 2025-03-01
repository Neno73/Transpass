import React from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import ProductQRCode from '../../components/ui/ProductQRCode';

// Sample product data for demo
const sampleProducts = [
  {
    id: 'eco-bottle-001',
    name: 'Eco-Friendly Water Bottle',
    description: 'Sustainable water bottle made from recycled materials',
    manufacturer: 'Green Products Inc',
    model: 'ECO-WB-100',
    category: 'Kitchenware',
    components: [
      {
        name: 'Bottle Body',
        description: 'Main container',
        material: 'Recycled PET',
        weight: 150,
        recyclable: true,
        certifications: ['BPA-Free', 'FDA Approved']
      },
      {
        name: 'Cap',
        description: 'Twist-off cap',
        material: 'Recycled Polypropylene',
        weight: 25,
        recyclable: true
      }
    ]
  },
  {
    id: 'smart-tracker-002',
    name: 'Smart Fitness Tracker',
    description: 'Advanced fitness tracker with heart rate monitoring',
    manufacturer: 'TechFit',
    model: 'FIT-200',
    category: 'Electronics',
    components: [
      {
        name: 'Main Unit',
        description: 'Electronic module',
        material: 'ABS Plastic',
        weight: 35,
        recyclable: false
      },
      {
        name: 'Band',
        description: 'Adjustable wristband',
        material: 'Silicone',
        weight: 30,
        recyclable: true
      },
      {
        name: 'Battery',
        description: 'Rechargeable battery',
        material: 'Lithium-ion',
        weight: 10,
        recyclable: true,
        certifications: ['UL Certified']
      }
    ]
  }
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-primary-lightest">
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
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Sign up</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-dark mb-4">
            Demo Products
          </h1>
          <p className="text-lg text-gray max-w-3xl mx-auto">
            These are example products to demonstrate how Transpass works. 
            You can scan their QR codes to view detailed product information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {sampleProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-dark mb-2">{product.name}</h2>
                <p className="text-gray mb-4">{product.description}</p>
                
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                  <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
                  <dd className="text-sm text-gray-dark">{product.manufacturer}</dd>
                  
                  <dt className="text-sm font-medium text-gray-500">Model</dt>
                  <dd className="text-sm text-gray-dark">{product.model}</dd>
                  
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="text-sm text-gray-dark">{product.category}</dd>
                </dl>
                
                <h3 className="text-lg font-semibold text-gray-dark mb-3">Components</h3>
                <ul className="space-y-4 mb-6">
                  {product.components.map((component, index) => (
                    <li key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-dark">{component.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          component.recyclable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {component.recyclable ? 'Recyclable' : 'Non-recyclable'}
                        </span>
                      </div>
                      <p className="text-sm text-gray mt-1">{component.description}</p>
                      <div className="mt-2 text-xs text-gray-600">
                        <span className="inline-block mr-3">Material: {component.material}</span>
                        <span className="inline-block">Weight: {component.weight}g</span>
                      </div>
                      {component.certifications && component.certifications.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {component.certifications.map((cert, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {cert}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-dark mb-3">Product QR Code</h3>
                  <ProductQRCode 
                    productId={product.id} 
                    productName={product.name}
                  />
                </div>
                
                <div className="mt-6 text-center">
                  <Link href={`/p/${product.id}`}>
                    <Button>
                      View Product Page
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-primary-lightest p-8 rounded-xl border border-primary-light text-center">
          <h2 className="text-2xl font-bold text-gray-dark mb-3">Try It Yourself</h2>
          <p className="text-gray mb-6">
            Ready to create your own product digital passports? Register your company 
            and start creating transparent, accessible product information.
          </p>
          <Link href="/auth/register">
            <Button size="lg">Register Your Company</Button>
          </Link>
        </div>
      </main>

      <footer className="bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <svg width="30" height="30" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <span className="ml-2 text-lg font-semibold text-primary">Transpass</span>
            </div>
            <p className="text-sm text-gray mt-2">© 2025 Transpass. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray">
                <li><Link href="/features" className="hover:text-primary">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray">
                <li><Link href="/about" className="hover:text-primary">About</Link></li>
                <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray">
                <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}