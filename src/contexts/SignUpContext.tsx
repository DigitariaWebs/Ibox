import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types for our sign-up data
export interface SignUpData {
  // Step 1: Account Type
  accountType?: 'customer' | 'transporter';
  
  // Step 2: Identity
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  legalAccepted?: boolean;
  
  // Step 2-b: OTP
  otp?: string;
  
  // Step 3: Address & Locale
  defaultAddress?: string;
  secondaryAddress?: string;
  language?: string;
  
  // Step 4-a: Customer Extras
  paymentData?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  } | null;
  isBusiness?: boolean;
  companyName?: string;
  taxId?: string;
  
  // Step 4-b: Transporter Vehicle
  vehicleType?: string;
  plate?: string;
  payloadKg?: number;
  vehiclePhotos?: string[];
  
  // Step 5-b: Transporter Identity & Compliance
  licenseImages?: string[];
  licenseExpiry?: string;
  insuranceDoc?: string;
  bgCheckConsent?: boolean;
  
  // Step 6-b: Transporter Banking
  bankIban?: string;
  bankRouting?: string;
  bankAccount?: string;
  bankHolder?: string;
  
  // Step 7: Confirmation
  confirmAll?: boolean;
  
  // Meta
  currentStep?: number;
  isCompleted?: boolean;
}

type SignUpAction = 
  | { type: 'UPDATE_DATA'; payload: Partial<SignUpData> }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'RESET_DATA' }
  | { type: 'LOAD_DATA'; payload: SignUpData };

interface SignUpContextType {
  signUpData: SignUpData;
  updateSignUpData: (data: Partial<SignUpData>) => void;
  setCurrentStep: (step: number) => void;
  resetSignUpData: () => void;
  saveToStorage: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

const initialSignUpData: SignUpData = {
  currentStep: 0,
  isCompleted: false,
  vehiclePhotos: [],
  licenseImages: [],
};

const signUpReducer = (state: SignUpData, action: SignUpAction): SignUpData => {
  switch (action.type) {
    case 'UPDATE_DATA':
      return { ...state, ...action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'RESET_DATA':
      return initialSignUpData;
    case 'LOAD_DATA':
      return { ...initialSignUpData, ...action.payload };
    default:
      return state;
  }
};

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

const STORAGE_KEY = '@ibox_signup_data';

export const SignUpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signUpData, dispatch] = useReducer(signUpReducer, initialSignUpData);

  const updateSignUpData = (data: Partial<SignUpData>) => {
    dispatch({ type: 'UPDATE_DATA', payload: data });
  };

  const setCurrentStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const resetSignUpData = () => {
    dispatch({ type: 'RESET_DATA' });
    AsyncStorage.removeItem(STORAGE_KEY);
  };

  const saveToStorage = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(signUpData));
    } catch (error) {
      console.error('Failed to save sign-up data:', error);
    }
  };

  const loadFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        dispatch({ type: 'LOAD_DATA', payload: data });
      }
    } catch (error) {
      console.error('Failed to load sign-up data:', error);
    }
  };

  // Auto-save to storage whenever data changes
  useEffect(() => {
    if (signUpData.currentStep !== undefined && signUpData.currentStep > 0) {
      saveToStorage();
    }
  }, [signUpData]);

  // Load data on mount
  useEffect(() => {
    loadFromStorage();
  }, []);

  const value: SignUpContextType = {
    signUpData,
    updateSignUpData,
    setCurrentStep,
    resetSignUpData,
    saveToStorage,
    loadFromStorage,
  };

  return (
    <SignUpContext.Provider value={value}>
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = () => {
  const context = useContext(SignUpContext);
  if (context === undefined) {
    throw new Error('useSignUp must be used within a SignUpProvider');
  }
  return context;
};