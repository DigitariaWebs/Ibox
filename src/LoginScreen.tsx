import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text, Input, Button, Icon } from './ui';
import { Colors } from './config/colors';
import { useAuth } from './contexts/AuthContext';
import { signInWithGoogle } from './services/googleAuth';

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const { signInWithEmailAndPassword, signInWithGoogleCredential } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleEmailLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Password Required', 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(email.trim(), password);
      console.log('✅ Login successful for:', email);
      // Navigation will happen automatically via AuthContext state change
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      const errorMessage = error.message || 'Please check your credentials and try again.';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'facebook' | 'google' | 'apple') => {
    setIsLoading(true);
    
    try {
      if (provider === 'google') {
        // Implement Google sign-in
        const googleResult = await signInWithGoogle();
        
        if (googleResult.error) {
          Alert.alert('Google Sign-In Failed', googleResult.error);
          return;
        }
        
        if (googleResult.id_token) {
          // Sign in with Firebase using the Google ID token
          await signInWithGoogleCredential(googleResult.id_token);
          console.log('✅ Google sign-in successful');
          // Navigation will be handled automatically by AuthContext
        } else {
          Alert.alert('Google Sign-In Failed', 'No ID token received from Google.');
        }
      } else {
        // For Facebook and Apple, show placeholder for now
        Alert.alert(`${provider} Sign-In`, `${provider} sign-in is not yet implemented. Please use email/password or Google for now.`);
        return;
      }
      
    } catch (error: any) {
      console.error('❌ Social login error:', error);
      const errorMessage = error.message || `Failed to login with ${provider}. Please try again.`;
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={styles.sheet}>
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Icon name="chevron-left" type="Feather" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Title */}
            <Text variant="h1" weight="bold" style={styles.title}>
              Welcome back
            </Text>
            <Text style={styles.subtitle}>
              Sign in to your account
            </Text>

            {/* Login Form */}
            <View style={styles.inputContainer}>
              <Input
                placeholder="Enter your email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.emailInput}
                leftIcon={<Icon name="mail" type="Feather" size={20} color={Colors.textSecondary} />}
              />
              
              <Input
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.passwordInput}
                leftIcon={<Icon name="lock" type="Feather" size={20} color={Colors.textSecondary} />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon 
                      name={showPassword ? "eye-off" : "eye"} 
                      type="Feather" 
                      size={20} 
                      color={Colors.textSecondary} 
                    />
                  </TouchableOpacity>
                }
              />
              
              <Button
                title={isLoading ? "Signing in..." : "Sign In"}
                onPress={handleEmailLogin}
                variant="primary"
                style={styles.continueButton}
                loading={isLoading}
                disabled={!email.trim() || !password.trim()}
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={[styles.socialButton, styles.facebookButton]}
                onPress={() => handleSocialLogin('facebook')}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Icon name="facebook" type="FontAwesome" size={20} color="#fff" />
                <Text style={[styles.socialButtonText, styles.facebookText]}>
                  Continue with Facebook
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => handleSocialLogin('google')}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Icon name="google" type="FontAwesome" size={20} color={Colors.textPrimary} />
                <Text style={[styles.socialButtonText, styles.googleText]}>
                  Continue with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={() => handleSocialLogin('apple')}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Icon name="apple" type="FontAwesome" size={20} color="#fff" />
                <Text style={[styles.socialButtonText, styles.appleText]}>
                  Continue with Apple
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Legal Disclaimer */}
          <View style={styles.footer}>
            <Text style={styles.legalText}>
              By continuing, you agree to our{' '}
              <Text style={styles.legalLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: 8,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 40,
    textAlign: 'left',
  },
  inputContainer: {
    marginBottom: 32,
  },
  emailInput: {
    marginBottom: 16,
  },
  passwordInput: {
    marginBottom: 24,
  },
  continueButton: {
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  socialContainer: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 56,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  facebookText: {
    color: '#fff',
  },
  googleButton: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
  },
  googleText: {
    color: Colors.textPrimary,
  },
  appleButton: {
    backgroundColor: Colors.textPrimary,
    borderColor: Colors.textPrimary,
  },
  appleText: {
    color: '#fff',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  legalText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    color: Colors.primary,
    fontWeight: '500',
  },
  sheet: {
    height: '80%',
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
});

export default LoginScreen;