import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
  FadeIn,
  FadeInLeft,
  SlideInLeft,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { Colors } from '../config/colors';
import { useAuth } from '../contexts/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.8;

interface SidebarMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  activeScreen?: string;
}

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconFamily: 'Ionicons' | 'MaterialIcons' | 'Feather';
  screen: string;
  color: string;
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    title: 'Home',
    subtitle: 'Dashboard',
    icon: 'home-outline',
    iconFamily: 'Ionicons',
    screen: 'HomeScreen',
    color: Colors.primary,
  },
  {
    id: '2',
    title: 'Orders',
    subtitle: 'Order history',
    icon: 'receipt-outline',
    iconFamily: 'Ionicons',
    screen: 'OrderHistory',
    color: Colors.primary,
    badge: '3',
  },
  {
    id: '3',
    title: 'Services',
    subtitle: 'Delivery options',
    icon: 'cube-outline',
    iconFamily: 'Ionicons',
    screen: 'Services',
    color: Colors.primary,
  },
  {
    id: '4',
    title: 'Payments',
    subtitle: 'Wallet & cards',
    icon: 'card-outline',
    iconFamily: 'Ionicons',
    screen: 'PaymentMethods',
    color: Colors.primary,
  },
  {
    id: '5',
    title: 'Addresses',
    subtitle: 'Saved locations',
    icon: 'location-outline',
    iconFamily: 'Ionicons',
    screen: 'Addresses',
    color: Colors.primary,
  },
  {
    id: '6',
    title: 'Support',
    subtitle: 'Help center',
    icon: 'help-circle-outline',
    iconFamily: 'Ionicons',
    screen: 'HelpSupport',
    color: Colors.primary,
  },
  {
    id: '7',
    title: 'Settings',
    subtitle: 'Preferences',
    icon: 'settings-outline',
    iconFamily: 'Ionicons',
    screen: 'Settings',
    color: Colors.primary,
  },
];

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  visible,
  onClose,
  onNavigate,
  activeScreen = 'HomeScreen',
}) => {
  const { logout } = useAuth();
  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const backdropOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 300 });
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      translateX.value = withTiming(-SIDEBAR_WIDTH, { duration: 250 });
    }
  }, [visible]);

  const sidebarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  const renderIcon = (item: MenuItem, isActive: boolean) => {
    const iconColor = isActive ? Colors.white : Colors.primary;
    const iconProps = {
      name: item.icon as any,
      size: 22,
      color: iconColor,
    };

    switch (item.iconFamily) {
      case 'Ionicons':
        return <Ionicons {...iconProps} />;
      case 'MaterialIcons':
        return <MaterialIcons {...iconProps} />;
      case 'Feather':
        return <Feather {...iconProps} />;
      default:
        return <Ionicons {...iconProps} />;
    }
  };

  const handleMenuItemPress = (screen: string) => {
    onNavigate(screen);
    onClose();
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
              onClose(); // Close sidebar first
              await logout();
              console.log('✅ User logged out successfully from sidebar');
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

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, sidebarAnimatedStyle]}>
        {/* Header */}
        <Animated.View 
          style={styles.header}
          entering={FadeIn.delay(100)}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@ibox.com</Text>
            </View>
          </View>
          
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Menu Items */}
        <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => {
            const isActive = activeScreen === item.screen;
            
            return (
              <Animated.View
                key={item.id}
                entering={FadeIn.delay(index * 30 + 200)}
              >
                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    isActive && styles.activeMenuItem
                  ]}
                  onPress={() => handleMenuItemPress(item.screen)}
                  activeOpacity={0.7}
                  underlayColor="#F1F5F9"
                >
                  <View style={[
                    styles.iconWrapper,
                    isActive && styles.activeIconWrapper
                  ]}>
                    {renderIcon(item, isActive)}
                  </View>
                  
                  <View style={styles.menuContent}>
                    <Text style={[
                      styles.menuTitle,
                      isActive && styles.activeMenuTitle
                    ]}>
                      {item.title}
                    </Text>
                  </View>
                  
                  {item.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                  
                  <Ionicons 
                    name="chevron-forward" 
                    size={18} 
                    color={isActive ? Colors.white : Colors.textTertiary} 
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
          
          {/* Divider */}
          <View style={styles.divider} />
          
          {/* Logout */}
          <Animated.View entering={FadeIn.delay(500)}>
            <TouchableOpacity 
              style={styles.logoutButton} 
              activeOpacity={0.7}
              onPress={handleLogout}
            >
              <View style={[styles.iconWrapper, styles.logoutIconWrapper]}>
                <Ionicons name="log-out-outline" size={22} color={Colors.error} />
              </View>
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>iBox v1.0.0</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: Colors.background,
    shadowColor: Colors.black,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderBottomWidth: 0,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    marginVertical: 3,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  activeMenuItem: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  activeMenuTitle: {
    color: Colors.white,
  },
  badge: {
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    minWidth: 24,
    alignItems: 'center',
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
    marginHorizontal: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 16,
    letterSpacing: -0.2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 0,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  logoutIconWrapper: {
    backgroundColor: '#FECACA',
  },
});

export default SidebarMenu;