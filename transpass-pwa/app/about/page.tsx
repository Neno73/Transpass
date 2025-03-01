import Link from 'next/link';
import { Button } from '../../components/ui/Button';

export default function AboutPage() {
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

      <main className="max-w-5xl mx-auto px-4 py-12">
        <section className="mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-dark mb-6">
            About Transpass
          </h1>
          <p className="text-lg text-center text-gray max-w-3xl mx-auto">
            We're on a mission to increase transparency in the product supply chain and 
            empower consumers to make more informed, sustainable choices.
          </p>
        </section>

        <section className="mb-16">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-dark mb-6">Our Story</h2>
            <div className="space-y-4 text-gray">
              <p>
                Transpass began in 2024 with a simple question: Why is it so difficult 
                for consumers to truly know what goes into the products they buy?
              </p>
              <p>
                Our founder, having worked in supply chain management for over a decade, 
                saw firsthand how little information was being passed on to customers 
                about the products they purchased—from the materials and components to 
                manufacturing processes and sustainability impact.
              </p>
              <p>
                We built Transpass to bridge this information gap, creating a digital 
                passport system that allows manufacturers to easily share transparent, 
                verified information about their products and enables consumers to 
                access this information through a simple QR code scan.
              </p>
              <p>
                Today, we're working with companies across multiple industries to bring 
                greater transparency to the marketplace and help consumers make 
                purchasing decisions that align with their values.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-dark mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary-lightest rounded-full flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V12" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8H12.01" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-dark mb-3">Transparency</h3>
              <p className="text-gray">
                We believe consumers have a right to know what goes into the products they 
                purchase, and companies have an opportunity to build trust through openness.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary-lightest rounded-full flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-dark mb-3">Sustainability</h3>
              <p className="text-gray">
                We're committed to helping both companies and consumers make more 
                environmentally and socially responsible choices through better information.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-primary-lightest rounded-full flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9H9.01" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 9H15.01" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-dark mb-3">Innovation</h3>
              <p className="text-gray">
                We're constantly exploring new ways to make complex supply chain 
                information accessible, understandable, and actionable for everyone.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-dark mb-8">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-24 h-24 bg-primary-lightest rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-dark">Emma Chen</h3>
              <p className="text-primary mb-2">Founder & CEO</p>
              <p className="text-gray text-sm">
                Former supply chain executive with 12+ years of experience in 
                sustainable manufacturing and product transparency.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-24 h-24 bg-primary-lightest rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-dark">Marcus Rodriguez</h3>
              <p className="text-primary mb-2">CTO</p>
              <p className="text-gray text-sm">
                Tech industry veteran specialized in blockchain, digital identity, 
                and building scalable web applications.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-24 h-24 bg-primary-lightest rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-dark">Olivia Kim</h3>
              <p className="text-primary mb-2">Head of Partnerships</p>
              <p className="text-gray text-sm">
                Background in environmental certification programs and 
                sustainable business development across multiple industries.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-dark mb-6">Join Us in Our Mission</h2>
          <p className="text-gray mb-8 max-w-3xl mx-auto">
            Whether you're a company looking to showcase your commitment to 
            transparency or a consumer who values making informed choices, 
            we invite you to be part of the Transpass community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg">Register Your Company</Button>
            </Link>
            <Link href="/scan">
              <Button size="lg" variant="outline">Scan a Product</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
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