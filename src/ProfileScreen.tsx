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
import { Text, Icon } from './ui';
import { Colors } from './config/colors';

const { width } = Dimensions.get('window');

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

  const userStats = [
    { label: 'Commandes', value: '47', icon: 'package', color: '#0AA5A8' },
    { label: 'Économisé', value: '€285', icon: 'dollar-sign', color: '#10B981' },
    { label: 'Points', value: '1,250', icon: 'star', color: '#F59E0B' },
  ];

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
      title: 'Historique des commandes',
      subtitle: 'Voir toutes vos commandes',
      icon: 'clock',
      color: '#F97316',
      action: () => navigation.navigate('OrderHistory'),
    },
  ];

  const appOptions = [
    {
      id: 'language',
      title: 'Langue',
      subtitle: 'Français',
      icon: 'globe',
      color: '#0AA5A8',
      action: () => navigation.navigate('Language'),
    },
    {
      id: 'help',
      title: 'Aide et support',
      subtitle: 'FAQ, contact',
      icon: 'help-circle',
      color: '#10B981',
      action: () => navigation.navigate('Help'),
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

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            // Handle logout logic
            console.log('User logged out');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
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

      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
                      <Icon name="chevron-left" type="Feather" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity style={styles.editButton}>
          <Icon name="edit-2" type="Feather" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Info Card */}
        <Animated.View 
          style={[
            styles.profileCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.profileImageContainer}>
            <ImageBackground
              source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
              style={styles.profileImage}
              imageStyle={styles.profileImageStyle}
            >
              <TouchableOpacity style={styles.cameraButton}>
                <Icon name="camera" type="Feather" size={16} color={Colors.white} />
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Alexandre Dubois</Text>
            <Text style={styles.profileEmail}>alexandre.dubois@email.com</Text>
            <Text style={styles.profilePhone}>+1 (514) 555-0123</Text>
          </View>

          <View style={styles.membershipBadge}>
            <Icon name="award" type="Feather" size={16} color={Colors.primary} />
            <Text style={styles.membershipText}>Membre Premium</Text>
          </View>
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View 
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
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

        {/* Account Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Compte</Text>
          <View style={styles.optionsContainer}>
            {accountOptions.map((option) => (
              <ProfileOption key={option.id} option={option} />
            ))}
          </View>
        </Animated.View>

        {/* Preferences Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Préférences</Text>
          <View style={styles.optionsContainer}>
            <ToggleOption
              title="Notifications push"
              subtitle="Recevoir des notifications"
              icon="bell"
              color="#F59E0B"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
            <ToggleOption
              title="Localisation"
              subtitle="Permettre la géolocalisation"
              icon="map-pin"
              color="#3B82F6"
              value={locationEnabled}
              onValueChange={setLocationEnabled}
            />
            <ToggleOption
              title="Mode sombre"
              subtitle="Interface en mode sombre"
              icon="moon"
              color="#8B5CF6"
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
            />
            <ToggleOption
              title="Emails promotionnels"
              subtitle="Recevoir les offres par email"
              icon="mail"
              color="#10B981"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
          </View>
        </Animated.View>

        {/* App Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Application</Text>
          <View style={styles.optionsContainer}>
            {appOptions.map((option) => (
              <ProfileOption key={option.id} option={option} />
            ))}
          </View>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Zone de danger</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.dangerOption} onPress={handleLogout}>
              <View style={[styles.optionIcon, { backgroundColor: '#EF444415' }]}>
                <Icon name="log-out" type="Feather" size={20} color="#EF4444" />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: '#EF4444' }]}>Déconnexion</Text>
                <Text style={styles.optionSubtitle}>Se déconnecter de l'application</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dangerOption} onPress={handleDeleteAccount}>
              <View style={[styles.optionIcon, { backgroundColor: '#DC262615' }]}>
                <Icon name="trash-2" type="Feather" size={20} color="#DC2626" />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: '#DC2626' }]}>Supprimer le compte</Text>
                <Text style={styles.optionSubtitle}>Action irréversible</Text>
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
  editButton: {
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
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
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
    alignItems: 'center',
    marginBottom: 16,
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
  profilePhone: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  membershipText: {
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
  optionsContainer: {
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
});

export default ProfileScreen; 