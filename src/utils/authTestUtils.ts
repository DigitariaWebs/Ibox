// Authentication Testing Utilities
// Use these functions in development to test Firebase auth integration

import { auth } from '../config/firebaseConfig';
import { 
  signInWithEmail,
  registerWithEmail,
  signOutUser 
} from '../services/firebaseAuth';

// Test email/password authentication
export const testEmailAuth = async () => {
  console.log('🧪 Testing Email Authentication...');
  
  const testEmail = 'test@example.com';
  const testPassword = 'test123456';
  const testName = { firstName: 'Test', lastName: 'User' };
  
  try {
    // Test registration
    console.log('1. Testing user registration...');
    const newUser = await registerWithEmail(
      testEmail, 
      testPassword, 
      testName.firstName, 
      testName.lastName
    );
    console.log('✅ Registration successful:', newUser.email);
    
    // Sign out
    await signOutUser();
    console.log('✅ Sign out successful');
    
    // Test login
    console.log('2. Testing user login...');
    const loginUser = await signInWithEmail(testEmail, testPassword);
    console.log('✅ Login successful:', loginUser.email);
    
    return true;
  } catch (error: any) {
    console.error('❌ Email auth test failed:', error.message);
    return false;
  }
};

// Test Firebase connection
export const testFirebaseConnection = async () => {
  console.log('🧪 Testing Firebase Connection...');
  
  try {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    
    console.log('✅ Firebase auth instance created');
    console.log('📍 Auth domain:', auth.config.authDomain);
    console.log('📍 Project ID:', auth.config.projectId);
    
    return true;
  } catch (error: any) {
    console.error('❌ Firebase connection test failed:', error.message);
    return false;
  }
};

// Run all tests
export const runAuthTests = async () => {
  console.log('🚀 Starting Authentication Tests...');
  console.log('=====================================');
  
  const tests = [
    { name: 'Firebase Connection', test: testFirebaseConnection },
    { name: 'Email Authentication', test: testEmailAuth },
  ];
  
  const results = [];
  
  for (const { name, test } of tests) {
    console.log(`\n📋 Running ${name} test...`);
    const result = await test();
    results.push({ name, passed: result });
  }
  
  console.log('\n📊 Test Results:');
  console.log('================');
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = results.every(r => r.passed);
  console.log(`\n🎯 Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  
  return allPassed;
};

// Helper function to check required configuration
export const checkConfiguration = () => {
  console.log('🔍 Checking Authentication Configuration...');
  
  const checks = [];
  
  // Check Firebase config
  try {
    const config = auth.config;
    checks.push({
      name: 'Firebase API Key',
      passed: config.apiKey !== 'YOUR_API_KEY',
      current: config.apiKey?.substring(0, 10) + '...'
    });
    
    checks.push({
      name: 'Firebase Project ID',
      passed: config.projectId !== 'your-project-id',
      current: config.projectId
    });
    
    checks.push({
      name: 'Firebase Auth Domain',
      passed: config.authDomain !== 'your-project.firebaseapp.com',
      current: config.authDomain
    });
  } catch (error) {
    checks.push({
      name: 'Firebase Configuration',
      passed: false,
      current: 'Error loading config'
    });
  }
  
  console.log('\n📋 Configuration Status:');
  console.log('========================');
  checks.forEach(({ name, passed, current }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}: ${current}`);
  });
  
  const needsConfig = checks.some(c => !c.passed);
  if (needsConfig) {
    console.log('\n⚠️  Configuration Required:');
    console.log('Please update src/config/firebaseConfig.ts with your Firebase project credentials.');
    console.log('See src/config/FIREBASE_SETUP.md for detailed setup instructions.');
  }
  
  return !needsConfig;
};

// Export all test utilities
export default {
  testEmailAuth,
  testFirebaseConnection,
  runAuthTests,
  checkConfiguration,
};