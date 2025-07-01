import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text, Icon } from '../ui';
import { Colors } from '../config/colors';
import { PaymentInput } from './PaymentInput';
import { 
  VisaLogo, 
  MastercardLogo, 
  AmexLogo, 
  DiscoverLogo, 
  ApplePayLogo, 
  GooglePayLogo, 
  StripeLogo 
} from './CardLogos';

interface PaymentMethodSelectorProps {
  onPaymentChange: (data: any, isValid: boolean) => void;
  onSkip: () => void;
}

type PaymentMethodType = 'card' | 'applepay' | 'googlepay' | 'stripe';

interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  logo: React.ReactNode;
  description: string;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onPaymentChange,
  onSkip,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card');
  const [isPaymentValid, setIsPaymentValid] = useState(false);

  // Define PAYMENT_METHODS inside component to avoid referencing styles before initialization
  const PAYMENT_METHODS: PaymentMethod[] = React.useMemo(() => ([
    {
      id: 'card',
      name: 'Credit/Debit Card',
      logo: (
        <View style={styles.cardLogos}>
          <VisaLogo width={32} height={20} />
          <MastercardLogo width={32} height={20} />
          <AmexLogo width={32} height={20} />
          <DiscoverLogo width={32} height={20} />
        </View>
      ),
      description: 'Visa, Mastercard, Amex, Discover',
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      logo: <ApplePayLogo width={40} height={24} />,
      description: 'Pay with Touch ID or Face ID',
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      logo: <GooglePayLogo width={40} height={24} />,
      description: 'Quick and secure payments',
    },
    {
      id: 'stripe',
      name: 'Stripe',
      logo: <StripeLogo width={40} height={24} />,
      description: 'Secure payment processing',
    },
  ]), []);

  const handleMethodSelect = (method: PaymentMethodType) => {
    setSelectedMethod(method);
    
    // For digital payment methods, mark as valid immediately
    if (method !== 'card') {
      setIsPaymentValid(true);
      onPaymentChange({ method, provider: method }, true);
    } else {
      setIsPaymentValid(false);
      onPaymentChange(null, false);
    }
  };

  const handleCardDataChange = (data: any, valid: boolean) => {
    setIsPaymentValid(valid);
    onPaymentChange({ method: 'card', ...data }, valid);
  };

  return (
    <View style={styles.container}>
      {/* Payment Method Selection */}
      <View style={styles.methodSelection}>
        <Text style={styles.sectionTitle}>Choose payment method</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.methodScroll}
          contentContainerStyle={styles.methodScrollContent}
        >
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected,
              ]}
              onPress={() => handleMethodSelect(method.id)}
              activeOpacity={0.8}
            >
              <View style={styles.methodLogo}>
                {method.logo}
              </View>
              <Text style={[
                styles.methodName,
                selectedMethod === method.id && styles.methodNameSelected,
              ]}>
                {method.name}
              </Text>
              <Text style={[
                styles.methodDescription,
                selectedMethod === method.id && styles.methodDescriptionSelected,
              ]}>
                {method.description}
              </Text>
              {selectedMethod === method.id && (
                <View style={styles.methodCheck}>
                  <Icon name="check" type="Feather" size={14} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Payment Details */}
      <View style={styles.paymentDetails}>
        {selectedMethod === 'card' ? (
          <PaymentInput
            onDataChange={handleCardDataChange}
            style={styles.paymentInput}
          />
        ) : (
          <View style={styles.digitalPaymentInfo}>
            <View style={styles.digitalPaymentHeader}>
              <Icon name="shield-check" type="Feather" size={24} color={Colors.success} />
              <Text style={styles.digitalPaymentTitle}>
                {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name} Selected
              </Text>
            </View>
            <Text style={styles.digitalPaymentDescription}>
              {selectedMethod === 'applepay' && 
                'You can securely pay using Touch ID, Face ID, or your device passcode. Your card details are never shared with merchants.'
              }
              {selectedMethod === 'googlepay' && 
                'Pay quickly and securely with Google Pay. Your payment info stays safe with advanced security and fraud protection.'
              }
              {selectedMethod === 'stripe' && 
                'Stripe provides secure payment processing with bank-level security and instant transaction processing.'
              }
            </Text>
            <View style={styles.digitalPaymentFeatures}>
              <View style={styles.featureItem}>
                <Icon name="lock" type="Feather" size={16} color={Colors.success} />
                <Text style={styles.featureText}>Bank-level encryption</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="zap" type="Feather" size={16} color={Colors.success} />
                <Text style={styles.featureText}>Instant processing</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="eye-off" type="Feather" size={16} color={Colors.success} />
                <Text style={styles.featureText}>Privacy protected</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Skip Option */}
      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  methodSelection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  methodScroll: {
    flexGrow: 0,
  },
  methodScrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  methodCard: {
    width: 140,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    position: 'relative',
  },
  methodCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  methodLogo: {
    height: 32,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLogos: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodName: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  methodNameSelected: {
    color: Colors.primary,
  },
  methodDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  methodDescriptionSelected: {
    color: Colors.primary,
  },
  methodCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentDetails: {
    minHeight: 100,
  },
  paymentInput: {
    marginBottom: 0,
  },
  digitalPaymentInfo: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.success + '20',
  },
  digitalPaymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  digitalPaymentTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  digitalPaymentDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  digitalPaymentFeatures: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});