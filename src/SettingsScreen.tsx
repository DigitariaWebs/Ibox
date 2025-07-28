import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  Switch,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Text, Icon } from './ui';
import { Colors } from './config/colors';
import { RootState } from './store/store';
import { useAuth } from './contexts/AuthContext';

const { width } = Dimensions.get('window');

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { logout, user } = useAuth();
  const dispatch = useDispatch();
  const user2 = useSelector((state: RootState) => state.user);
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
  }, []);

  // Personal Account User Stats
  const personalUserStats = [
    { label: 'Commandes', value: '47', icon: 'package', color: '#0AA5A8' },
    { label: 'Points', value: '1,250', icon: 'star', color: '#F59E0B' },
  ];

  // Business Account User Stats
  const businessUserStats = [
    { label: 'Expéditions', value: '156', icon: 'truck', color: '#0AA5A8' },
    { label: 'Équipe', value: '8', icon: 'users', color: '#10B981' },
    { label: 'Revenus', value: '$12,450', icon: 'dollar-sign', color: '#F59E0B' },
  ];

  // Get user stats based on account type
  const userStats = accountType === 'business' ? businessUserStats : personalUserStats;

  const accountOptions = [
    {
      id: 'personal-info',
      title: 'Informations personnelles',
      subtitle: 'Nom, email, téléphone',
      icon: 'user',
      color: '#0AA5A8',
      action: () => navigation.navigate('PersonalInfo'),
    },
    {
      id: 'addresses',
      title: 'Adresses',
      subtitle: '3 adresses enregistrées',
      icon: 'map-pin',
      color: '#3B82F6',
      action: () => navigation.navigate('Addresses'),
    },
    {
      id: 'payment-methods',
      title: 'Moyens de paiement',
      subtitle: '2 cartes enregistrées',
      icon: 'credit-card',
      color: '#8B5CF6',
      action: () => navigation.navigate('PaymentMethods'),
    },
    {
      id: 'order-history',
      title: accountType === 'business' ? 'Historique des expéditions' : 'Historique des commandes',
      subtitle: accountType === 'business' ? 'Voir toutes vos expéditions' : 'Voir toutes vos commandes',
      icon: 'clock',
      color: '#F97316',
      action: () => navigation.navigate('OrderHistory'),
    },
  ];

  // Business-specific options
  const businessOptions = [
    {
      id: 'team-management',
      title: 'Gestion d\'équipe',
      subtitle: '8 membres actifs',
      icon: 'users',
      color: '#10B981',
      action: () => navigation.navigate('TeamManagement'),
    },
    {
      id: 'business-analytics',
      title: 'Analytics Business',
      subtitle: 'Rapports et statistiques',
      icon: 'bar-chart',
      color: '#3B82F6',
      action: () => navigation.navigate('BusinessAnalytics'),
    },
    {
      id: 'invoicing',
      title: 'Facturation',
      subtitle: 'Gestion des factures',
      icon: 'file-text',
      color: '#F59E0B',
      action: () => navigation.navigate('Invoicing'),
    },
  ];

  const appOptions = [
    {
      id: 'language',
      title: 'Langue',
      subtitle: 'Français',
      icon: 'globe',
      color: '#0AA5A8',
      action: () => navigation.navigate('LanguageSelection'),
    },
    {
      id: 'help',
      title: 'Aide et support',
      subtitle: 'FAQ, contact, assistance',
      icon: 'help-circle',
      color: '#F59E0B',
      action: () => navigation.navigate('HelpSupport'),
    },
    {
      id: 'about',
      title: 'À propos',
      subtitle: 'Version 1.2.0',
      icon: 'info',
      color: '#6B7280',
      action: () => navigation.navigate('About'),
    },
  ];

  const getDisplayName = () => {
    if (userData.firstName) {
      return `${userData.firstName} ${userData.lastName}`.trim();
    }
    return accountType === 'business' ? 'Entreprise' : 'Utilisateur';
  };

  const getAccountTypeLabel = () => {
    return accountType === 'business' ? 'Compte Business' : 'Compte Personnel';
  };

  const getLoginMethodLabel = () => {
    switch (userData.loginMethod) {
      case 'facebook':
        return 'Connecté via Facebook';
      case 'apple':
        return 'Connecté via Apple';
      case 'google':
        return 'Connecté via Google';
      case 'email':
        return 'Connecté par email';
      default:
        return 'Connecté';
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              console.log('✅ User logged out successfully');
              // Navigation will happen automatically via AuthContext state change
            } catch (error) {
              console.error('❌ Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes vos données seront supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            console.log('Account deletion requested');
          },
        },
      ]
    );
  };

  const ProfileOption = ({ option }: { option: any }) => (
    <TouchableOpacity style={styles.optionCard} onPress={option.action} activeOpacity={0.8}>
      <View style={[styles.optionIcon, { backgroundColor: option.color + '15' }]}>
        <Icon name={option.icon} type="Feather" size={20} color={option.color} />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{option.title}</Text>
        <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
      </View>
      <Icon name="chevron-right" type="Feather" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  const ToggleOption = ({ 
    title, 
    subtitle, 
    icon, 
    color, 
    value, 
    onValueChange 
  }: {
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.optionCard}>
      <View style={[styles.optionIcon, { backgroundColor: color + '15' }]}>
        <Icon name={icon} type="Feather" size={20} color={color} />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.border, true: Colors.primary + '40' }}
        thumbColor={value ? Colors.primary : Colors.textSecondary}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" type="Feather" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerRight} />
        </Animated.View>

        {/* Profile Card */}
        <Animated.View
          style={[
            styles.profileCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <ImageBackground
                source={{ uri: 'https://i.pravatar.cc/100?img=2' }}
                style={styles.profileImage}
                imageStyle={styles.profileImageStyle}
              >
                <TouchableOpacity style={styles.cameraButton}>
                  <Icon name="camera" type="Feather" size={16} color={Colors.white} />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1} ellipsizeMode="tail">
                {getDisplayName()}
              </Text>
              <Text style={styles.profileEmail} numberOfLines={1} ellipsizeMode="tail">
                {userData.email}
              </Text>
              <View style={styles.profileBadges}>
                <View style={styles.accountTypeBadge}>
                  <Icon 
                    name={accountType === 'business' ? 'briefcase' : 'user'} 
                    type="Feather" 
                    size={10} 
                    color={Colors.primary} 
                  />
                  <Text style={styles.accountTypeText} numberOfLines={1}>
                    {accountType === 'business' ? 'Business' : 'Personnel'}
                  </Text>
                </View>
                <View style={styles.loginMethodBadge}>
                  <Text style={styles.loginMethodText} numberOfLines={1}>
                    {userData.loginMethod ? userData.loginMethod.charAt(0).toUpperCase() + userData.loginMethod.slice(1) : 'App'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* User Stats */}
        <Animated.View
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.statsContainer}>
            {userStats.map((stat, index) => (
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

        {/* Account Management */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Gestion du compte</Text>
          <View style={styles.sectionContent}>
            {accountOptions.map((option) => (
              <ProfileOption key={option.id} option={option} />
            ))}
          </View>
        </Animated.View>

        {/* Business-specific Section */}
        {accountType === 'business' && (
          <Animated.View
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Gestion Business</Text>
            <View style={styles.sectionContent}>
              {businessOptions.map((option) => (
                <ProfileOption key={option.id} option={option} />
              ))}
            </View>
          </Animated.View>
        )}

        {/* Smart Preferences */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Préférences</Text>
          <View style={styles.sectionContent}>
            <ToggleOption
              title="Notifications"
              subtitle="Recevoir les notifications push"
              icon="bell"
              color="#0AA5A8"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
            <ToggleOption
              title="Localisation"
              subtitle="Utiliser ma position actuelle"
              icon="map-pin"
              color="#3B82F6"
              value={locationEnabled}
              onValueChange={setLocationEnabled}
            />
            <ToggleOption
              title="Mode sombre"
              subtitle="Interface sombre"
              icon="moon"
              color="#8B5CF6"
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
            />
            <ToggleOption
              title="Notifications email"
              subtitle="Recevoir les emails"
              icon="mail"
              color="#F59E0B"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
          </View>
        </Animated.View>

        {/* App Settings */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Application</Text>
          <View style={styles.sectionContent}>
            {appOptions.map((option) => (
              <ProfileOption key={option.id} option={option} />
            ))}
          </View>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View
          style={[
            styles.section,
            styles.dangerSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Zone dangereuse</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.dangerOption} onPress={handleLogout}>
              <View style={styles.dangerIcon}>
                <Icon name="log-out" type="Feather" size={20} color="#EF4444" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.dangerTitle}>Déconnexion</Text>
                <Text style={styles.dangerSubtitle}>Se déconnecter de l'application</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dangerOption} onPress={handleDeleteAccount}>
              <View style={styles.dangerIcon}>
                <Icon name="trash-2" type="Feather" size={20} color="#EF4444" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.dangerTitle}>Supprimer le compte</Text>
                <Text style={styles.dangerSubtitle}>Action irréversible</Text>
              </View>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textSecondary,
  },
  profileImageStyle: {
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  profileBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accountTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  accountTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  loginMethodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  loginMethodText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statsContainer: {
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
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  sectionContent: {
    gap: 2,
  },
  optionCard: {
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
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  dangerSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  dangerOption: {
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
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EF444420',
  },
  dangerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 2,
  },
  dangerSubtitle: {
    fontSize: 14,
    color: '#EF4444',
  },
});

export default SettingsScreen; 