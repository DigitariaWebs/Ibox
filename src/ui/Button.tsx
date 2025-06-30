import React, { useState } from 'react';
import { Pressable, Text, PressableProps, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  useSharedValue,
  interpolateColor,
  runOnJS,
  withSequence,
  withRepeat,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { Colors } from '../config/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  hapticFeedback?: boolean;
  pulseOnLoad?: boolean;
  glowEffect?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  hapticFeedback = true,
  pulseOnLoad = true,
  glowEffect = false,
  icon,
  onPress,
  style,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  // Animated values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const backgroundColor = useSharedValue(0);
  const borderRadius = useSharedValue(8);
  const loadingProgress = useSharedValue(0);

  // Haptic feedback function
  const triggerHaptic = async () => {
    if (hapticFeedback && !disabled && !loading) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        // Haptic feedback not supported on this device
        console.log('Haptic feedback not supported:', error);
      }
    }
  };

  // Press handlers with animations
  const handlePressIn = () => {
    if (disabled || loading) return;
    
    setIsPressed(true);
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
    
    backgroundColor.value = withTiming(1, { duration: 150 });
    borderRadius.value = withSpring(12, {
      damping: 15,
      stiffness: 200,
    });
    
    runOnJS(triggerHaptic)();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
    
    backgroundColor.value = withTiming(0, { duration: 200 });
    borderRadius.value = withSpring(8, {
      damping: 15,
      stiffness: 200,
    });
  };

  const handlePress = (event: any) => {
    if (disabled || loading) return;
    
    // Success animation
    scale.value = withSequence(
      withSpring(1.05, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    
    onPress?.(event);
  };

  // Loading animation effect
  React.useEffect(() => {
    if (loading && pulseOnLoad) {
      loadingProgress.value = withRepeat(
        withTiming(1, { duration: 1000 }),
        -1,
        true
      );
    } else {
      loadingProgress.value = withTiming(0, { duration: 300 });
    }
  }, [loading, pulseOnLoad]);

  // Disabled animation effect
  React.useEffect(() => {
    opacity.value = withTiming(disabled ? 0.5 : 1, { duration: 300 });
  }, [disabled]);

  // Main animated style
  const animatedStyle = useAnimatedStyle(() => {
    const scaleInterpolation = interpolate(
      loadingProgress.value,
      [0, 0.5, 1],
      [scale.value, scale.value * 0.98, scale.value],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { scale: scaleInterpolation },
      ],
      opacity: opacity.value,
      borderRadius: borderRadius.value,
    };
  });

  // Background color animation
  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    let primaryColor: string = Colors.primary;
    let pressedColor: string = '#1D4ED8'; // Darker blue
    
    switch (variant) {
      case 'primary':
        primaryColor = Colors.primary;
        pressedColor = '#1D4ED8';
        break;
      case 'secondary':
        primaryColor = Colors.secondary;
        pressedColor = '#059669';
        break;
      case 'outline':
      case 'ghost':
        primaryColor = 'transparent';
        pressedColor = 'rgba(37, 99, 235, 0.1)';
        break;
    }

    return {
      backgroundColor: interpolateColor(
        backgroundColor.value,
        [0, 1],
        [primaryColor, pressedColor]
      ),
    };
  });

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderRadius: 24,
      backgroundColor: variant === 'primary' ? Colors.primary : '#fff',
      borderWidth: variant === 'outline' ? 2 : 0,
      borderColor: variant === 'outline' ? Colors.primary : 'transparent',
      paddingHorizontal: 24,
      paddingVertical: 16,
      minHeight: 48,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    };
    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '700',
      fontSize: 16,
      color: variant === 'primary' ? '#fff' : Colors.primary,
      textAlign: 'center',
    };
    return baseStyle;
  };

  const LoadingSpinner = () => (
    <MotiView
      from={{ rotate: '0deg' }}
      animate={{ rotate: '360deg' }}
      transition={{
        type: 'timing',
        duration: 1000,
        loop: true,
      }}
      style={{ marginRight: 8 }}
    >
      <ActivityIndicator 
        size="small" 
        color={variant === 'outline' || variant === 'ghost' ? Colors.primary : '#FFFFFF'} 
      />
    </MotiView>
  );

  const ButtonContent = () => (
    <>
      {icon && !loading && <View style={{ marginRight: 8 }}>{icon}</View>}
      {loading && <LoadingSpinner />}
      <Text style={getTextStyle()}>
        {loading ? 'Loading...' : title}
      </Text>
    </>
  );

  // Glow effect wrapper
  if (glowEffect && !disabled) {
    return (
      <MotiView
        from={{ 
          shadowOpacity: 0,
          shadowRadius: 0,
        }}
        animate={{ 
          shadowOpacity: isPressed ? 0.3 : 0.15,
          shadowRadius: isPressed ? 8 : 4,
        }}
        transition={{
          type: 'timing',
          duration: 200,
        }}
        style={{
          shadowColor: variant === 'primary' ? Colors.primary : Colors.secondary,
          shadowOffset: { width: 0, height: 2 },
          elevation: 4,
        }}
      >
        <AnimatedPressable
          style={[getButtonStyle(), backgroundAnimatedStyle, animatedStyle, style]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={disabled || loading}
          {...props}
        >
          <ButtonContent />
        </AnimatedPressable>
      </MotiView>
    );
  }

  return (
    <AnimatedPressable
      style={[getButtonStyle(), backgroundAnimatedStyle, animatedStyle, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || loading}
      {...props}
    >
      <ButtonContent />
    </AnimatedPressable>
  );
}; 