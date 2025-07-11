import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Region, Polyline } from 'react-native-maps';
import { Colors } from '../config/colors';
import * as Location from 'expo-location';
import ShippingModal from './ShippingModal';

const { width, height } = Dimensions.get('window');

interface HomeMapProps {
  style?: any;
  onRegionChange?: (region: Region) => void;
}

interface RouteCoordinates {
  latitude: number;
  longitude: number;
}

const HomeMap: React.FC<HomeMapProps> = ({ style, onRegionChange }) => {
  const mapRef = useRef<MapView>(null);
  const [initialRegion, setInitialRegion] = useState<Region>({
    latitude: 46.8139,
    longitude: -71.2082,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [destination, setDestination] = useState<RouteCoordinates | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinates[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [distance, setDistance] = useState('');

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

  const getAddressFromCoordinates = async (coords: RouteCoordinates) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=AIzaSyBRwiNsI16XFfA71eFLM4YaIDax8qQIrI4`
      );
      const json = await response.json();
      if (json.results && json.results.length > 0) {
        return json.results[0].formatted_address;
      }
      return 'Adresse inconnue';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Adresse inconnue';
    }
  };

  const calculateDistance = (route: RouteCoordinates[]) => {
    let dist = 0;
    for (let i = 0; i < route.length - 1; i++) {
      dist += getDistanceFromLatLonInKm(
        route[i].latitude,
        route[i].longitude,
        route[i + 1].latitude,
        route[i + 1].longitude
      );
    }
    return Math.round(dist * 10) / 10; // Round to 1 decimal place
  };

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const getRouteDirections = async (startLoc: RouteCoordinates, destinationLoc: RouteCoordinates) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${destinationLoc.latitude},${destinationLoc.longitude}&key=AIzaSyBRwiNsI16XFfA71eFLM4YaIDax8qQIrI4`
      );
      const json = await response.json();
      
      if (json.routes.length) {
        const points = json.routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(points);
        setRouteCoordinates(decodedPoints);

        // Calculate distance
        const distanceInKm = calculateDistance(decodedPoints);
        setDistance(`${distanceInKm} km`);

        // Get destination address
        const address = await getAddressFromCoordinates(destinationLoc);
        setDestinationAddress(address);

        // Show modal
        setIsModalVisible(true);

        // Fit map to show entire route
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(decodedPoints, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  const decodePolyline = (encoded: string) => {
    const poly: RouteCoordinates[] = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      poly.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5
      });
    }
    return poly;
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setDestination(coordinate);
    
    if (userLocation) {
      const startLocation = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      };
      getRouteDirections(startLocation, coordinate);
    }
  };

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
        onPress={handleMapPress}
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
        
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor="blue"
          />
        )}

        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={4}
            strokeColor={Colors.primary}
          />
        )}
      </MapView>

      <ShippingModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        destinationAddress={destinationAddress}
        distance={distance}
        coordinates={destination || { latitude: 0, longitude: 0 }}
      />
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