import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUserData, logout as logoutRedux } from '../store/store';
import { auth } from '../config/firebaseConfig';
import { 
  signInWithEmail,
  registerWithEmail,
  sendPhoneVerificationCode,
  verifyPhoneCode,
  signInWithGoogle,
  signOutUser,
  mapFirebaseUserToAuthUser,
  AuthUser,
  AuthError
} from '../services/firebaseAuth';
import { ConfirmationResult, ApplicationVerifier } from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType?: 'customer' | 'transporter';
  displayName?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  user: User | null;
  isLoading: boolean;
  login: (user: User, userType?: 'customer' | 'transporter') => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
  // Firebase auth methods
  signInWithEmailAndPassword: (email: string, password: string) => Promise<User>;
  registerWithEmailAndPassword: (email: string, password: string, firstName: string, lastName: string) => Promise<User>;
  sendPhoneOTP: (phoneNumber: string, recaptchaVerifier: ApplicationVerifier) => Promise<ConfirmationResult>;
  verifyPhoneOTP: (confirmationResult: ConfirmationResult, code: string) => Promise<User>;
  signInWithGoogleCredential: (idToken: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  IS_AUTHENTICATED: '@ibox:isAuthenticated',
  HAS_COMPLETED_ONBOARDING: '@ibox:hasCompletedOnboarding',
  USER_DATA: '@ibox:userData',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // User is signed in - convert Firebase user to our User format
          const authUser = mapFirebaseUserToAuthUser(firebaseUser);
          
          // Check if we have cached user data with userType
          const cachedUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
          let userType: 'customer' | 'transporter' = 'customer';
          
          if (cachedUserData) {
            const parsed = JSON.parse(cachedUserData);
            userType = parsed.userType || 'customer';
          }
          
          const userWithType: User = {
            ...authUser,
            userType,
          };
          
          setUser(userWithType);
          setIsAuthenticated(true);
          
          // Cache the user data
          await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userWithType));
          await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
          
          // Sync with Redux store
          dispatch(setUserData({
            firstName: userWithType.firstName,
            lastName: userWithType.lastName,
            email: userWithType.email,
            loginMethod: 'email', // Default, could be improved to track actual method
            accountType: userWithType.userType === 'customer' ? 'personal' : 'business',
          }));
          
          console.log('🔐 Firebase user authenticated:', userWithType.email);
        } else {
          // User is signed out
          setUser(null);
          setIsAuthenticated(false);
          await AsyncStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
          await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
          
          // Sync with Redux store
          dispatch(logoutRedux());
          
          console.log('🚪 Firebase user signed out');
        }
      } catch (error) {
        console.error('❌ Error in auth state change:', error);
      }
    });

    // Load onboarding state
    loadOnboardingState();

    return unsubscribe;
  }, []);

  // Load cached onboarding state on app start
  useEffect(() => {
    loadOnboardingState();
  }, []);

  const loadOnboardingState = async () => {
    try {
      setIsLoading(true);
      
      const cachedHasCompletedOnboarding = await AsyncStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
      
      if (cachedHasCompletedOnboarding === 'true') {
        setHasCompletedOnboarding(true);
      }

      console.log('🔐 Onboarding state loaded:', {
        hasCompletedOnboarding: cachedHasCompletedOnboarding === 'true',
      });

    } catch (error) {
      console.error('❌ Error loading onboarding state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User, userType?: 'customer' | 'transporter') => {
    try {
      // Add userType to userData if provided
      const userWithType = {
        ...userData,
        userType: userType || 'customer' // default to customer if not specified
      };
      
      setIsAuthenticated(true);
      setUser(userWithType);

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true'),
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userWithType)),
      ]);

      console.log('✅ User logged in and cached:', userWithType.email, 'as', userWithType.userType);
    } catch (error) {
      console.error('❌ Error caching login state:', error);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase (this will trigger the auth state change)
      await signOutUser();
      console.log('🚪 User logged out');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Fallback: clear local state even if Firebase logout fails
      setIsAuthenticated(false);
      setUser(null);
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);
    }
  };

  const completeOnboarding = async () => {
    try {
      setHasCompletedOnboarding(true);
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, 'true');
      console.log('✅ Onboarding completed and cached');
    } catch (error) {
      console.error('❌ Error caching onboarding state:', error);
    }
  };

  const skipOnboarding = async () => {
    try {
      setHasCompletedOnboarding(true);
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, 'true');
      console.log('⏭️ Onboarding skipped and cached');
    } catch (error) {
      console.error('❌ Error caching onboarding skip:', error);
    }
  };

  // Firebase Authentication Methods
  const signInWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
    try {
      const authUser = await signInWithEmail(email, password);
      const userWithType: User = {
        ...authUser,
        userType: 'customer', // Default to customer, can be updated later
      };
      
      // The onAuthStateChanged listener will handle setting the user state
      return userWithType;
    } catch (error) {
      console.error('❌ Email sign-in error:', error);
      throw error;
    }
  };

  const registerWithEmailAndPassword = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<User> => {
    try {
      const authUser = await registerWithEmail(email, password, firstName, lastName);
      const userWithType: User = {
        ...authUser,
        userType: 'customer', // Default to customer, can be updated later
      };
      
      // The onAuthStateChanged listener will handle setting the user state
      return userWithType;
    } catch (error) {
      console.error('❌ Email registration error:', error);
      throw error;
    }
  };

  const sendPhoneOTP = async (phoneNumber: string, recaptchaVerifier: ApplicationVerifier): Promise<ConfirmationResult> => {
    try {
      return await sendPhoneVerificationCode(phoneNumber, recaptchaVerifier);
    } catch (error) {
      console.error('❌ Phone OTP send error:', error);
      throw error;
    }
  };

  const verifyPhoneOTP = async (confirmationResult: ConfirmationResult, code: string): Promise<User> => {
    try {
      const authUser = await verifyPhoneCode(confirmationResult, code);
      const userWithType: User = {
        ...authUser,
        userType: 'customer', // Default to customer, can be updated later
      };
      
      // The onAuthStateChanged listener will handle setting the user state
      return userWithType;
    } catch (error) {
      console.error('❌ Phone OTP verification error:', error);
      throw error;
    }
  };

  const signInWithGoogleCredential = async (idToken: string): Promise<User> => {
    try {
      const authUser = await signInWithGoogle(idToken);
      const userWithType: User = {
        ...authUser,
        userType: 'customer', // Default to customer, can be updated later
      };
      
      // The onAuthStateChanged listener will handle setting the user state
      return userWithType;
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      throw error;
    }
  };

  // Clear all cache (for debugging)
  const clearAllCache = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED),
        AsyncStorage.removeItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);
      
      setIsAuthenticated(false);
      setHasCompletedOnboarding(false);
      setUser(null);
      
      console.log('🗑️ All auth cache cleared');
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    hasCompletedOnboarding,
    user,
    isLoading,
    login,
    logout,
    completeOnboarding,
    skipOnboarding,
    // Firebase auth methods
    signInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPhoneOTP,
    verifyPhoneOTP,
    signInWithGoogleCredential,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export for debugging purposes
export const debugAuth = {
  clearAllCache: async () => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED),
      AsyncStorage.removeItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
    ]);
    console.log('🗑️ Debug: All auth cache cleared');
  },
}; 