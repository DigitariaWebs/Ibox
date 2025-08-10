import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

// Complete the authentication session for better UX
WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
// Note: This is a constructed client ID based on the Firebase project
// If this doesn't work, you'll need to get the actual Web client ID from Firebase Console > Authentication > Sign-in method > Google
const GOOGLE_CLIENT_ID = '79631645506-9jg545mflqfvl8v50lc1gsthj4cotsld.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = ''; // Not needed for mobile OAuth flow

interface GoogleAuthResponse {
  id_token?: string;
  access_token?: string;
  error?: string;
}

export const signInWithGoogle = async (): Promise<GoogleAuthResponse> => {
  try {
    // Create the authorization request
    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
      redirectUri: AuthSession.makeRedirectUri({
        useProxy: true,
      }),
      additionalParameters: {},
      extraParams: {
        nonce: generateNonce(),
      },
    });

    // Start the authentication session
    const result = await request.promptAsync({
      authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
    });

    if (result.type === 'success') {
      // Extract the ID token from the response
      const { id_token, access_token } = result.params;
      
      if (id_token) {
        return { id_token, access_token };
      } else {
        return { error: 'No ID token received from Google' };
      }
    } else if (result.type === 'cancel') {
      return { error: 'User cancelled Google sign-in' };
    } else {
      return { error: result.error?.message || 'Google sign-in failed' };
    }
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    return { error: error.message || 'An unexpected error occurred' };
  }
};

// Generate a random nonce for security
const generateNonce = (): string => {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._';
  let nonce = '';
  for (let i = 0; i < 128; i++) {
    nonce += charset[Math.floor(Math.random() * charset.length)];
  }
  return nonce;
};

// Alternative implementation using Google's discovery document
export const signInWithGoogleDiscovery = async (): Promise<GoogleAuthResponse> => {
  try {
    // Discovery endpoint for Google OAuth
    const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
    
    // Create the authorization request
    const [request, response, promptAsync] = AuthSession.useAuthRequest(
      {
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.IdToken,
        redirectUri: AuthSession.makeRedirectUri({
          useProxy: true,
        }),
        additionalParameters: {
          nonce: generateNonce(),
        },
      },
      discovery
    );

    // Start the authentication
    const result = await promptAsync();

    if (result?.type === 'success') {
      const { id_token, access_token } = result.params;
      
      if (id_token) {
        return { id_token, access_token };
      } else {
        return { error: 'No ID token received from Google' };
      }
    } else {
      return { error: 'Google authentication failed or was cancelled' };
    }
  } catch (error: any) {
    console.error('Google sign-in discovery error:', error);
    return { error: error.message || 'An unexpected error occurred' };
  }
};

export default signInWithGoogle;