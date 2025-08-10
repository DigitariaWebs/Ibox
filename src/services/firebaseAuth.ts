import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  GoogleAuthProvider,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
  ConfirmationResult,
  ApplicationVerifier,
  Auth
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

// Types
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  displayName?: string;
}

export interface AuthError {
  code: string;
  message: string;
}

// Helper function to convert Firebase user to our user format
export const mapFirebaseUserToAuthUser = (firebaseUser: FirebaseUser, additionalData?: Partial<AuthUser>): AuthUser => {
  const displayName = firebaseUser.displayName || '';
  const nameParts = displayName.split(' ');
  
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    firstName: additionalData?.firstName || nameParts[0] || '',
    lastName: additionalData?.lastName || nameParts.slice(1).join(' ') || '',
    phone: firebaseUser.phoneNumber || additionalData?.phone || '',
    displayName: firebaseUser.displayName || '',
  };
};

// Email/Password Authentication
export const signInWithEmail = async (email: string, password: string): Promise<AuthUser> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUserToAuthUser(userCredential.user);
  } catch (error: any) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code),
    } as AuthError;
  }
};

export const registerWithEmail = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string
): Promise<AuthUser> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(userCredential.user, {
      displayName: `${firstName} ${lastName}`,
    });

    return mapFirebaseUserToAuthUser(userCredential.user, { firstName, lastName });
  } catch (error: any) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code),
    } as AuthError;
  }
};

// Phone Authentication
export const sendPhoneVerificationCode = async (
  phoneNumber: string,
  recaptchaVerifier: ApplicationVerifier
): Promise<ConfirmationResult> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
  } catch (error: any) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code),
    } as AuthError;
  }
};

export const verifyPhoneCode = async (
  confirmationResult: ConfirmationResult,
  verificationCode: string
): Promise<AuthUser> => {
  try {
    const userCredential = await confirmationResult.confirm(verificationCode);
    return mapFirebaseUserToAuthUser(userCredential.user);
  } catch (error: any) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code),
    } as AuthError;
  }
};

// Google Authentication
export const signInWithGoogle = async (idToken: string): Promise<AuthUser> => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    return mapFirebaseUserToAuthUser(userCredential.user);
  } catch (error: any) {
    throw {
      code: error.code,
      message: getAuthErrorMessage(error.code),
    } as AuthError;
  }
};

// Error message helper
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/invalid-phone-number':
      return 'Please enter a valid phone number.';
    case 'auth/invalid-verification-code':
      return 'Invalid verification code. Please try again.';
    case 'auth/code-expired':
      return 'Verification code has expired. Please request a new one.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but different sign-in credentials.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw error;
  }
};