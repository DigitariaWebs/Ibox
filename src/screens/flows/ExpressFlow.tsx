import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
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

interface ExpressFlowProps {
  navigation: any;
  route: any;
}

interface UrgencyOption {
  id: string;
  title: string;
  subtitle: string;
  timeframe: string;
  price: string;
  color: string;
  popular?: boolean;
}

interface PackageSize {
  id: string;
  title: string;
  description: string;
  icon: string;
  maxDimensions: string;
}

const ExpressFlow: React.FC<ExpressFlowProps> = ({ navigation, route }) => {
  const [selectedUrgency, setSelectedUrgency] = useState<string>('same-day');
  const [selectedSize, setSelectedSize] = useState<string>('small');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const buttonScale = useSharedValue(1);

  const urgencyOptions: UrgencyOption[] = [
    {
      id: 'express-1h',
      title: 'Express 1 Hour',
      subtitle: 'Ultra urgent delivery',
      timeframe: '30-60 min',
      price: 'From $45',
      color: '#EF4444',
    },
    {
      id: 'express-2h',
      title: 'Express 2 Hours',
      subtitle: 'Fast priority delivery',
      timeframe: '1-2 hours',
      price: 'From $25',
      color: '#F59E0B',
      popular: true,
    },
    {
      id: 'same-day',
      title: 'Same Day',
      subtitle: 'Delivered today',
      timeframe: '2-4 hours',
      price: 'From $15',
      color: '#10B981',
    },
  ];

  const packageSizes: PackageSize[] = [
    {
      id: 'small',
      title: 'Small Package',
      description: 'Documents, small items',
      icon: 'cube-outline',
      maxDimensions: 'Up to 30×30×30 cm',
    },
    {
      id: 'medium',
      title: 'Medium Package',
      description: 'Books, electronics',
      icon: 'cube',
      maxDimensions: 'Up to 50×50×50 cm',
    },
    {
      id: 'large',
      title: 'Large Package',
      description: 'Large items, multiple boxes',
      icon: 'albums',
      maxDimensions: 'Up to 80×80×80 cm',
    },
  ];

  const handleContinue = () => {
    const selectedUrgencyOption = urgencyOptions.find(option => option.id === selectedUrgency);
    const selectedSizeOption = packageSizes.find(size => size.id === selectedSize);

    if (!selectedUrgencyOption || !selectedSizeOption) {
      Alert.alert('Selection Required', 'Please select both urgency and package size options.');
      return;
    }

    buttonScale.value = withSpring(0.95, { duration: 100 }, () => {
      buttonScale.value = withSpring(1, { duration: 200 });
    });

    // Navigate to order summary with express-specific data
    setTimeout(() => {
      navigation.navigate('OrderSummary', {
        ...route.params,
        urgency: selectedUrgencyOption,
        packageSize: selectedSizeOption,
        specialInstructions,
        serviceType: 'express',
        estimatedPrice: selectedUrgencyOption.price,
      });
    }, 200);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Express Delivery</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Urgency Selection */}
        <Animated.View style={styles.section} entering={FadeIn.delay(100)}>
          <Text style={styles.sectionTitle}>How urgent is your delivery?</Text>
          <Text style={styles.sectionSubtitle}>Choose the speed that matches your needs</Text>
          
          {urgencyOptions.map((option, index) => (
            <Animated.View
              key={option.id}
              entering={SlideInUp.delay(200 + index * 100)}
            >
              <TouchableOpacity
                style={[
                  styles.urgencyOption,
                  selectedUrgency === option.id && styles.selectedOption,
                  { borderColor: option.color }
                ]}
                onPress={() => setSelectedUrgency(option.id)}
              >
                {option.popular && (
                  <View style={[styles.popularBadge, { backgroundColor: option.color }]}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}
                <View style={styles.optionContent}>
                  <View style={styles.optionLeft}>
                    <View style={[styles.optionIcon, { backgroundColor: option.color + '20' }]}>
                      <Ionicons name="flash" size={24} color={option.color} />
                    </View>
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                      <Text style={styles.optionTimeframe}>{option.timeframe}</Text>
                    </View>
                  </View>
                  <View style={styles.optionRight}>
                    <Text style={[styles.optionPrice, { color: option.color }]}>{option.price}</Text>
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
          ))}
        </Animated.View>

        {/* Package Size Selection */}
        <Animated.View style={styles.section} entering={FadeIn.delay(600)}>
          <Text style={styles.sectionTitle}>Package Size</Text>
          <Text style={styles.sectionSubtitle}>Select the size category that best fits your item</Text>
          
          <View style={styles.sizeGrid}>
            {packageSizes.map((size, index) => (
              <Animated.View
                key={size.id}
                style={styles.sizeOption}
                entering={SlideInUp.delay(700 + index * 100)}
              >
                <TouchableOpacity
                  style={[
                    styles.sizeCard,
                    selectedSize === size.id && styles.selectedSizeCard
                  ]}
                  onPress={() => setSelectedSize(size.id)}
                >
                  <View style={[
                    styles.sizeIcon,
                    selectedSize === size.id && styles.selectedSizeIcon
                  ]}>
                    <Ionicons 
                      name={size.icon as any} 
                      size={32} 
                      color={selectedSize === size.id ? Colors.primary : Colors.textSecondary} 
                    />
                  </View>
                  <Text style={[
                    styles.sizeTitle,
                    selectedSize === size.id && styles.selectedSizeTitle
                  ]}>
                    {size.title}
                  </Text>
                  <Text style={styles.sizeDescription}>{size.description}</Text>
                  <Text style={styles.sizeDimensions}>{size.maxDimensions}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Special Instructions */}
        <Animated.View style={styles.section} entering={FadeIn.delay(1000)}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <Text style={styles.sectionSubtitle}>Any special handling requirements? (Optional)</Text>
          
          <View style={styles.instructionsContainer}>
            <TouchableOpacity 
              style={[styles.instructionChip, specialInstructions.includes('Fragile') && styles.selectedChip]}
              onPress={() => setSpecialInstructions(prev => 
                prev.includes('Fragile') ? prev.replace('Fragile', '').trim() : `${prev} Fragile`.trim()
              )}
            >
              <Text style={[styles.chipText, specialInstructions.includes('Fragile') && styles.selectedChipText]}>
                Fragile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.instructionChip, specialInstructions.includes('Keep upright') && styles.selectedChip]}
              onPress={() => setSpecialInstructions(prev => 
                prev.includes('Keep upright') ? prev.replace('Keep upright', '').trim() : `${prev} Keep upright`.trim()
              )}
            >
              <Text style={[styles.chipText, specialInstructions.includes('Keep upright') && styles.selectedChipText]}>
                Keep upright
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.instructionChip, specialInstructions.includes('Signature required') && styles.selectedChip]}
              onPress={() => setSpecialInstructions(prev => 
                prev.includes('Signature required') ? prev.replace('Signature required', '').trim() : `${prev} Signature required`.trim()
              )}
            >
              <Text style={[styles.chipText, specialInstructions.includes('Signature required') && styles.selectedChipText]}>
                Signature required
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Continue Button */}
      <Animated.View style={styles.footer} entering={FadeIn.delay(1200)}>
        <Animated.View style={buttonAnimatedStyle}>
          <Button
            title="Continue to Summary"
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 24,
  },
  urgencyOption: {
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
  selectedOption: {
    borderWidth: 2,
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
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
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  optionTimeframe: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  optionRight: {
    alignItems: 'flex-end',
  },
  optionPrice: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderWidth: 2,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sizeOption: {
    width: '32%',
    marginBottom: 16,
  },
  sizeCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedSizeCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  sizeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  selectedSizeIcon: {
    backgroundColor: Colors.primary + '20',
  },
  sizeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  selectedSizeTitle: {
    color: Colors.primary,
  },
  sizeDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  sizeDimensions: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  instructionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6, // Negative margin to compensate for item margins
  },
  instructionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 12,
    marginBottom: 12,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  selectedChipText: {
    color: Colors.white,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: Colors.primary,
  },
});

export default ExpressFlow; 