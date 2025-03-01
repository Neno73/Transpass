'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../../../../components/ui/Button';
import { SuccessScreen } from '../../../../components/SuccessScreen';
import { generateAndStoreQRCode } from '../../../../lib/qrcode';

export default function ProductSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const productName = searchParams.get('name');
  
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Generate QR code for the newly created product
    if (productId) {
      setLoading(true);
      generateAndStoreQRCode(productId)
        .then(url => {
          setQrCodeUrl(url);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error generating QR code:', err);
          setError('Failed to generate QR code. You can view and download it later from your product page.');
          setLoading(false);
        });
    } else {
      setError('No product information found. Please go back to your products.');
      setLoading(false);
    }
  }, [productId]);

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${productName || 'product'}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <SuccessScreen>
      {/* QR Code Display */}
      {loading ? (
        <div className="bg-white p-4 rounded-lg shadow-md mb-8 w-64 h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : qrCodeUrl ? (
        <div className="bg-white p-4 rounded-lg shadow-md mb-8 mx-auto">
          <img src={qrCodeUrl} alt="Product QR Code" className="w-64 h-64 object-contain" />
          <p className="text-center text-sm text-gray-600 mt-2">Scan to view product details</p>
        </div>
      ) : (
        <div className="bg-red-50 p-4 rounded-lg text-red-600 mb-8 max-w-xs mx-auto">
          <p className="text-sm">{error || 'Unable to generate QR code. Please try again later.'}</p>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="w-full space-y-4">
        {qrCodeUrl && (
          <Button 
            className="w-full bg-white hover:bg-gray-100 text-primary font-medium py-4 px-4 rounded-full"
            onClick={handleDownloadQR}
          >
            Download QR Code
          </Button>
        )}
        
        <Link href="/company/products/create">
          <Button 
            className="w-full bg-white hover:bg-gray-100 text-primary font-medium py-4 px-4 rounded-full"
          >
            Add another product
          </Button>
        </Link>
        
        <Link href="/company/products">
          <Button 
            variant="outline"
            className="w-full bg-transparent hover:bg-primary-dark text-white border border-white font-medium py-4 px-4 rounded-full"
          >
            View all products
          </Button>
        </Link>
      </div>
    </SuccessScreen>
  );
}