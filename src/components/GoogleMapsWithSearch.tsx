import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../config/colors';

// Google Maps component with search functionality
interface Place {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GoogleMapsWithSearchProps {
  style?: any;
  onLocationSelect?: (location: Coordinates & { address: string }) => void;
  showsUserLocation?: boolean;
  interactive?: boolean;
}

const GoogleMapsWithSearch: React.FC<GoogleMapsWithSearchProps> = ({
  style,
  onLocationSelect,
  showsUserLocation = true,
  interactive = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Coordinates>({
    latitude: 46.8139, // Quebec City center
    longitude: -71.2082,
  });
  const [markers, setMarkers] = useState<Array<Coordinates & { id: string; title: string }>>([]);
  
  // Google Places API configuration for Quebec, Canada
  const GOOGLE_API_KEY = 'AIzaSyA_jfjSKfrdU9J7w0AezzFhsNvZUc4Uvj8'; // Your provided API key
  const searchInputRef = useRef<TextInput>(null);

  // Quebec-centered region
  const quebecRegion = {
    latitude: 46.8139,
    longitude: -71.2082,
    latitudeDelta: 2.0, // Wider view to cover Quebec province
    longitudeDelta: 2.0,
  };

  // Search for places using Google Places API
  const searchPlaces = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&components=country:ca&language=en&location=${quebecRegion.latitude},${quebecRegion.longitude}&radius=50000&key=${GOOGLE_API_KEY}`
      );

      const data = await response.json();
      
      if (data.status === 'OK') {
        setSuggestions(data.predictions || []);
        setShowSuggestions(true);
      } else {
        console.error('Places API error:', data.status, data.error_message);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Get place details and coordinates
  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address,name&key=${GOOGLE_API_KEY}`
      );

      const data = await response.json();
      
      if (data.status === 'OK' && data.result.geometry) {
        const location = data.result.geometry.location;
        const newLocation = {
          latitude: location.lat,
          longitude: location.lng,
        };
        
        setSelectedLocation(newLocation);
        
        // Add marker
        const newMarker = {
          id: placeId,
          latitude: location.lat,
          longitude: location.lng,
          title: data.result.name || data.result.formatted_address,
        };
        
        setMarkers([newMarker]);
        
        if (onLocationSelect) {
          onLocationSelect({
            ...newLocation,
            address: data.result.formatted_address,
          });
        }
        
        setShowSuggestions(false);
        Keyboard.dismiss();
      }
    } catch (error) {
      console.error('Place details error:', error);
      Alert.alert('Error', 'Could not get location details');
    }
  };

  // Handle search input change
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    searchPlaces(text);
  };

  // Handle suggestion selection
  const handleSuggestionPress = (place: Place) => {
    setSearchQuery(place.description);
    getPlaceDetails(place.place_id);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setMarkers([]);
  };

  // Render map component based on availability
  const renderMap = () => {
    // Always use fallback in Expo Go since native maps aren't available
    return renderFallbackMap();
  };

  // Fallback map for when react-native-maps is not available
  const renderFallbackMap = () => {
    return (
      <View style={styles.fallbackMap}>
        <View style={styles.mapPattern}>
          {Array.from({ length: 12 }, (_, i) => (
            <View key={i} style={styles.patternRow}>
              {Array.from({ length: 8 }, (_, j) => (
                <View
                  key={j}
                  style={[
                    styles.patternCell,
                    (i + j) % 3 === 0 ? styles.roadCell :
                    (i + j) % 3 === 1 ? styles.buildingCell : styles.parkCell
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
        
        {/* Show search results on the map */}
        {markers.length > 0 && (
          <View style={styles.searchResultOverlay}>
            <Ionicons name="location" size={28} color="#EF4444" />
            <Text style={styles.resultTitle}>{markers[0].title}</Text>
            <Text style={styles.resultCoords}>
              📍 {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
            </Text>
            <Text style={styles.searchNote}>Search working! 🔍</Text>
          </View>
        )}
        
        {/* Default Quebec overlay when no search */}
        {markers.length === 0 && (
          <View style={styles.quebecOverlay}>
            <Ionicons name="location" size={32} color="#2563EB" />
            <Text style={styles.quebecText}>Quebec, Canada</Text>
            <Text style={styles.buildText}>
              🔍 Search above to find locations
            </Text>
            <Text style={styles.buildSubText}>
              Native maps available with development build
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Render suggestion item
  const renderSuggestion = ({ item }: { item: Place }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
      <View style={styles.suggestionText}>
        <Text style={styles.suggestionMain}>
          {item.structured_formatting.main_text}
        </Text>
        <Text style={styles.suggestionSecondary}>
          {item.structured_formatting.secondary_text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {/* Map */}
      {renderMap()}
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search in Quebec, Canada..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item.place_id}
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
      
      {/* Quebec Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          🍁 Searching in Quebec, Canada
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  fallbackMap: {
    flex: 1,
    backgroundColor: '#E8F4FD',
    position: 'relative',
  },
  mapPattern: {
    flex: 1,
    flexDirection: 'column',
  },
  patternRow: {
    flex: 1,
    flexDirection: 'row',
  },
  patternCell: {
    flex: 1,
    borderWidth: 0.3,
    borderColor: '#B8D4E8',
  },
  roadCell: {
    backgroundColor: '#FFFFFF',
  },
  buildingCell: {
    backgroundColor: '#F1F5F9',
  },
  parkCell: {
    backgroundColor: '#DCFCE7',
  },
  quebecOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -80 }, { translateY: -40 }],
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  quebecText: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  buildText: {
    marginTop: 8,
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 160,
  },
  buildSubText: {
    marginTop: 4,
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 160,
    fontStyle: 'italic',
  },
  searchResultOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -60 }],
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  resultTitle: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 180,
  },
  resultCoords: {
    marginTop: 4,
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  searchNote: {
    marginTop: 6,
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    textAlign: 'center',
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  clearButton: {
    padding: 4,
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionText: {
    flex: 1,
    marginLeft: 12,
  },
  suggestionMain: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  suggestionSecondary: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default GoogleMapsWithSearch;