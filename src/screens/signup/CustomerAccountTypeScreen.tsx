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
import { customerExtrasSchema } from '../../validation/signUpSchemas';

interface CustomerAccountTypeScreenProps {
  navigation: any;
}

interface FormData {
  isBusiness: boolean;
  companyName: string;
  taxId: string;
}

const CustomerAccountTypeScreen: React.FC<CustomerAccountTypeScreenProps> = ({ navigation }) => {
  const { signUpData, updateSignUpData, setCurrentStep } = useSignUp();
  
  const [formData, setFormData] = useState<FormData>({
    isBusiness: signUpData.isBusiness || false,
    companyName: signUpData.companyName || '',
    taxId: signUpData.taxId || '',
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = async () => {
    try {
      const validationData = {
        paymentToken: 'valid', // Skip payment validation
        isBusiness: formData.isBusiness,
        companyName: formData.companyName,
        taxId: formData.taxId,
      };
      await customerExtrasSchema.validate(validationData, { abortEarly: false });
      setErrors({});
      
      // Check if business fields are valid if business account
      const businessOk = !formData.isBusiness || (formData.companyName && formData.taxId);
      setIsValid(businessOk);
    } catch (validationErrors: any) {
      const errorObj: Partial<FormData> = {};
      validationErrors.inner?.forEach((error: any) => {
        if (error.path === 'paymentToken') return; // Skip payment validation error
        errorObj[error.path as keyof FormData] = error.message;
      });
      setErrors(errorObj);
      setIsValid(false);
    }
  };

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (isValid) {
      updateSignUpData({
        isBusiness: formData.isBusiness,
        companyName: formData.companyName,
        taxId: formData.taxId,
      });
      setCurrentStep(8); // Jump to confirmation for customers
      navigation.navigate('ConfirmationScreen');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" type="Feather" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 5 of 7</Text>
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
                Account preferences
              </Text>
              <Text style={styles.subtitle}>
                Tell us about your account type and business details if applicable
              </Text>
            </View>
            
            {/* Account Type Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="briefcase" type="Feather" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Account Type</Text>
              </View>
              
              <View style={styles.sectionContent}>
                <View style={styles.accountTypeGrid}>
                  {/* Personal Account Card */}
                  <TouchableOpacity
                    style={[
                      styles.accountTypeCard,
                      !formData.isBusiness && styles.accountTypeCardSelected
                    ]}
                    onPress={() => updateField('isBusiness', false)}
                    activeOpacity={0.8}
                  >
                    <Icon 
                      name="user" 
                      type="Feather" 
                      size={24} 
                      color={!formData.isBusiness ? Colors.white : Colors.primary} 
                    />
                    <Text style={[
                      styles.accountTypeLabel,
                      !formData.isBusiness && styles.accountTypeLabelSelected
                    ]}>
                      Personal Account
                    </Text>
                    <Text style={[
                      styles.accountTypeDescription,
                      !formData.isBusiness && styles.accountTypeDescriptionSelected
                    ]}>
                      For individual shipping needs
                    </Text>
                    {!formData.isBusiness && (
                      <View style={styles.accountTypeCheck}>
                        <Icon name="check" type="Feather" size={16} color={Colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Business Account Card */}
                  <TouchableOpacity
                    style={[
                      styles.accountTypeCard,
                      formData.isBusiness && styles.accountTypeCardSelected
                    ]}
                    onPress={() => updateField('isBusiness', true)}
                    activeOpacity={0.8}
                  >
                    <Icon 
                      name="briefcase" 
                      type="Feather" 
                      size={24} 
                      color={formData.isBusiness ? Colors.white : Colors.primary} 
                    />
                    <Text style={[
                      styles.accountTypeLabel,
                      formData.isBusiness && styles.accountTypeLabelSelected
                    ]}>
                      Business Account
                    </Text>
                    <Text style={[
                      styles.accountTypeDescription,
                      formData.isBusiness && styles.accountTypeDescriptionSelected
                    ]}>
                      For business shipping and invoicing
                    </Text>
                    {formData.isBusiness && (
                      <View style={styles.accountTypeCheck}>
                        <Icon name="check" type="Feather" size={16} color={Colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
                
                {/* Business Fields */}
                {formData.isBusiness && (
                  <View style={styles.businessFields}>
                    <Input
                      placeholder="Company name"
                      value={formData.companyName}
                      onChangeText={(value) => updateField('companyName', value)}
                      error={errors.companyName}
                      leftIcon={<Icon name="building" type="Feather" size={20} color={Colors.textSecondary} />}
                      style={styles.inputField}
                    />
                    
                    <Input
                      placeholder="Tax ID / VAT number"
                      value={formData.taxId}
                      onChangeText={(value) => updateField('taxId', value)}
                      error={errors.taxId}
                      leftIcon={<Icon name="hash" type="Feather" size={20} color={Colors.textSecondary} />}
                      style={styles.inputField}
                    />
                  </View>
                )}
              </View>
            </View>
            
            {/* Features Comparison */}
            <View style={styles.featuresCard}>
              <View style={styles.featuresHeader}>
                <Icon name="star" type="Feather" size={18} color={Colors.primary} />
                <Text style={styles.featuresTitle}>Account Features</Text>
              </View>
              
              <View style={styles.featuresComparison}>
                <View style={styles.featureColumn}>
                  <Text style={styles.columnTitle}>Personal</Text>
                  <View style={styles.featuresList}>
                    <View style={styles.featureItem}>
                      <Icon name="check" type="Feather" size={14} color={Colors.success} />
                      <Text style={styles.featureText}>Individual shipping</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Icon name="check" type="Feather" size={14} color={Colors.success} />
                      <Text style={styles.featureText}>Basic tracking</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Icon name="check" type="Feather" size={14} color={Colors.success} />
                      <Text style={styles.featureText}>Customer support</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.featureColumn}>
                  <Text style={styles.columnTitle}>Business</Text>
                  <View style={styles.featuresList}>
                    <View style={styles.featureItem}>
                      <Icon name="check" type="Feather" size={14} color={Colors.success} />
                      <Text style={styles.featureText}>Everything in Personal</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Icon name="check" type="Feather" size={14} color={Colors.success} />
                      <Text style={styles.featureText}>Business invoicing</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Icon name="check" type="Feather" size={14} color={Colors.success} />
                      <Text style={styles.featureText}>Expense reporting</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Icon name="check" type="Feather" size={14} color={Colors.success} />
                      <Text style={styles.featureText}>Priority support</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        
        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Complete setup"
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
  accountTypeGrid: {
    gap: 12,
  },
  accountTypeCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    position: 'relative',
  },
  accountTypeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  accountTypeLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  accountTypeLabelSelected: {
    color: Colors.white,
  },
  accountTypeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  accountTypeDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  accountTypeCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessFields: {
    gap: 16,
    marginTop: 16,
  },
  inputField: {
    marginBottom: 0,
  },
  featuresCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 8,
  },
  featuresComparison: {
    flexDirection: 'row',
    gap: 16,
  },
  featureColumn: {
    flex: 1,
  },
  columnTitle: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 16,
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.borderLight,
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

export default CustomerAccountTypeScreen;