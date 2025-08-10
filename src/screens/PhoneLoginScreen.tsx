import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text, Input, Button, Icon } from '../ui';
import { Colors } from '../config/colors';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import firebaseConfig from '../config/firebaseConfig';

interface PhoneLoginScreenProps {
  navigation: any;
}

const PhoneLoginScreen: React.FC<PhoneLoginScreenProps> = ({ navigation }) => {
  const { sendPhoneOTP } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const recaptchaVerifier = useRef(null);

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format as +1 (XXX) XXX-XXXX for US numbers
    if (cleaned.length <= 10) {
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        let formatted = '';
        if (match[1]) {
          formatted += `(${match[1]}`;
        }
        if (match[2]) {
          formatted += `) ${match[2]}`;
        }
        if (match[3]) {
          formatted += `-${match[3]}`;
        }
        return formatted;
      }
    }
    return text;
  };

  const getE164PhoneNumber = (formattedNumber: string) => {
    // Convert formatted number to E.164 format (+1XXXXXXXXXX)
    const cleaned = formattedNumber.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    return formattedNumber;
  };

  const handlePhoneNumberChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const handleSendCode = async () => {
    const e164Number = getE164PhoneNumber(phoneNumber);
    
    if (e164Number.length !== 12) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
      return;
    }

    setIsLoading(true);
    
    try {
      if (!recaptchaVerifier.current) {
        throw new Error('reCAPTCHA verifier not initialized');
      }

      const confirmationResult = await sendPhoneOTP(e164Number, recaptchaVerifier.current);
      
      console.log('✅ SMS sent successfully');
      
      // Navigate to OTP verification screen with confirmation result and phone number
      navigation.navigate('PhoneOTP', {
        confirmationResult,
        phoneNumber: e164Number,
      });
      
    } catch (error: any) {
      console.error('❌ Phone OTP send error:', error);
      const errorMessage = error.message || 'Failed to send verification code. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Firebase Recaptcha */}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      />

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Icon name="chevron-left" type="Feather" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icon name="phone" type="Feather" size={32} color={Colors.primary} />
            </View>
          </View>
          
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              Enter your phone number
            </Text>
            <Text style={styles.subtitle}>
              We'll send you a verification code via SMS
            </Text>
          </View>
          
          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.countryCode}>+1</Text>
            <Input
              placeholder="(555) 123-4567"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              keyboardType="phone-pad"
              style={styles.phoneInput}
              maxLength={14} // (XXX) XXX-XXXX format
            />
          </View>
          
          {/* Info Text */}
          <Text style={styles.infoText}>
            By continuing, you agree to receive SMS messages from iBox. Message and data rates may apply.
          </Text>
        </View>

        {/* Send Code Button - Fixed at bottom */}
        <View style={styles.buttonContainer}>
          <Button
            title={isLoading ? "Sending..." : "Send Code"}
            onPress={handleSendCode}
            variant="primary"
            disabled={phoneNumber.length < 10 || isLoading}
            loading={isLoading}
            style={styles.sendCodeButton}
          />
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
  keyboardView: {
    flex: 1,
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
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
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  countryCode: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginRight: 12,
    paddingVertical: 16,
  },
  phoneInput: {
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  sendCodeButton: {
    width: '100%',
  },
});

export default PhoneLoginScreen;