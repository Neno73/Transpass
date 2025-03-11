'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { auth } from '../../../lib/firebase';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';

// Loading component to display while the main component is loading
function ResetPasswordLoading() {
  return (
    <div className="min-h-screen bg-primary-lightest flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
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
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-dark">
          Loading...
        </h2>
        <p className="mt-2 text-center text-sm text-gray">
          Please wait while we prepare the password reset form.
        </p>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [actionCode, setActionCode] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get the action code (oobCode) from the URL
    const oobCode = searchParams.get('oobCode');
    const mode = searchParams.get('mode');
    
    // Check if this is a password reset request
    if (mode !== 'resetPassword' || !oobCode) {
      setError('Invalid password reset link');
      setIsLoading(false);
      return;
    }

    setActionCode(oobCode);

    // Verify the action code
    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setEmail(email);
        setIsValid(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error verifying reset code:', err);
        if (err.code === 'auth/expired-action-code') {
          setError('Your password reset link has expired. Please request a new one.');
        } else if (err.code === 'auth/invalid-action-code') {
          setError('Your password reset link is invalid or has already been used.');
        } else {
          setError('There was a problem with your password reset link. Please try again.');
        }
        setIsLoading(false);
      });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!actionCode) {
      setError('Missing reset code. Please use the link from your email.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // Reset the password
      await confirmPasswordReset(auth, actionCode, newPassword);
      setSuccess(true);
      setError('');
    } catch (err: any) {
      console.error('Error resetting password:', err);
      if (err.code === 'auth/expired-action-code') {
        setError('Your password reset link has expired. Please request a new one.');
      } else if (err.code === 'auth/invalid-action-code') {
        setError('Your password reset link is invalid or has already been used.');
      } else if (err.code === 'auth/weak-password') {
        setError('Please choose a stronger password. It should be at least 6 characters long.');
      } else {
        setError(err.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-lightest flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
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
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-dark">
            Verifying your reset link...
          </h2>
          <p className="mt-2 text-center text-sm text-gray">
            Please wait while we verify your password reset link.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-primary-lightest flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
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
          </div>
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="rounded-md bg-green-50 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Your password has been reset successfully!
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/auth/login">
                  <Button className="w-full">
                    Sign in with your new password
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-lightest flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
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
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-dark">
          Reset your password
        </h2>
        {email && (
          <p className="mt-2 text-center text-sm text-gray">
            For account: <span className="font-medium text-primary">{email}</span>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!isValid ? (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Link href="/auth/login" className="text-sm text-primary hover:text-primary-dark">
                  Return to login page
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-dark">
                    New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="new-password"
                      name="newPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                      placeholder="At least 6 characters"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-dark">
                    Confirm New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrap the reset password content component with Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}