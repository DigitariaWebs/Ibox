import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import { Text, Input, Button, Icon } from '../ui';
import { Colors } from '../config/colors';
import { useAuth } from '../contexts/AuthContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  withRepeat,
  withSequence,
  Extrapolate,
} from 'react-native-reanimated';
import { BlurView as ExpoBlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.8;

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  navigation?: any;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose, navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const translateY = useSharedValue(MODAL_HEIGHT);
  const opacity = useSharedValue(0);
  const backgroundGradient = useSharedValue(0);
  const emailFocusProgress = useSharedValue(0);
  const loadingProgress = useSharedValue(0);
  const gestureTranslateY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 400 });
      translateY.value = withSpring(0, {
        damping: 25,
        stiffness: 300,
      });
      gestureTranslateY.value = 0;
      backgroundGradient.value = withTiming(1, { duration: 800 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(MODAL_HEIGHT, { duration: 350 }, () => {
        runOnJS(() => {
          setEmail('');
          setIsEmailFocused(false);
          setIsLoading(false);
        })();
      });
      gestureTranslateY.value = 0;
      backgroundGradient.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  useEffect(() => {
    if (isLoading) {
      loadingProgress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        false
      );
    } else {
      loadingProgress.value = withTiming(0, { duration: 300 });
    }
  }, [isLoading]);

  const handleClose = () => {
    onClose();
  };

  const handleBackdropPress = () => {
    handleClose();
  };

  const handleEmailContinue = async () => {
    if (email.trim()) {
      setIsLoading(true);
      console.log('Continue with email:', email);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create user data for AuthContext
        const userData = {
          id: `email_user_${Date.now()}`,
          email: email.trim(),
          firstName: 'Email',
          lastName: 'User',
        };

        await login(userData);
        console.log('✅ Email login successful for:', email);
        handleSuccessfulLogin();
      } catch (error) {
        console.error('❌ Email login error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSocialLogin = async (provider: 'facebook' | 'google' | 'apple', accountType?: 'transporter' | 'customer') => {
    setIsLoading(true);
    console.log('Login with:', provider, 'as:', accountType);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create user data for AuthContext
      const userData = {
        id: `${provider}_user_${Date.now()}`,
        email: `user@${provider}.com`,
        firstName: 'Social',
        lastName: 'User',
      };

      await login(userData);
      console.log('✅ Social login successful with:', provider);
      handleSuccessfulLogin(accountType);
    } catch (error) {
      console.error('❌ Social login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailFocus = () => {
    setIsEmailFocused(true);
    emailFocusProgress.value = withSpring(1, {
      damping: 20,
      stiffness: 300,
    });
  };

  const handleEmailBlur = () => {
    setIsEmailFocused(false);
    emailFocusProgress.value = withSpring(0, {
      damping: 20,
      stiffness: 300,
    });
  };

  const handleSuccessfulLogin = (accountType?: 'transporter' | 'customer') => {
    // Close the modal first
    onClose();
    // Note: Navigation will be handled automatically by AuthContext useEffect
    console.log('🎉 Login modal closed, AuthContext will handle navigation');
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Respond to pan gestures only for vertical movement
      return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 10;
    },
    onPanResponderGrant: (evt, gestureState) => {
      // Gesture started
    },
    onPanResponderMove: (evt, gestureState) => {
      // Only allow downward drag
      if (gestureState.dy > 0) {
        gestureTranslateY.value = gestureState.dy;
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      const shouldClose = gestureState.dy > MODAL_HEIGHT * 0.25 || gestureState.vy > 0.5;
      
      if (shouldClose) {
        // Close the modal
        gestureTranslateY.value = withTiming(MODAL_HEIGHT, { duration: 300 });
        translateY.value = withTiming(MODAL_HEIGHT, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        runOnJS(onClose)();
      } else {
        // Snap back to original position
        gestureTranslateY.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
        });
      }
    },
  });

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value + gestureTranslateY.value }],
  }));

  const animatedGradientStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      backgroundGradient.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  const animatedEmailContainerStyle = useAnimatedStyle(() => ({
    // Removed scale transform to prevent text blurriness
    opacity: interpolate(
      emailFocusProgress.value,
      [0, 1],
      [1, 1],
      Extrapolate.CLAMP
    ),
  }));

  const animatedLoadingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      loadingProgress.value,
      [0, 1],
      [0.3, 1],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View style={styles.backdropTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Modal Content */}
        <Animated.View style={[styles.modalContent, animatedModalStyle]}>
          {/* Gradient Background */}
          <Animated.View style={[styles.gradientContainer, animatedGradientStyle]}>
            <LinearGradient
              colors={['rgba(10, 165, 168, 0.1)', 'rgba(16, 185, 129, 0.05)', 'rgba(255, 255, 255, 0.95)']}
              locations={[0, 0.5, 1]}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
          
          {/* Glassmorphism Blur */}
          <ExpoBlurView intensity={50} tint="light" style={StyleSheet.absoluteFillObject} />
          
          {/* Interactive Green Bar for dragging */}
          <Animated.View 
            style={styles.dragHandle}
            {...panResponder.panHandlers}
          >
            <View style={styles.modernAccentBar} />
          </Animated.View>

          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Icon name="x" type="Feather" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
              {/* Title */}
              <View style={styles.titleContainer}>
                <Text variant="h1" weight="bold" style={styles.modernTitle}>
                  Welcome back
                </Text>
                <Text style={styles.subtitle}>
                  Sign in to your account to continue
                </Text>
              </View>

              {/* Email Input */}
              <Animated.View style={[styles.inputContainer, animatedEmailContainerStyle]}>
                <View style={styles.modernInputWrapper}>
                  <Icon 
                    name="mail" 
                    type="Feather" 
                    size={20} 
                    color={isEmailFocused ? Colors.primary : Colors.textSecondary} 
                    style={styles.inputIcon}
                  />
                  <Input
                    label={isEmailFocused || email.length > 0 ? "Email Address" : undefined}
                    placeholder="Enter your email address"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={handleEmailFocus}
                    onBlur={handleEmailBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    variant="filled"
                    style={styles.modernEmailInput}
                    placeholderTextColor={Colors.textSecondary}
                  />
                </View>
                {email.trim() && (
                  <View style={styles.continueButtonContainer}>
                    <Button
                      title={isLoading ? "Signing in..." : "Continue"}
                      onPress={handleEmailContinue}
                      variant="primary"
                      loading={isLoading}
                      disabled={isLoading}
                      style={styles.continueButton}
                      glowEffect={true}
                    />
                  </View>
                )}
              </Animated.View>

              {/* Divider (moved below input, spaced) */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={[styles.modernSocialButton, styles.facebookButton]}
                  onPress={() => handleSocialLogin('facebook', 'transporter')}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <View style={styles.socialIconContainer}>
                    <Icon name="facebook" type="FontAwesome" size={22} color="#fff" />
                  </View>
                  <Text style={[styles.socialButtonText, styles.facebookText]}>
                    Continue with Facebook
                  </Text>
                  {isLoading && (
                    <View style={styles.loadingIndicator}>
                      <Icon name="loader" type="Feather" size={18} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modernSocialButton, styles.googleButton]}
                  onPress={() => handleSocialLogin('google')}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <View style={styles.socialIconContainer}>
                    <Icon name="google" type="FontAwesome" size={22} color={Colors.textPrimary} />
                  </View>
                  <Text style={[styles.socialButtonText, styles.googleText]}>
                    Continue with Google
                  </Text>
                  {isLoading && (
                    <View style={styles.loadingIndicator}>
                      <Icon name="loader" type="Feather" size={18} color={Colors.textPrimary} />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modernSocialButton, styles.appleButton]}
                  onPress={() => handleSocialLogin('apple')}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <View style={styles.socialIconContainer}>
                    <Icon name="apple" type="FontAwesome" size={22} color="#fff" />
                  </View>
                  <Text style={[styles.socialButtonText, styles.appleText]}>
                    Continue with Apple
                  </Text>
                  {isLoading && (
                    <View style={styles.loadingIndicator}>
                      <Icon name="loader" type="Feather" size={18} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Bottom Policy Text (more margin) */}
              <View style={styles.bottomPolicyContainer}>
                <Text style={styles.bottomPolicyText}>
                  By continuing, you agree to our <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>
                </Text>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: MODAL_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
    overflow: 'hidden',
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardView: {
    flex: 1,
  },
  dragHandle: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modernAccentBar: {
    height: 5,
    width: 80,
    backgroundColor: Colors.primary,
    borderRadius: 3,
    opacity: 0.9,
    // Add subtle shadow to make it stand out
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  titleContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  modernTitle: {
    fontSize: 32,
    color: Colors.textPrimary,
    marginBottom: 8,
    lineHeight: 38,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 32,
  },
  modernInputWrapper: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 12,
  },
  modernEmailInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    minHeight: 44,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textPrimary,
    // Properties for crisp text rendering
    textAlignVertical: 'center',
  },
  continueButtonContainer: {
    marginTop: 20,
  },
  continueButton: {
    borderRadius: 16,
    minHeight: 52,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
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
    gap: 14,
    marginBottom: 40,
  },
  modernSocialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 52,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  socialIconContainer: {
    marginRight: 16,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  loadingIndicator: {
    marginLeft: 16,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  facebookText: {
    color: '#fff',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#dadce0',
  },
  googleText: {
    color: Colors.textPrimary,
  },
  appleButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  appleText: {
    color: '#fff',
  },
  bottomPolicyContainer: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  bottomPolicyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default LoginModal;