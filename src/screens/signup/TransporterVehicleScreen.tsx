import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { Button, Text, Icon, Input } from '../../ui';
import { Colors } from '../../config/colors';
import { useSignUp } from '../../contexts/SignUpContext';
import { transporterVehicleSchema } from '../../validation/signUpSchemas';
import * as ImagePicker from 'expo-image-picker';

interface TransporterVehicleScreenProps {
  navigation: any;
}

interface FormData {
  vehicleType: string;
  plate: string;
  payloadKg: string;
  vehiclePhotos: string[];
}

const VEHICLE_TYPES = [
  { id: 'van', label: 'Van', icon: 'truck', description: 'Medium packages, furniture' },
  { id: 'truck', label: 'Truck', icon: 'truck', description: 'Large items, bulk deliveries' },
  { id: 'car', label: 'Car', icon: 'navigation', description: 'Small packages, documents' },
  { id: 'motorcycle', label: 'Motorcycle', icon: 'zap', description: 'Express deliveries' },
  { id: 'bicycle', label: 'Bicycle', icon: 'activity', description: 'Local, eco-friendly' },
];

const TransporterVehicleScreen: React.FC<TransporterVehicleScreenProps> = ({ navigation }) => {
  const { signUpData, updateSignUpData, setCurrentStep } = useSignUp();
  
  const [formData, setFormData] = useState<FormData>({
    vehicleType: signUpData.vehicleType || '',
    plate: signUpData.plate || '',
    payloadKg: signUpData.payloadKg?.toString() || '',
    vehiclePhotos: signUpData.vehiclePhotos || [],
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = async () => {
    try {
      const validationData = {
        ...formData,
        payloadKg: parseFloat(formData.payloadKg) || 0,
      };
      await transporterVehicleSchema.validate(validationData, { abortEarly: false });
      setErrors({});
      setIsValid(true);
    } catch (validationErrors: any) {
      const errorObj: Partial<FormData> = {};
      validationErrors.inner?.forEach((error: any) => {
        errorObj[error.path as keyof FormData] = error.message;
      });
      setErrors(errorObj);
      setIsValid(false);
    }
  };

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (isValid) {
      updateSignUpData({
        vehicleType: formData.vehicleType,
        plate: formData.plate,
        payloadKg: parseFloat(formData.payloadKg),
        vehiclePhotos: formData.vehiclePhotos,
      });
      setCurrentStep(6);
      navigation.navigate('TransporterComplianceScreen');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera roll permission is required to add photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhotos = [...formData.vehiclePhotos, result.assets[0].uri];
        updateField('vehiclePhotos', newPhotos);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.vehiclePhotos.filter((_, i) => i !== index);
    updateField('vehiclePhotos', newPhotos);
  };

  const getVehicleTypeInfo = (typeId: string) => {
    return VEHICLE_TYPES.find(type => type.id === typeId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" type="Feather" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>Step 4 of 7</Text>
      </View>
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                Tell us about your vehicle
              </Text>
              <Text style={styles.subtitle}>
                Vehicle information helps customers choose the right transporter for their needs
              </Text>
            </View>
            
            {/* Vehicle Type Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="truck" type="Feather" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Vehicle Type</Text>
              </View>
              
              <View style={styles.vehicleGrid}>
                {VEHICLE_TYPES.map((vehicle) => (
                  <TouchableOpacity
                    key={vehicle.id}
                    style={[
                      styles.vehicleCard,
                      formData.vehicleType === vehicle.id && styles.vehicleCardSelected
                    ]}
                    onPress={() => updateField('vehicleType', vehicle.id)}
                    activeOpacity={0.8}
                  >
                    <Icon 
                      name={vehicle.icon} 
                      type="Feather" 
                      size={24} 
                      color={formData.vehicleType === vehicle.id ? Colors.white : Colors.primary} 
                    />
                    <Text style={[
                      styles.vehicleLabel,
                      formData.vehicleType === vehicle.id && styles.vehicleLabelSelected
                    ]}>
                      {vehicle.label}
                    </Text>
                    <Text style={[
                      styles.vehicleDescription,
                      formData.vehicleType === vehicle.id && styles.vehicleDescriptionSelected
                    ]}>
                      {vehicle.description}
                    </Text>
                    {formData.vehicleType === vehicle.id && (
                      <View style={styles.vehicleCheck}>
                        <Icon name="check" type="Feather" size={16} color={Colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {errors.vehicleType && (
                <Text style={styles.errorText}>{errors.vehicleType}</Text>
              )}
            </View>
            
            {/* Vehicle Details Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="info" type="Feather" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Vehicle Details</Text>
              </View>
              
              <View style={styles.sectionContent}>
                <Input
                  placeholder="License plate number"
                  value={formData.plate}
                  onChangeText={(value) => updateField('plate', value.toUpperCase())}
                  error={errors.plate}
                  leftIcon={<Icon name="hash" type="Feather" size={20} color={Colors.textSecondary} />}
                  style={styles.inputField}
                />
                
                <Input
                  placeholder="Payload capacity (kg)"
                  value={formData.payloadKg}
                  onChangeText={(value) => updateField('payloadKg', value)}
                  keyboardType="numeric"
                  error={errors.payloadKg}
                  leftIcon={<Icon name="package" type="Feather" size={20} color={Colors.textSecondary} />}
                  style={styles.inputField}
                />
              </View>
            </View>
            
            {/* Photos Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="camera" type="Feather" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Vehicle Photos</Text>
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Recommended</Text>
                </View>
              </View>
              
              <View style={styles.sectionContent}>
                <View style={styles.photosContainer}>
                  {formData.vehiclePhotos.map((photo, index) => (
                    <View key={index} style={styles.photoItem}>
                      <Image source={{ uri: photo }} style={styles.photoImage} />
                      <TouchableOpacity 
                        style={styles.removePhotoButton}
                        onPress={() => removePhoto(index)}
                      >
                        <Icon name="x" type="Feather" size={16} color={Colors.white} />
                      </TouchableOpacity>
                    </View>
                  ))}
                  
                  {formData.vehiclePhotos.length < 3 && (
                    <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                      <Icon name="plus" type="Feather" size={24} color={Colors.primary} />
                      <Text style={styles.addPhotoText}>Add Photo</Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                <View style={styles.photoHint}>
                  <Icon name="lightbulb" type="Feather" size={16} color={Colors.warning} />
                  <Text style={styles.hintText}>
                    Photos of your vehicle help build trust with customers. Include exterior and cargo area views.
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Preview Card */}
            {formData.vehicleType && (
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <Icon name="eye" type="Feather" size={18} color={Colors.primary} />
                  <Text style={styles.previewTitle}>How customers will see your vehicle</Text>
                </View>
                <View style={styles.previewContent}>
                  <View style={styles.previewVehicle}>
                    <Icon 
                      name={getVehicleTypeInfo(formData.vehicleType)?.icon || 'truck'} 
                      type="Feather" 
                      size={24} 
                      color={Colors.primary} 
                    />
                    <View style={styles.previewInfo}>
                      <Text style={styles.previewVehicleType}>
                        {getVehicleTypeInfo(formData.vehicleType)?.label}
                      </Text>
                      <Text style={styles.previewDetails}>
                        {formData.plate && `${formData.plate} • `}
                        {formData.payloadKg && `${formData.payloadKg}kg capacity`}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
        
        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Continue to compliance"
            onPress={handleNext}
            variant="primary"
            disabled={!isValid}
            style={styles.nextButton}
            icon={<Icon name="arrow-right" type="Feather" size={20} color={Colors.white} />}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  },
  stepIndicator: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: 12,
    lineHeight: 34,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  recommendedBadge: {
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '600',
  },
  sectionContent: {
    gap: 16,
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vehicleCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    position: 'relative',
  },
  vehicleCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  vehicleLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  vehicleLabelSelected: {
    color: Colors.white,
  },
  vehicleDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  vehicleDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  vehicleCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputField: {
    marginBottom: 0,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoItem: {
    position: 'relative',
  },
  photoImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    width: 100,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '10',
  },
  addPhotoText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 4,
  },
  photoHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.warning + '10',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  previewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 8,
  },
  previewContent: {
    gap: 8,
  },
  previewVehicle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewInfo: {
    flex: 1,
  },
  previewVehicleType: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  previewDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  nextButton: {
    width: '100%',
  },
});

export default TransporterVehicleScreen;