import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, StyleSheet, Platform } from 'react-native';
import { Colors } from './config/colors';

// Dynamically import map libraries to support Expo Go and development builds
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
} catch (error) {
  // expo-maps not available, fall back to react-native-maps
  try {
    MapView = require('react-native-maps').default;
    isReactNativeMapsAvailable = true;
  } catch (fallbackError) {
    console.warn('No native map libraries available, using fallback view.');
  }
}

// Types for place autocomplete result
interface Place {
  place_id: string;
  description: string;
}

// Location coordinates
interface Location {
  latitude: number;
  longitude: number;
}

const HomeScreen: React.FC = () => {
  // Search query and suggestions
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Selected location and markers
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [markers, setMarkers] = useState<{ id: string; latitude: number; longitude: number; title: string }[]>([]);

  // Use API key from environment variables, fallback to provided key
  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBj-kxTi1cwXrvneaBSMoJsiYLYyZbpjeU';

  // Default map region (Paris)
  const defaultRegion = {
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Fetch suggestions from Google Places Autocomplete API
  const searchPlaces = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK') {
        setSuggestions(data.predictions || []);
      } else {
        console.error('Places API error:', data.status);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    }
  };

  // Retrieve place details and update map location/marker
  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,name,formatted_address&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK' && data.result.geometry) {
        const location = data.result.geometry.location;
        const newLoc = { latitude: location.lat, longitude: location.lng };
        setSelectedLocation(newLoc);
        setMarkers([
          {
            id: placeId,
            latitude: location.lat,
            longitude: location.lng,
            title: data.result.name || data.result.formatted_address,
          },
        ]);
        // Close modal and clear suggestions
        setModalVisible(false);
        setSuggestions([]);
        setSearchQuery(data.result.name || data.result.formatted_address);
      }
    } catch (error) {
      console.error('Place details error:', error);
    }
  };

  // Render appropriate map component based on availability
  const renderMap = () => {
    // Use expo-maps when available (development builds)
    if (isExpoMapsAvailable && (Platform.OS === 'ios' ? AppleMaps : GoogleMaps)) {
      const MapComponent = Platform.OS === 'ios' ? AppleMaps : GoogleMaps;
      return (
        <MapComponent
          style={StyleSheet.absoluteFill}
          region={
            selectedLocation
              ? {
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
              : defaultRegion
          }
          showsUserLocation
          markers={markers}
        />
      );
    }
    // Fallback to react-native-maps for Expo Go
    if (isReactNativeMapsAvailable && MapView) {
      const region = selectedLocation
        ? {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }
        : defaultRegion;
      const Marker = (MapView as any).Marker || MapView.Marker;
      return (
        <MapView style={StyleSheet.absoluteFill} region={region} showsUserLocation>
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.title}
            />
          ))}
        </MapView>
      );
    }
    // No map library available
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: Colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text style={{ color: Colors.textPrimary }}>Map is unavailable in this environment.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderMap()}
      {/* Bottom button to open search modal */}
      <TouchableOpacity style={styles.whereToButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.whereToText}>Where to?</Text>
      </TouchableOpacity>
      {/* Modal with search input and suggestions */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <TextInput
              style={styles.input}
              placeholder="Search destination"
              value={searchQuery}
              onChangeText={searchPlaces}
              autoFocus
            />
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => getPlaceDetails(item.place_id)}
                >
                  <Text style={styles.suggestionText}>{item.description}</Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                setSuggestions([]);
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  whereToButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: Colors.white,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  whereToText: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  input: {
    height: 48,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    color: Colors.textPrimary,
  },
  suggestionItem: {
    paddingVertical: 12,
    borderBottomColor: Colors.borderLight,
    borderBottomWidth: 1,
  },
  suggestionText: {
    color: Colors.textPrimary,
  },
  cancelButton: {
    marginTop: 8,
    alignSelf: 'center',
  },
  cancelText: {
    color: Colors.primary,
    fontSize: 16,
  },
});

export default HomeScreen;
