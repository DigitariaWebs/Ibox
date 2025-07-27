import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from './config/colors';
import AnimatedSearchModal from './components/AnimatedSearchModal';
import TopNavigation from './components/TopNavigation';
import SidebarMenu from './components/SidebarMenu';
import ServiceSelectionModal from './components/ServiceSelectionModal';

interface Place {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description?: string;
  type?: 'destination';
}

type RootStackParamList = {
  PackagePhoto: {
    service: string;
    startLocation: string;
    destination: any;
  };
  [key: string]: any;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<MapRegion>({
    latitude: 46.8139, // Quebec City default
    longitude: -71.2082,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showServiceSelection, setShowServiceSelection] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<MapMarker | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{latitude: number; longitude: number}[]>([]);
  const [startLocation, setStartLocation] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showBackButton, setShowBackButton] = useState(false);

  const GOOGLE_API_KEY = 'AIzaSyAzPxqQ9QhUq_cmXkkcE-6DcgJn-EDngzI';

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      console.log('🗺️ Requesting location permissions...');
      
      // Check if location services are enabled
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        console.log('❌ Location services disabled');
        setLocationPermissionGranted(false);
        setMapError('Location services are disabled. Using default location.');
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('❌ Location permission denied');
        setLocationPermissionGranted(false);
        setMapError('Location permission denied. Using default location.');
        return;
      }

      console.log('✅ Location permission granted');
      setLocationPermissionGranted(true);

      console.log('📍 Getting current position...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
        maximumAge: 60000, // 1 minute cache
      });

      console.log('✅ Location obtained:', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setCurrentLocation(newLocation);
      setMapError(null);
      
      console.log('🗺️ Location updated successfully');
    } catch (error) {
      console.error('❌ Error getting location:', error);
      setLocationPermissionGranted(false);
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          setMapError('Location request timed out. Using default location.');
        } else if (error.message.includes('unavailable')) {
          setMapError('Location unavailable. Using default location.');
        } else {
          setMapError('Unable to get location. Using default location.');
        }
      } else {
        setMapError('Unknown location error. Using default location.');
      }
      
      console.log('🗺️ Using default location (Quebec City)');
    }
  };

  const getDirections = async (origin: {latitude: number; longitude: number}, destination: {latitude: number; longitude: number}) => {
    try {
      console.log('🗺️ Getting directions from', origin, 'to', destination);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🗺️ Directions response status:', data.status);

      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        const points = decodePolyline(route.overview_polyline.points);
        console.log('✅ Route calculated with', points.length, 'points');
        setRouteCoordinates(points);
      } else {
        console.log('⚠️ Directions API returned status:', data.status);
        // Fallback: create a simple straight line
        setRouteCoordinates([origin, destination]);
      }
    } catch (error) {
      console.error('❌ Error getting directions:', error);
      // Fallback: create a simple straight line
      setRouteCoordinates([origin, destination]);
    }
  };

  const decodePolyline = (encoded: string) => {
    const points: {latitude: number; longitude: number}[] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let shift = 0;
      let result = 0;
      let byte;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      shift = 0;
      result = 0;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += deltaLng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  };

  const searchPlaces = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      console.log('🔍 Searching for places:', query);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&key=${GOOGLE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🔍 Search response status:', data.status);
      
      if (data.status === 'OK') {
        console.log('✅ Found', data.predictions?.length || 0, 'suggestions');
        setSuggestions(data.predictions || []);
      } else {
        console.log('⚠️ Search API returned status:', data.status, data.error_message);
        setSuggestions([]);
        
        // More detailed error handling
        switch (data.status) {
          case 'REQUEST_DENIED':
            console.error('❌ API request denied - check API key');
            break;
          case 'OVER_QUERY_LIMIT':
            console.error('❌ API quota exceeded');
            break;
          case 'ZERO_RESULTS':
            console.log('ℹ️ No results found for query:', query);
            break;
          case 'INVALID_REQUEST':
            console.error('❌ Invalid request parameters');
            break;
          default:
            console.error('❌ Unknown API error:', data.status);
        }
      }
    } catch (error) {
      console.error('❌ Search error:', error);
      Alert.alert('Search Error', 'Unable to search for places. Please try again.');
    }
  };

  const getPlaceDetails = async (placeId: string, isStartLocation?: boolean) => {
    try {
      console.log('📍 Getting place details for:', placeId);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,name,formatted_address,address_components,place_id,types&key=${GOOGLE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📍 Place details response status:', data.status);
      
      if (data.status === 'OK' && data.result.geometry) {
        const location = data.result.geometry.location;
        const placeName = data.result.name || data.result.formatted_address;
        
        console.log('✅ Place location obtained:', {
          latitude: location.lat,
          longitude: location.lng,
          name: placeName,
          isStartLocation,
        });
        
        if (isStartLocation) {
          // Handle start location selection
          setStartLocation(placeName);
          setSuggestions([]);
          setSearchQuery('');
        } else {
          // Handle destination selection
          const newLocation = {
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };
          
          setCurrentLocation(newLocation);
          
          const destinationMarker: MapMarker = {
            id: placeId,
            coordinate: {
              latitude: location.lat,
              longitude: location.lng,
            },
            title: placeName,
            description: data.result.formatted_address,
            type: 'destination',
          };
          
          setSelectedDestination(destinationMarker);
          setMarkers([destinationMarker]);
          
          // Get directions from current location to destination
          getDirections(
            { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
            { latitude: location.lat, longitude: location.lng }
          );
          
          // Show service selection and back button
          setShowServiceSelection(true);
          setShowBackButton(true);
          setSuggestions([]);
          setSearchQuery('');
        }
      } else {
        console.log('⚠️ Place details API returned status:', data.status, data.error_message);
        Alert.alert('Place Error', 'Unable to get location details for this place.');
      }
    } catch (error) {
      console.error('❌ Place details error:', error);
      Alert.alert('Place Error', 'Unable to get place details. Please try again.');
    }
  };

  const renderMap = () => {
    try {
      console.log('🗺️ Rendering react-native-maps for platform:', Platform.OS);
      console.log('🗺️ Current location:', currentLocation);
      console.log('🗺️ Markers:', markers);
      console.log('🗺️ Location permission granted:', locationPermissionGranted);

      return (
        <MapView
          style={StyleSheet.absoluteFill}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
          region={currentLocation}
          showsUserLocation={locationPermissionGranted}
          showsMyLocationButton={true}
          zoomEnabled={true}
          scrollEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
          onMapReady={() => {
            console.log('✅ react-native-maps ready');
            setMapError(null);
          }}
          onError={(error) => {
            console.error('❌ Map error:', error);
            setMapError(`Map error: ${error.message || 'Unknown error'}`);
          }}
          onRegionChangeComplete={(region) => {
            console.log('🗺️ Region changed:', region);
          }}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              onPress={() => console.log('📍 Marker pressed:', marker.title)}
              pinColor={getMarkerColor(marker.type)}
            />
          ))}
          
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={Colors.primary}
              strokeWidth={4}
              strokePattern={[1]}
            />
          )}
        </MapView>
      );
    } catch (error) {
      console.error('❌ Error rendering map:', error);
      return (
        <View style={[StyleSheet.absoluteFill, styles.errorContainer]}>
          <Text style={styles.errorText}>
            Error loading map: {error instanceof Error ? error.message : 'Unknown error'}
          </Text>
          <Text style={[styles.errorText, { marginTop: 10, fontSize: 14 }]}>
            Current location: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
          </Text>
        </View>
      );
    }
  };

  const getMarkerColor = (type?: MapMarker['type']): string => {
    return type === 'destination' ? '#FF6B6B' : '#1E90FF';
  };

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleNotificationPress = () => {
    console.log('🚀 Notifications pressed');
    // TODO: Navigate to notifications screen
  };

  const handleSidebarNavigate = (screen: string) => {
    console.log('🚀 Navigate to:', screen);
    // TODO: Implement navigation to different screens
  };

  const handleServiceSelect = (serviceId: string) => {
    console.log('🚀 Service selected:', serviceId);
    setSelectedService(serviceId);
  };

  const handleServiceContinue = () => {
    console.log('🚀 Service confirmed:', selectedService);
    setShowBackButton(false);
    
    // Navigate to package photo screen to start booking flow
    navigation.navigate('PackagePhoto', {
      service: selectedService,
      startLocation,
      destination: selectedDestination,
    });
  };

  const handleBackPress = () => {
    if (showServiceSelection) {
      setShowServiceSelection(false);
      setShowBackButton(false);
      setSelectedDestination(null);
      setMarkers([]);
      setRouteCoordinates([]);
    }
  };

  const handleChangeStartLocation = () => {
    console.log('🚀 Changing start location');
  };

  // Service helper functions
  const services = [
    {
      id: 'express',
      title: 'Express Delivery',
      icon: 'flash',
      iconFamily: 'Ionicons',
      color: '#FF6B6B',
    },
    {
      id: 'standard',
      title: 'Standard Delivery',
      icon: 'cube-outline',
      iconFamily: 'Ionicons',
      color: '#4ECDC4',
    },
    {
      id: 'moving',
      title: 'Moving Service',
      icon: 'local-shipping',
      iconFamily: 'MaterialIcons',
      color: '#45B7D1',
    },
    {
      id: 'storage',
      title: 'Storage Service',
      icon: 'archive',
      iconFamily: 'Ionicons',
      color: '#96CEB4',
    },
  ];

  const getServiceColor = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.color || Colors.primary;
  };

  const getServiceTitle = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.title || 'Selected Service';
  };

  const renderServiceIcon = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return null;
    
    const IconComponent = service.iconFamily === 'Ionicons' ? Ionicons : MaterialIcons;
    return (
      <IconComponent
        name={service.icon as any}
        size={20}
        color="white"
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderMap()}
      
      {/* Top Navigation */}
      <TopNavigation 
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
        showBackButton={showBackButton}
        onBackPress={handleBackPress}
      />
      
      {mapError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{mapError}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={getCurrentLocation}
          >
            <Ionicons name="refresh" size={16} color="white" />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Bottom Action Buttons */}
      {selectedService ? (
        // Service Selected - Show two buttons
        <View style={styles.serviceButtonsContainer}>
          <TouchableOpacity 
            style={[styles.selectedServiceButton, { backgroundColor: getServiceColor(selectedService) }]}
            onPress={() => setSelectedService(null)}
            activeOpacity={0.8}
          >
            <View style={styles.serviceButtonIcon}>
              {renderServiceIcon(selectedService)}
            </View>
            <Text style={styles.selectedServiceText}>{getServiceTitle(selectedService)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleServiceContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        // Default search button
        <TouchableOpacity 
          style={[
            styles.searchButton, 
            selectedDestination && styles.destinationButton
          ]} 
          onPress={() => {
            if (selectedDestination) {
              setShowServiceSelection(true);
            } else {
              setModalVisible(true);
            }
          }}
        >
          <Ionicons 
            name={selectedDestination ? "car" : "search"} 
            size={20} 
            color={selectedDestination ? "white" : Colors.textSecondary} 
            style={styles.searchButtonIcon}
          />
          <Text style={[
            styles.searchButtonText,
            selectedDestination && styles.destinationButtonText
          ]}>
            {selectedDestination ? "Select Service" : "Where to?"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Modals */}
      <AnimatedSearchModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSuggestions([]);
          setSearchQuery('');
        }}
        onSearch={searchPlaces}
        onSelectPlace={getPlaceDetails}
        suggestions={suggestions}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        startLocation={startLocation}
        onChangeStartLocation={handleChangeStartLocation}
      />

      <SidebarMenu
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onNavigate={handleSidebarNavigate}
      />

      <ServiceSelectionModal
        visible={showServiceSelection}
        onClose={() => {
          setShowServiceSelection(false);
          setShowBackButton(false);
        }}
        onSelectService={handleServiceSelect}
        destination={selectedDestination?.title}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 110,
    left: 20,
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorBannerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  searchButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchButtonIcon: {
    marginRight: 10,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  destinationButton: {
    backgroundColor: Colors.primary,
  },
  destinationButtonText: {
    color: 'white',
  },
  serviceButtonsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  selectedServiceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  serviceButtonIcon: {
    marginRight: 8,
  },
  selectedServiceText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  continueButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    gap: 6,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default HomeScreen;
