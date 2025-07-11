import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  ImageBackground,
  Platform
} from 'react-native';
import { useSelector } from 'react-redux';
import { Text, Icon } from './ui';
import { Colors } from './config/colors';
import { RootState } from './store/store';
import HomeMap from './components/HomeMap';

const { width, height } = Dimensions.get('window');

interface UserState {
  accountType: 'business' | 'personal';
  userData: {
    firstName?: string;
  };
}

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Get account type from Redux store
  const accountType = useSelector((state: RootState & { user: UserState }) => state.user.accountType);
  const userData = useSelector((state: RootState & { user: UserState }) => state.user.userData);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent 
      />
      
      {/* Map Section - Full Screen */}
      <View style={styles.mapWrapper}>
        <HomeMap style={styles.map} />
      </View>

      {/* Header Overlay */}
      <SafeAreaView pointerEvents="box-none" style={styles.headerOverlay}>
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={[styles.headerContent, { paddingVertical: 8 }]}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
                <ImageBackground
                  source={{ uri: 'https://i.pravatar.cc/100?img=1' }}
                  style={styles.profileImage}
                  imageStyle={styles.profileImageStyle}
                >
                  <Icon name="user" size={24} color={Colors.white} />
                </ImageBackground>
              </TouchableOpacity>
              <View style={{ width: 10 }} />
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.userName}>{getDisplayName()}! 👋</Text> 
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notificationButton}>
                <Icon name="bell" size={24} color={Colors.textSecondary} />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
               
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  map: {
    flex: 1,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 16,
    marginTop: Platform.OS === 'ios' ? 14 : 40,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    width: 45,
    height: 45,
    borderRadius: 30,
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
    width: 45,
    height: 45,
    borderRadius: 30,
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
});

export default HomeScreen; 