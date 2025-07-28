import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import Animated, {
  SlideInUp,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../config/colors';
import { Text, Button } from '../../ui';

// Safe window dimensions
const windowDims = Dimensions.get('window');
const SCREEN_WIDTH = windowDims?.width || 375;

interface StandardOrderSummaryProps {
  navigation: any;
  route: any;
}

const StandardOrderSummary: React.FC<StandardOrderSummaryProps> = ({
  navigation,
  route,
}) => {
  console.log('📦 StandardOrderSummary: Component mounted');
  console.log('📦 StandardOrderSummary: Route params received:', Object.keys(route.params || {}));
  
  const { 
    service, 
    startLocation, 
    startLocationCoords, 
    destination, 
    packagePhoto,
    measurements: passedMeasurements,
    deliveryWindow,
    specialInstructions,
    serviceType 
  } = route.params;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [aiMeasurements, setAiMeasurements] = useState(null);
  const [currentStep, setCurrentStep] = useState('Initializing measurement system...');
  
  const buttonScale = useSharedValue(1);
  const analysisProgress = useSharedValue(0);

  // Use passed measurements or generate AI measurements
  useEffect(() => {
    if (passedMeasurements) {
      // Use manually entered measurements
      setAiMeasurements(passedMeasurements);
      setIsAnalyzing(false);
    } else {
      // Simulate AI analysis
      console.log('📦 StandardOrderSummary: Starting AI analysis simulation');
      
      const analysisSteps = [
        { delay: 700, progress: 0.12, status: 'Loading advanced measurement model...' },
        { delay: 1400, progress: 0.25, status: 'Scanning package geometry...' },
        { delay: 2100, progress: 0.4, status: 'Detecting surface boundaries...' },
        { delay: 2800, progress: 0.55, status: 'Measuring depth and volume...' },
        { delay: 3500, progress: 0.7, status: 'Analyzing material properties...' },
        { delay: 4200, progress: 0.85, status: 'Cross-referencing dimensions...' },
        { delay: 4900, progress: 1.0, status: 'Precision measurement complete!' },
      ];

      analysisSteps.forEach((step, index) => {
        setTimeout(() => {
          analysisProgress.value = withTiming(step.progress, { duration: 350 });
          setCurrentStep(step.status);
          
          if (index === analysisSteps.length - 1) {
            const measurements = generateAIMeasurements();
            setAiMeasurements(measurements);
            
            setTimeout(() => {
              setIsAnalyzing(false);
            }, 700);
          }
        }, step.delay);
      });
    }
  }, [passedMeasurements]);

  const generateAIMeasurements = () => {
    // Generate realistic measurements for standard delivery
    const baseRanges = {
      width: [20, 50],
      height: [15, 40],
      depth: [10, 30],
      weight: [1.0, 8.0]
    };
    
    const randomInRange = (range) => Math.round((Math.random() * (range[1] - range[0]) + range[0]) * 10) / 10;
    
    return {
      width: randomInRange(baseRanges.width),
      height: randomInRange(baseRanges.height),
      depth: randomInRange(baseRanges.depth),
      weight: randomInRange(baseRanges.weight),
      confidence: Math.round((Math.random() * 10 + 90) * 10) / 10, // 90-100% confidence
    };
  };

  // Calculate price based on measurements
  const calculatePrice = () => {
    if (!aiMeasurements) return { base: 0, size: 0, weight: 0, total: 0 };
    
    // Base price for standard delivery
    let basePrice = 15;
    
    // Size calculation (volume-based)
    const volume = aiMeasurements.width * aiMeasurements.height * aiMeasurements.depth;
    const sizeMultiplier = Math.max(1, Math.ceil(volume / 8000)); // Every 8000 cm³
    const sizeAdjustment = (sizeMultiplier - 1) * 4;
    
    // Weight adjustment (more generous for standard)
    const weightAdjustment = Math.max(0, (aiMeasurements.weight - 2) * 1.5);
    
    // Delivery window adjustment
    const windowAdjustment = deliveryWindow === 'express' ? 8 : 0;
    
    return {
      base: basePrice,
      size: sizeAdjustment,
      weight: weightAdjustment,
      window: windowAdjustment,
      total: basePrice + sizeAdjustment + weightAdjustment + windowAdjustment
    };
  };

  const price = calculatePrice();

  const handleStartRequest = () => {
    console.log('📦 StandardOrderSummary: Start request button pressed');
    
    setIsProcessing(true);
    buttonScale.value = withSpring(0.95, { duration: 100 }, () => {
      buttonScale.value = withSpring(1, { duration: 200 });
    });

    setTimeout(() => {
      console.log('📦 StandardOrderSummary: Navigating to DriverSearch');
      navigation.navigate('DriverSearch', {
        ...route.params,
        measurements: aiMeasurements,
        price: price,
        bookingId: `SD${Date.now()}`,
      });
    }, 1000);
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${analysisProgress.value * 100}%`,
    };
  });

  if (isAnalyzing) {
    return (
      <View style={styles.analysisContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        
        <View style={styles.analysisContent}>
          <Animated.View entering={FadeIn.delay(200)}>
            <View style={styles.aiIcon}>
              <MaterialIcons name="photo-camera" size={48} color={Colors.primary} />
            </View>
          </Animated.View>
          
          <Animated.Text 
            style={styles.analysisTitle}
            entering={SlideInUp.delay(400)}
          >
            Measuring Package
          </Animated.Text>
          
          <Animated.Text 
            style={styles.analysisSubtitle}
            entering={SlideInUp.delay(600)}
          >
            AI is analyzing your package to calculate precise dimensions and pricing
          </Animated.Text>
          
          {packagePhoto && (
            <Animated.View 
              style={styles.photoContainer}
              entering={SlideInUp.delay(800)}
            >
              <Image source={{ uri: packagePhoto }} style={styles.packagePhoto} />
              <View style={styles.scanOverlay}>
                <View style={styles.scanGrid}>
                  <View style={styles.gridLine} />
                  <View style={styles.gridLine} />
                  <View style={[styles.gridLine, styles.gridLineVertical]} />
                  <View style={[styles.gridLine, styles.gridLineVertical]} />
                </View>
              </View>
            </Animated.View>
          )}
          
          <Animated.View 
            style={styles.progressContainer}
            entering={SlideInUp.delay(1000)}
          >
            <Text style={styles.stepText}>{currentStep}</Text>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
            </View>
            <Text style={styles.progressText}>
              {Math.round(analysisProgress.value * 100)}% Complete
            </Text>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            console.log('📦 StandardOrderSummary: Back button pressed');
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Summary</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Package Analysis */}
        <Animated.View style={styles.section} entering={SlideInUp.delay(100)}>
          <Text style={styles.sectionTitle}>📏 Package Measurements</Text>
          <View style={styles.measurementsCard}>
            <View style={styles.photoSection}>
              {packagePhoto && (
                <Image source={{ uri: packagePhoto }} style={styles.thumbnailPhoto} />
              )}
              <View style={styles.measurementInfo}>
                <Text style={styles.measurementTitle}>AI Measured Package</Text>
                <Text style={styles.confidenceText}>
                  {aiMeasurements?.confidence || 95}% Accuracy
                </Text>
              </View>
            </View>
            
            <View style={styles.dimensionsGrid}>
              <View style={styles.dimensionCard}>
                <Ionicons name="resize" size={20} color={Colors.primary} />
                <Text style={styles.dimensionLabel}>Width</Text>
                <Text style={styles.dimensionValue}>{aiMeasurements?.width} cm</Text>
              </View>
              <View style={styles.dimensionCard}>
                <Ionicons name="resize" size={20} color={Colors.primary} />
                <Text style={styles.dimensionLabel}>Height</Text>
                <Text style={styles.dimensionValue}>{aiMeasurements?.height} cm</Text>
              </View>
              <View style={styles.dimensionCard}>
                <Ionicons name="resize" size={20} color={Colors.primary} />
                <Text style={styles.dimensionLabel}>Depth</Text>
                <Text style={styles.dimensionValue}>{aiMeasurements?.depth} cm</Text>
              </View>
              <View style={styles.dimensionCard}>
                <Ionicons name="scale" size={20} color={Colors.primary} />
                <Text style={styles.dimensionLabel}>Weight</Text>
                <Text style={styles.dimensionValue}>{aiMeasurements?.weight} kg</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Service Details */}
        <Animated.View style={styles.section} entering={SlideInUp.delay(200)}>
          <Text style={styles.sectionTitle}>📦 Standard Delivery</Text>
          <View style={styles.serviceCard}>
            <View style={styles.serviceIcon}>
              <MaterialIcons name="local-shipping" size={24} color={Colors.primary} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>Standard Delivery</Text>
              <Text style={styles.serviceSubtitle}>Reliable & Affordable</Text>
              <Text style={styles.serviceDescription}>Same-day or next-day delivery</Text>
            </View>
          </View>
        </Animated.View>

        {/* Route Information */}
        <Animated.View style={styles.section} entering={SlideInUp.delay(300)}>
          <Text style={styles.sectionTitle}>🗺️ Delivery Route</Text>
          <View style={styles.routeCard}>
            <View style={styles.routeItem}>
              <View style={styles.routeIconContainer}>
                <Ionicons name="location" size={16} color={Colors.primary} />
              </View>
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Pickup Location</Text>
                <Text style={styles.routeAddress}>{startLocation || 'Current Location'}</Text>
              </View>
            </View>
            
            <View style={styles.routeLine} />
            
            <View style={styles.routeItem}>
              <View style={styles.routeIconContainer}>
                <Ionicons name="flag" size={16} color={Colors.error} />
              </View>
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Delivery Address</Text>
                <Text style={styles.routeAddress}>{destination?.title || 'Destination'}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Special Instructions */}
        {specialInstructions && (
          <Animated.View style={styles.section} entering={SlideInUp.delay(400)}>
            <Text style={styles.sectionTitle}>📝 Delivery Instructions</Text>
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsText}>{specialInstructions}</Text>
            </View>
          </Animated.View>
        )}

        {/* Price Breakdown */}
        <Animated.View style={styles.section} entering={SlideInUp.delay(500)}>
          <Text style={styles.sectionTitle}>💰 Price Breakdown</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base delivery</Text>
              <Text style={styles.priceValue}>${price.base.toFixed(2)}</Text>
            </View>
            {price.size > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Size adjustment</Text>
                <Text style={styles.priceValue}>${price.size.toFixed(2)}</Text>
              </View>
            )}
            {price.weight > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Weight adjustment</Text>
                <Text style={styles.priceValue}>${price.weight.toFixed(2)}</Text>
              </View>
            )}
            {price.window > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Express window</Text>
                <Text style={styles.priceValue}>${price.window.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.priceDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.priceTotalLabel}>Total</Text>
              <Text style={styles.priceTotalValue}>${price.total.toFixed(2)}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Delivery Info */}
        <Animated.View style={styles.section} entering={SlideInUp.delay(600)}>
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryInfo}>
              <Ionicons name="time-outline" size={24} color={Colors.primary} />
              <View style={styles.deliveryDetails}>
                <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
                <Text style={styles.deliveryTime}>1-3 hours</Text>
              </View>
            </View>
            <View style={styles.deliveryInfo}>
              <Ionicons name="shield-checkmark" size={24} color={Colors.success} />
              <View style={styles.deliveryDetails}>
                <Text style={styles.deliveryLabel}>Package Protection</Text>
                <Text style={styles.deliveryTime}>Fully Insured</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomSection}>
        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity
            style={[styles.startButton, isProcessing && styles.startButtonProcessing]}
            onPress={handleStartRequest}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <View style={styles.processingContainer}>
                <Animated.View 
                  style={styles.processingDot}
                  entering={FadeIn}
                />
                <Text style={styles.startButtonText}>Finding Driver...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.startButtonText}>Find Driver</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Analysis Screen Styles
  analysisContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  analysisContent: {
    alignItems: 'center',
    width: '100%',
  },
  aiIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  analysisTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  analysisSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  packagePhoto: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: Colors.surface,
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanGrid: {
    width: '80%',
    height: '80%',
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    opacity: 0.6,
  },
  gridLineVertical: {
    width: 1,
    height: '100%',
    left: '33%',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
    minHeight: 20,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },

  // Main Screen Styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  measurementsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  thumbnailPhoto: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    marginRight: 16,
  },
  measurementInfo: {
    flex: 1,
  },
  measurementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  confidenceText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
  },
  dimensionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  dimensionCard: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  dimensionLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  dimensionValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  routeCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  routeAddress: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.border,
    marginLeft: 15,
    marginVertical: 8,
  },
  instructionsCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionsText: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  priceCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  priceDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  priceTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  priceTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  deliveryCard: {
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 16,
    padding: 20,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryDetails: {
    marginLeft: 16,
  },
  deliveryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  bottomSection: {
    padding: 20,
    paddingBottom: 40,
  },
  startButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonProcessing: {
    backgroundColor: Colors.textSecondary,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 12,
  },
});

export default StandardOrderSummary; 