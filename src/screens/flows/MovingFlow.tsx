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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../config/colors';
import { Text, Button } from '../../ui';

interface MovingFlowProps {
  navigation: any;
  route: any;
}

interface ApartmentSize {
  id: string;
  title: string;
  description: string;
  rooms: string;
  estimatedHours: string;
  basePrice: string;
  icon: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  selected: boolean;
  quantity: number;
}

interface AdditionalService {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  selected: boolean;
}

const MovingFlow: React.FC<MovingFlowProps> = ({ navigation, route }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedApartmentSize, setSelectedApartmentSize] = useState<string>('');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([]);
  const [movingDate, setMovingDate] = useState<string>('');
  const [movingTime, setMovingTime] = useState<string>('morning');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const buttonScale = useSharedValue(1);

  const apartmentSizes: ApartmentSize[] = [
    {
      id: 'studio',
      title: 'Studio / 1BR',
      description: 'Small apartment or condo',
      rooms: '1-2 rooms',
      estimatedHours: '3-4 hours',
      basePrice: 'From $129',
      icon: 'home-outline',
    },
    {
      id: '2br',
      title: '2-3 Bedrooms',
      description: 'Standard family home',
      rooms: '2-3 bedrooms',
      estimatedHours: '4-6 hours',
      basePrice: 'From $199',
      icon: 'home',
    },
    {
      id: '4br',
      title: '4+ Bedrooms',
      description: 'Large house or condo',
      rooms: '4+ bedrooms',
      estimatedHours: '6-8 hours',
      basePrice: 'From $299',
      icon: 'business',
    },
  ];

  const defaultInventory: InventoryItem[] = [
    // Living Room
    { id: 'sofa', name: 'Sofa/Couch', category: 'Living Room', icon: 'bed-outline', selected: false, quantity: 1 },
    { id: 'tv', name: 'TV', category: 'Living Room', icon: 'tv-outline', selected: false, quantity: 1 },
    { id: 'coffee-table', name: 'Coffee Table', category: 'Living Room', icon: 'square-outline', selected: false, quantity: 1 },
    { id: 'bookshelf', name: 'Bookshelf', category: 'Living Room', icon: 'library-outline', selected: false, quantity: 1 },
    
    // Bedroom
    { id: 'bed', name: 'Bed (Queen/King)', category: 'Bedroom', icon: 'bed', selected: false, quantity: 1 },
    { id: 'dresser', name: 'Dresser', category: 'Bedroom', icon: 'file-tray-stacked-outline', selected: false, quantity: 1 },
    { id: 'wardrobe', name: 'Wardrobe', category: 'Bedroom', icon: 'shirt-outline', selected: false, quantity: 1 },
    { id: 'nightstand', name: 'Nightstand', category: 'Bedroom', icon: 'square-outline', selected: false, quantity: 2 },
    
    // Kitchen
    { id: 'refrigerator', name: 'Refrigerator', category: 'Kitchen', icon: 'snow-outline', selected: false, quantity: 1 },
    { id: 'stove', name: 'Stove/Oven', category: 'Kitchen', icon: 'flame-outline', selected: false, quantity: 1 },
    { id: 'dishwasher', name: 'Dishwasher', category: 'Kitchen', icon: 'water-outline', selected: false, quantity: 1 },
    { id: 'dining-table', name: 'Dining Table', category: 'Kitchen', icon: 'restaurant-outline', selected: false, quantity: 1 },
    
    // Office
    { id: 'desk', name: 'Desk', category: 'Office', icon: 'desktop-outline', selected: false, quantity: 1 },
    { id: 'office-chair', name: 'Office Chair', category: 'Office', icon: 'person-outline', selected: false, quantity: 1 },
    { id: 'filing-cabinet', name: 'Filing Cabinet', category: 'Office', icon: 'folder-outline', selected: false, quantity: 1 },
    
    // Special Items
    { id: 'piano', name: 'Piano', category: 'Special', icon: 'musical-notes-outline', selected: false, quantity: 1 },
    { id: 'artwork', name: 'Artwork/Mirrors', category: 'Special', icon: 'image-outline', selected: false, quantity: 3 },
    { id: 'plants', name: 'Plants', category: 'Special', icon: 'leaf-outline', selected: false, quantity: 5 },
  ];

  const serviceOptions: AdditionalService[] = [
    {
      id: 'packing',
      title: 'Full Packing Service',
      description: 'We pack all your belongings professionally',
      price: '+$80',
      icon: 'cube-outline',
      selected: false,
    },
    {
      id: 'unpacking',
      title: 'Unpacking Service',
      description: 'We unpack and organize at destination',
      price: '+$60',
      icon: 'open-outline',
      selected: false,
    },
    {
      id: 'assembly',
      title: 'Furniture Assembly',
      description: 'Disassemble and reassemble furniture',
      price: '+$40',
      icon: 'construct-outline',
      selected: false,
    },
    {
      id: 'storage',
      title: 'Temporary Storage',
      description: '30-day secure storage if needed',
      price: '+$100',
      icon: 'archive-outline',
      selected: false,
    },
    {
      id: 'cleaning',
      title: 'Move-out Cleaning',
      description: 'Basic cleaning of old location',
      price: '+$120',
      icon: 'sparkles-outline',
      selected: false,
    },
  ];

  React.useEffect(() => {
    setInventoryItems(defaultInventory);
    setAdditionalServices(serviceOptions);
  }, []);

  const toggleInventoryItem = (itemId: string) => {
    setInventoryItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setInventoryItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const toggleAdditionalService = (serviceId: string) => {
    setAdditionalServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, selected: !service.selected }
          : service
      )
    );
  };

  const handleContinue = () => {
    if (currentStep === 1 && !selectedApartmentSize) {
      Alert.alert('Selection Required', 'Please select your apartment/house size.');
      return;
    }

    if (currentStep === 2 && inventoryItems.filter(item => item.selected).length === 0) {
      Alert.alert('Inventory Required', 'Please select at least one item to move.');
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
        const selectedApartment = apartmentSizes.find(apt => apt.id === selectedApartmentSize);
        const selectedItems = inventoryItems.filter(item => item.selected);
        const selectedServices = additionalServices.filter(service => service.selected);
        
        navigation.navigate('OrderSummary', {
          ...route.params,
          apartmentSize: selectedApartment,
          inventoryItems: selectedItems,
          additionalServices: selectedServices,
          movingDate,
          movingTime,
          specialInstructions,
          serviceType: 'moving',
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
      <Text style={styles.stepTitle}>What size is your move?</Text>
      <Text style={styles.stepSubtitle}>
        Help us estimate the right team size and truck for your move
      </Text>

      {apartmentSizes.map((size, index) => (
        <Animated.View
          key={size.id}
          entering={SlideInUp.delay(100 + index * 100)}
        >
          <TouchableOpacity
            style={[
              styles.sizeOption,
              selectedApartmentSize === size.id && styles.selectedSizeOption,
            ]}
            onPress={() => setSelectedApartmentSize(size.id)}
          >
            <View style={styles.sizeOptionLeft}>
              <View style={[
                styles.sizeIcon,
                selectedApartmentSize === size.id && styles.selectedSizeIcon,
              ]}>
                <Ionicons 
                  name={size.icon as any} 
                  size={32} 
                  color={selectedApartmentSize === size.id ? Colors.primary : Colors.textSecondary} 
                />
              </View>
              <View style={styles.sizeInfo}>
                <Text style={[
                  styles.sizeTitle,
                  selectedApartmentSize === size.id && styles.selectedSizeTitle,
                ]}>
                  {size.title}
                </Text>
                <Text style={styles.sizeDescription}>{size.description}</Text>
                <Text style={styles.sizeDetails}>{size.rooms} • {size.estimatedHours}</Text>
              </View>
            </View>
            <View style={styles.sizeRight}>
              <Text style={[
                styles.sizePrice,
                selectedApartmentSize === size.id && { color: Colors.primary }
              ]}>
                {size.basePrice}
              </Text>
              <View style={[
                styles.radioButton,
                selectedApartmentSize === size.id && styles.radioSelected,
              ]}>
                {selectedApartmentSize === size.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </Animated.View>
  );

  const renderStep2 = () => {
    const categories = ['Living Room', 'Bedroom', 'Kitchen', 'Office', 'Special'];
    
    return (
      <Animated.View style={styles.stepContent} entering={FadeIn}>
        <Text style={styles.stepTitle}>What needs to be moved?</Text>
        <Text style={styles.stepSubtitle}>
          Select items you need moved and adjust quantities
        </Text>

        {categories.map((category) => {
          const categoryItems = inventoryItems.filter(item => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {categoryItems.map((item, index) => (
                <Animated.View
                  key={item.id}
                  entering={SlideInUp.delay(100 + index * 50)}
                >
                  <View style={[
                    styles.inventoryItem,
                    item.selected && styles.selectedInventoryItem,
                  ]}>
                    <TouchableOpacity
                      style={styles.inventoryItemLeft}
                      onPress={() => toggleInventoryItem(item.id)}
                    >
                      <View style={[
                        styles.inventoryIcon,
                        item.selected && styles.selectedInventoryIcon,
                      ]}>
                        <Ionicons 
                          name={item.icon as any} 
                          size={20} 
                          color={item.selected ? Colors.primary : Colors.textSecondary} 
                        />
                      </View>
                      <Text style={[
                        styles.inventoryName,
                        item.selected && styles.selectedInventoryName,
                      ]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                    
                    {item.selected && (
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateItemQuantity(item.id, item.quantity - 1)}
                        >
                          <Ionicons name="remove" size={16} color={Colors.primary} />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateItemQuantity(item.id, item.quantity + 1)}
                        >
                          <Ionicons name="add" size={16} color={Colors.primary} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </Animated.View>
              ))}
            </View>
          );
        })}
      </Animated.View>
    );
  };

  const renderStep3 = () => (
    <Animated.View style={styles.stepContent} entering={FadeIn}>
      <Text style={styles.stepTitle}>Additional Services</Text>
      <Text style={styles.stepSubtitle}>
        Choose optional services to make your move easier
      </Text>

      <View style={styles.servicesSection}>
        {additionalServices.map((service, index) => (
          <Animated.View
            key={service.id}
            entering={SlideInUp.delay(100 + index * 50)}
          >
            <TouchableOpacity
              style={[
                styles.serviceOption,
                service.selected && styles.selectedServiceOption,
              ]}
              onPress={() => toggleAdditionalService(service.id)}
            >
              <View style={styles.serviceLeft}>
                <View style={[
                  styles.serviceIcon,
                  service.selected && styles.selectedServiceIcon,
                ]}>
                  <Ionicons 
                    name={service.icon as any} 
                    size={24} 
                    color={service.selected ? Colors.primary : Colors.textSecondary} 
                  />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={[
                    styles.serviceTitle,
                    service.selected && styles.selectedServiceTitle,
                  ]}>
                    {service.title}
                  </Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                </View>
              </View>
              <View style={styles.serviceRight}>
                <Text style={[
                  styles.servicePrice,
                  service.selected && { color: Colors.primary }
                ]}>
                  {service.price}
                </Text>
                <View style={[
                  styles.checkbox,
                  service.selected && styles.checkboxSelected,
                ]}>
                  {service.selected && (
                    <Ionicons name="checkmark" size={16} color={Colors.white} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.instructionsSection}>
        <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
        <TextInput
          style={styles.instructionsInput}
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          placeholder="e.g., Fragile items, parking restrictions, stairs..."
          multiline
          numberOfLines={4}
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
        <Text style={styles.headerTitle}>Moving Service</Text>
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
  sizeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedSizeOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  sizeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sizeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedSizeIcon: {
    backgroundColor: Colors.primary + '20',
  },
  sizeInfo: {
    flex: 1,
  },
  sizeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  selectedSizeTitle: {
    color: Colors.primary,
  },
  sizeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  sizeDetails: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sizeRight: {
    alignItems: 'flex-end',
  },
  sizePrice: {
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
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedInventoryItem: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  inventoryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inventoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedInventoryIcon: {
    backgroundColor: Colors.primary + '20',
  },
  inventoryName: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  selectedInventoryName: {
    color: Colors.primary,
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -6, // Negative margin to compensate for button margins
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6, // Add horizontal margin instead of gap
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    minWidth: 24,
    textAlign: 'center',
  },
  servicesSection: {
    marginBottom: 24,
  },
  serviceOption: {
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
  selectedServiceOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  selectedServiceIcon: {
    backgroundColor: Colors.primary + '20',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  selectedServiceTitle: {
    color: Colors.primary,
  },
  serviceDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  serviceRight: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  instructionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
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
    minHeight: 100,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: Colors.primary,
  },
});

export default MovingFlow; 