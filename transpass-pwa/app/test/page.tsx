'use client';

import React, { useState, useEffect } from 'react';
import { db, connectWithRetry } from '../../lib/firebase';
import { collection, addDoc, getDocs, query, limit, serverTimestamp } from 'firebase/firestore';

export default function TestPage() {
  const [status, setStatus] = useState<string>('Checking connection...');
  const [error, setError] = useState<string | null>(null);
  const [testDoc, setTestDoc] = useState<string | null>(null);
  const [authDomain, setAuthDomain] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Display auth domain from environment
        setAuthDomain(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not set');
        
        // Test connection with retry
        const connected = await connectWithRetry(3, 2000);
        if (!connected) {
          throw new Error('Failed to connect to Firestore after multiple attempts');
        }
        
        setStatus('Connected to Firestore successfully');
        
        // Try to write to a test collection
        try {
          const docRef = await addDoc(collection(db, 'connectivity_tests'), {
            timestamp: serverTimestamp(),
            client: 'test-page',
            userAgent: navigator.userAgent
          });
          
          setTestDoc(docRef.id);
          setStatus('Test document created successfully with ID: ' + docRef.id);
        } catch (writeError: any) {
          setStatus('Connected but failed to write test document');
          setError(`Write error: ${writeError.message}`);
        }
        
        // Try to read from the collection
        try {
          const q = query(collection(db, 'connectivity_tests'), limit(5));
          const querySnapshot = await getDocs(q);
          
          const docsCount = querySnapshot.size;
          setStatus(`Connection verified. Found ${docsCount} test documents.`);
        } catch (readError: any) {
          setStatus('Connected but failed to read test documents');
          setError(`Read error: ${readError.message}`);
        }
      } catch (err: any) {
        setStatus('Connection failed');
        setError(err.message || 'Unknown error');
      }
    };
    
    testConnection();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Firebase Connectivity Test</h1>
      
      <div className="mb-4">
        <p className="font-semibold">Auth Domain:</p>
        <p className="text-blue-600">{authDomain}</p>
      </div>
      
      <div className="mb-4">
        <p className="font-semibold">Status:</p>
        <p className={status.includes('failed') ? 'text-red-600' : 'text-green-600'}>
          {status}
        </p>
      </div>
      
      {testDoc && (
        <div className="mb-4">
          <p className="font-semibold">Test Document ID:</p>
          <p className="text-blue-600">{testDoc}</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <p className="font-semibold text-red-800">Error:</p>
          <p className="text-red-600 whitespace-pre-wrap">{error}</p>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <p>This page tests direct connectivity to Firebase Firestore</p>
        <p>If this test passes but product creation fails, the issue is likely with:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Firebase Storage permissions</li>
          <li>Security rules for the products collection</li>
          <li>Specific auth requirements for product creation</li>
        </ul>
      </div>
    </div>
  );
}