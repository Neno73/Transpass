import Link from 'next/link';
import { Button } from '../../components/ui/Button';

export default function FAQPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-dark mb-12">
          Frequently Asked Questions
        </h1>

        <div className="space-y-8">
          {/* FAQ Item 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-dark mb-3">What is Transpass?</h2>
            <p className="text-gray">
              Transpass is a digital product passport platform that helps companies create transparent, 
              verifiable information about their products. It allows customers to scan a QR code and 
              access detailed information about a product's origin, components, sustainability 
              credentials, and more.
            </p>
          </div>

          {/* FAQ Item 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-dark mb-3">How does it work for companies?</h2>
            <p className="text-gray">
              Companies can register on our platform, add their products with detailed information about 
              materials, components, manufacturing processes, and sustainability credentials. Transpass 
              generates unique QR codes for each product that can be printed on packaging or labels. 
              When customers scan these codes, they access the product's digital passport.
            </p>
          </div>

          {/* FAQ Item 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-dark mb-3">How does it work for consumers?</h2>
            <p className="text-gray">
              Consumers can scan a Transpass QR code using their smartphone camera or our app. 
              This opens the product's digital passport, showing transparent information about 
              the product's components, materials, origin, and sustainability credentials. 
              No account is needed to view product information.
            </p>
          </div>

          {/* FAQ Item 4 */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-dark mb-3">Is there a cost to use Transpass?</h2>
            <p className="text-gray">
              For companies, we offer tiered pricing based on the number of products and features needed. 
              We have a free tier for small businesses with limited products, and premium tiers for 
              larger companies requiring more advanced features. For consumers, accessing product 
              information is always free.
            </p>
          </div>

          {/* FAQ Item 5 */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-dark mb-3">How secure is the product data?</h2>
            <p className="text-gray">
              We take data security very seriously. All product data is stored securely in our 
              encrypted database. Companies maintain full control over what information they share. 
              The QR codes themselves do not contain sensitive data—they simply link to the information 
              stored on our secure servers.
            </p>
          </div>

          {/* FAQ Item 6 */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-dark mb-3">Can I verify sustainability claims?</h2>
            <p className="text-gray">
              Yes, Transpass allows companies to upload certificates and verification documents for 
              sustainability claims. This creates transparency and builds trust with consumers who 
              can verify claims directly rather than relying solely on packaging statements.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
          <p className="text-gray mb-6">
            Contact our support team and we'll get back to you as soon as possible.
          </p>
          <Link href="/contact">
            <Button size="lg">Contact Us</Button>
          </Link>
        </div>
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