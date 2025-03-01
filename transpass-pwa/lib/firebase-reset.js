// Import Firebase SDK modules
import { 
  getAuth, 
  deleteUser, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

// Function to reset a user's account by email
export async function resetUserAccount(email, password) {
  try {
    // Sign in with the user's credentials
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Delete the user's document from Firestore
    if (user.uid) {
      try {
        await deleteDoc(doc(db, 'users', user.uid));
        console.log('User document deleted from Firestore');
      } catch (error) {
        console.error('Error deleting user document:', error);
      }
    }
    
    // Delete the user's account from Firebase Authentication
    await deleteUser(user);
    console.log('User account deleted');
    
    return { success: true, message: 'Account successfully reset' };
  } catch (error) {
    console.error('Error resetting user account:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to reset account',
      code: error.code
    };
  }
}

// Function to check if an email is already registered
export async function isEmailRegistered(email) {
  try {
    // Try to sign in with a fake password
    await signInWithEmailAndPassword(auth, email, "password123!@#");
    return true; // This should never happen unless the password matches
  } catch (error) {
    // If the error is 'auth/user-not-found', the email is not registered
    if (error.code === 'auth/user-not-found') {
      return false;
    }
    // If the error is 'auth/wrong-password', the email is registered
    if (error.code === 'auth/wrong-password') {
      return true;
    }
    // For other errors, return false
    return false;
  }
}