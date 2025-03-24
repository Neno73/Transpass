import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// Type definitions
export interface ProductComponentInfo {
  name: string;
  description: string;
  material: string;
  weight: number;
  recyclable: boolean;
  certifications?: string[];
  documentUrl?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  location?: string; // Position within the product
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  manufacturer: string;
  model: string;
  serialNumber?: string;
  manufactureDate?: Date | string;
  warrantyInfo?: string;
  imageUrl?: string;
  createdBy: string; // User ID of the creator
  companyId?: string; // Company ID if created by a company
  components?: ProductComponentInfo[];
  category?: string;
  tags?: string[];
  createdAt?: any;
  updatedAt?: any;
}

// Get all products created by a specific user/company
export const getUserProducts = async (userId: string) => {
  try {
    console.log(`Fetching products for user ID: ${userId}`);
    
    // Simple approach - instead of complex retry logic, just try to get the data directly
    try {
      // First, check if we can access the products collection at all (simpler query)
      const testQuery = query(collection(db, 'products'), limit(1));
      await getDocs(testQuery);
      
      // If we're here, we can access the collection, now run the real query
      const q = query(
        collection(db, 'products'),
        where('createdBy', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      console.log('Executing Firestore query');
      const querySnapshot = await getDocs(q);
      console.log(`Query executed successfully, found ${querySnapshot.size} documents`);
      
      const products: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data() as Product
        });
      });
      
      return products;
    } catch (error: any) {
      console.error("Firestore query failed:", error);
      
      // Special handling for known initialization issues
      if (error.code === 'failed-precondition' && error.message.includes('indexes')) {
        console.warn("Index error detected - this is normal when first setting up the database");
        return []; // Return empty result to avoid crashing
      }
      
      // Special handling for missing orderBy
      if (error.message?.includes('The query requires an index')) {
        console.warn("Index not yet created for this query");
        
        // Try again without orderBy as a fallback
        try {
          console.log("Retrying with simpler query (no orderBy)");
          const fallbackQuery = query(
            collection(db, 'products'),
            where('createdBy', '==', userId)
          );
          
          const fallbackSnapshot = await getDocs(fallbackQuery);
          const fallbackProducts: Product[] = [];
          
          fallbackSnapshot.forEach((doc) => {
            fallbackProducts.push({
              id: doc.id,
              ...doc.data() as Product
            });
          });
          
          return fallbackProducts;
        } catch (fallbackError) {
          console.error("Fallback query also failed:", fallbackError);
          return []; // Return empty result to avoid crashing
        }
      }
      
      // For other errors, try without any filtering as last resort
      try {
        console.log("Trying to fetch all products as last resort");
        const lastResortQuery = query(collection(db, 'products'), limit(20));
        const allSnapshot = await getDocs(lastResortQuery);
        
        const allProducts: Product[] = [];
        allSnapshot.forEach((doc) => {
          const data = doc.data() as Product;
          // Only include products matching our user
          if (data.createdBy === userId) {
            allProducts.push({
              id: doc.id,
              ...data
            });
          }
        });
        
        return allProducts;
      } catch (lastError) {
        console.error("Last resort query failed:", lastError);
        throw error; // rethrow the original error
      }
    }
  } catch (error) {
    console.error("Error in getUserProducts:", error);
    // Return empty array instead of throwing to prevent UI errors
    return [];
  }
};

// Interface for scan history records
export interface ScanHistoryRecord {
  id?: string;           // Document ID (optional)
  userId: string;        // User who performed the scan
  productId: string;     // Product that was scanned
  productName?: string;  // Cached product name for quick display
  scannedAt: any;        // Timestamp of when scan occurred
  imageUrl?: string;     // Optional cached product image
}

// Get the user's scan history
export const getUserScanHistory = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'scanHistory'),
      where('userId', '==', userId),
      orderBy('scannedAt', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    const history: ScanHistoryRecord[] = [];
    
    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data() as ScanHistoryRecord
      });
    });
    
    return history;
  } catch (error) {
    console.error("Error fetching scan history:", error);
    return [];
  }
};

// Log a product scan in the user's history
export const logProductScan = async (userId: string, productId: string) => {
  try {
    // First check if this product exists
    const productData = await getProduct(productId);
    
    if (!productData) {
      console.error("Cannot log scan for non-existent product:", productId);
      return false;
    }
    
    // Check if user has already scanned this product recently (last 24 hours)
    const recentScansQuery = query(
      collection(db, 'scanHistory'),
      where('userId', '==', userId),
      where('productId', '==', productId),
      where('scannedAt', '>', new Date(Date.now() - 24 * 60 * 60 * 1000)), // Last 24 hours
      limit(1)
    );
    
    const recentScans = await getDocs(recentScansQuery);
    
    // If recent scan exists, just update the timestamp
    if (!recentScans.empty) {
      const docRef = doc(db, 'scanHistory', recentScans.docs[0].id);
      await updateDoc(docRef, {
        scannedAt: serverTimestamp()
      });
      return true;
    }
    
    // Otherwise create a new scan record
    const scanRecord: ScanHistoryRecord = {
      userId,
      productId,
      productName: productData.name,
      imageUrl: productData.imageUrl,
      scannedAt: serverTimestamp()
    };
    
    await addDoc(collection(db, 'scanHistory'), scanRecord);
    return true;
  } catch (error) {
    console.error("Error logging product scan:", error);
    return false;
  }
};

// Get a single product by ID
export const getProduct = async (productId: string) => {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data() as Product
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Get scan analytics for a company
export const getCompanyScanAnalytics = async (companyId: string) => {
  try {
    // First, get all products created by this company
    const products = await getUserProducts(companyId);
    
    if (!products || products.length === 0) {
      return {
        totalScans: 0,
        productAnalytics: [],
        recentScans: [],
        timeSeriesData: []
      };
    }
    
    // Extract just the product IDs
    const productIds = products.map(product => product.id as string);
    
    // Get all scan history records for these products
    const scanHistoryQuery = query(
      collection(db, 'scanHistory'),
      where('productId', 'in', productIds.slice(0, 10)), // Firebase limit is 10 items for 'in' queries
      orderBy('scannedAt', 'desc')
    );
    
    const scanHistorySnapshot = await getDocs(scanHistoryQuery);
    const scanHistory: ScanHistoryRecord[] = [];
    
    scanHistorySnapshot.forEach(doc => {
      scanHistory.push({
        id: doc.id,
        ...doc.data() as ScanHistoryRecord
      });
    });
    
    // For larger product catalogs, we need to make multiple queries
    let additionalScanHistory: ScanHistoryRecord[] = [];
    if (productIds.length > 10) {
      for (let i = 10; i < productIds.length; i += 10) {
        const batchIds = productIds.slice(i, i + 10);
        if (batchIds.length === 0) break;
        
        const batchQuery = query(
          collection(db, 'scanHistory'),
          where('productId', 'in', batchIds),
          orderBy('scannedAt', 'desc')
        );
        
        const batchSnapshot = await getDocs(batchQuery);
        batchSnapshot.forEach(doc => {
          additionalScanHistory.push({
            id: doc.id,
            ...doc.data() as ScanHistoryRecord
          });
        });
      }
      
      // Merge the scan history arrays
      scanHistory.push(...additionalScanHistory);
    }
    
    // Calculate counts by product
    const productScans: {[productId: string]: number} = {};
    const productNames: {[productId: string]: string} = {};
    
    // Initialize with all products (even those with zero scans)
    products.forEach(product => {
      if (product.id) {
        productScans[product.id] = 0;
        productNames[product.id] = product.name;
      }
    });
    
    // Count scans for each product
    scanHistory.forEach(scan => {
      if (productScans[scan.productId] !== undefined) {
        productScans[scan.productId]++;
      } else {
        productScans[scan.productId] = 1;
      }
      
      // Cache product names if we don't have them yet
      if (!productNames[scan.productId] && scan.productName) {
        productNames[scan.productId] = scan.productName;
      }
    });
    
    // Generate analytics by product
    const productAnalytics = Object.keys(productScans).map(productId => ({
      productId,
      productName: productNames[productId] || 'Unknown Product',
      scanCount: productScans[productId]
    })).sort((a, b) => b.scanCount - a.scanCount); // Sort by scan count desc
    
    // Generate time series data for the last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Initialize time series with zeros for all days
    const timeSeriesData: {date: string, count: number}[] = [];
    for (let i = 0; i < 30; i++) {
      const day = new Date(thirtyDaysAgo);
      day.setDate(day.getDate() + i);
      timeSeriesData.push({
        date: day.toISOString().split('T')[0], // YYYY-MM-DD format
        count: 0
      });
    }
    
    // Fill in scan counts for each day
    scanHistory.forEach(scan => {
      if (scan.scannedAt) {
        // Handle both Firestore timestamps and regular dates
        let scanDate: Date;
        if (scan.scannedAt.toDate && typeof scan.scannedAt.toDate === 'function') {
          scanDate = scan.scannedAt.toDate();
        } else {
          scanDate = new Date(scan.scannedAt);
        }
        
        // Only count scans from the last 30 days
        if (scanDate >= thirtyDaysAgo) {
          const dateStr = scanDate.toISOString().split('T')[0];
          const dayIndex = timeSeriesData.findIndex(d => d.date === dateStr);
          if (dayIndex !== -1) {
            timeSeriesData[dayIndex].count++;
          }
        }
      }
    });
    
    return {
      totalScans: scanHistory.length,
      productAnalytics,
      recentScans: scanHistory.slice(0, 10), // Just the 10 most recent scans
      timeSeriesData,
      products // Include full product data for component analytics
    };
  } catch (error) {
    console.error("Error fetching company scan analytics:", error);
    return {
      totalScans: 0,
      productAnalytics: [],
      recentScans: [],
      timeSeriesData: [],
      products: []
    };
  }
};

// Create a new product 
export const createProduct = async (productData: Product, imageFile?: File, imageData?: ArrayBuffer) => {
  try {
    // If an image file is provided, upload it to Firebase Storage
    let imageUrl = productData.imageUrl;
    
    if (imageFile) {
      try {
        console.log("Starting image upload for:", imageFile.name, "size:", imageFile.size, "type:", imageFile.type);
        
        // Check if the file is valid
        if (!(imageFile instanceof File) || imageFile.size === 0) {
          throw new Error("Invalid image file provided: " + (imageFile ? "empty file" : "no file"));
        }
        
        // Remove special characters from filename
        const safeFileName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const timestamp = Date.now();
        const storageRef = ref(storage, `product-images/${timestamp}_${safeFileName}`);
        
        console.log("Storage reference created:", `product-images/${timestamp}_${safeFileName}`);
        
        // Upload with retry mechanism
        let uploadAttempts = 0;
        const maxAttempts = 3;
        let success = false;
        
        while (uploadAttempts < maxAttempts && !success) {
          try {
            uploadAttempts++;
            console.log(`Upload attempt ${uploadAttempts} for image, bytes:`, imageFile.size);
            
            // Upload file with metadata
            const metadata = {
              contentType: imageFile.type,
              customMetadata: {
                'originalName': imageFile.name,
                'uploadTime': new Date().toISOString()
              }
            };
            
            let uploadResult;
            
            // If we have direct image data, use that instead
            if (imageData) {
              console.log("Using provided ArrayBuffer data for upload");

              // Create a new Blob from the ArrayBuffer with the correct content type
              const blob = new Blob([new Uint8Array(imageData)], { type: imageFile.type });
              uploadResult = await uploadBytes(storageRef, blob, metadata);
            } else {
              console.log("Using image File object for upload");
              uploadResult = await uploadBytes(storageRef, imageFile, metadata);
            }
            console.log("Upload completed, getting download URL...");
            
            imageUrl = await getDownloadURL(uploadResult.ref);
            success = true;
            console.log("Image uploaded successfully, URL:", imageUrl);
          } catch (uploadError: any) {
            console.error(`Upload attempt ${uploadAttempts} failed:`, uploadError.message || uploadError);
            
            if (uploadAttempts >= maxAttempts) {
              throw uploadError;
            }
            
            // Wait before retrying with exponential backoff
            const delay = Math.pow(2, uploadAttempts) * 1000;
            console.log(`Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      } catch (uploadError: any) {
        console.error("Error uploading image:", uploadError);
        throw new Error(`Image upload failed: ${uploadError.message || 'Unknown error'}`);
      }
    } else {
      console.warn("No image file provided for product creation");
    }
    
    // Check if we have components with documents to upload
    if (productData.components && productData.components.length > 0) {
      console.log(`Processing ${productData.components.length} components for documents`);
      
      // Enforce component limit
      if (productData.components.length > 8) {
        throw new Error('Maximum 8 components allowed per product');
      }
      
      // No actual document upload happens - this is a placeholder
      // In a real implementation, we would process any document files here
      // But this fix simply enforces the component limit
    }
    
    console.log("Adding product to Firestore with image URL:", imageUrl);
    
    // Add the product to Firestore
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log("Product added to Firestore with ID:", docRef.id);
    
    // Return the new product with its ID
    return {
      id: docRef.id,
      ...productData,
      imageUrl
    };
  } catch (error: any) {
    console.error("Error creating product:", error);
    throw new Error(`Failed to create product: ${error.message || "Unknown error"}`);
  }
};

// Update an existing product
export const updateProduct = async (
  productId: string, 
  productData: Partial<Product>, 
  imageFile?: File
) => {
  try {
    // If an image file is provided, upload it to Firebase Storage
    let imageUrl = productData.imageUrl;
    
    if (imageFile) {
      try {
        console.log("Starting image upload for update:", imageFile.name);
        // Remove special characters from filename
        const safeFileName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const storageRef = ref(storage, `product-images/${Date.now()}_${safeFileName}`);
        
        // Upload with retry mechanism
        let uploadAttempts = 0;
        const maxAttempts = 3;
        let success = false;
        
        while (uploadAttempts < maxAttempts && !success) {
          try {
            uploadAttempts++;
            console.log(`Upload attempt ${uploadAttempts} for image update`);
            const uploadResult = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(uploadResult.ref);
            success = true;
            console.log("Image updated successfully:", imageUrl);
          } catch (uploadError) {
            console.error(`Upload attempt ${uploadAttempts} failed:`, uploadError);
            if (uploadAttempts >= maxAttempts) throw uploadError;
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } catch (uploadError) {
        console.error("Error uploading image for update:", uploadError);
        throw new Error(`Image upload failed: ${uploadError.message || 'Unknown error'}`);
      }
    }
    
    // Update the product in Firestore
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      ...productData,
      ...(imageUrl && { imageUrl }),
      updatedAt: serverTimestamp()
    });
    
    // Return the updated product
    const updatedDoc = await getDoc(docRef);
    
    return {
      id: updatedDoc.id,
      ...updatedDoc.data() as Product
    };
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId: string) => {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Search for products by various criteria
export const searchProducts = async ({
  category,
  tags,
  manufacturer,
  searchText,
  limit: queryLimit = 20
}: {
  category?: string;
  tags?: string[];
  manufacturer?: string;
  searchText?: string;
  limit?: number;
}) => {
  try {
    let q = query(collection(db, 'products'));
    
    if (category) {
      q = query(q, where('category', '==', category));
    }
    
    if (tags && tags.length > 0) {
      // To search for documents containing any of the specified tags
      q = query(q, where('tags', 'array-contains-any', tags));
    }
    
    if (manufacturer) {
      q = query(q, where('manufacturer', '==', manufacturer));
    }
    
    // Note: For full-text search in text fields, Firebase requires more advanced
    // solutions like Algolia or ElasticSearch. This is a simple implementation.
    
    q = query(q, orderBy('createdAt', 'desc'), limit(queryLimit));
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Product;
      
      // If searchText is provided, check if it exists in the product name or description
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const nameMatch = data.name?.toLowerCase().includes(searchLower);
        const descMatch = data.description?.toLowerCase().includes(searchLower);
        const modelMatch = data.model?.toLowerCase().includes(searchLower);
        
        if (!(nameMatch || descMatch || modelMatch)) {
          return; // Skip this product if no match
        }
      }
      
      products.push({
        id: doc.id,
        ...data
      });
    });
    
    return products;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};