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
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../config/colors';
import { Text, Button } from '../../ui';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Safe window dimensions
const windowDims = Dimensions.get('window');
const SCREEN_WIDTH = windowDims?.width || 375;

interface ExpressFlowProps {
  navigation: any;
  route: any;
}

const ExpressFlow: React.FC<ExpressFlowProps> = ({ navigation, route }) => {
  console.log('⚡ ExpressFlow: Component mounted');
  
  const [selectedUrgency, setSelectedUrgency] = useState<string>('');
  const [selectedInstructions, setSelectedInstructions] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState<string>('');

  const buttonScale = useSharedValue(1);

  console.log('⚡ ExpressFlow: Initial state set');

  const urgencyOptions = [
    {
      id: '1h',
      title: 'Within 1 Hour',
      subtitle: 'Emergency delivery',
      price: '+$25',
      icon: 'bolt',
      color: Colors.error,
    },
    {
      id: '2h',
      title: 'Within 2 Hours',
      subtitle: 'Fast delivery',
      price: '+$15',
      icon: 'schedule',
      color: Colors.warning,
    },
    {
      id: 'same-day',
      title: 'Same Day',
      subtitle: 'Standard express',
      price: 'No extra cost',
      icon: 'today',
      color: Colors.primary,
    },
  ];

  const instructionOptions = [
    { id: 'fragile', title: 'Fragile', icon: 'warning-outline' },
    { id: 'upright', title: 'Keep upright', icon: 'arrow-up-outline' },
    { id: 'signature', title: 'Signature required', icon: 'create-outline' },
    { id: 'photo', title: 'Photo confirmation', icon: 'camera-outline' },
    { id: 'call', title: 'Call on arrival', icon: 'call-outline' },
  ];

  const handleUrgencySelect = (urgencyId: string) => {
    console.log('⚡ ExpressFlow: Urgency selected:', urgencyId);
    setSelectedUrgency(urgencyId);
  };

  const toggleInstruction = (instructionId: string) => {
    console.log('⚡ ExpressFlow: Toggling instruction:', instructionId);
    setSelectedInstructions(prev => 
      prev.includes(instructionId)
        ? prev.filter(id => id !== instructionId)
        : [...prev, instructionId]
    );
  };

  const handleContinue = () => {
    console.log('⚡ ExpressFlow: Continue button pressed');
    console.log('⚡ ExpressFlow: Selected urgency:', selectedUrgency);
    console.log('⚡ ExpressFlow: Selected instructions:', selectedInstructions);
    
    if (!selectedUrgency) {
      console.log('⚡ ExpressFlow: ERROR - No urgency selected');
      Alert.alert('Selection Required', 'Please select delivery urgency.');
      return;
    }

    console.log('⚡ ExpressFlow: Validation passed, proceeding to package photo');
    buttonScale.value = withSpring(0.95, { duration: 100 }, () => {
      buttonScale.value = withSpring(1, { duration: 200 });
    });

    setTimeout(() => {
      console.log('⚡ ExpressFlow: Navigating to PackagePhoto');
      const selectedUrgencyData = urgencyOptions.find(opt => opt.id === selectedUrgency);
      
      console.log('⚡ ExpressFlow: Order data prepared:', {
        urgency: selectedUrgencyData?.title,
        instructionCount: selectedInstructions.length
      });
      
      navigation.navigate('PackagePhoto', {
        ...route.params,
        urgency: selectedUrgencyData,
        specialInstructions: selectedInstructions,
        specialNotes,
        serviceType: 'express',
        nextScreen: 'ExpressOrderSummary',
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
      {console.log('⚡ ExpressFlow: Rendering main container')}
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        {console.log('⚡ ExpressFlow: Rendering header')}
        <TouchableOpacity style={styles.backButton} onPress={() => {
          console.log('⚡ ExpressFlow: Back button pressed');
          navigation.goBack();
        }}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Express Delivery</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {console.log('⚡ ExpressFlow: Rendering ScrollView content')}
        
        {/* Header Section */}
        <Animated.View style={styles.headerSection} entering={FadeIn}>
          <Text style={styles.stepTitle}>Express Delivery</Text>
          <Text style={styles.stepSubtitle}>
            Configure your urgent delivery preferences. We'll take a photo of your package to calculate precise pricing.
          </Text>
        </Animated.View>

        {/* Urgency Selection */}
        <Animated.View style={styles.section} entering={SlideInUp.delay(200)}>
          {console.log('⚡ ExpressFlow: Rendering urgency selection')}
          <Text style={styles.sectionTitle}>⚡ How urgent is this delivery?</Text>
          
          <View style={styles.urgencyList}>
            {urgencyOptions.map((option, index) => {
              console.log('⚡ ExpressFlow: Rendering urgency option:', option.id);
              return (
                <Animated.View
                  key={option.id}
                  entering={SlideInUp.delay(300 + index * 100)}
                >
                  <TouchableOpacity
                    style={[
                      styles.urgencyCard,
                      selectedUrgency === option.id && styles.selectedUrgencyCard,
                    ]}
                    onPress={() => handleUrgencySelect(option.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.urgencyCardContent}>
                      <View style={[
                        styles.urgencyIcon,
                        { backgroundColor: option.color + '15' },
                        selectedUrgency === option.id && { backgroundColor: option.color },
                      ]}>
                        <MaterialIcons 
                          name={option.icon as any} 
                          size={24} 
                          color={selectedUrgency === option.id ? Colors.white : option.color} 
                        />
                      </View>
                      
                      <View style={styles.urgencyInfo}>
                        <Text style={[
                          styles.urgencyTitle,
                          selectedUrgency === option.id && styles.selectedUrgencyTitle,
                        ]}>
                          {option.title}
                        </Text>
                        <Text style={styles.urgencySubtitle}>{option.subtitle}</Text>
                      </View>
                      
                      <View style={styles.urgencyPriceContainer}>
                        <Text style={[
                          styles.urgencyPrice,
                          selectedUrgency === option.id && { color: option.color }
                        ]}>
                          {option.price}
                        </Text>
                        
                        <View style={[
                          styles.radioButton,
                          selectedUrgency === option.id && styles.radioSelected,
                          { borderColor: option.color }
                        ]}>
                          {selectedUrgency === option.id && (
                            <View style={[styles.radioInner, { backgroundColor: option.color }]} />
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
          {console.log('⚡ ExpressFlow: Rendering special instructions')}
          <Text style={styles.sectionTitle}>📋 Special Instructions</Text>
          <Text style={styles.sectionSubtitle}>
            Select any special handling requirements for your package
          </Text>
          
          <View style={styles.instructionsGrid}>
            {instructionOptions.map((option, index) => {
              console.log('⚡ ExpressFlow: Rendering instruction option:', option.id);
              return (
                <Animated.View 
                  key={option.id}
                  entering={SlideInUp.delay(700 + index * 50)}
                  style={styles.instructionContainer}
                >
                  <TouchableOpacity 
                    style={[
                      styles.instructionChip,
                      selectedInstructions.includes(option.id) && styles.selectedChip
                    ]}
                    onPress={() => {
                      console.log('⚡ ExpressFlow: Instruction clicked:', option.id);
                      toggleInstruction(option.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.chipIcon,
                      selectedInstructions.includes(option.id) && styles.selectedChipIcon
                    ]}>
                      <Ionicons 
                        name={option.icon as any} 
                        size={18} 
                        color={selectedInstructions.includes(option.id) ? Colors.white : Colors.primary} 
                      />
                    </View>
                    <Text style={[
                      styles.chipText, 
                      selectedInstructions.includes(option.id) && styles.selectedChipText
                    ]}>
                      {option.title}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Special Notes */}
          <Animated.View entering={SlideInUp.delay(900)}>
            <Text style={styles.notesLabel}>Additional Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              value={specialNotes}
              onChangeText={(text) => {
                console.log('⚡ ExpressFlow: Special notes updated:', text.length, 'characters');
                setSpecialNotes(text);
              }}
              placeholder="Any specific delivery instructions, access codes, or special requirements..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
            <Text style={styles.characterCount}>
              {specialNotes.length}/200 characters
            </Text>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {/* Continue Button */}
      {console.log('⚡ ExpressFlow: Rendering footer with continue button')}
      <Animated.View style={styles.footer} entering={FadeIn.delay(1000)}>
        <View style={styles.footerContent}>
          {selectedUrgency && (
            <View style={styles.selectionSummary}>
              <Text style={styles.summaryText}>
                Selected: {urgencyOptions.find(opt => opt.id === selectedUrgency)?.title}
              </Text>
              <Text style={styles.summaryPrice}>
                {urgencyOptions.find(opt => opt.id === selectedUrgency)?.price}
              </Text>
            </View>
          )}
          
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !selectedUrgency && styles.disabledButton
              ]}
              onPress={handleContinue}
              disabled={!selectedUrgency}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.continueButtonText,
                !selectedUrgency && styles.disabledButtonText
              ]}>
                Take Package Photo
              </Text>
              <Ionicons 
                name="camera" 
                size={20} 
                color={!selectedUrgency ? Colors.textSecondary : Colors.white} 
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
  urgencyList: {
    gap: 16,
  },
  urgencyCard: {
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
  selectedUrgencyCard: {
    borderColor: Colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  urgencyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  urgencyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  urgencyInfo: {
    flex: 1,
    marginRight: 16,
  },
  urgencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 22,
  },
  selectedUrgencyTitle: {
    color: Colors.primary,
  },
  urgencySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  urgencyPriceContainer: {
    alignItems: 'flex-end',
  },
  urgencyPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
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
  summaryPrice: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
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

export default ExpressFlow; 