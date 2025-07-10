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
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Text, Icon, Input, Button } from '../ui';
import { Colors } from '../config/colors';
import { RootState, setUserData } from '../store/store';

interface PersonalInfoScreenProps {
  navigation: any;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  dateOfBirth: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  dateOfBirth?: string;
}

const PersonalInfoScreen: React.FC<PersonalInfoScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.userData);
  const accountType = useSelector((state: RootState) => state.user.accountType);

  const [formData, setFormData] = useState<FormData>({
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    email: userData.email || '',
    phone: '+1 (514) 555-0123',
    address: '1234 Rue Sainte-Catherine',
    city: 'Montréal',
    postalCode: 'H3G 1M8',
    dateOfBirth: '1990-05-15',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Format de téléphone invalide';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    // Postal code validation (Canadian format)
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Le code postal est requis';
    } else if (!postalCodeRegex.test(formData.postalCode)) {
      newErrors.postalCode = 'Format de code postal invalide (ex: H3G 1M8)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update Redux store with new user data
      dispatch(setUserData({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        loginMethod: userData.loginMethod,
        accountType: accountType,
      }));

      setHasChanges(false);
      setIsLoading(false);

      Alert.alert(
        'Succès',
        'Vos informations ont été mises à jour avec succès!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sauvegarde');
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Annuler les modifications',
        'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir annuler?',
        [
          { text: 'Continuer l\'édition', style: 'cancel' },
          { text: 'Annuler', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <Icon name="arrow-left" type="Feather" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Informations personnelles</Text>
          <TouchableOpacity 
            style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={!hasChanges || isLoading}
          >
            <Text style={[styles.saveButtonText, !hasChanges && styles.saveButtonTextDisabled]}>
              Sauvegarder
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Picture Section */}
          <Animated.View
            style={[
              styles.profileSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.profileImageContainer}>
              <ImageBackground
                source={{ uri: 'https://i.pravatar.cc/120?img=2' }}
                style={styles.profileImage}
                imageStyle={styles.profileImageStyle}
              >
                <TouchableOpacity style={styles.editImageButton}>
                  <Icon name="camera" type="Feather" size={18} color={Colors.white} />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <Text style={styles.profileImageText}>Modifier la photo</Text>
          </Animated.View>

          {/* Personal Information Form */}
          <Animated.View
            style={[
              styles.formSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Informations de base</Text>
            
            <View style={styles.formRow}>
              <View style={styles.formHalf}>
                <Input
                  label="Prénom"
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  error={errors.firstName}
                  placeholder="Votre prénom"
                  leftIcon={<Icon name="user" type="Feather" size={20} color={Colors.textSecondary} />}
                />
              </View>
              <View style={styles.formHalf}>
                <Input
                  label="Nom"
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  error={errors.lastName}
                  placeholder="Votre nom"
                />
              </View>
            </View>

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              error={errors.email}
              placeholder="votre.email@exemple.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Icon name="mail" type="Feather" size={20} color={Colors.textSecondary} />}
            />

            <Input
              label="Téléphone"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              error={errors.phone}
              placeholder="+1 (514) 555-0123"
              keyboardType="phone-pad"
              leftIcon={<Icon name="phone" type="Feather" size={20} color={Colors.textSecondary} />}
            />

            <Input
              label="Date de naissance"
              value={formData.dateOfBirth}
              onChangeText={(value) => handleInputChange('dateOfBirth', value)}
              error={errors.dateOfBirth}
              placeholder="YYYY-MM-DD"
              leftIcon={<Icon name="calendar" type="Feather" size={20} color={Colors.textSecondary} />}
            />
          </Animated.View>

          {/* Address Information */}
          <Animated.View
            style={[
              styles.formSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Adresse</Text>
            
            <Input
              label="Adresse"
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              error={errors.address}
              placeholder="1234 Rue de la Montagne"
              leftIcon={<Icon name="map-pin" type="Feather" size={20} color={Colors.textSecondary} />}
            />

            <View style={styles.formRow}>
              <View style={styles.formThird}>
                <Input
                  label="Ville"
                  value={formData.city}
                  onChangeText={(value) => handleInputChange('city', value)}
                  error={errors.city}
                  placeholder="Montréal"
                />
              </View>
              <View style={styles.formThird}>
                <Input
                  label="Code postal"
                  value={formData.postalCode}
                  onChangeText={(value) => handleInputChange('postalCode', value)}
                  error={errors.postalCode}
                  placeholder="H3G 1M8"
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </Animated.View>

          {/* Save Button */}
          <Animated.View
            style={[
              styles.buttonSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Button
              title={isLoading ? "Sauvegarde..." : "Sauvegarder les modifications"}
              onPress={handleSave}
              variant="primary"
              disabled={!hasChanges || isLoading}
              loading={isLoading}
              icon={<Icon name="save" type="Feather" size={20} color={Colors.white} />}
              style={[styles.saveButtonLarge, (!hasChanges || isLoading) && styles.saveButtonDisabledLarge]}
            />
            
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.textSecondary,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  saveButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.textSecondary,
  },
  profileImageStyle: {
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImageText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formHalf: {
    flex: 1,
  },
  formThird: {
    flex: 1,
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: Colors.white,
    marginBottom: 20,
  },
  saveButtonLarge: {
    marginBottom: 12,
  },
  saveButtonDisabledLarge: {
    backgroundColor: Colors.textSecondary,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});

export default PersonalInfoScreen; 