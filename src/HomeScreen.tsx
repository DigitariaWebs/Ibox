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
  ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { Text, Icon } from './ui';
import { Colors } from './config/colors';
import { RootState } from './store/store';
import GoogleMapsWithSearch from './components/GoogleMapsWithSearch';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Get account type from Redux store
  const accountType = useSelector((state: RootState) => state.user.accountType);
  const userData = useSelector((state: RootState) => state.user.userData);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Services for personal users
  const personalServices = [
    {
      id: 'colis',
      title: 'Colis',
      description: 'Livraison rapide et suivie de petits colis.',
      icon: 'package',
      color: '#0AA5A8',
    },
    {
      id: 'palette',
      title: 'Palette',
      description: 'Transport sécurisé pour vos palettes pros.',
      icon: 'layers',
      color: '#3B82F6',
    },
    {
      id: 'camion',
      title: 'Camion',
      description: 'Réservez un camion à l\'heure, avec ou sans aide.',
      icon: 'truck',
      color: '#F97316',
    },
    {
      id: 'demenagement',
      title: 'Déménagement',
      description: 'Service complet avec équipe professionnelle.',
      icon: 'home',
      color: '#8B5CF6',
    },
  ];

  // Services for business users  
  const businessServices = [
    {
      id: 'colis-pro',
      title: 'Colis Pro',
      description: 'Expédition de colis pour entreprises.',
      icon: 'package',
      color: '#0AA5A8',
    },
    {
      id: 'palette-pro',
      title: 'Palette Pro',
      description: 'Logistique palette professionnelle.',
      icon: 'layers',
      color: '#3B82F6',
    },
    {
      id: 'camion-pro',
      title: 'Camion Pro',
      description: 'Flotte dédiée pour entreprises.',
      icon: 'truck',
      color: '#F97316',
    },
    {
      id: 'demenagement-bureau',
      title: 'Déménagement Bureau',
      description: 'Déménagement professionnel d\'entreprise.',
      icon: 'briefcase',
      color: '#8B5CF6',
    },
  ];

  // Get services based on account type
  const services = accountType === 'business' ? businessServices : personalServices;

  // Personal Account Quick Stats
  const personalQuickStats = [
    { label: 'En cours', value: '3', icon: 'clock', color: '#F59E0B' },
    { label: 'Terminées', value: '47', icon: 'check-circle', color: '#10B981' },
  ];

  // Business Account Quick Stats
  const businessQuickStats = [
    { label: 'Expéditions', value: '156', icon: 'truck', color: '#F59E0B' },
    { label: 'Équipe', value: '8', icon: 'users', color: '#10B981' },
  ];

  // Get quick stats based on account type
  const quickStats = accountType === 'business' ? businessQuickStats : personalQuickStats;

  // Personal Account Recent Activity
  const personalRecentActivity = [
    {
      id: 1,
      type: 'delivery',
      title: 'Livraison terminée',
      subtitle: 'Colis livré à Laval • Il y a 2h',
      amount: '$25',
      icon: 'check-circle',
      color: Colors.primary,
    },
    {
      id: 2,
      type: 'move',
      title: 'Déménagement programmé',
      subtitle: 'Camion réservé • Demain 14h',
      amount: '$120',
      icon: 'truck',
      color: '#F97316',
    },
  ];

  // Business Account Recent Activity
  const businessRecentActivity = [
    {
      id: 1,
      type: 'shipment',
      title: 'Expédition B2B',
      subtitle: '5 palettes livrées • Il y a 1h',
      amount: '$450',
      icon: 'layers',
      color: '#3B82F6',
    },
    {
      id: 2,
      type: 'team',
      title: 'Équipe mobilisée',
      subtitle: '3 transporteurs assignés • Il y a 3h',
      amount: '$280',
      icon: 'users',
      color: '#10B981',
    },
  ];

  // Get recent activity based on account type
  const recentActivity = accountType === 'business' ? businessRecentActivity : personalRecentActivity;

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getDisplayName = () => {
    if (userData.firstName) {
      return userData.firstName;
    }
    return accountType === 'business' ? 'Entreprise' : 'Utilisateur';
  };

  const getAccountTypeLabel = () => {
    return accountType === 'business' ? '🏢 Compte Business' : '👤 Compte Personnel';
  };

  const handleServicePress = (serviceId: string) => {
    setSelectedService(serviceId);
    
    // Navigate to specific service screens
    switch (serviceId) {
      case 'colis':
      case 'colis-pro':
        navigation.navigate('ColisService');
        break;
      case 'demenagement':
      case 'demenagement-bureau':
        navigation.navigate('DemenagementService');
        break;
      case 'palette':
      case 'palette-pro':
        // navigation.navigate('PaletteService');
        console.log('Palette service selected');
        break;
      case 'camion':
      case 'camion-pro':
        // navigation.navigate('CamionService');
        console.log('Camion service selected');
        break;
      case 'stockage':
        navigation.navigate('StockageScreen');
        break;
      case 'express':
        navigation.navigate('ExpressScreen');
        break;
      default:
        console.log('Service selected:', serviceId);
        break;
    }
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleProfilePress = () => {
    try {
      navigation.navigate('Settings');
    } catch (error) {
      console.log('Tab navigation failed, trying stack navigation:', error);
      try {
        navigation.push('Settings');
      } catch (stackError) {
        console.log('Stack navigation also failed:', stackError);
        navigation.navigate('Main', { screen: 'Settings' });
      }
    }
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
        {/* Clean Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.logoContainer}>
                <Icon name="box" type="Feather" size={24} color={Colors.primary} />
              </View>
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.userName}>{getDisplayName()}! 👋</Text>
                <Text style={styles.accountType}>{getAccountTypeLabel()}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notificationButton}>
                <Icon name="bell" type="Feather" size={20} color={Colors.textSecondary} />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
                <ImageBackground
                  source={{ uri: 'https://i.pravatar.cc/100?img=1' }}
                  style={styles.profileImage}
                  imageStyle={styles.profileImageStyle}
                >
                  <Icon name="user" type="Feather" size={16} color={Colors.white} />
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Quick Stats Cards */}
        <Animated.View 
          style={[
            styles.quickStatsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.quickStatsContainer}>
            {quickStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                  <Icon name={stat.icon as any} type="Feather" size={18} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Enhanced Map Section */}
        <Animated.View 
          style={[
            styles.mapSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Zone de Service</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MapScreen')}>
              <Text style={styles.viewAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapContainer}>
            <GoogleMapsWithSearch />
          </View>
        </Animated.View>

        {/* Services Section */}
        <Animated.View 
          style={[
            styles.servicesSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {accountType === 'business' ? 'Services Business' : 'Nos Services'}
            </Text>
            <TouchableOpacity onPress={() => handleQuickAction('view-all-services')}>
              <Text style={styles.viewAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceCard,
                  selectedService === service.id && styles.serviceCardSelected,
                ]}
                onPress={() => handleServicePress(service.id)}
                activeOpacity={0.8}
              >
                <View style={styles.serviceCardInner}>
                  <View style={styles.serviceCardContent}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                  </View>
                  <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                    <Icon name={service.icon} type="Feather" size={20} color={Colors.white} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity Section */}
        <Animated.View 
          style={[
            styles.recentSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {accountType === 'business' ? 'Activité Business' : 'Activité Récente'}
            </Text>
            <TouchableOpacity onPress={() => handleQuickAction('view-history')}>
              <Text style={styles.viewAllText}>Historique</Text>
            </TouchableOpacity>
          </View>

          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.recentCard}>
              <View style={styles.recentIcon}>
                <Icon name={activity.icon as any} type="Feather" size={20} color={activity.color} />
              </View>
              <View style={styles.recentContent}>
                <Text style={styles.recentTitle}>{activity.title}</Text>
                <Text style={styles.recentSubtitle}>{activity.subtitle}</Text>
              </View>
              <Text style={styles.recentAmount}>{activity.amount}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Business-only Features */}
        {accountType === 'business' && (
          <Animated.View 
            style={[
              styles.businessSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Gestion Business</Text>
            </View>
            
            <View style={styles.businessFeatures}>
              <TouchableOpacity style={styles.businessFeature} onPress={() => handleQuickAction('team-management')}>
                <View style={[styles.businessFeatureIcon, { backgroundColor: '#10B981' + '15' }]}>
                  <Icon name="users" type="Feather" size={20} color="#10B981" />
                </View>
                <Text style={styles.businessFeatureText}>Équipe</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.businessFeature} onPress={() => handleQuickAction('analytics')}>
                <View style={[styles.businessFeatureIcon, { backgroundColor: '#3B82F6' + '15' }]}>
                  <Icon name="bar-chart" type="Feather" size={20} color="#3B82F6" />
                </View>
                <Text style={styles.businessFeatureText}>Analytics</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.businessFeature} onPress={() => handleQuickAction('invoices')}>
                <View style={[styles.businessFeatureIcon, { backgroundColor: '#F59E0B' + '15' }]}>
                  <Icon name="file-text" type="Feather" size={20} color="#F59E0B" />
                </View>
                <Text style={styles.businessFeatureText}>Factures</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  accountType: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textSecondary,
  },
  profileImageStyle: {
    borderRadius: 20,
  },
  quickStatsSection: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  mapSection: {
    marginTop: 24,
    paddingHorizontal: 20,
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
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  mapInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapInfoText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  servicesSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  servicesGrid: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  serviceCardSelected: {
    borderColor: Colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  serviceCardInner: {
    flex: 1,
  },
  serviceCardContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  recentSection: {
    marginTop: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  recentCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  recentSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  recentAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  businessSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  businessFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  businessFeature: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  businessFeatureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  businessFeatureText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

export default HomeScreen; 