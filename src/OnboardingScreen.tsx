import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Easing, Dimensions, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Text } from './ui';
import { Colors } from './config/colors';
import { Fonts } from './config/fonts';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onGetStarted?: () => void;
}

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle?: string;
  specialWord?: string;
  specialWordIndex?: number;
  buttonText?: string;
  colors: string[];
  showButton?: boolean;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onGetStarted }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const colorTransition = useRef(new Animated.Value(0)).current;
  
  const logoOpacity = new Animated.Value(0);
  const logoTranslateY = new Animated.Value(-50);
  const textOpacity = new Animated.Value(0);
  const textTranslateY = new Animated.Value(30);
  const buttonOpacity = new Animated.Value(0);
  const buttonTranslateY = new Animated.Value(50);

  const slides: OnboardingSlide[] = [
    {
      id: 1,
      title: "Ship anything \nwith a single tap.",
      specialWord: "anything",
      specialWordIndex: 1,
      buttonText: "Let's Go",
      colors: ['#0AA5A8', '#4DC5C8', '#7B68EE', '#9370DB'],
      showButton: true,
    },
    {
      id: 2,
      title: "Track every parcel \nlive to your door.",
      specialWord: "live",
      specialWordIndex: 3,
      colors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
      showButton: false,
    },
    {
      id: 3,
      title: "Trucks, pallets, storage — \nall in one app.",
      specialWord: "all",
      specialWordIndex: 4,
      buttonText: "Get Started",
      colors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
      showButton: true,
    },
  ];

  const animateSlideEntrance = () => {
    // Reset animations
    logoOpacity.setValue(0);
    logoTranslateY.setValue(-50);
    textOpacity.setValue(0);
    textTranslateY.setValue(30);
    buttonOpacity.setValue(0);
    buttonTranslateY.setValue(50);

    // Staggered entrance animations
    Animated.sequence([
      // Logo animation
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Text animation (after 200ms delay)
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Button animation (after 300ms delay)
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(buttonTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const animateColorTransition = () => {
    Animated.timing(colorTransition, {
      toValue: currentSlide,
      duration: 800,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      useNativeDriver: false,
    }).start();
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      onGetStarted?.();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const goToSlide = (slideIndex: number) => {
    const direction = slideIndex > currentSlide ? -1 : 1;
    
    // Start color transition animation
    Animated.timing(colorTransition, {
      toValue: slideIndex,
      duration: 600,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      useNativeDriver: false,
    }).start();

    // Slide out current content
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: direction * width,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentSlide(slideIndex);
      slideAnim.setValue(-direction * width);
      
      // Slide in new content
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        animateSlideEntrance();
      });
    });
  };

  // Pan responder for swipe gestures
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      slideAnim.setValue(gestureState.dx);
    },
    onPanResponderRelease: (_, gestureState) => {
      const { dx, vx } = gestureState;
      const swipeThreshold = width * 0.25;
      const velocityThreshold = 0.5;

      if ((dx > swipeThreshold || vx > velocityThreshold) && currentSlide > 0) {
        // Swipe right - go to previous slide
        prevSlide();
      } else if ((dx < -swipeThreshold || vx < -velocityThreshold) && currentSlide < slides.length - 1) {
        // Swipe left - go to next slide
        nextSlide();
      } else {
        // Snap back to current position
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  useEffect(() => {
    animateSlideEntrance();
    animateColorTransition();
  }, [currentSlide]);

  const renderTitle = (title: string, specialWord?: string, specialWordIndex?: number) => {
    const isWhiteBackground = currentSlide > 0;
    const titleStyle = isWhiteBackground ? styles.titleDark : styles.title;
    const emphasisStyle = isWhiteBackground ? styles.titleEmphasisDark : styles.titleEmphasis;

    if (!specialWord || specialWordIndex === undefined) {
      return (
        <Text variant="h1" weight="bold" style={titleStyle}>
          {title}
        </Text>
      );
    }

    const words = title.split(' ');
    return (
      <Text variant="h1" weight="bold" style={titleStyle}>
        {words.map((word, index) => {
          const cleanWord = word.replace('\n', '');
          const isSpecialWord = cleanWord.toLowerCase() === specialWord.toLowerCase();
          const hasLineBreak = word.includes('\n');
          
          return (
            <React.Fragment key={index}>
              {hasLineBreak && word.startsWith('\n') && '\n'}
              <Text
                variant="h1"
                weight="bold"
                style={[
                  emphasisStyle,
                  isSpecialWord && styles.specialFont,
                  isSpecialWord && isWhiteBackground && styles.specialFontDark
                ]}
              >
                {cleanWord}
              </Text>
              {index < words.length - 1 && ' '}
              {hasLineBreak && word.endsWith('\n') && '\n'}
            </React.Fragment>
          );
        })}
      </Text>
    );
  };

  const currentSlideData = slides[currentSlide];
  
  // Create interpolated colors for smooth transitions
  const getInterpolatedColors = () => {
    const allColors = slides.map(slide => slide.colors);
    
    if (currentSlide === 0) {
      return allColors[0];
    }
    
    // For transitions, we'll use the current slide colors
    return allColors[currentSlide];
  };

  const interpolatedColors = getInterpolatedColors();

  return (
    <Animated.View style={styles.container}>
      {/* Base gradient background */}
      <LinearGradient
        colors={slides[0].colors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Animated white overlay for transition effect */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: '#FFFFFF',
            opacity: colorTransition.interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [0, 0, 1],
              extrapolate: 'clamp',
            }),
          },
        ]}
      />
      
      {/* Gradient fade-out effect */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: colorTransition.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 0.3, 0],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        <LinearGradient
          colors={slides[0].colors as [string, string, ...string[]]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.slideContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ translateY: logoTranslateY }],
            },
          ]}
        >
          <Image
            source={require('../assets/images/logo.png')}
            style={[styles.logo, currentSlide > 0 && styles.logoDark]}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Main Content */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          {renderTitle(
            currentSlideData.title,
            currentSlideData.specialWord,
            currentSlideData.specialWordIndex
          )}
        </Animated.View>

        {/* Button (conditionally rendered) */}
        {currentSlideData.showButton !== false && (
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: buttonOpacity,
                transform: [{ translateY: buttonTranslateY }],
              },
            ]}
          >
            <Button
              title={currentSlideData.buttonText ?? ''}
              onPress={nextSlide}
              variant={currentSlide > 0 ? "primary" : "primary"}
              style={currentSlide > 0 ? [styles.button, styles.buttonDark] : styles.button}
            />
          </Animated.View>
        )}

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                currentSlide > 0 && styles.progressDotDark,
                index === currentSlide && styles.progressDotActive,
                index === currentSlide && currentSlide > 0 && styles.progressDotActiveDark,
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: height * 0.15,
    paddingBottom: height * 0.1,
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    tintColor: Colors.white,
  },
  logoDark: {
    tintColor: Colors.primary,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 42,
    lineHeight: 50,
    textAlign: 'center',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  titleDark: {
    fontSize: 42,
    lineHeight: 50,
    textAlign: 'center',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  titleEmphasis: {
    fontSize: 42,
    fontStyle: 'italic',
    color: Colors.white,
  },
  titleEmphasisDark: {
    fontSize: 42,
    fontStyle: 'italic',
    color: Colors.primary,
  },
  //change font
  specialFont: {
    fontFamily: Fonts.PlayfairDisplay.Variable,
    fontStyle: 'normal', // Override the italic style
    fontSize: 48, // Slightly larger to make it more prominent
    letterSpacing: 1, // Add some letter spacing for elegance
  },
  specialFontDark: {
    color: Colors.primary,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: Colors.white,
    minHeight: 56,
  },
  buttonDark: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotDark: {
    backgroundColor: 'rgba(10, 165, 168, 0.3)',
  },
  progressDotActive: {
    backgroundColor: Colors.white,
    width: 24,
  },
  progressDotActiveDark: {
    backgroundColor: Colors.primary,
  },
});

export default OnboardingScreen; 