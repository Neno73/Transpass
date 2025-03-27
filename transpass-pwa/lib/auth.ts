import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
  updateProfile,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

// Register a new user with email and password
export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  companyName?: string,
  isCompany: boolean = false
): Promise<UserCredential> => {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update the user's display name
    await updateProfile(user, { displayName });

    // Create a user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      displayName,
      isCompany,
      companyName: companyName || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    if (isCompany) {
      await setDoc(doc(db, "companies", user.uid), {
        uid: user.uid,
        name: companyName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    return userCredential;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Sign in an existing user
export const signIn = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// Sign out the current user
export const signOut = async (): Promise<void> => {
  try {
    return await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Request password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    // Use the default Firebase password reset flow
    // This will use Firebase's default handling which is more reliable
    return await sendPasswordResetEmail(auth, email);

    // NOTE: If you want to use custom URLs in the future, uncomment this code:
    /*
    const actionCodeSettings = {
      url: typeof window !== 'undefined' 
        ? `${window.location.origin}/auth/reset-password` 
        : 'https://transpass.vercel.app/auth/reset-password',
      handleCodeInApp: true
    };
    return await sendPasswordResetEmail(auth, email, actionCodeSettings);
    */
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
};

// Get the current user's data from Firestore
export const getUserData = async (user: User) => {
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  user: User,
  data: {
    displayName?: string;
    companyName?: string;
    photoURL?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
) => {
  try {
    // Update auth profile if displayName or photoURL is provided
    if (data.displayName || data.photoURL) {
      const profileUpdate: { displayName?: string; photoURL?: string } = {};
      if (data.displayName) profileUpdate.displayName = data.displayName;
      if (data.photoURL) profileUpdate.photoURL = data.photoURL;

      await updateProfile(user, profileUpdate);
    }

    // Update the user document in Firestore
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const updateCompanyProfile = async (
  user: User,
  data: {
    companyName?: string;
    displayName?: string;
    website?: string;
    description?: string;
    phone?: string;
    address?: string;
    certifications?: string[];
    image?: string;
  }
) => {
  try {
    const companyRef = doc(db, "companies", user.uid);
    await updateDoc(companyRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error updating company profile:", error);
    throw error;
  }
};
