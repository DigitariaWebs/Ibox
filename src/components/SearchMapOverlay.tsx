import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../ui';
import { Colors } from '../config/colors';

// Import expo-maps with better error handling
let AppleMaps: any = null;
let GoogleMaps: any = null;
let MapView: any = null;
let isExpoMapsAvailable = false;
let isReactNativeMapsAvailable = false;

try {
  const ExpoMaps = require('expo-maps');
  AppleMaps = ExpoMaps.AppleMaps;
  GoogleMaps = ExpoMaps.GoogleMaps;
  isExpoMapsAvailable = true;
  console.log('✅ expo-maps loaded successfully');
} catch (error) {
  console.warn('❌ expo-maps not available:', error);
  isExpoMapsAvailable = false;
  
  // Fallback to react-native-maps only if expo-maps fails
  try {
    MapView = require('react-native-maps').default;
    isReactNativeMapsAvailable = true;
    console.log('⚠️ Using react-native-maps fallback');
  } catch (fallbackError) {
    console.warn('❌ react-native-maps also not available:', fallbackError);
    isReactNativeMapsAvailable = false;
  }
}

interface SearchMapOverlayProps {
  onSearchPress?: () => void;
}

// Types pour la navigation
type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
};

const SearchMapOverlay: React.FC<SearchMapOverlayProps> = ({ onSearchPress }) => {
  const navigation = useNavigation<NavigationProp>();
  const containerRef = React.useRef<View>(null);

  // Configuration initiale de la carte (Paris par défaut)
  const initialCamera = {
    center: {
      latitude: 48.8566,
      longitude: 2.3522,
    },
    zoom: 12,
  };

  // Configuration pour Google Maps (Android)
  const initialRegion = {
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      // Measure the position of the overlay before navigating
      if (containerRef.current) {
        containerRef.current.measureInWindow((x, y, width, height) => {
          navigation.navigate('MapScreen', {
            initialPosition: { x, y, width, height }
          });
        });
      } else {
        navigation.navigate('MapScreen');
      }
    }
  };

  // Apple Maps pour iOS - expo-maps utilise Apple Maps nativement
  const renderAppleMaps = () => {
    if (!isExpoMapsAvailable || !AppleMaps) {
      console.log('⚠️ Apple Maps not available, trying fallback');
      return renderReactNativeMaps();
    }
    
    console.log('✅ Rendering Apple Maps via expo-maps');
    return (
      <AppleMaps.View
        style={styles.map}
        initialCamera={initialCamera}
        showsUserLocation={false}
        pointerEvents="none" // Carte non interactive
        mapType="standard" // Standard Apple Maps appearance
      />
    );
  };

  // Google Maps pour Android uniquement
  // Note: Nécessite un development build (EAS) car Expo Go ne contient pas Google Maps
  const renderGoogleMaps = () => {
    if (!isExpoMapsAvailable || !GoogleMaps) {
      return renderReactNativeMaps();
    }
    return (
      <GoogleMaps.View
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        pointerEvents="none" // Carte non interactive
      />
    );
  };

  // React Native Maps fallback for Expo Go
  const renderReactNativeMaps = () => {
    if (!isReactNativeMapsAvailable || !MapView) {
      return renderWebViewMap();
    }
    return (
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        pointerEvents="none" // Carte non interactive
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
      />
    );
  };

  // Google Maps with search fallback
  const renderWebViewMap = () => {
    const GoogleMapsWithSearch = require('./GoogleMapsWithSearch').default;
    return (
      <GoogleMapsWithSearch
        style={styles.map}
        showsUserLocation={false}
        interactive={false} // Non-interactive in overlay
      />
    );
  };

  // Fallback UI when no map library is available
  const renderFallbackMap = () => (
    <View style={styles.fallbackMap}>
      <Ionicons name="map" size={48} color={Colors.textSecondary} />
      <Text style={styles.fallbackText}>
        Carte disponible avec react-native-maps ou EAS build
      </Text>
    </View>
  );

  return (
    <View ref={containerRef} style={styles.container}>
      {/* Carte en arrière-plan */}
      {Platform.OS === 'ios' ? renderAppleMaps() : renderGoogleMaps()}
      
      {/* Barre de recherche superposée */}
      <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
        <Ionicons 
          name="search" 
          size={20} 
          color={Colors.textSecondary} 
          style={styles.searchIcon} 
        />
        <Text style={styles.searchPlaceholder}>Rechercher</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: 24,
    marginBottom: 32,
  },
  map: {
    flex: 1,
  },
  searchBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    height: 48,
    backgroundColor: Colors.white,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    // Ombrage natif
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // Android
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  fallbackMap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  fallbackText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  staticMap: {
    flex: 1,
    backgroundColor: '#E5F3FF',
    position: 'relative',
  },
  mapGrid: {
    flex: 1,
    flexDirection: 'column',
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#CBD5E1',
  },
  lightCell: {
    backgroundColor: '#F1F5F9',
  },
  darkCell: {
    backgroundColor: '#E2E8F0',
  },
  mapOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});

export default SearchMapOverlay;
