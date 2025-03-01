"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import QRCode from 'qrcode';

interface ProductQRCodeProps {
  productId: string;
  productName?: string;
  baseUrl?: string;
  logoUrl?: string;
  color?: string;
}

export default function ProductQRCode({ 
  productId, 
  productName, 
  baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin,
  logoUrl, 
  color = '#3D4EAD' 
}: ProductQRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    generateQRCode();
  }, [productId, baseUrl, color]);
  
  const generateQRCode = async () => {
    if (!productId) return;
    
    try {
      setIsGenerating(true);
      setError(null);
      
      const productUrl = `${baseUrl}/p/${productId}`;
      
      // Generate QR code as data URL
      const qrCode = await QRCode.toDataURL(productUrl, {
        errorCorrectionLevel: 'H',
        margin: 2,
        color: {
          dark: color,
          light: '#FFFFFF'
        }
      });
      
      setQrDataUrl(qrCode);
      
      // Also render to canvas if the ref exists
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, productUrl, {
          errorCorrectionLevel: 'H',
          margin: 2,
          color: {
            dark: color,
            light: '#FFFFFF'
          },
          width: 200
        });
      }
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError('Failed to generate QR code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadQRCode = () => {
    if (!qrDataUrl) return;
    
    const fileName = `${productName || 'product'}-qrcode.png`;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = fileName;
    link.click();
  };
  
  const printQRCode = () => {
    if (!qrDataUrl) return;
    
    // Create a new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setError('Pop-up blocked. Please allow pop-ups and try again.');
      return;
    }
    
    // Add content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code - ${productName || productId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 40px;
            }
            .qr-container {
              margin: 20px auto;
              max-width: 400px;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            h1 {
              font-size: 18px;
              margin-bottom: 10px;
            }
            p {
              font-size: 12px;
              color: #666;
              margin-bottom: 20px;
            }
            @media print {
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h1>${productName || 'Product QR Code'}</h1>
            <p>Scan this code to view product details</p>
            <img src="${qrDataUrl}" alt="Product QR Code" />
            <p>Product ID: ${productId}</p>
            <button onclick="window.print();" style="padding: 8px 16px; background: #3D4EAD; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;">
              Print
            </button>
          </div>
          <script>
            // Auto-open print dialog when the page loads
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };
  
  return (
    <div className="qr-code-container">
      {error && (
        <div className="bg-red-50 p-3 rounded-lg text-red-600 mb-4">
          {error}
        </div>
      )}
      
      <div className="flex items-start space-x-6">
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          {isGenerating ? (
            <div className="w-[200px] h-[200px] flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : qrDataUrl ? (
            <img 
              src={qrDataUrl} 
              alt="Product QR Code" 
              className="w-[200px] h-[200px]" 
            />
          ) : (
            <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-50">
              <p className="text-sm text-gray">No QR code generated</p>
            </div>
          )}
          
          {/* Canvas element for direct manipulation if needed */}
          <canvas 
            ref={canvasRef} 
            className="hidden" 
            width="200" 
            height="200"
          ></canvas>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-dark mb-2">
            {productName ? `QR Code for ${productName}` : 'Product QR Code'}
          </h3>
          
          <p className="text-sm text-gray mb-4">
            Scan this code to access product details and information. You can download 
            or print this QR code to place on your product packaging.
          </p>
          
          <div className="text-sm text-gray mb-4">
            <p>Links to: <span className="text-primary">{baseUrl}/p/{productId}</span></p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={downloadQRCode}
              disabled={!qrDataUrl || isGenerating}
            >
              Download
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={printQRCode}
              disabled={!qrDataUrl || isGenerating}
            >
              Print
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateQRCode}
              disabled={isGenerating}
            >
              Regenerate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}