import QRCode from 'qrcode';
import { doc, updateDoc, collection, query, getDocs } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { db, storage } from './firebase';

interface QRCodeOptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  scale?: number;
  width?: number;
  color?: {
    dark: string;
    light: string;
  };
  logo?: {
    src: string;
    width?: number;
    height?: number;
    margin?: number;
  };
}

// Default QR code styling options
const defaultOptions: QRCodeOptions = {
  errorCorrectionLevel: 'H',
  margin: 2,
  color: {
    dark: '#3D4EAD',
    light: '#FFFFFF'
  },
  width: 300
};

// Generate a QR code data URL for a product
export const generateQRCode = async (productId: string, options: QRCodeOptions = defaultOptions) => {
  try {
    const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/p/${productId}`;
    
    // Merge default options with provided options
    const mergedOptions = { ...defaultOptions, ...options };
    
    const qrDataUrl = await QRCode.toDataURL(productUrl, mergedOptions);
    return qrDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    // Improved error handling
    if (error instanceof Error) {
      throw new Error(`Failed to generate QR code: ${error.message}`);
    } else {
      throw new Error('Failed to generate QR code due to an unknown error');
    }
  }
};

// Generate QR code and store it in Firebase Storage
export const generateAndStoreQRCode = async (productId: string, options: QRCodeOptions = defaultOptions) => {
  try {
    // Generate QR code
    const qrDataUrl = await generateQRCode(productId, options);
    
    // Implement retry mechanism for upload
    let attempts = 0;
    const maxAttempts = 3;
    let qrCodeUrl: string | null = null;
    
    while (attempts < maxAttempts && !qrCodeUrl) {
      try {
        // Upload to Firebase Storage
        const storageRef = ref(storage, `qr-codes/${productId}.png`);
        await uploadString(storageRef, qrDataUrl, 'data_url');
        
        // Get the download URL
        qrCodeUrl = await getDownloadURL(storageRef);
      } catch (uploadError) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw uploadError;
        }
        // Exponential backoff before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempts)));
      }
    }
    
    if (!qrCodeUrl) {
      throw new Error('Failed to upload QR code after multiple attempts');
    }
    
    // Update the product with the QR code URL
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      qrCodeUrl: qrCodeUrl
    });
    
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating and storing QR code:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to save QR code: ${error.message}`);
    } else {
      throw new Error('Failed to save QR code due to an unknown error');
    }
  }
};

// Generate a QR code as a canvas element (useful for browser rendering)
export const generateQRCodeCanvas = async (
  productId: string, 
  canvas: HTMLCanvasElement,
  options: QRCodeOptions = defaultOptions
) => {
  try {
    const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/p/${productId}`;
    // Merge default options with provided options
    const mergedOptions = { ...defaultOptions, ...options };
    
    await QRCode.toCanvas(canvas, productUrl, mergedOptions);
    return true;
  } catch (error) {
    console.error('QR Code canvas generation error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to render QR code: ${error.message}`);
    } else {
      throw new Error('Failed to render QR code due to an unknown error');
    }
  }
};

// Generate and download a printable QR code in PNG format
export const downloadQRCode = async (productId: string, productName: string, options: QRCodeOptions = defaultOptions) => {
  try {
    const qrDataUrl = await generateQRCode(productId, options);
    
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${productName.replace(/\s+/g, '-')}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('QR Code download error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to download QR code: ${error.message}`);
    } else {
      throw new Error('Failed to download QR code due to an unknown error');
    }
  }
};

// Generate printable QR code template with product details
export const generatePrintableQRTemplate = async (
  productId: string, 
  productDetails: { 
    name: string, 
    manufacturer?: string, 
    model?: string 
  }
) => {
  try {
    // Generate QR code with higher quality for printing
    const printOptions: QRCodeOptions = {
      ...defaultOptions,
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 600
    };
    
    const qrDataUrl = await generateQRCode(productId, printOptions);
    
    // Create a canvas for the template
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context could not be created');
    
    // Set canvas size for printing (3x3 inches at 300dpi)
    canvas.width = 900;
    canvas.height = 900;
    
    // Fill background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw border
    ctx.strokeStyle = '#3D4EAD';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Draw QR code
    const qrImage = new Image();
    qrImage.src = qrDataUrl;
    
    await new Promise((resolve, reject) => {
      qrImage.onload = resolve;
      qrImage.onerror = reject;
    });
    
    // Center QR code
    const qrX = (canvas.width - 600) / 2;
    const qrY = 100;
    ctx.drawImage(qrImage, qrX, qrY, 600, 600);
    
    // Add text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(productDetails.name, canvas.width / 2, 760);
    
    ctx.font = '24px Arial';
    if (productDetails.manufacturer) {
      ctx.fillText(`by ${productDetails.manufacturer}`, canvas.width / 2, 800);
    }
    
    if (productDetails.model) {
      ctx.fillText(`Model: ${productDetails.model}`, canvas.width / 2, 840);
    }
    
    // Add scan instructions
    ctx.font = 'italic 20px Arial';
    ctx.fillText('Scan to view product details', canvas.width / 2, 50);
    
    // Convert to data URL and trigger download
    const templateUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = `${productDetails.name.replace(/\s+/g, '-')}-template.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return templateUrl;
  } catch (error) {
    console.error('QR Template generation error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate QR template: ${error.message}`);
    } else {
      throw new Error('Failed to generate QR template due to an unknown error');
    }
  }
};

// Generate and download multiple QR codes in a ZIP file
export const bulkGenerateQRCodes = async (
  products: Array<{ id: string, name: string }>,
  options: QRCodeOptions = defaultOptions
) => {
  try {
    const zip = new JSZip();
    const promises = [];
    
    // Create a folder for the QR codes
    const qrFolder = zip.folder("product-qr-codes");
    if (!qrFolder) throw new Error('Failed to create folder in ZIP archive');
    
    // Generate QR codes for each product
    for (const product of products) {
      const promise = generateQRCode(product.id, options).then(qrDataUrl => {
        // Remove data URL prefix to get just the base64 data
        const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
        // Add to ZIP file
        qrFolder.file(`${product.name.replace(/\s+/g, '-')}-QR.png`, base64Data, {base64: true});
      });
      promises.push(promise);
    }
    
    // Wait for all QR codes to be generated
    await Promise.all(promises);
    
    // Generate and download the ZIP file
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "transpass-qr-codes.zip");
    
    return true;
  } catch (error) {
    console.error('Bulk QR generation error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate bulk QR codes: ${error.message}`);
    } else {
      throw new Error('Failed to generate bulk QR codes due to an unknown error');
    }
  }
};

// Fetch all products for a company and generate bulk QR codes
export const bulkGenerateCompanyQRCodes = async (companyId: string) => {
  try {
    // Fetch all products for this company
    const productsRef = collection(db, 'products');
    const q = query(productsRef);
    const querySnapshot = await getDocs(q);
    
    // Filter products by company ID
    const companyProducts = [];
    querySnapshot.forEach(doc => {
      const product = doc.data();
      if (product.companyId === companyId) {
        companyProducts.push({
          id: doc.id,
          name: product.name
        });
      }
    });
    
    if (companyProducts.length === 0) {
      throw new Error('No products found for this company');
    }
    
    // Generate bulk QR codes
    return await bulkGenerateQRCodes(companyProducts);
  } catch (error) {
    console.error('Company bulk QR generation error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate company QR codes: ${error.message}`);
    } else {
      throw new Error('Failed to generate company QR codes due to an unknown error');
    }
  }
};