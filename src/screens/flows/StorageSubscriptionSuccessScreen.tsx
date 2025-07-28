import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Linking,
  Alert,
} from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Text, Button } from '../../ui';
import { Colors } from '../../config/colors';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
  StorageSubscriptionSuccess: {
    facility: StorageFacility;
    selectedUnit: any;
    subscription: any;
    totalPrice: number;
    service: string;
  };
  DriverSearch: {
    service: string;
    startLocationCoords?: {
      latitude: number;
      longitude: number;
    };
    facilityCoords?: {
      latitude: number;
      longitude: number;
    };
    subscriptionDetails?: any;
  };
  HomeScreen: {};
};

interface StorageSubscriptionSuccessScreenProps {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'StorageSubscriptionSuccess'>;
}

interface StorageFacility {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number;
  securityRating: number;
  availability: 'available' | 'limited' | 'full';
  amenities: string[];
  imageUrl?: string;
  priceMultiplier: number;
}

const StorageSubscriptionSuccessScreen: React.FC<StorageSubscriptionSuccessScreenProps> = ({ navigation, route }) => {
  const { facility, selectedUnit, subscription, totalPrice } = route.params;
  
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    getCurrentLocation();
    
    // Success animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getCurrentLocation = async () => {
    try {
      console.log('📍 StorageSubscriptionSuccess: Getting current location for driver request');
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('📍 StorageSubscriptionSuccess: Location permission denied, using fallback');
        setUserLocation({
          coords: {
            latitude: 46.8139,
            longitude: -71.2082,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      console.log('📍 StorageSubscriptionSuccess: Location obtained:', location.coords);
      setUserLocation(location);
    } catch (error) {
      console.error('📍 StorageSubscriptionSuccess: Location error:', error);
      // Fallback location
      setUserLocation({
        coords: {
          latitude: 46.8139,
          longitude: -71.2082,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      });
    }
  };

  const handleRequestPickupDriver = () => {
    if (!userLocation) {
      Alert.alert('Location Required', 'Please enable location services to request a pickup driver.');
      return;
    }

    console.log('🚚 StorageSubscriptionSuccess: Requesting pickup driver');
    console.log('📍 From location:', userLocation.coords);
    console.log('🏢 To facility:', facility.name, facility.latitude, facility.longitude);
    
    navigation.navigate('DriverSearch', {
      service: 'storage',
      startLocationCoords: {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      },
      facilityCoords: {
        latitude: facility.latitude,
        longitude: facility.longitude,
      },
      subscriptionDetails: {
        facility: facility.name,
        unit: selectedUnit.name,
        subscription: subscription.id,
      },
    });
  };

  const handleShowRoute = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}&travelmode=driving`;
    console.log('🗺️ StorageSubscriptionSuccess: Opening Google Maps route:', url);
    
    Linking.openURL(url).catch((err) => {
      console.error('Error opening Google Maps:', err);
      Alert.alert('Error', 'Could not open Google Maps');
    });
  };

  const handleBackToHome = () => {
    console.log('🏠 StorageSubscriptionSuccess: Navigating back to home');
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeScreen' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={[Colors.primary, '#8B5CF6']}
        style={styles.header}
      >
        <Animated.View
          style={[
            styles.successIconContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.successIcon}>
            <MaterialIcons name="check" size={48} color={Colors.white} />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.successTitle}>Subscription Active!</Text>
          <Text style={styles.successSubtitle}>
            You can now request pickup service
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Subscription Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Subscription Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Storage Facility</Text>
            <Text style={styles.detailValue}>{facility.name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Unit Size</Text>
            <Text style={styles.detailValue}>{selectedUnit.name} ({selectedUnit.size})</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Monthly Cost</Text>
            <Text style={styles.detailValuePrice}>${totalPrice}/month</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Subscription ID</Text>
            <Text style={styles.detailValue}>{subscription.id}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Date</Text>
            <Text style={styles.detailValue}>
              {new Date(subscription.startDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Facility Location */}
        <View style={styles.locationCard}>
          <Text style={styles.cardTitle}>Facility Location</Text>
          
          <View style={styles.locationInfo}>
            <View style={styles.locationIcon}>
              <MaterialIcons name="location-on" size={24} color={Colors.primary} />
            </View>
            <View style={styles.locationDetails}>
              <Text style={styles.locationName}>{facility.name}</Text>
              <Text style={styles.locationAddress}>{facility.address}</Text>
              <Text style={styles.locationDistance}>{facility.distance} km from your location</Text>
            </View>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.cardTitle}>What's Next?</Text>
          
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Request a pickup driver to transport your items</Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Or drive to the facility yourself using route directions</Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Access your unit 24/7 with your personal access code</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Actions */}
      <Animated.View
        style={[
          styles.bottomActions,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity style={styles.routeButton} onPress={handleShowRoute}>
          <MaterialIcons name="directions" size={20} color={Colors.primary} />
          <Text style={styles.routeButtonText}>Show Route to Facility</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.pickupButton} onPress={handleRequestPickupDriver}>
          <MaterialIcons name="local-shipping" size={20} color={Colors.white} />
          <Text style={styles.pickupButtonText}>Request Pickup Driver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  detailValuePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  locationCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  locationDistance: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  nextStepsCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 100,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    gap: 12,
  },
  routeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 8,
  },
  routeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  pickupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    gap: 8,
  },
  pickupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  homeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  homeButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});

export default StorageSubscriptionSuccessScreen; 