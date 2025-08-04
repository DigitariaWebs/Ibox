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
  Platform,
} from 'react-native';
import { Text, Icon } from '../ui';
import { Colors } from '../config/colors';

interface ClientProfileScreenProps {
  navigation: any;
}

const ClientProfileScreen: React.FC<ClientProfileScreenProps> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
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

  const clientStats = [
    { label: 'Shipments', value: '47', icon: 'package', color: '#0AA5A8' },
    { label: 'Saved', value: '$285', icon: 'dollar-sign', color: '#10B981' },
    { label: 'Points', value: '1,250', icon: 'star', color: '#F59E0B' },
  ];

  const accountOptions = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      subtitle: 'Name, email, phone',
      icon: 'user',
      color: '#0AA5A8',
      action: () => navigation.navigate('PersonalInfo'),
    },
    {
      id: 'addresses',
      title: 'My Addresses',
      subtitle: '3 saved addresses',
      icon: 'map-pin',
      color: '#3B82F6',
      action: () => navigation.navigate('Addresses'),
    },
    {
      id: 'payment-methods',
      title: 'Payment Methods',
      subtitle: '2 cards saved',
      icon: 'credit-card',
      color: '#8B5CF6',
      action: () => navigation.navigate('PaymentMethods'),
    },
    {
      id: 'order-history',
      title: 'Order History',
      subtitle: 'View all your orders',
      icon: 'clock',
      color: '#F97316',
      action: () => navigation.navigate('OrderHistory'),
    },
  ];

  const preferenceOptions = [
    {
      id: 'favorites',
      title: 'Favorite Drivers',
      subtitle: 'Manage preferred drivers',
      icon: 'heart',
      color: '#EF4444',
      action: () => navigation.navigate('FavoriteDrivers'),
    },
    {
      id: 'recurring',
      title: 'Recurring Deliveries',
      subtitle: 'Set up regular shipments',
      icon: 'repeat',
      color: '#10B981',
      action: () => navigation.navigate('RecurringDeliveries'),
    },
  ];

  const appOptions = [
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'FAQ, contact support',
      icon: 'help-circle',
      color: '#10B981',
      action: () => navigation.navigate('Help'),
    },
    {
      id: 'rate',
      title: 'Rate Our Service',
      subtitle: 'Share your feedback',
      icon: 'star',
      color: '#F59E0B',
      action: () => navigation.navigate('RateService'),
    },
    {
      id: 'refer',
      title: 'Refer & Earn',
      subtitle: 'Get €10 for each referral',
      icon: 'gift',
      color: '#8B5CF6',
      action: () => navigation.navigate('ReferEarn'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
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

  const ProfileOption = ({ option }: { option: any }) => (
    <TouchableOpacity style={styles.optionCard} onPress={option.action} activeOpacity={0.8}>
      <View style={[styles.optionIcon, { backgroundColor: option.color + '10' }]}>
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
      <View style={[styles.optionIcon, { backgroundColor: color + '10' }]}>
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
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" type="Feather" size={28} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

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
              source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
              style={styles.profileImage}
              imageStyle={styles.profileImageStyle}
            >
              <TouchableOpacity style={styles.cameraButton}>
                <Icon name="camera" type="Feather" size={14} color={Colors.white} />
              </TouchableOpacity>
            </ImageBackground>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Sarah Johnson</Text>
            <Text style={styles.profileEmail}>sarah.johnson@email.com</Text>
            <Text style={styles.profilePhone}>+1 (514) 555-0123</Text>
          </View>

          <View style={styles.membershipBadge}>
            <Icon name="award" type="Feather" size={16} color={Colors.primary} />
            <Text style={styles.membershipText}>Premium Client</Text>
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
            {clientStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '10' }]}>
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
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.optionsContainer}>
            {accountOptions.map((option) => (
              <ProfileOption key={option.id} option={option} />
            ))}
          </View>
        </Animated.View>

        {/* Client Preferences Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Shipping Preferences</Text>
          <View style={styles.optionsContainer}>
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
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.optionsContainer}>
            <ToggleOption
              title="Push Notifications"
              subtitle="Order updates & offers"
              icon="bell"
              color="#F59E0B"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
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
              title="Email Updates"
              subtitle="Order confirmations & receipts"
              icon="mail"
              color="#10B981"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
            <ToggleOption
              title="Location Services"
              subtitle="Track deliveries in real-time"
              icon="map-pin"
              color="#8B5CF6"
              value={locationEnabled}
              onValueChange={setLocationEnabled}
            />
          </View>
        </Animated.View>

        {/* More Options */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.optionsContainer}>
            {appOptions.map((option) => (
              <ProfileOption key={option.id} option={option} />
            ))}
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="log-out" type="Feather" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 28,
  },
  profileCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textSecondary,
  },
  profileImageStyle: {
    borderRadius: 40,
  },
  cameraButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
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
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  membershipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 1,
  },
  optionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  logoutButton: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#EF4444',
  },
});

export default ClientProfileScreen;