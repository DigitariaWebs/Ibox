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
  Platform,
  Linking,
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
  const userData = useSelector((state: RootState) => state.user);
  
  // Settings states
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [dataSync, setDataSync] = useState(true);

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

  // Account and Profile options
  const accountOptions = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      subtitle: 'Name, email, phone number',
      icon: 'user',
      color: '#0AA5A8',
      action: () => navigation.navigate('PersonalInfo'),
    },
    {
      id: 'addresses',
      title: 'My Addresses',
      subtitle: 'Saved delivery locations',
      icon: 'map-pin',
      color: '#3B82F6',
      action: () => navigation.navigate('Addresses'),
    },
    {
      id: 'payment-methods',
      title: 'Payment Methods',
      subtitle: 'Cards and payment options',
      icon: 'credit-card',
      color: '#8B5CF6',
      action: () => navigation.navigate('PaymentMethods'),
    },
    {
      id: 'order-history',
      title: 'Order History',
      subtitle: 'View your past deliveries',
      icon: 'clock',
      color: '#F97316',
      action: () => navigation.navigate('OrderHistory'),
    },
  ];

  // App preferences options
  const preferenceOptions = [
    {
      id: 'language',
      title: 'Language',
      subtitle: 'English',
      icon: 'globe',
      color: '#0AA5A8',
      action: () => navigation.navigate('LanguageSelection'),
    },
    {
      id: 'currency',
      title: 'Currency',
      subtitle: 'CAD - Canadian Dollar',
      icon: 'dollar-sign',
      color: '#10B981',
      action: () => console.log('Currency settings'),
    },
    {
      id: 'theme',
      title: 'App Theme',
      subtitle: 'Light mode',
      icon: 'sun',
      color: '#F59E0B',
      action: () => console.log('Theme settings'),
    },
  ];

  // Privacy and Security options
  const privacyOptions = [
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      subtitle: 'How we handle your data',
      icon: 'shield',
      color: '#8B5CF6',
      action: () => Linking.openURL('https://ibox.com/privacy'),
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      subtitle: 'Our terms and conditions',
      icon: 'file-text',
      color: '#3B82F6',
      action: () => Linking.openURL('https://ibox.com/terms'),
    },
    {
      id: 'data-export',
      title: 'Export My Data',
      subtitle: 'Download your personal data',
      icon: 'download',
      color: '#6B7280',
      action: () => console.log('Export data'),
    },
  ];

  // Support and Information options
  const supportOptions = [
    {
      id: 'help',
      title: 'Help Center',
      subtitle: 'FAQ and support articles',
      icon: 'help-circle',
      color: '#F59E0B',
      action: () => navigation.navigate('HelpSupport'),
    },
    {
      id: 'contact',
      title: 'Contact Support',
      subtitle: 'Get help from our team',
      icon: 'message-circle',
      color: '#10B981',
      action: () => navigation.navigate('HelpSupport'),
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      subtitle: 'Help us improve the app',
      icon: 'star',
      color: '#F59E0B',
      action: () => console.log('Send feedback'),
    },
    {
      id: 'about',
      title: 'About iBox',
      subtitle: 'Version 2.1.0',
      icon: 'info',
      color: '#6B7280',
      action: () => navigation.navigate('About'),
    },
  ];

  const getDisplayName = () => {
    if (userData.firstName) {
      return `${userData.firstName} ${userData.lastName}`.trim();
    }
    return user?.userType === 'business' ? 'Business User' : 'Customer';
  };

  const getAccountTypeLabel = () => {
    return user?.userType === 'business' ? 'Business Account' : 'Personal Account';
  };

  const getLoginMethodLabel = () => {
    switch (userData.loginMethod) {
      case 'facebook':
        return 'Connected via Facebook';
      case 'apple':
        return 'Connected via Apple';
      case 'google':
        return 'Connected via Google';
      case 'email':
        return 'Connected via Email';
      default:
        return 'Connected';
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
      'Delete Account',
      'This action is irreversible. All your data will be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
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
            <Icon name="chevron-left" type="Feather" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </Animated.View>

        {/* Account Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
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
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            {preferenceOptions.map((option) => (
              <ProfileOption key={option.id} option={option} />
            ))}
          </View>
        </Animated.View>

        {/* Notifications Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionContent}>
            <ToggleOption
              title="Push Notifications"
              subtitle="Receive order updates and alerts"
              icon="bell"
              color="#0AA5A8"
              value={pushNotifications}
              onValueChange={setPushNotifications}
            />
            <ToggleOption
              title="Email Notifications"
              subtitle="Receive delivery confirmations"
              icon="mail"
              color="#F59E0B"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
            <ToggleOption
              title="SMS Notifications"
              subtitle="Delivery updates via SMS"
              icon="message-square"
              color="#3B82F6"
              value={smsNotifications}
              onValueChange={setSmsNotifications}
            />
            <ToggleOption
              title="Location Services"
              subtitle="Use current location for deliveries"
              icon="map-pin"
              color="#8B5CF6"
              value={locationServices}
              onValueChange={setLocationServices}
            />
          </View>
        </Animated.View>

        {/* Privacy & Security Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.sectionContent}>
            {privacyOptions.map((option) => (
              <ProfileOption key={option.id} option={option} />
            ))}
            <ToggleOption
              title="Dark Mode"
              subtitle="Switch to dark interface"
              icon="moon"
              color="#6B7280"
              value={darkMode}
              onValueChange={setDarkMode}
            />
            <ToggleOption
              title="Biometric Authentication"
              subtitle="Use Touch ID or Face ID"
              icon="shield"
              color="#8B5CF6"
              value={biometricAuth}
              onValueChange={setBiometricAuth}
            />
            <ToggleOption
              title="Auto Backup"
              subtitle="Backup data automatically"
              icon="hard-drive"
              color="#10B981"
              value={autoBackup}
              onValueChange={setAutoBackup}
            />
          </View>
        </Animated.View>

        {/* Support Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionContent}>
            {supportOptions.map((option) => (
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
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.dangerOption} onPress={handleLogout}>
              <View style={styles.dangerIcon}>
                <Icon name="log-out" type="Feather" size={20} color="#EF4444" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.dangerTitle}>Sign Out</Text>
                <Text style={styles.dangerSubtitle}>Sign out from the app</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dangerOption} onPress={handleDeleteAccount}>
              <View style={styles.dangerIcon}>
                <Icon name="trash-2" type="Feather" size={20} color="#EF4444" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.dangerTitle}>Delete Account</Text>
                <Text style={styles.dangerSubtitle}>Irreversible action</Text>
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
  headerSpacer: {
    width: 40,
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