import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { Button, Text, Icon, Input } from '../../ui';
import { Colors } from '../../config/colors';
import { useSignUp } from '../../contexts/SignUpContext';
import { transporterBankingSchema } from '../../validation/signUpSchemas';

interface TransporterBankingScreenProps {
  navigation: any;
}

interface FormData {
  bankIban: string;
  bankRouting: string;
  bankAccount: string;
  bankHolder: string;
}

const TransporterBankingScreen: React.FC<TransporterBankingScreenProps> = ({ navigation }) => {
  const { signUpData, updateSignUpData, setCurrentStep } = useSignUp();
  
  const [formData, setFormData] = useState<FormData>({
    bankIban: signUpData.bankIban || '',
    bankRouting: signUpData.bankRouting || '',
    bankAccount: signUpData.bankAccount || '',
    bankHolder: signUpData.bankHolder || '',
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isValid, setIsValid] = useState(false);
  const [useIban, setUseIban] = useState(!!formData.bankIban);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = async () => {
    try {
      await transporterBankingSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setIsValid(true);
    } catch (validationErrors: any) {
      const errorObj: Partial<FormData> = {};
      validationErrors.inner?.forEach((error: any) => {
        errorObj[error.path as keyof FormData] = error.message;
      });
      setErrors(errorObj);
      setIsValid(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (isValid) {
      updateSignUpData({
        bankIban: formData.bankIban,
        bankRouting: formData.bankRouting,
        bankAccount: formData.bankAccount,
        bankHolder: formData.bankHolder,
      });
      setCurrentStep(8);
      navigation.navigate('ConfirmationScreen');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleBankingMethod = (value: boolean) => {
    setUseIban(value);
    if (value) {
      // Clear routing and account when switching to IBAN
      updateField('bankRouting', '');
      updateField('bankAccount', '');
    } else {
      // Clear IBAN when switching to routing/account
      updateField('bankIban', '');
    }
  };

  const formatIban = (value: string) => {
    // Remove spaces and convert to uppercase
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    // Add spaces every 4 characters for display
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const handleIbanChange = (value: string) => {
    const formatted = formatIban(value);
    updateField('bankIban', formatted);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" type="Feather" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 6 of 7</Text>
      </View>
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                Banking Information
              </Text>
              <Text style={styles.subtitle}>
                Add your banking details to receive payments for completed deliveries
              </Text>
            </View>
            
            {/* Banking Method Toggle */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="credit-card" type="Feather" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Banking Method</Text>
              </View>
              
              <View style={styles.sectionContent}>
                <View style={styles.toggleContainer}>
                  <View style={styles.toggleOption}>
                    <View style={styles.toggleContent}>
                      <Text style={styles.toggleLabel}>IBAN</Text>
                      <Text style={styles.toggleDescription}>
                        International Bank Account Number (Europe)
                      </Text>
                    </View>
                    <Switch
                      value={useIban}
                      onValueChange={toggleBankingMethod}
                      trackColor={{ false: Colors.border, true: Colors.primary }}
                      thumbColor={Colors.white}
                      ios_backgroundColor={Colors.border}
                    />
                  </View>
                  
                  <View style={styles.toggleOption}>
                    <View style={styles.toggleContent}>
                      <Text style={styles.toggleLabel}>Routing + Account</Text>
                      <Text style={styles.toggleDescription}>
                        US banking details (Routing & Account numbers)
                      </Text>
                    </View>
                    <Switch
                      value={!useIban}
                      onValueChange={(value) => toggleBankingMethod(!value)}
                      trackColor={{ false: Colors.border, true: Colors.primary }}
                      thumbColor={Colors.white}
                      ios_backgroundColor={Colors.border}
                    />
                  </View>
                </View>
              </View>
            </View>
            
            {/* Banking Details Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="dollar-sign" type="Feather" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>
                  {useIban ? 'IBAN Details' : 'Account Details'}
                </Text>
              </View>
              
              <View style={styles.sectionContent}>
                {useIban ? (
                  <Input
                    placeholder="IBAN (e.g., GB82 WEST 1234 5698 7654 32)"
                    value={formData.bankIban}
                    onChangeText={handleIbanChange}
                    error={errors.bankIban}
                    leftIcon={<Icon name="credit-card" type="Feather" size={20} color={Colors.textSecondary} />}
                    style={styles.inputField}
                    autoCapitalize="characters"
                  />
                ) : (
                  <>
                    <Input
                      placeholder="Routing number (9 digits)"
                      value={formData.bankRouting}
                      onChangeText={(value) => updateField('bankRouting', value)}
                      error={errors.bankRouting}
                      leftIcon={<Icon name="hash" type="Feather" size={20} color={Colors.textSecondary} />}
                      keyboardType="numeric"
                      maxLength={9}
                      style={styles.inputField}
                    />
                    
                    <Input
                      placeholder="Account number"
                      value={formData.bankAccount}
                      onChangeText={(value) => updateField('bankAccount', value)}
                      error={errors.bankAccount}
                      leftIcon={<Icon name="credit-card" type="Feather" size={20} color={Colors.textSecondary} />}
                      keyboardType="numeric"
                      style={styles.inputField}
                    />
                  </>
                )}
                
                <Input
                  placeholder="Account holder name"
                  value={formData.bankHolder}
                  onChangeText={(value) => updateField('bankHolder', value)}
                  error={errors.bankHolder}
                  leftIcon={<Icon name="user" type="Feather" size={20} color={Colors.textSecondary} />}
                  style={styles.inputField}
                />
              </View>
            </View>
            
            {/* Security Notice */}
            <View style={styles.securityCard}>
              <View style={styles.securityHeader}>
                <Icon name="shield" type="Feather" size={18} color={Colors.success} />
                <Text style={styles.securityTitle}>Your Information is Secure</Text>
              </View>
              <View style={styles.securityContent}>
                <View style={styles.securityItem}>
                  <Icon name="lock" type="Feather" size={16} color={Colors.success} />
                  <Text style={styles.securityText}>Bank-level encryption protects your data</Text>
                </View>
                <View style={styles.securityItem}>
                  <Icon name="eye-off" type="Feather" size={16} color={Colors.success} />
                  <Text style={styles.securityText}>Details are never shared with customers</Text>
                </View>
                <View style={styles.securityItem}>
                  <Icon name="check-circle" type="Feather" size={16} color={Colors.success} />
                  <Text style={styles.securityText}>Used only for secure payment processing</Text>
                </View>
              </View>
            </View>
            
            {/* Payment Info */}
            <View style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <Icon name="info" type="Feather" size={18} color={Colors.info} />
                <Text style={styles.paymentTitle}>How You Get Paid</Text>
              </View>
              <View style={styles.paymentContent}>
                <Text style={styles.paymentText}>
                  • Payments are processed automatically after delivery completion
                </Text>
                <Text style={styles.paymentText}>
                  • Funds typically arrive within 2-3 business days
                </Text>
                <Text style={styles.paymentText}>
                  • You'll receive detailed payment notifications via email
                </Text>
                <Text style={styles.paymentText}>
                  • Track your earnings in the app's dashboard
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        
        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Review and confirm"
            onPress={handleNext}
            variant="primary"
            disabled={!isValid}
            style={styles.nextButton}
            icon={<Icon name="check" type="Feather" size={20} color={Colors.white} />}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  stepIndicator: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: 12,
    lineHeight: 34,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionContent: {
    gap: 16,
  },
  toggleContainer: {
    gap: 12,
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  toggleContent: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  inputField: {
    marginBottom: 0,
  },
  securityCard: {
    backgroundColor: Colors.success + '10',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.success + '20',
    marginBottom: 24,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 8,
  },
  securityContent: {
    gap: 8,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  securityText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  paymentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 8,
  },
  paymentContent: {
    gap: 8,
  },
  paymentText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  nextButton: {
    width: '100%',
  },
});

export default TransporterBankingScreen;