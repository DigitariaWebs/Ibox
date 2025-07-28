import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';
import Animated, {
  FadeIn,
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../config/colors';
import { Text, Button } from '../../ui';

interface StandardFlowProps {
  navigation: any;
  route: any;
}

interface DeliveryWindow {
  id: string;
  title: string;
  timeRange: string;
  description: string;
  icon: string;
}

interface PackageMeasurements {
  width: string;
  height: string;
  depth: string;
  weight: string;
}

const StandardFlow: React.FC<StandardFlowProps> = ({ navigation, route }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [packagePhoto, setPackagePhoto] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<PackageMeasurements>({
    width: '',
    height: '',
    depth: '',
    weight: '',
  });
  const [selectedDeliveryWindow, setSelectedDeliveryWindow] = useState<string>('standard');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');

  const buttonScale = useSharedValue(1);

  const deliveryWindows: DeliveryWindow[] = [
    {
      id: 'morning',
      title: 'Morning Delivery',
      timeRange: '8:00 AM - 12:00 PM',
      description: 'Perfect for business deliveries',
      icon: 'sunny',
    },
    {
      id: 'afternoon',
      title: 'Afternoon Delivery',
      timeRange: '12:00 PM - 6:00 PM',
      description: 'Most flexible option',
      icon: 'partly-sunny',
    },
    {
      id: 'evening',
      title: 'Evening Delivery',
      timeRange: '6:00 PM - 9:00 PM',
      description: 'Great for residential deliveries',
      icon: 'moon',
    },
    {
      id: 'standard',
      title: 'Any Time',
      timeRange: '8:00 AM - 9:00 PM',
      description: 'Standard delivery window',
      icon: 'time',
    },
  ];

  const handleTakePhoto = () => {
    // Navigate to camera screen
    navigation.navigate('PackagePhoto', {
      ...route.params,
      returnScreen: 'StandardFlow',
      returnData: { currentStep, measurements, selectedDeliveryWindow, specialInstructions, deliveryNotes },
    });
  };

  const handleMeasurementChange = (field: keyof PackageMeasurements, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateMeasurements = (): boolean => {
    const { width, height, depth, weight } = measurements;
    
    if (!width || !height || !depth || !weight) {
      Alert.alert('Measurements Required', 'Please fill in all measurement fields.');
      return false;
    }

    const numWidth = parseFloat(width);
    const numHeight = parseFloat(height);
    const numDepth = parseFloat(depth);
    const numWeight = parseFloat(weight);

    if (isNaN(numWidth) || isNaN(numHeight) || isNaN(numDepth) || isNaN(numWeight)) {
      Alert.alert('Invalid Measurements', 'Please enter valid numbers for all measurements.');
      return false;
    }

    if (numWidth <= 0 || numHeight <= 0 || numDepth <= 0 || numWeight <= 0) {
      Alert.alert('Invalid Measurements', 'All measurements must be greater than zero.');
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (currentStep === 1 && !packagePhoto) {
      Alert.alert('Photo Required', 'Please take a photo of your package to continue.');
      return;
    }

    if (currentStep === 2 && !validateMeasurements()) {
      return;
    }

    buttonScale.value = withSpring(0.95, { duration: 100 }, () => {
      buttonScale.value = withSpring(1, { duration: 200 });
    });

    if (currentStep < 3) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 200);
    } else {
      // Navigate to order summary
      setTimeout(() => {
        const selectedWindow = deliveryWindows.find(window => window.id === selectedDeliveryWindow);
        
        navigation.navigate('OrderSummary', {
          ...route.params,
          packagePhoto,
          measurements,
          deliveryWindow: selectedWindow,
          specialInstructions,
          deliveryNotes,
          serviceType: 'standard',
        });
      }, 200);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep >= step && styles.activeStep,
            currentStep > step && styles.completedStep,
          ]}>
            {currentStep > step ? (
              <Ionicons name="checkmark" size={16} color={Colors.white} />
            ) : (
              <Text style={[
                styles.stepNumber,
                currentStep >= step && styles.activeStepText,
              ]}>
                {step}
              </Text>
            )}
          </View>
          {step < 3 && (
            <View style={[
              styles.stepLine,
              currentStep > step && styles.completedStepLine,
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <Animated.View style={styles.stepContent} entering={FadeIn}>
      <Text style={styles.stepTitle}>Package Photo</Text>
      <Text style={styles.stepSubtitle}>
        Take a clear photo of your package for accurate assessment
      </Text>

      <TouchableOpacity style={styles.photoContainer} onPress={handleTakePhoto}>
        {packagePhoto ? (
          <View style={styles.photoPreview}>
            <Text style={styles.photoTakenText}>Photo taken ✓</Text>
            <Text style={styles.retakeText}>Tap to retake</Text>
          </View>
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="camera" size={64} color={Colors.textSecondary} />
            <Text style={styles.photoPlaceholderText}>Tap to take photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.photoTips}>
        <Text style={styles.tipsTitle}>Photo Tips:</Text>
        <Text style={styles.tipText}>• Place package on a flat surface</Text>
        <Text style={styles.tipText}>• Ensure good lighting</Text>
        <Text style={styles.tipText}>• Include the entire package in frame</Text>
        <Text style={styles.tipText}>• Take photo from a slight angle</Text>
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View style={styles.stepContent} entering={FadeIn}>
      <Text style={styles.stepTitle}>Package Measurements</Text>
      <Text style={styles.stepSubtitle}>
        Provide accurate measurements for precise pricing
      </Text>

      <View style={styles.measurementsGrid}>
        <View style={styles.measurementRow}>
          <View style={styles.measurementField}>
            <Text style={styles.fieldLabel}>Width (cm)</Text>
            <TextInput
              style={styles.measurementInput}
              value={measurements.width}
              onChangeText={(value) => handleMeasurementChange('width', value)}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.measurementField}>
            <Text style={styles.fieldLabel}>Height (cm)</Text>
            <TextInput
              style={styles.measurementInput}
              value={measurements.height}
              onChangeText={(value) => handleMeasurementChange('height', value)}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.measurementRow}>
          <View style={styles.measurementField}>
            <Text style={styles.fieldLabel}>Depth (cm)</Text>
            <TextInput
              style={styles.measurementInput}
              value={measurements.depth}
              onChangeText={(value) => handleMeasurementChange('depth', value)}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.measurementField}>
            <Text style={styles.fieldLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.measurementInput}
              value={measurements.weight}
              onChangeText={(value) => handleMeasurementChange('weight', value)}
              placeholder="0.0"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <View style={styles.measurementVisual}>
        <View style={styles.packageDiagram}>
          <Text style={styles.diagramLabel}>Width</Text>
          <Text style={styles.diagramLabel}>Height</Text>
          <Text style={styles.diagramLabel}>Depth</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View style={styles.stepContent} entering={FadeIn}>
      <Text style={styles.stepTitle}>Delivery Preferences</Text>
      <Text style={styles.stepSubtitle}>
        Choose your preferred delivery time and add any special instructions
      </Text>

      <View style={styles.deliveryOptions}>
        <Text style={styles.sectionTitle}>Delivery Time Window</Text>
        {deliveryWindows.map((window, index) => (
          <Animated.View
            key={window.id}
            entering={SlideInUp.delay(100 + index * 50)}
          >
            <TouchableOpacity
              style={[
                styles.deliveryOption,
                selectedDeliveryWindow === window.id && styles.selectedDeliveryOption,
              ]}
              onPress={() => setSelectedDeliveryWindow(window.id)}
            >
              <View style={styles.deliveryOptionLeft}>
                <View style={[
                  styles.deliveryIcon,
                  selectedDeliveryWindow === window.id && styles.selectedDeliveryIcon,
                ]}>
                  <Ionicons 
                    name={window.icon as any} 
                    size={24} 
                    color={selectedDeliveryWindow === window.id ? Colors.primary : Colors.textSecondary} 
                  />
                </View>
                <View style={styles.deliveryInfo}>
                  <Text style={[
                    styles.deliveryTitle,
                    selectedDeliveryWindow === window.id && styles.selectedDeliveryTitle,
                  ]}>
                    {window.title}
                  </Text>
                  <Text style={styles.deliveryTime}>{window.timeRange}</Text>
                  <Text style={styles.deliveryDescription}>{window.description}</Text>
                </View>
              </View>
              <View style={[
                styles.radioButton,
                selectedDeliveryWindow === window.id && styles.radioSelected,
              ]}>
                {selectedDeliveryWindow === window.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.notesSection}>
        <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          placeholder="e.g., Ring doorbell, leave with concierge..."
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.notesSection}>
        <Text style={styles.sectionTitle}>Delivery Notes (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          value={deliveryNotes}
          onChangeText={setDeliveryNotes}
          placeholder="Additional delivery information..."
          multiline
          numberOfLines={3}
        />
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Standard Delivery</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      {/* Continue Button */}
      <Animated.View style={styles.footer} entering={FadeIn.delay(500)}>
        <Animated.View style={buttonAnimatedStyle}>
          <Button
            title={currentStep < 3 ? 'Continue' : 'Continue to Summary'}
            onPress={handleContinue}
            style={styles.continueButton}
          />
        </Animated.View>
      </Animated.View>
    </View>
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 44,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStep: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  completedStep: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeStepText: {
    color: Colors.primary,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  completedStepLine: {
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
    lineHeight: 24,
  },
  photoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    marginBottom: 24,
    overflow: 'hidden',
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  photoPlaceholderText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
    fontWeight: '500',
  },
  photoPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '10',
  },
  photoTakenText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  retakeText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  photoTips: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  measurementsGrid: {
    marginBottom: 24,
  },
  measurementRow: {
    flexDirection: 'row',
    marginHorizontal: -8, // Negative margin to compensate for field margins
    marginBottom: 16,
  },
  measurementField: {
    flex: 1,
    marginHorizontal: 8, // Add horizontal margin instead of gap
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  measurementInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  measurementVisual: {
    alignItems: 'center',
    marginBottom: 24,
  },
  packageDiagram: {
    width: 120,
    height: 120,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  diagramLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginVertical: 2,
  },
  deliveryOptions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectedDeliveryOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  deliveryOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deliveryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedDeliveryIcon: {
    backgroundColor: Colors.primary + '20',
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  selectedDeliveryTitle: {
    color: Colors.primary,
  },
  deliveryTime: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  deliveryDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.white,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: Colors.primary,
  },
});

export default StandardFlow; 