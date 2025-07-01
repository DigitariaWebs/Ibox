import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from 'react-native';
import { Button, Text, Icon } from '../../ui';
import { Colors } from '../../config/colors';
import { useSignUp } from '../../contexts/SignUpContext';
import { accountTypeSchema } from '../../validation/signUpSchemas';
import { useFonts } from 'expo-font';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface AccountTypeScreenProps {
  navigation: any;
}

const AccountTypeScreen: React.FC<AccountTypeScreenProps> = ({ navigation }) => {
  const { signUpData, updateSignUpData, setCurrentStep } = useSignUp();
  const [selectedType, setSelectedType] = useState<'customer' | 'transporter' | null>(
    signUpData.accountType || null
  );
  const [isValid, setIsValid] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Load custom fonts if needed
  const [fontsLoaded] = useFonts({
    // Add any custom fonts here if needed
  });

  useEffect(() => {
    // Fade in animation when component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (selectedType) {
      // Animate layout when selection changes
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      accountTypeSchema
        .isValid({ accountType: selectedType })
        .then(setIsValid);
    } else {
      setIsValid(false);
    }
  }, [selectedType]);

  const handleSelection = (type: 'customer' | 'transporter') => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (selectedType && isValid) {
      updateSignUpData({ accountType: selectedType });
      setCurrentStep(2);
      navigation.navigate('IdentityScreen');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" type="Feather" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 1 of 7</Text>
      </View>
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              What describes you best?
            </Text>
            <Text style={styles.subtitle}>
              Choose the option that best fits your needs and goals
            </Text>
          </View>

          {/* Selection Cards */}
          <View style={styles.selectionContainer}>
            <OptionCard
              type="customer"
              iconName="package"
              title="I'm a Customer"
              tagline="I need to ship items"
              longDescription="I need to send packages or items from one location to another. I'm looking for reliable transporters to handle my delivery needs."
              benefits={[
                'Find verified transporters near you',
                'Track your packages in real-time',
                'Get competitive pricing options',
              ]}
              selectedType={selectedType}
              onSelect={handleSelection}
            />

            <OptionCard
              type="transporter"
              iconName="truck"
              title="I'm a Transporter"
              tagline="I deliver packages"
              longDescription="I provide delivery services and want to connect with customers who need items transported. I'm looking to grow my business and find new opportunities."
              benefits={[
                'Find delivery jobs in your area',
                'Set your own schedule and pricing',
                'Get paid securely and reliably',
              ]}
              selectedType={selectedType}
              onSelect={handleSelection}
            />
          </View>
        </ScrollView>
        
        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            onPress={handleNext}
            variant="primary"
            disabled={!isValid}
            style={styles.nextButton}
            icon={<Icon name="arrow-right" type="Feather" size={20} color={Colors.white} />}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

// Helper component for benefit items
const BenefitItem = ({ icon, text, isSelected }: { icon: string, text: string, isSelected: boolean }) => (
  <View style={styles.benefitRow}>
    <Icon 
      name={icon} 
      type="Feather" 
      size={16} 
      color={isSelected ? Colors.white : Colors.primary} 
      style={styles.benefitIcon} 
    />
    <Text style={[
      styles.benefitText,
      isSelected && styles.selectedBenefitText
    ]}>
      {text}
    </Text>
  </View>
);

// NEW: Reusable OptionCard component for cleaner markup
const OptionCard = ({
  type,
  iconName,
  title,
  tagline,
  longDescription,
  benefits,
  selectedType,
  onSelect,
}: {
  type: 'customer' | 'transporter';
  iconName: string;
  title: string;
  tagline: string;
  longDescription: string;
  benefits: string[];
  selectedType: 'customer' | 'transporter' | null;
  onSelect: (t: 'customer' | 'transporter') => void;
}) => {
  const isSelected = selectedType === type;
  return (
    <TouchableOpacity
      style={[styles.selectionCard, isSelected && styles.selectedCard]}
      activeOpacity={0.8}
      onPress={() => onSelect(type)}
    >
      {/* First Row (icon + title + tagline) */}
      <View style={styles.cardRow}>
        <View style={[styles.cardIcon, isSelected && styles.selectedCardIcon]}>
          <Icon
            name={iconName}
            type="Feather"
            size={32}
            color={isSelected ? Colors.white : Colors.primary}
          />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={[styles.cardTitle, isSelected && styles.selectedCardTitle]}>{title}</Text>
          <Text style={[styles.cardTagline, isSelected && styles.selectedCardTagline]}>{tagline}</Text>
        </View>
      </View>

      {/* Expanded section visible only if selected */}
      {isSelected && (
        <>
          <Text style={[styles.cardDescription, styles.expandedDescription]}>{longDescription}</Text>
          <View style={styles.cardBenefits}>
            {benefits.map((b, idx) => (
              <BenefitItem key={idx} icon="check-circle" text={b} isSelected={isSelected} />
            ))}
          </View>
        </>
      )}

      {/* Checkmark */}
      {isSelected && (
        <View style={styles.checkmark}>
          <Icon name="check" type="Feather" size={20} color={Colors.white} />
        </View>
      )}
    </TouchableOpacity>
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
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: Colors.surfaceDark,
  },
  stepIndicator: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    color: Colors.textPrimary,
    marginBottom: 12,
    lineHeight: 38,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    lineHeight: 24,
    fontWeight: '500',
  },
  selectionContainer: {
    flex: 1,
    gap: 20,
  },
  selectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
    marginBottom: 16,
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(10, 165, 168, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  selectedCardIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    color: Colors.textPrimary,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  selectedCardTitle: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 15,
    color: Colors.white,
    lineHeight: 22,
    fontWeight: '400',
    marginBottom: 16,
  },
  selectedCardDescription: {
    color: Colors.white,
    fontWeight: '400',
  },
  cardBenefits: {
    marginTop: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIcon: {
    marginRight: 8,
  },
  benefitText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  selectedBenefitText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  nextButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  cardTagline: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  selectedCardTagline: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  expandedDescription: {
    marginBottom: 12,
  },
});

export default AccountTypeScreen;