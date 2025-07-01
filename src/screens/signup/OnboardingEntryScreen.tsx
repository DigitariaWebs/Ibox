import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Text, Icon } from '../../ui';
import { Colors } from '../../config/colors';
import { useSignUp } from '../../contexts/SignUpContext';

interface OnboardingEntryScreenProps {
  navigation: any;
}

const OnboardingEntryScreen: React.FC<OnboardingEntryScreenProps> = ({ navigation }) => {
  const { setCurrentStep } = useSignUp();

  const handleGetStarted = () => {
    setCurrentStep(1);
    navigation.navigate('AccountTypeScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={[Colors.primary, Colors.secondary, Colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.content}>
        {/* Icon Container */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon name="box" type="Feather" size={48} color={Colors.white} />
          </View>
        </View>
        
        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text variant="h1" weight="bold" style={styles.title}>
            Create your iBox account
          </Text>
          
          <Text style={styles.subtitle}>
            It only takes a minute.
          </Text>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Icon name="check-circle" type="Feather" size={20} color={Colors.white} />
              <Text style={styles.featureText}>Secure and encrypted</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="check-circle" type="Feather" size={20} color={Colors.white} />
              <Text style={styles.featureText}>Fast setup process</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="check-circle" type="Feather" size={20} color={Colors.white} />
              <Text style={styles.featureText}>Join thousands of users</Text>
            </View>
          </View>
        </View>
        
        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Let's start"
            onPress={handleGetStarted}
            variant="secondary"
            style={styles.startButton}
            icon={<Icon name="arrow-right" type="Feather" size={20} color={Colors.primary} />}
          />
          
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
              Sign in
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
  },
  featureList: {
    alignItems: 'flex-start',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 20,
  },
  startButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  linkText: {
    color: Colors.white,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default OnboardingEntryScreen;