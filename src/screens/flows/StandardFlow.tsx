import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  Dimensions,
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

// Safe window dimensions
const windowDims = Dimensions.get('window');
const SCREEN_WIDTH = windowDims?.width || 375;

interface StandardFlowProps {
  navigation: any;
  route: any;
}

const StandardFlow: React.FC<StandardFlowProps> = ({ navigation, route }) => {
  console.log('📦 StandardFlow: Component mounted');
  
  const [selectedDeliveryWindow, setSelectedDeliveryWindow] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string[]>([]);
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');

  const buttonScale = useSharedValue(1);

  console.log('📦 StandardFlow: Initial state set');

  const deliveryWindows = [
    {
      id: 'morning',
      title: 'Morning Delivery',
      timeRange: '8:00 AM - 12:00 PM',
      description: 'Perfect for business deliveries',
      icon: 'wb-sunny',
      color: '#FFB347',
    },
    {
      id: 'afternoon',
      title: 'Afternoon Delivery',
      timeRange: '12:00 PM - 6:00 PM',
      description: 'Most flexible option',
      icon: 'wb-cloudy',
      color: '#87CEEB',
    },
    {
      id: 'evening',
      title: 'Evening Delivery',
      timeRange: '6:00 PM - 9:00 PM',
      description: 'Great for residential deliveries',
      icon: 'brightness-2',
      color: '#9370DB',
    },
    {
      id: 'anytime',
      title: 'Any Time',
      timeRange: '8:00 AM - 9:00 PM',
      description: 'Standard delivery window',
      icon: 'schedule',
      color: Colors.primary,
    },
  ];

  const instructionOptions = [
    { id: 'doorbell', title: 'Ring doorbell', icon: 'notifications-outline' },
    { id: 'concierge', title: 'Leave with concierge', icon: 'person-outline' },
    { id: 'safe_place', title: 'Safe place delivery', icon: 'shield-outline' },
    { id: 'no_substitutes', title: 'No substitutes', icon: 'close-circle-outline' },
    { id: 'call_first', title: 'Call before delivery', icon: 'call-outline' },
    { id: 'fragile', title: 'Handle with care', icon: 'warning-outline' },
  ];

  const handleDeliveryWindowSelect = (windowId: string) => {
    console.log('📦 StandardFlow: Delivery window selected:', windowId);
    setSelectedDeliveryWindow(windowId);
  };

  const toggleInstruction = (instructionId: string) => {
    console.log('📦 StandardFlow: Toggling instruction:', instructionId);
    setSpecialInstructions(prev => 
      prev.includes(instructionId)
        ? prev.filter(id => id !== instructionId)
        : [...prev, instructionId]
    );
  };

  const handleContinue = () => {
    console.log('📦 StandardFlow: Continue button pressed');
    console.log('📦 StandardFlow: Selected delivery window:', selectedDeliveryWindow);
    console.log('📦 StandardFlow: Selected instructions:', specialInstructions);
    
    if (!selectedDeliveryWindow) {
      console.log('📦 StandardFlow: ERROR - No delivery window selected');
      Alert.alert('Selection Required', 'Please select a delivery time window.');
      return;
    }

    console.log('📦 StandardFlow: Validation passed, proceeding to package photo');
    buttonScale.value = withSpring(0.95, { duration: 100 }, () => {
      buttonScale.value = withSpring(1, { duration: 200 });
    });

    setTimeout(() => {
      console.log('📦 StandardFlow: Navigating to PackagePhoto');
      const selectedWindowData = deliveryWindows.find(window => window.id === selectedDeliveryWindow);
      
      console.log('📦 StandardFlow: Order data prepared:', {
        deliveryWindow: selectedWindowData?.title,
        instructionCount: specialInstructions.length
      });
      
      navigation.navigate('PackagePhoto', {
        ...route.params,
        deliveryWindow: selectedWindowData,
        specialInstructions: specialInstructions,
        deliveryNotes,
        serviceType: 'standard',
        nextScreen: 'Measuring', // StandardFlow goes to Measuring then StandardOrderSummary
      });
    }, 200);
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      {console.log('📦 StandardFlow: Rendering main container')}
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        {console.log('📦 StandardFlow: Rendering header')}
        <TouchableOpacity style={styles.backButton} onPress={() => {
          console.log('📦 StandardFlow: Back button pressed');
          navigation.goBack();
        }}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Standard Delivery</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {console.log('📦 StandardFlow: Rendering ScrollView content')}
        
        {/* Header Section */}
        <Animated.View style={styles.headerSection} entering={FadeIn}>
          <Text style={styles.stepTitle}>Standard Delivery</Text>
          <Text style={styles.stepSubtitle}>
            Choose your delivery preferences. We'll capture your package photo and take precise measurements for accurate pricing.
          </Text>
        </Animated.View>

        {/* Delivery Time Window Selection */}
        <Animated.View style={styles.section} entering={SlideInUp.delay(200)}>
          {console.log('📦 StandardFlow: Rendering delivery window selection')}
          <Text style={styles.sectionTitle}>🕐 Delivery Time Window</Text>
          <Text style={styles.sectionSubtitle}>
            Select your preferred delivery time for convenience
          </Text>
          
          <View style={styles.windowList}>
            {deliveryWindows.map((window, index) => {
              console.log('📦 StandardFlow: Rendering delivery window:', window.id);
              return (
                <Animated.View
                  key={window.id}
                  entering={SlideInUp.delay(300 + index * 100)}
                >
                  <TouchableOpacity
                    style={[
                      styles.windowCard,
                      selectedDeliveryWindow === window.id && styles.selectedWindowCard,
                    ]}
                    onPress={() => handleDeliveryWindowSelect(window.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.windowCardContent}>
                      <View style={[
                        styles.windowIcon,
                        { backgroundColor: window.color + '15' },
                        selectedDeliveryWindow === window.id && { backgroundColor: window.color },
                      ]}>
                        <MaterialIcons 
                          name={window.icon as any} 
                          size={24} 
                          color={selectedDeliveryWindow === window.id ? Colors.white : window.color} 
                        />
                      </View>
                      
                      <View style={styles.windowInfo}>
                        <Text style={[
                          styles.windowTitle,
                          selectedDeliveryWindow === window.id && styles.selectedWindowTitle,
                        ]}>
                          {window.title}
                        </Text>
                        <Text style={styles.windowTime}>{window.timeRange}</Text>
                        <Text style={styles.windowDescription}>{window.description}</Text>
                      </View>
                      
                      <View style={styles.windowPriceContainer}>
                        <View style={[
                          styles.radioButton,
                          selectedDeliveryWindow === window.id && styles.radioSelected,
                          { borderColor: window.color }
                        ]}>
                          {selectedDeliveryWindow === window.id && (
                            <View style={[styles.radioInner, { backgroundColor: window.color }]} />
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Special Instructions */}
        <Animated.View style={styles.section} entering={SlideInUp.delay(600)}>
          {console.log('📦 StandardFlow: Rendering special instructions')}
          <Text style={styles.sectionTitle}>📋 Delivery Instructions</Text>
          <Text style={styles.sectionSubtitle}>
            Select any special delivery requirements or preferences
          </Text>
          
          <View style={styles.instructionsGrid}>
            {instructionOptions.map((option, index) => {
              console.log('📦 StandardFlow: Rendering instruction option:', option.id);
              return (
                <Animated.View 
                  key={option.id}
                  entering={SlideInUp.delay(700 + index * 50)}
                  style={styles.instructionContainer}
                >
                  <TouchableOpacity 
                    style={[
                      styles.instructionChip,
                      specialInstructions.includes(option.id) && styles.selectedChip
                    ]}
                    onPress={() => {
                      console.log('📦 StandardFlow: Instruction clicked:', option.id);
                      toggleInstruction(option.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.chipIcon,
                      specialInstructions.includes(option.id) && styles.selectedChipIcon
                    ]}>
                      <Ionicons 
                        name={option.icon as any} 
                        size={18} 
                        color={specialInstructions.includes(option.id) ? Colors.white : Colors.primary} 
                      />
                    </View>
                    <Text style={[
                      styles.chipText, 
                      specialInstructions.includes(option.id) && styles.selectedChipText
                    ]}>
                      {option.title}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Delivery Notes */}
          <Animated.View entering={SlideInUp.delay(900)}>
            <Text style={styles.notesLabel}>Additional Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              value={deliveryNotes}
              onChangeText={(text) => {
                console.log('📦 StandardFlow: Delivery notes updated:', text.length, 'characters');
                setDeliveryNotes(text);
              }}
              placeholder="Any specific delivery instructions, access codes, building numbers, or other important details..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={3}
              maxLength={300}
            />
            <Text style={styles.characterCount}>
              {deliveryNotes.length}/300 characters
            </Text>
          </Animated.View>
        </Animated.View>

        {/* Delivery Information */}
        <Animated.View style={styles.section} entering={SlideInUp.delay(1000)}>
          <Text style={styles.sectionTitle}>📦 What's Next?</Text>
          <View style={styles.processCard}>
            <View style={styles.processStep}>
              <View style={styles.processIcon}>
                <Ionicons name="camera-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.processInfo}>
                <Text style={styles.processTitle}>1. Package Photo</Text>
                <Text style={styles.processDescription}>Take a clear photo of your package</Text>
              </View>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.processIcon}>
                <Ionicons name="resize-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.processInfo}>
                <Text style={styles.processTitle}>2. AI Measurement</Text>
                <Text style={styles.processDescription}>AI analyzes and measures your package</Text>
              </View>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.processIcon}>
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.processInfo}>
                <Text style={styles.processTitle}>3. Price & Book</Text>
                <Text style={styles.processDescription}>Get accurate pricing and book delivery</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Continue Button */}
      {console.log('📦 StandardFlow: Rendering footer with continue button')}
      <Animated.View style={styles.footer} entering={FadeIn.delay(1100)}>
        <View style={styles.footerContent}>
          {selectedDeliveryWindow && (
            <View style={styles.selectionSummary}>
              <Text style={styles.summaryText}>
                Selected: {deliveryWindows.find(window => window.id === selectedDeliveryWindow)?.title}
              </Text>
              <Text style={styles.summaryTime}>
                {deliveryWindows.find(window => window.id === selectedDeliveryWindow)?.timeRange}
              </Text>
            </View>
          )}
          
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !selectedDeliveryWindow && styles.disabledButton
              ]}
              onPress={handleContinue}
              disabled={!selectedDeliveryWindow}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.continueButtonText,
                !selectedDeliveryWindow && styles.disabledButtonText
              ]}>
                Take Package Photo
              </Text>
              <Ionicons 
                name="camera" 
                size={20} 
                color={!selectedDeliveryWindow ? Colors.textSecondary : Colors.white} 
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
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
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerSection: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  stepTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
    lineHeight: 38,
  },
  stepSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    lineHeight: 28,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  windowList: {
    gap: 16,
  },
  windowCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  selectedWindowCard: {
    borderColor: Colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  windowCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  windowIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  windowInfo: {
    flex: 1,
    marginRight: 16,
  },
  windowTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 22,
  },
  selectedWindowTitle: {
    color: Colors.primary,
  },
  windowTime: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 4,
    lineHeight: 18,
  },
  windowDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  windowPriceContainer: {
    alignItems: 'flex-end',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.border,
  },
  radioSelected: {
    borderWidth: 2,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  instructionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  instructionContainer: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  instructionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 56,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedChipIcon: {
    backgroundColor: Colors.white + '20',
  },
  chipText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  selectedChipText: {
    color: Colors.white,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
    marginTop: 24,
  },
  notesInput: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 8,
  },
  processCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  processIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  processInfo: {
    flex: 1,
  },
  processTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  processDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  footerContent: {
    padding: 20,
    paddingBottom: 40,
  },
  selectionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  summaryTime: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 25,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: Colors.surface,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 12,
  },
  disabledButtonText: {
    color: Colors.textSecondary,
  },
});

export default StandardFlow; 