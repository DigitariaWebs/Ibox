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

interface StorageFlowProps {
  navigation: any;
  route: any;
}

interface StorageUnit {
  id: string;
  title: string;
  size: string;
  dimensions: string;
  description: string;
  monthlyPrice: string;
  icon: string;
  popular?: boolean;
}

interface StorageDuration {
  id: string;
  title: string;
  period: string;
  description: string;
  discount?: string;
  icon: string;
}

interface PickupService {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
}

const StorageFlow: React.FC<StorageFlowProps> = ({ navigation, route }) => {
  console.log('🏪 StorageFlow: Component mounted');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedPickup, setSelectedPickup] = useState<string>('pickup');
  const [itemDescription, setItemDescription] = useState<string>('');
  const [needsClimateControl, setNeedsClimateControl] = useState<boolean>(false);
  const [accessFrequency, setAccessFrequency] = useState<string>('occasional');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const buttonScale = useSharedValue(1);

  console.log('🏪 StorageFlow: Initial state set, currentStep =', currentStep);

  const storageUnits: StorageUnit[] = [
    {
      id: 'small',
      title: 'Small Unit',
      size: '5x5 ft',
      dimensions: '25 sq ft',
      description: 'Perfect for documents, seasonal items, or small furniture',
      monthlyPrice: '$25',
      icon: 'cube-outline',
    },
    {
      id: 'medium',
      title: 'Medium Unit',
      size: '10x10 ft',
      dimensions: '100 sq ft',
      description: 'Ideal for 1-2 bedroom apartment contents',
      monthlyPrice: '$75',
      icon: 'cube',
      popular: true,
    },
    {
      id: 'large',
      title: 'Large Unit',
      size: '10x20 ft',
      dimensions: '200 sq ft',
      description: 'Great for 3-4 bedroom house contents',
      monthlyPrice: '$150',
      icon: 'albums',
    },
    {
      id: 'xlarge',
      title: 'Extra Large',
      size: '20x20 ft',
      dimensions: '400 sq ft',
      description: 'Commercial or large household storage',
      monthlyPrice: '$280',
      icon: 'business',
    },
  ];

  const storageDurations: StorageDuration[] = [
    {
      id: 'short',
      title: 'Short Term',
      period: '1-3 months',
      description: 'Flexible month-to-month',
      icon: 'calendar-outline',
    },
    {
      id: 'medium',
      title: 'Medium Term',
      period: '3-12 months',
      description: 'Best value for temporary storage',
      discount: '10% off',
      icon: 'calendar',
    },
    {
      id: 'long',
      title: 'Long Term',
      period: '12+ months',
      description: 'Maximum savings for extended storage',
      discount: '20% off',
      icon: 'calendar-sharp',
    },
  ];

  const pickupServices: PickupService[] = [
    {
      id: 'pickup',
      title: 'Pickup Service',
      description: 'We come to you and transport to storage',
      price: '+$80',
      icon: 'car-outline',
    },
    {
      id: 'dropoff',
      title: 'Self Drop-off',
      description: 'You bring items to our facility',
      price: 'Free',
      icon: 'walk-outline',
    },
    {
      id: 'white-glove',
      title: 'White Glove Service',
      description: 'Full packing, pickup, and inventory service',
      price: '+$200',
      icon: 'hand-left-outline',
    },
  ];

  const accessOptions = [
    { id: 'frequent', title: 'Frequent', description: 'Weekly access' },
    { id: 'occasional', title: 'Occasional', description: 'Monthly access' },
    { id: 'rare', title: 'Rare', description: 'Few times per year' },
  ];

  const handleContinue = () => {
    if (currentStep === 1 && !selectedUnit) {
      Alert.alert('Selection Required', 'Please select a storage unit size.');
      return;
    }

    if (currentStep === 2 && !selectedDuration) {
      Alert.alert('Selection Required', 'Please select a storage duration.');
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
      // Navigate to facility map for storage selection
      setTimeout(() => {
        console.log('🏪 StorageFlow: Navigating to StorageFacilityMap');
        const selectedUnitData = storageUnits.find(unit => unit.id === selectedUnit);
        const selectedDurationData = storageDurations.find(duration => duration.id === selectedDuration);
        const selectedPickupData = pickupServices.find(pickup => pickup.id === selectedPickup);
        
        console.log('🏪 StorageFlow: Storage preferences prepared:', {
          unit: selectedUnitData?.title,
          duration: selectedDurationData?.title,
          climateControl: needsClimateControl,
          needsPickup: selectedPickupData?.id === 'pickup'
        });
        
        // Create unified unit object compatible with StockageScreen format
        const unifiedUnit = {
          id: selectedUnitData?.id || 'medium',
          name: selectedUnitData?.title || 'Medium Unit',
          price: selectedUnitData?.monthlyPrice?.replace('$', '').replace('/mo', '') || '75',
          description: selectedUnitData?.description || 'Storage unit',
          size: selectedUnitData?.dimensions || '100 sq ft',
          dimensions: selectedUnitData?.size || '10x10 ft',
          features: [
            'Secure Access',
            '24/7 Surveillance',
            ...(needsClimateControl ? ['Climate Controlled'] : []),
            ...(accessFrequency === 'frequent' ? ['Frequent Access'] : []),
          ],
        };

        // Create unified option object
        const unifiedOption = {
          id: selectedDurationData?.id || 'medium',
          type: selectedDurationData?.title || 'Medium Term',
          duration: selectedDurationData?.period || '3-12 months',
          description: selectedDurationData?.description || 'Best value option',
          needsPickup: selectedPickupData?.id === 'pickup',
          specialInstructions,
          climateControl: needsClimateControl,
          accessFrequency,
        };
        
        navigation.navigate('StorageFacilityMap', {
          service: 'storage',
          selectedUnit: unifiedUnit,
          selectedOption: unifiedOption,
          originalParams: route.params, // Keep original location data
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
      <Text style={styles.stepTitle}>Choose Storage Unit Size</Text>
      <Text style={styles.stepSubtitle}>
        Select the storage unit that best fits your needs
      </Text>

      {storageUnits.map((unit, index) => (
        <Animated.View
          key={unit.id}
          entering={SlideInUp.delay(100 + index * 100)}
        >
          <TouchableOpacity
            style={[
              styles.unitOption,
              selectedUnit === unit.id && styles.selectedUnitOption,
            ]}
            onPress={() => setSelectedUnit(unit.id)}
          >
            {unit.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}
            <View style={styles.unitOptionLeft}>
              <View style={[
                styles.unitIcon,
                selectedUnit === unit.id && styles.selectedUnitIcon,
              ]}>
                <Ionicons 
                  name={unit.icon as any} 
                  size={32} 
                  color={selectedUnit === unit.id ? Colors.primary : Colors.textSecondary} 
                />
              </View>
              <View style={styles.unitInfo}>
                <Text style={[
                  styles.unitTitle,
                  selectedUnit === unit.id && styles.selectedUnitTitle,
                ]}>
                  {unit.title}
                </Text>
                <Text style={styles.unitSize}>{unit.size} ({unit.dimensions})</Text>
                <Text style={styles.unitDescription}>{unit.description}</Text>
              </View>
            </View>
            <View style={styles.unitRight}>
              <Text style={[
                styles.unitPrice,
                selectedUnit === unit.id && { color: Colors.primary }
              ]}>
                {unit.monthlyPrice}/mo
              </Text>
              <View style={[
                styles.radioButton,
                selectedUnit === unit.id && styles.radioSelected,
              ]}>
                {selectedUnit === unit.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View style={styles.stepContent} entering={FadeIn}>
      <Text style={styles.stepTitle}>Storage Duration & Options</Text>
      <Text style={styles.stepSubtitle}>
        How long do you need storage and what special requirements do you have?
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage Duration</Text>
        {storageDurations.map((duration, index) => (
          <Animated.View
            key={duration.id}
            entering={SlideInUp.delay(100 + index * 50)}
          >
            <TouchableOpacity
              style={[
                styles.durationOption,
                selectedDuration === duration.id && styles.selectedDurationOption,
              ]}
              onPress={() => setSelectedDuration(duration.id)}
            >
              <View style={styles.durationLeft}>
                <View style={[
                  styles.durationIcon,
                  selectedDuration === duration.id && styles.selectedDurationIcon,
                ]}>
                  <Ionicons 
                    name={duration.icon as any} 
                    size={24} 
                    color={selectedDuration === duration.id ? Colors.primary : Colors.textSecondary} 
                  />
                </View>
                <View style={styles.durationInfo}>
                  <Text style={[
                    styles.durationTitle,
                    selectedDuration === duration.id && styles.selectedDurationTitle,
                  ]}>
                    {duration.title}
                  </Text>
                  <Text style={styles.durationPeriod}>{duration.period}</Text>
                  <Text style={styles.durationDescription}>{duration.description}</Text>
                </View>
              </View>
              <View style={styles.durationRight}>
                {duration.discount && (
                  <Text style={styles.discountText}>{duration.discount}</Text>
                )}
                <View style={[
                  styles.radioButton,
                  selectedDuration === duration.id && styles.radioSelected,
                ]}>
                  {selectedDuration === duration.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Access Frequency</Text>
        <View style={styles.accessOptions}>
          {accessOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.accessOption,
                accessFrequency === option.id && styles.selectedAccessOption,
              ]}
              onPress={() => setAccessFrequency(option.id)}
            >
              <Text style={[
                styles.accessTitle,
                accessFrequency === option.id && styles.selectedAccessTitle,
              ]}>
                {option.title}
              </Text>
              <Text style={styles.accessDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.climateOption}
          onPress={() => setNeedsClimateControl(!needsClimateControl)}
        >
          <View style={styles.climateLeft}>
            <Ionicons name="thermometer-outline" size={24} color={Colors.primary} />
            <View style={styles.climateInfo}>
              <Text style={styles.climateTitle}>Climate Controlled Storage</Text>
              <Text style={styles.climateDescription}>
                Temperature and humidity controlled (+$20/month)
              </Text>
            </View>
          </View>
          <View style={[
            styles.switch,
            needsClimateControl && styles.switchActive,
          ]}>
            <View style={[
              styles.switchThumb,
              needsClimateControl && styles.switchThumbActive,
            ]} />
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View style={styles.stepContent} entering={FadeIn}>
      <Text style={styles.stepTitle}>Pickup & Delivery Options</Text>
      <Text style={styles.stepSubtitle}>
        How would you like to get your items to storage?
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pickup Service</Text>
        {pickupServices.map((service, index) => (
          <Animated.View
            key={service.id}
            entering={SlideInUp.delay(100 + index * 50)}
          >
            <TouchableOpacity
              style={[
                styles.pickupOption,
                selectedPickup === service.id && styles.selectedPickupOption,
              ]}
              onPress={() => setSelectedPickup(service.id)}
            >
              <View style={styles.pickupLeft}>
                <View style={[
                  styles.pickupIcon,
                  selectedPickup === service.id && styles.selectedPickupIcon,
                ]}>
                  <Ionicons 
                    name={service.icon as any} 
                    size={24} 
                    color={selectedPickup === service.id ? Colors.primary : Colors.textSecondary} 
                  />
                </View>
                <View style={styles.pickupInfo}>
                  <Text style={[
                    styles.pickupTitle,
                    selectedPickup === service.id && styles.selectedPickupTitle,
                  ]}>
                    {service.title}
                  </Text>
                  <Text style={styles.pickupDescription}>{service.description}</Text>
                </View>
              </View>
              <View style={styles.pickupRight}>
                <Text style={[
                  styles.pickupPrice,
                  selectedPickup === service.id && { color: Colors.primary }
                ]}>
                  {service.price}
                </Text>
                <View style={[
                  styles.radioButton,
                  selectedPickup === service.id && styles.radioSelected,
                ]}>
                  {selectedPickup === service.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What are you storing?</Text>
        <TextInput
          style={styles.itemInput}
          value={itemDescription}
          onChangeText={setItemDescription}
          placeholder="e.g., Furniture, documents, seasonal items..."
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
        <TextInput
          style={styles.instructionsInput}
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          placeholder="Any special handling or access requirements..."
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
        <Text style={styles.headerTitle}>Storage Service</Text>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  unitOption: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedUnitOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 12,
    zIndex: 1,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  unitOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    padding: 20,
  },
  unitIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedUnitIcon: {
    backgroundColor: Colors.primary + '20',
  },
  unitInfo: {
    flex: 1,
  },
  unitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  selectedUnitTitle: {
    color: Colors.primary,
  },
  unitSize: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  unitDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  unitRight: {
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  unitPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
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
  durationOption: {
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
  selectedDurationOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  durationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  durationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedDurationIcon: {
    backgroundColor: Colors.primary + '20',
  },
  durationInfo: {
    flex: 1,
  },
  durationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  selectedDurationTitle: {
    color: Colors.primary,
  },
  durationPeriod: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  durationDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  durationRight: {
    alignItems: 'flex-end',
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
    marginBottom: 8,
  },
  accessOptions: {
    flexDirection: 'row',
  },
  accessOption: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    marginHorizontal: 6, // Add horizontal margin instead of gap
  },
  selectedAccessOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  accessTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  selectedAccessTitle: {
    color: Colors.primary,
  },
  accessDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  climateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  climateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  climateInfo: {
    marginLeft: 16,
  },
  climateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  climateDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: Colors.primary,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  pickupOption: {
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
  selectedPickupOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  pickupLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pickupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedPickupIcon: {
    backgroundColor: Colors.primary + '20',
  },
  pickupInfo: {
    flex: 1,
  },
  pickupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  selectedPickupTitle: {
    color: Colors.primary,
  },
  pickupDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  pickupRight: {
    alignItems: 'flex-end',
  },
  pickupPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  itemInput: {
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
  instructionsInput: {
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

export default StorageFlow; 