'use client';

import React, { useState, useRef } from 'react';
import { storage } from '../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function StorageTestPage() {
  const [status, setStatus] = useState<string>('Ready to test');
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const testStorageUpload = async (file: File) => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setUploading(true);
    setStatus('Uploading file...');
    setError(null);

    try {
      // Create a test file reference with timestamp to avoid collisions
      const timestamp = Date.now();
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const storageRef = ref(storage, `test-uploads/${timestamp}_${safeFileName}`);
      
      // Log the storage path for reference
      console.log(`Attempting to upload to: test-uploads/${timestamp}_${safeFileName}`);
      
      // Log storage bucket from env
      console.log('Storage bucket:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
      
      // Upload the file
      const uploadResult = await uploadBytes(storageRef, file);
      console.log('Upload completed successfully:', uploadResult);
      
      // Get download URL
      const url = await getDownloadURL(uploadResult.ref);
      setImageUrl(url);
      setStatus('File uploaded successfully');
    } catch (err: any) {
      console.error('Storage upload error:', err);
      setStatus('Upload failed');
      setError(`Error: ${err.code || ''} - ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Firebase Storage Test</h1>
      
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-4">
          This test will attempt to upload a file to Firebase Storage.
          If product creation is failing, this will help determine if storage permissions are the issue.
        </p>
        
        <div className="flex items-center space-x-3 mb-4">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                testStorageUpload(files[0]);
              }
            }}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            Select & Upload Test Image
          </button>
          
          <span className="text-gray-500 text-sm">
            {uploading ? 'Uploading...' : 'Select a small image file'}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="font-semibold">Status:</p>
        <p className={status.includes('failed') ? 'text-red-600' : 'text-green-600'}>
          {status}
        </p>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <p className="font-semibold text-red-800">Error:</p>
          <p className="text-red-600 whitespace-pre-wrap">{error}</p>
        </div>
      )}
      
      {imageUrl && (
        <div className="mt-6">
          <p className="font-semibold mb-2">Uploaded Image:</p>
          <div className="border border-gray-200 rounded p-2 max-w-xs">
            <img src={imageUrl} alt="Uploaded test" className="max-w-full h-auto" />
          </div>
          <p className="text-xs text-gray-500 mt-1 break-all">{imageUrl}</p>
        </div>
      )}
    </div>
  );
}