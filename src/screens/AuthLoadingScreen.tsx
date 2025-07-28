import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  FadeIn,
} from 'react-native-reanimated';
import { Colors } from '../config/colors';
import { Text } from '../ui';

const AuthLoadingScreen: React.FC = () => {
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Initial logo animation
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, { duration: 800 });

    // Continuous pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: logoScale.value },
      ],
      opacity: logoOpacity.value,
    };
  });

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: pulseScale.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <Animated.View style={styles.content} entering={FadeIn.duration(500)}>
        {/* Logo Container */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Animated.View style={[styles.logoBackground, pulseAnimatedStyle]} />
          <View style={styles.logo}>
            <Text style={styles.logoText}>iBox</Text>
          </View>
        </Animated.View>

        {/* Loading Text */}
        <Animated.View 
          style={styles.loadingTextContainer}
          entering={FadeIn.delay(1000).duration(600)}
        >
          <Text style={styles.loadingText}>Loading your experience...</Text>
          <View style={styles.dotsContainer}>
            <Animated.View style={[styles.dot, { animationDelay: '0ms' }]} />
            <Animated.View style={[styles.dot, { animationDelay: '200ms' }]} />
            <Animated.View style={[styles.dot, { animationDelay: '400ms' }]} />
          </View>
        </Animated.View>
      </Animated.View>

      {/* Bottom Branding */}
      <Animated.View 
        style={styles.bottomBranding}
        entering={FadeIn.delay(1500).duration(600)}
      >
        <Text style={styles.brandingText}>Smart Transportation Platform</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  logoBackground: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white + '20',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -1,
  },
  loadingTextContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.white,
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.9,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    opacity: 0.6,
    marginHorizontal: 4, // Add horizontal margin instead of gap
  },
  bottomBranding: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  brandingText: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
});

export default AuthLoadingScreen; 