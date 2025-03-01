'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { resetUserAccount, isEmailRegistered } from '../../../lib/firebase-reset';

export default function AdminResetPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string }>({});
  const [checkResult, setCheckResult] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult({});
    
    try {
      const resetResult = await resetUserAccount(email, password);
      setResult(resetResult);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = async () => {
    if (!email) {
      setCheckResult('Please enter an email to check');
      return;
    }
    
    setIsLoading(true);
    setCheckResult(null);
    
    try {
      const registered = await isEmailRegistered(email);
      setCheckResult(registered 
        ? 'This email is registered in Firebase Authentication' 
        : 'This email is not registered in Firebase Authentication');
    } catch (error: any) {
      setCheckResult(`Error checking email: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-lightest p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-dark mb-6">Admin Reset Tool</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-dark mb-4">Check Email Registration</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="checkEmail" className="block text-sm font-medium text-gray-dark mb-1">
                Email Address
              </label>
              <input
                id="checkEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="user@example.com"
              />
            </div>
            
            <Button 
              onClick={handleCheck} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Checking...' : 'Check Email'}
            </Button>
            
            {checkResult && (
              <div className={`mt-3 p-3 rounded-md ${
                checkResult.includes('not registered') 
                  ? 'bg-green-50 text-green-800' 
                  : checkResult.includes('Error') 
                    ? 'bg-red-50 text-red-800'
                    : 'bg-yellow-50 text-yellow-800'
              }`}>
                {checkResult}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-dark mb-4">Reset User Account</h2>
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-dark mb-1">
                Email Address
              </label>
              <input
                id="resetEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="user@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-dark mb-1">
                Current Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter current password"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Resetting...' : 'Reset Account'}
            </Button>
            
            {result.message && (
              <div className={`mt-3 p-3 rounded-md ${
                result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {result.message}
              </div>
            )}
          </form>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Note: This tool allows you to check if an email is registered and delete a user account if you have the credentials.</p>
          <p className="mt-2">Use with caution as account deletion is permanent and cannot be undone.</p>
        </div>
      </div>
    </div>
  );
}