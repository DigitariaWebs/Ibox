import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  Dimensions,
  ScrollView,
  Animated,
  RefreshControl,
  ImageBackground,
  Alert
} from 'react-native';
import { useSelector } from 'react-redux';
import { Text, Icon } from '../ui';
import { Colors } from '../config/colors';
import { RootState } from '../store/store';

const { width, height } = Dimensions.get('window');

const TransporterHomeScreen: React.FC<any> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [visibleRequests, setVisibleRequests] = useState<any[]>([]);
  const [timers, setTimers] = useState<{ [key: number]: number }>({});
  const [countdowns, setCountdowns] = useState<{ [key: number]: number }>({});
  
  // Get user data from Redux store
  const userData = useSelector((state: RootState) => state.user.userData);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // All possible delivery requests (20 total)
  const allDeliveryRequests = [
    {
      id: 1,
      customerName: 'Marie Dubois',
      serviceType: 'Colis Express',
      pickupAddress: '123 Rue Saint-Denis, Montréal, QC',
      deliveryAddress: '456 Boulevard René-Lévesque, Laval, QC',
      distance: '15.2 km',
      estimatedTime: '25 min',
      price: '$25.00',
      weight: '2.5 kg',
      description: 'Petit colis fragile - documents importants',
      urgency: 'normal',
    },
    {
      id: 2,
      customerName: 'Jean-Pierre Martin',
      serviceType: 'Déménagement',
      pickupAddress: '789 Rue Sherbrooke, Montréal, QC',
      deliveryAddress: '321 Avenue du Parc, Longueuil, QC',
      distance: '22.8 km',
      estimatedTime: '45 min',
      price: '$120.00',
      weight: '50+ kg',
      description: 'Déménagement studio - besoin d\'aide pour porter',
      urgency: 'high',
    },
    {
      id: 3,
      customerName: 'Sophie Chen',
      serviceType: 'Palette',
      pickupAddress: '555 Boulevard Industriel, Montréal, QC',
      deliveryAddress: '888 Rue Commerciale, Brossard, QC',
      distance: '18.5 km',
      estimatedTime: '35 min',
      price: '$65.00',
      weight: '200 kg',
      description: 'Palette de marchandises - accès camion requis',
      urgency: 'normal',
    },
    {
      id: 4,
      customerName: 'Alexandre Roy',
      serviceType: 'Colis Urgent',
      pickupAddress: '234 Avenue Mont-Royal, Montréal, QC',
      deliveryAddress: '567 Rue Wellington, Verdun, QC',
      distance: '12.3 km',
      estimatedTime: '20 min',
      price: '$35.00',
      weight: '1.2 kg',
      description: 'Médicaments urgents - livraison prioritaire',
      urgency: 'high',
    },
    {
      id: 5,
      customerName: 'Isabelle Tremblay',
      serviceType: 'Déménagement',
      pickupAddress: '890 Boulevard Pie-IX, Montréal, QC',
      deliveryAddress: '123 Rue Principale, Boucherville, QC',
      distance: '28.7 km',
      estimatedTime: '50 min',
      price: '$150.00',
      weight: '75+ kg',
      description: 'Déménagement 2 chambres - aide requise',
      urgency: 'normal',
    },
    {
      id: 6,
      customerName: 'Marc Lefebvre',
      serviceType: 'Colis',
      pickupAddress: '456 Rue Sainte-Catherine, Montréal, QC',
      deliveryAddress: '789 Boulevard Taschereau, Longueuil, QC',
      distance: '16.8 km',
      estimatedTime: '30 min',
      price: '$22.00',
      weight: '3.1 kg',
      description: 'Équipement électronique - manipulation délicate',
      urgency: 'normal',
    },
    {
      id: 7,
      customerName: 'Lucie Gagnon',
      serviceType: 'Express',
      pickupAddress: '321 Rue Saint-Laurent, Montréal, QC',
      deliveryAddress: '654 Avenue des Pins, Westmount, QC',
      distance: '8.4 km',
      estimatedTime: '15 min',
      price: '$40.00',
      weight: '0.8 kg',
      description: 'Documents contractuels urgents',
      urgency: 'high',
    },
    {
      id: 8,
      customerName: 'Pierre Bouchard',
      serviceType: 'Palette',
      pickupAddress: '987 Rue Industrielle, Montréal, QC',
      deliveryAddress: '147 Boulevard de la Rive-Sud, Longueuil, QC',
      distance: '24.1 km',
      estimatedTime: '40 min',
      price: '$85.00',
      weight: '180 kg',
      description: 'Marchandises alimentaires - réfrigération requise',
      urgency: 'normal',
    },
    {
      id: 9,
      customerName: 'Catherine Morin',
      serviceType: 'Colis',
      pickupAddress: '741 Avenue du Parc, Montréal, QC',
      deliveryAddress: '852 Rue Saint-Charles, Longueuil, QC',
      distance: '19.3 km',
      estimatedTime: '35 min',
      price: '$28.00',
      weight: '4.2 kg',
      description: 'Cadeaux d\'anniversaire - emballage fragile',
      urgency: 'normal',
    },
    {
      id: 10,
      customerName: 'Robert Lavoie',
      serviceType: 'Déménagement',
      pickupAddress: '159 Rue Fleury, Montréal, QC',
      deliveryAddress: '753 Boulevard Curé-Labelle, Laval, QC',
      distance: '31.5 km',
      estimatedTime: '55 min',
      price: '$180.00',
      weight: '90+ kg',
      description: 'Déménagement bureau - meubles lourds',
      urgency: 'high',
    },
    {
      id: 11,
      customerName: 'Nathalie Côté',
      serviceType: 'Express',
      pickupAddress: '462 Rue Rachel, Montréal, QC',
      deliveryAddress: '785 Avenue Victoria, Saint-Lambert, QC',
      distance: '14.7 km',
      estimatedTime: '22 min',
      price: '$45.00',
      weight: '1.5 kg',
      description: 'Échantillons médicaux - livraison immédiate',
      urgency: 'high',
    },
    {
      id: 12,
      customerName: 'Daniel Bélanger',
      serviceType: 'Colis',
      pickupAddress: '963 Boulevard Saint-Joseph, Montréal, QC',
      deliveryAddress: '258 Rue Principale, Brossard, QC',
      distance: '21.9 km',
      estimatedTime: '38 min',
      price: '$32.00',
      weight: '5.7 kg',
      description: 'Pièces automobiles - manipulation soigneuse',
      urgency: 'normal',
    },
    {
      id: 13,
      customerName: 'Sylvie Bergeron',
      serviceType: 'Palette',
      pickupAddress: '357 Rue Notre-Dame, Montréal, QC',
      deliveryAddress: '951 Boulevard Marie-Victorin, Longueuil, QC',
      distance: '17.2 km',
      estimatedTime: '32 min',
      price: '$75.00',
      weight: '220 kg',
      description: 'Matériaux de construction - accès difficile',
      urgency: 'normal',
    },
    {
      id: 14,
      customerName: 'François Pelletier',
      serviceType: 'Express',
      pickupAddress: '684 Avenue Laurier, Montréal, QC',
      deliveryAddress: '426 Rue King, Sherbrooke, QC',
      distance: '145.3 km',
      estimatedTime: '1h 40min',
      price: '$200.00',
      weight: '2.1 kg',
      description: 'Documents légaux urgents - long trajet',
      urgency: 'high',
    },
    {
      id: 15,
      customerName: 'Julie Mercier',
      serviceType: 'Colis',
      pickupAddress: '528 Rue Beaubien, Montréal, QC',
      deliveryAddress: '179 Avenue des Érables, Chambly, QC',
      distance: '26.4 km',
      estimatedTime: '42 min',
      price: '$38.00',
      weight: '3.8 kg',
      description: 'Produits artisanaux - emballage spécial',
      urgency: 'normal',
    },
    {
      id: 16,
      customerName: 'Martin Dubé',
      serviceType: 'Déménagement',
      pickupAddress: '813 Rue Jarry, Montréal, QC',
      deliveryAddress: '642 Boulevard des Promenades, Saint-Bruno, QC',
      distance: '23.6 km',
      estimatedTime: '45 min',
      price: '$140.00',
      weight: '65+ kg',
      description: 'Déménagement 1 chambre - 3e étage sans ascenseur',
      urgency: 'normal',
    },
    {
      id: 17,
      customerName: 'Chantal Rousseau',
      serviceType: 'Express',
      pickupAddress: '395 Boulevard René-Lévesque, Montréal, QC',
      deliveryAddress: '717 Rue Saint-Paul, Québec, QC',
      distance: '251.8 km',
      estimatedTime: '3h 10min',
      price: '$350.00',
      weight: '1.3 kg',
      description: 'Contrat urgent - livraison même jour Québec',
      urgency: 'high',
    },
    {
      id: 18,
      customerName: 'Éric Fontaine',
      serviceType: 'Palette',
      pickupAddress: '476 Rue de la Commune, Montréal, QC',
      deliveryAddress: '238 Avenue du Commerce, Dorval, QC',
      distance: '29.1 km',
      estimatedTime: '48 min',
      price: '$95.00',
      weight: '300 kg',
      description: 'Équipement industriel lourd - grue requise',
      urgency: 'normal',
    },
    {
      id: 19,
      customerName: 'Véronique Leblanc',
      serviceType: 'Colis',
      pickupAddress: '692 Rue Sherbrooke, Montréal, QC',
      deliveryAddress: '384 Rue des Pins, Laval, QC',
      distance: '20.7 km',
      estimatedTime: '36 min',
      price: '$30.00',
      weight: '2.9 kg',
      description: 'Vêtements de créateur - manipulation délicate',
      urgency: 'normal',
    },
    {
      id: 20,
      customerName: 'Stéphane Girard',
      serviceType: 'Express',
      pickupAddress: '847 Avenue Papineau, Montréal, QC',
      deliveryAddress: '519 Boulevard Gouin, Laval, QC',
      distance: '18.9 km',
      estimatedTime: '28 min',
      price: '$50.00',
      weight: '0.6 kg',
      description: 'Clés de voiture de luxe - livraison prioritaire',
      urgency: 'high',
    },
  ];

  useEffect(() => {
    // Initial animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Initialize with 3 random requests
    generateRandomRequests();

    // Set up random request generation
    const requestInterval = setInterval(() => {
      if (visibleRequests.length < 3) {
        addRandomRequest();
      }
    }, Math.random() * 8000 + 5000); // Random interval between 5-13 seconds

    return () => {
      clearInterval(requestInterval);
      // Clear all timers
      Object.values(timers).forEach(timer => clearInterval(timer));
    };
  }, []);

  // Countdown effect
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdowns(prev => {
        const newCountdowns = { ...prev };
        Object.keys(newCountdowns).forEach(key => {
          const requestId = parseInt(key);
          if (newCountdowns[requestId] > 0) {
            newCountdowns[requestId] -= 1;
          }
        });
        return newCountdowns;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  // Generate 3 initial random requests
  const generateRandomRequests = () => {
    const shuffled = [...allDeliveryRequests].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    const newTimers: { [key: number]: number } = {};
    const newCountdowns: { [key: number]: number } = {};
    
    selected.forEach((request) => {
      // Start 10-second timer for each request
      const timerId = setTimeout(() => {
        removeRequest(request.id);
      }, 10000);
      newTimers[request.id] = timerId as unknown as number;
      newCountdowns[request.id] = 10; // Start countdown at 10 seconds
    });

    setVisibleRequests(selected);
    setTimers(newTimers);
    setCountdowns(newCountdowns);
  };

  // Add a random request
  const addRandomRequest = () => {
    const availableRequests = allDeliveryRequests.filter(
      req => !visibleRequests.some(visible => visible.id === req.id)
    );
    
    if (availableRequests.length === 0) return;
    
    const randomRequest = availableRequests[Math.floor(Math.random() * availableRequests.length)];
    
    // Start 10-second timer for the new request
    const timerId = setTimeout(() => {
      removeRequest(randomRequest.id);
    }, 10000);

    setVisibleRequests(prev => [...prev, randomRequest]);
    setTimers(prev => ({ ...prev, [randomRequest.id]: timerId as unknown as number }));
    setCountdowns(prev => ({ ...prev, [randomRequest.id]: 10 }));
  };

  // Remove a request
  const removeRequest = (requestId: number) => {
    setVisibleRequests(prev => prev.filter(req => req.id !== requestId));
    setTimers(prev => {
      const newTimers = { ...prev };
      if (newTimers[requestId]) {
        clearTimeout(newTimers[requestId]);
        delete newTimers[requestId];
      }
      return newTimers;
    });
    setCountdowns(prev => {
      const newCountdowns = { ...prev };
      delete newCountdowns[requestId];
      return newCountdowns;
    });
  };

  const getDisplayName = () => {
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    return 'Transporteur';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return '#EF4444';
      case 'normal': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const handleAcceptRequest = (requestId: number) => {
    Alert.alert(
      'Accepter la demande',
      'Voulez-vous accepter cette demande de livraison?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Accepter', 
          onPress: () => {
            console.log('Request accepted:', requestId);
            
            // Find the accepted order
            const acceptedOrder = visibleRequests.find(req => req.id === requestId);
            if (acceptedOrder) {
              // Add coordinates to the order for map navigation
              const orderWithCoords = {
                ...acceptedOrder,
                pickupCoords: {
                  latitude: 45.5017 + (Math.random() - 0.5) * 0.01, // Montreal area with some variation
                  longitude: -73.5673 + (Math.random() - 0.5) * 0.01,
                },
                deliveryCoords: {
                  latitude: 45.5017 + (Math.random() - 0.5) * 0.02, // Different location in Montreal area
                  longitude: -73.5673 + (Math.random() - 0.5) * 0.02,
                }
              };
              
              // Navigate to driver mode with the order details
              navigation.navigate('DriverModeScreen', { order: orderWithCoords });
            }
            
            removeRequest(requestId);
          }
        }
      ]
    );
  };

  const handleDeclineRequest = (requestId: number) => {
    Alert.alert(
      'Décliner la demande',
      'Voulez-vous décliner cette demande de livraison?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Décliner', 
          style: 'destructive',
          onPress: () => {
            console.log('Request declined:', requestId);
            removeRequest(requestId);
            // TODO: Handle decline logic
          }
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleProfilePress = () => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Profile Header */}
        <Animated.View style={[styles.profileSection, { opacity: fadeAnim }]}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
                <ImageBackground
                  source={{ uri: 'https://i.pravatar.cc/100?img=2' }}
                  style={styles.profileImage}
                  imageStyle={styles.profileImageStyle}
                >
                  <Icon name="user" type="Feather" size={20} color={Colors.white} />
                </ImageBackground>
              </TouchableOpacity>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>{getDisplayName()}</Text>
                <Text style={styles.profileRole}>Transporteur</Text>
                <View style={styles.profileStats}>
                  <Text style={styles.profileStat}>⭐ 4.8 • 47 livraisons</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton} onPress={handleProfilePress}>
              <Icon name="settings" type="Feather" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Delivery Requests */}
        <Animated.View style={[styles.requestsSection, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Demandes de livraison</Text>
            <Text style={styles.requestCount}>{visibleRequests.length} nouvelles</Text>
          </View>

          {visibleRequests.map((request) => (
            <Animated.View 
              key={request.id} 
              style={[
                styles.requestCard,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: fadeAnim }]
                }
              ]}
            >
              {/* Request Header */}
              <View style={styles.requestHeader}>
                <View style={styles.requestInfo}>
                  <Text style={styles.customerName}>{request.customerName}</Text>
                  <View style={styles.serviceTypeContainer}>
                    <Text style={styles.serviceType}>{request.serviceType}</Text>
                    <View style={[
                      styles.urgencyBadge, 
                      { backgroundColor: getUrgencyColor(request.urgency) + '15' }
                    ]}>
                      <Text style={[
                        styles.urgencyText, 
                        { color: getUrgencyColor(request.urgency) }
                      ]}>
                        {request.urgency === 'high' ? 'Urgent' : 'Normal'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.requestMeta}>
                  <Text style={styles.requestPrice}>{request.price}</Text>
                  <View style={styles.countdownContainer}>
                    <Text style={styles.countdownText}>
                      {countdowns[request.id] || 0}s
                    </Text>
                  </View>
                </View>
              </View>

              {/* Request Details */}
              <View style={styles.requestDetails}>
                <View style={styles.addressSection}>
                  <View style={styles.addressItem}>
                    <Icon name="map-pin" type="Feather" size={14} color={Colors.primary} />
                    <Text style={styles.addressText}>{request.pickupAddress}</Text>
                  </View>
                  <View style={styles.addressItem}>
                    <Icon name="navigation" type="Feather" size={14} color={Colors.success} />
                    <Text style={styles.addressText}>{request.deliveryAddress}</Text>
                  </View>
                </View>
                
                <View style={styles.requestInfo}>
                  <Text style={styles.requestDescription}>{request.description}</Text>
                  <View style={styles.requestSpecs}>
                    <Text style={styles.specText}>📏 {request.distance}</Text>
                    <Text style={styles.specText}>⏱️ {request.estimatedTime}</Text>
                    <Text style={styles.specText}>📦 {request.weight}</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.declineButton}
                  onPress={() => handleDeclineRequest(request.id)}
                  activeOpacity={0.8}
                >
                  <Icon name="x" type="Feather" size={18} color={Colors.error} />
                  <Text style={styles.declineText}>Décliner</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.acceptButton}
                  onPress={() => handleAcceptRequest(request.id)}
                  activeOpacity={0.8}
                >
                  <Icon name="check" type="Feather" size={18} color={Colors.white} />
                  <Text style={styles.acceptText}>Accepter</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  // Profile Section
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.primary,
    marginRight: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textSecondary,
  },
  profileImageStyle: {
    borderRadius: 30,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  profileStats: {
    marginTop: 2,
  },
  profileStat: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  // Requests Section
  requestsSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  requestCount: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  // Request Card
  requestCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  requestInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 6,
  },
  serviceTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceType: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  requestMeta: {
    alignItems: 'flex-end',
  },
  requestPrice: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  requestTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  countdownContainer: {
    backgroundColor: Colors.error + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  countdownText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '700',
  },
  // Request Details
  requestDetails: {
    marginBottom: 20,
  },
  addressSection: {
    marginBottom: 16,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 4,
  },
  addressText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  requestDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  requestSpecs: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  specText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.error,
    gap: 8,
  },
  declineText: {
    fontSize: 16,
    color: Colors.error,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    gap: 8,
  },
  acceptText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
});

export default TransporterHomeScreen;