# Firebase Authentication Setup Guide

This document outlines how to configure Firebase Authentication for the iBox React Native app.

## Prerequisites

1. Firebase project created at https://console.firebase.google.com/
2. React Native app registered in Firebase
3. Authentication providers enabled in Firebase Console

## Configuration Steps

### 1. Firebase Project Setup

1. Go to the Firebase Console
2. Create a new project or select existing project
3. Add a new app (iOS/Android/Web) 
4. Download the configuration file

### 2. Update Firebase Config

Update `/src/config/firebaseConfig.ts` with your actual Firebase project credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789",
};
```

### 3. Enable Authentication Providers

In the Firebase Console, go to Authentication > Sign-in method and enable:

#### Email/Password
- Enable "Email/Password" provider
- Optionally enable "Email link (passwordless sign-in)"

#### Phone Authentication
- Enable "Phone" provider
- Configure your test phone numbers (optional)
- Set up reCAPTCHA (handled automatically by expo-firebase-recaptcha)

#### Google Sign-In
- Enable "Google" provider
- Add your OAuth client IDs:
  - Web client ID (for Expo managed workflow)
  - iOS client ID (if using bare workflow)
  - Android client ID (if using bare workflow)

### 4. Google OAuth Configuration

For Google sign-in to work, update `/src/services/googleAuth.ts`:

```typescript
const GOOGLE_CLIENT_ID = 'your-web-client-id.googleusercontent.com';
```

**Where to find your Google Client ID:**
1. Firebase Console → Authentication → Sign-in method → Google
2. Copy the "Web client ID" 
3. OR go to Google Cloud Console → APIs & Credentials → OAuth 2.0 Client IDs

### 5. Testing Configuration

#### Test Users for Development

Add test users in Firebase Console → Authentication → Users:
- Email: test@example.com / Password: test123456
- Phone: +1 555-123-4567 (add in Authentication → Sign-in method → Phone → Phone numbers for testing)

## Authentication Flow Testing

### 1. Email/Password Authentication

**Registration Flow:**
1. Navigate to AuthSelection → "Join neighborhood"
2. Complete the 7-step onboarding process
3. In ConfirmationScreen, the app will create a Firebase user
4. User should be automatically logged in and navigated to home

**Login Flow:**
1. Navigate to AuthSelection → "Log in" 
2. Enter email and password
3. User should be authenticated and navigated to appropriate home screen

### 2. Phone Authentication

**Phone Login Flow:**
1. Navigate to AuthSelection → "Log in with Phone"
2. Enter phone number (US format)
3. Complete reCAPTCHA if prompted
4. Enter 6-digit SMS verification code
5. User should be authenticated and navigated to home

### 3. Google Authentication

**Google Login Flow:**
1. Navigate to AuthSelection → "Log in" → "Continue with Google"
2. Complete Google OAuth in browser/WebView
3. User should be authenticated and navigated to home

## Troubleshooting

### Common Issues

**1. Firebase Config Error**
- Error: "Firebase app not initialized"
- Solution: Ensure firebaseConfig.ts has valid credentials

**2. Phone Auth reCAPTCHA Issues**
- Error: "reCAPTCHA verification failed"
- Solution: Ensure Firebase project has Phone auth enabled and test on physical device

**3. Google Sign-In Issues**
- Error: "Google sign-in failed"
- Solution: 
  - Check GOOGLE_CLIENT_ID is correct
  - Ensure Google provider is enabled in Firebase
  - Test on physical device (doesn't work in simulator)

**4. Build Issues**
- Error: Module resolution errors
- Solution: 
  - Run `npm install` to ensure all packages are installed
  - Clear Metro cache: `npx react-native start --reset-cache`

### Testing on Different Platforms

**iOS:**
- Physical device required for Phone and Google auth
- Simulator can test Email/Password only

**Android:**
- Physical device or emulator both work
- Ensure Google Play Services available for Google auth

**Expo Go:**
- Email/Password: ✅ Works
- Phone Auth: ⚠️ Limited (may not work in development)
- Google Auth: ⚠️ Limited (may require custom development build)

## Production Deployment

Before deploying to production:

1. **Security Rules**: Set up proper Firebase Security Rules
2. **Authorized Domains**: Add your production domains to Firebase Auth settings
3. **API Quotas**: Monitor and set up billing for Firebase usage
4. **Test Numbers**: Remove test phone numbers from production
5. **OAuth Consent**: Complete Google OAuth consent screen verification

## Current Implementation Status

✅ **Completed:**
- Firebase SDK integration
- Email/Password authentication (login & registration)
- Phone/SMS authentication with OTP
- Google OAuth authentication
- Redux state synchronization
- Navigation integration
- Error handling and user feedback

⚠️ **Requires Configuration:**
- Firebase project credentials
- Google OAuth client ID
- Test users for development

🚧 **Future Enhancements:**
- Apple Sign-In integration
- Facebook authentication
- Email verification flows
- Password reset functionality
- Multi-factor authentication