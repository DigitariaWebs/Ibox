import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  user: User | null;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
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

  // Load cached auth state on app start
  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      setIsLoading(true);
      
      const [
        cachedIsAuthenticated,
        cachedHasCompletedOnboarding,
        cachedUserData,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED),
        AsyncStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
      ]);

      if (cachedIsAuthenticated === 'true') {
        setIsAuthenticated(true);
        
        if (cachedUserData) {
          setUser(JSON.parse(cachedUserData));
        }
      }

      if (cachedHasCompletedOnboarding === 'true') {
        setHasCompletedOnboarding(true);
      }

      console.log('🔐 Auth state loaded:', {
        isAuthenticated: cachedIsAuthenticated === 'true',
        hasCompletedOnboarding: cachedHasCompletedOnboarding === 'true',
        hasUserData: !!cachedUserData,
      });

    } catch (error) {
      console.error('❌ Error loading auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User) => {
    try {
      setIsAuthenticated(true);
      setUser(userData);

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true'),
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData)),
      ]);

      console.log('✅ User logged in and cached:', userData.email);
    } catch (error) {
      console.error('❌ Error caching login state:', error);
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      // Note: We keep onboarding state so user doesn't see intro again

      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);

      console.log('🚪 User logged out');
    } catch (error) {
      console.error('❌ Error clearing auth cache:', error);
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