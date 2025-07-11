import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import { Colors } from '../config/colors';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

interface HomeMapProps {
  style?: any;
  onRegionChange?: (region: Region) => void;
}

const HomeMap: React.FC<HomeMapProps> = ({ style, onRegionChange }) => {
  const mapRef = useRef<MapView>(null);
  const [initialRegion, setInitialRegion] = useState<Region>({
    latitude: 46.8139, // Quebec City center
    longitude: -71.2082,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getUserLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (isMounted) {
          setUserLocation(location);
          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          setInitialRegion(newRegion);
          setCurrentRegion(newRegion);

          // Animate to user location if map is ready
          if (isMapReady && mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 1000);
          }
        }
      } catch (error) {
        console.log('Error getting location:', error);
      }
    };

    getUserLocation();

    return () => {
      isMounted = false;
    };
  }, [isMapReady]);

  const handleMapReady = () => {
    setIsMapReady(true);
  };

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentRegion(region);
    if (onRegionChange) {
      onRegionChange(region);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onMapReady={handleMapReady}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
        loadingEnabled
        scrollEnabled={true}
        zoomEnabled={true}
        rotateEnabled={true}
        pitchEnabled={true}
        moveOnMarkerPress={false}
        toolbarEnabled={false}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="You are here"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default HomeMap; 