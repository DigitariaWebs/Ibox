import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../config/colors';

interface TopNavigationProps {
  onMenuPress: () => void;
  onNotificationPress: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  onMenuPress,
  onNotificationPress,
  showBackButton = false,
  onBackPress,
}) => {
  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent 
      />
      <View style={styles.container}>
        <View style={styles.navigationBar}>
          {/* Left - Back Button or Hamburger Menu */}
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={showBackButton ? onBackPress : onMenuPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconBackground}>
              <Ionicons 
                name={showBackButton ? "arrow-back" : "menu"} 
                size={24} 
                color={Colors.textPrimary} 
              />
            </View>
          </TouchableOpacity>

          {/* Center - Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Right - Notifications */}
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconBackground}>
              <Ionicons 
                name="notifications-outline" 
                size={22} 
                color={Colors.primary} 
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  logoImage: {
    height: 40,
    width: 120,
  },
  iconBackground: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default TopNavigation;