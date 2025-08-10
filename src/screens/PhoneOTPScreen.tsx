import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Button, Text, Icon } from '../ui';
import { Colors } from '../config/colors';
import { useAuth } from '../contexts/AuthContext';
import { ConfirmationResult } from 'firebase/auth';

interface PhoneOTPScreenProps {
  navigation: any;
  route: {
    params: {
      confirmationResult: ConfirmationResult;
      phoneNumber: string;
    };
  };
}

const PhoneOTPScreen: React.FC<PhoneOTPScreenProps> = ({ navigation, route }) => {
  const { verifyPhoneOTP, sendPhoneOTP } = useAuth();
  const { confirmationResult, phoneNumber } = route.params;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentConfirmationResult, setCurrentConfirmationResult] = useState(confirmationResult);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setIsValid(true);
      setError('');
    } else {
      setIsValid(false);
      setError('');
    }
  }, [otp]);

  const handleOTPChange = (value: string, index: number) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (!isValid) return;

    setIsVerifying(true);
    
    try {
      await verifyPhoneOTP(currentConfirmationResult, otpString);
      console.log('✅ Phone verification successful');
      
      // Navigation will be handled automatically by AuthContext state change
      
    } catch (error: any) {
      console.error('❌ Phone verification error:', error);
      const errorMessage = error.message || 'Invalid verification code. Please try again.';
      setError(errorMessage);
      shakeInputs();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setResendTimer(60);
    setOtp(['', '', '', '', '', '']);
    setError('');
    
    // Focus first input
    inputRefs.current[0]?.focus();
    
    try {
      // We need recaptcha verifier for resending, but we don't have access to it here
      // For now, just show a message that the user should go back and try again
      Alert.alert(
        'Resend Code',
        'To resend the verification code, please go back and enter your phone number again.',
        [
          {
            text: 'Go Back',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Resend OTP error:', error);
      Alert.alert('Error', 'Failed to resend code. Please try again.');
      setCanResend(true);
      setResendTimer(0);
    }
  };

  const shakeInputs = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (phone: string) => {
    // Format +1XXXXXXXXXX to +1 (XXX) XXX-XXXX
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      const match = cleaned.match(/^1(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    return phone;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="chevron-left" type="Feather" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Icon name="message-circle" type="Feather" size={32} color={Colors.primary} />
              </View>
            </View>
            
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                Enter verification code
              </Text>
              <Text style={styles.subtitle}>
                We sent a 6-digit code to
              </Text>
              <Text style={styles.phoneNumber}>
                {formatPhoneNumber(phoneNumber)}
              </Text>
            </View>
            
            {/* OTP Input */}
            <Animated.View 
              style={[
                styles.otpContainer,
                { transform: [{ translateX: shakeAnimation }] }
              ]}
            >
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => inputRefs.current[index] = ref}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                    error && styles.otpInputError
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOTPChange(value, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  autoFocus={index === 0}
                  selectTextOnFocus
                  returnKeyType="next"
                />
              ))}
            </Animated.View>
            
            {/* Error Message */}
            {error && (
              <Text style={styles.errorText}>
                {error}
              </Text>
            )}
            
            {/* Resend */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Didn't receive the code?{' '}
              </Text>
              <TouchableOpacity 
                onPress={handleResend}
                disabled={!canResend}
              >
                <Text style={[
                  styles.resendLink,
                  !canResend && styles.resendLinkDisabled
                ]}>
                  {canResend ? 'Resend' : `Resend in ${formatTime(resendTimer)}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        
        {/* Verify Button - Fixed at bottom */}
        <View style={styles.buttonContainer}>
          <Button
            title={isVerifying ? "Verifying..." : "Verify"}
            onPress={handleVerify}
            variant="primary"
            disabled={!isValid || isVerifying}
            loading={isVerifying}
            style={styles.verifyButton}
          />
          
          <TouchableOpacity style={styles.backToPhoneButton} onPress={handleBack}>
            <Text style={styles.backToPhoneText}>
              Back to phone number
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  otpInputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  resendLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: Colors.textTertiary,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 16,
  },
  verifyButton: {
    width: '100%',
  },
  backToPhoneButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backToPhoneText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

export default PhoneOTPScreen;