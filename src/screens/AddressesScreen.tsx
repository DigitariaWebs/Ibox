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
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, Icon, Input, Button } from '../ui';
import { Colors } from '../config/colors';

interface AddressesScreenProps {
  navigation: any;
}

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

interface AddressForm {
  label: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  type: 'home' | 'work' | 'other';
}

interface FormErrors {
  label?: string;
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}

const AddressesScreen: React.FC<AddressesScreenProps> = ({ navigation }) => {
  // Mock addresses data
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Domicile',
      street: '1234 Rue Sainte-Catherine',
      city: 'Montréal',
      province: 'QC',
      postalCode: 'H3G 1M8',
      country: 'Canada',
      isDefault: true,
      type: 'home',
    },
    {
      id: '2',
      label: 'Bureau',
      street: '5678 Boulevard Saint-Laurent',
      city: 'Montréal',
      province: 'QC',
      postalCode: 'H2T 1S1',
      country: 'Canada',
      isDefault: false,
      type: 'work',
    },
    {
      id: '3',
      label: 'Entrepôt',
      street: '9876 Avenue du Parc',
      city: 'Laval',
      province: 'QC',
      postalCode: 'H7N 2K5',
      country: 'Canada',
      isDefault: false,
      type: 'other',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressForm>({
    label: '',
    street: '',
    city: 'Montréal',
    province: 'QC',
    postalCode: '',
    country: 'Canada',
    type: 'home',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const addressTypes = [
    { key: 'home', label: 'Domicile', icon: 'home', color: '#0AA5A8' },
    { key: 'work', label: 'Bureau', icon: 'briefcase', color: '#3B82F6' },
    { key: 'other', label: 'Autre', icon: 'map-pin', color: '#8B5CF6' },
  ];

  const getAddressTypeInfo = (type: string) => {
    return addressTypes.find(t => t.key === type) || addressTypes[2];
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.label.trim()) {
      newErrors.label = 'Le libellé est requis';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'L\'adresse est requise';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    if (!formData.province.trim()) {
      newErrors.province = 'La province est requise';
    }

    // Canadian postal code validation
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Le code postal est requis';
    } else if (!postalCodeRegex.test(formData.postalCode)) {
      newErrors.postalCode = 'Format invalide (ex: H3G 1M8)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AddressForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      label: '',
      street: '',
      city: 'Montréal',
      province: 'QC',
      postalCode: '',
      country: 'Canada',
      type: 'home',
    });
    setErrors({});
    setEditingAddress(null);
  };

  const handleAddAddress = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditAddress = (address: Address) => {
    setFormData({
      label: address.label,
      street: address.street,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      country: address.country,
      type: address.type,
    });
    setEditingAddress(address);
    setShowAddModal(true);
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingAddress) {
        // Update existing address
        setAddresses(prev => prev.map(addr => 
          addr.id === editingAddress.id 
            ? { ...addr, ...formData }
            : addr
        ));
      } else {
        // Add new address
        const newAddress: Address = {
          id: Date.now().toString(),
          ...formData,
          isDefault: addresses.length === 0, // First address is default
        };
        setAddresses(prev => [...prev, newAddress]);
      }

      setIsLoading(false);
      setShowAddModal(false);
      resetForm();

      Alert.alert(
        'Succès',
        editingAddress ? 'Adresse modifiée avec succès!' : 'Adresse ajoutée avec succès!'
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sauvegarde');
    }
  };

  const handleDeleteAddress = (address: Address) => {
    Alert.alert(
      'Supprimer l\'adresse',
      `Êtes-vous sûr de vouloir supprimer "${address.label}"?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setAddresses(prev => {
              const filtered = prev.filter(addr => addr.id !== address.id);
              // If we deleted the default address, make the first one default
              if (address.isDefault && filtered.length > 0) {
                filtered[0].isDefault = true;
              }
              return filtered;
            });
          },
        },
      ]
    );
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId,
    })));
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const AddressCard = ({ address }: { address: Address }) => {
    const typeInfo = getAddressTypeInfo(address.type);
    
    return (
      <View style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <View style={styles.addressTypeInfo}>
            <View style={[styles.addressTypeIcon, { backgroundColor: typeInfo.color + '15' }]}>
              <Icon name={typeInfo.icon as any} type="Feather" size={18} color={typeInfo.color} />
            </View>
            <View style={styles.addressLabelContainer}>
              <Text style={styles.addressLabel}>{address.label}</Text>
              {address.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Principal</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.addressActions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleEditAddress(address)}
            >
              <Icon name="edit-2" type="Feather" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleDeleteAddress(address)}
            >
              <Icon name="trash-2" type="Feather" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.addressContent}>
          <Text style={styles.addressStreet}>{address.street}</Text>
          <Text style={styles.addressDetails}>
            {address.city}, {address.province} {address.postalCode}
          </Text>
          <Text style={styles.addressCountry}>{address.country}</Text>
        </View>
        
        {!address.isDefault && (
          <TouchableOpacity 
            style={styles.setDefaultButton}
            onPress={() => handleSetDefault(address.id)}
          >
            <Icon name="star" type="Feather" size={14} color={Colors.primary} />
            <Text style={styles.setDefaultText}>Définir comme principal</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="Feather" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes adresses</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
          <Icon name="plus" type="Feather" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Address Count */}
        <Animated.View
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.statsCard}>
            <Icon name="map-pin" type="Feather" size={24} color={Colors.primary} />
            <Text style={styles.statsNumber}>{addresses.length}</Text>
            <Text style={styles.statsLabel}>
              {addresses.length === 1 ? 'adresse enregistrée' : 'adresses enregistrées'}
            </Text>
          </View>
        </Animated.View>

        {/* Addresses List */}
        <Animated.View
          style={[
            styles.addressesList,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {addresses.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="map-pin" type="Feather" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>Aucune adresse</Text>
              <Text style={styles.emptyStateText}>
                Ajoutez votre première adresse pour faciliter vos livraisons
              </Text>
              <Button
                title="Ajouter une adresse"
                onPress={handleAddAddress}
                variant="primary"
                icon={<Icon name="plus" type="Feather" size={20} color={Colors.white} />}
                style={styles.emptyStateButton}
              />
            </View>
          ) : (
            addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))
          )}
        </Animated.View>

        {/* Add Address Button */}
        {addresses.length > 0 && (
          <Animated.View
            style={[
              styles.addSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Button
              title="Ajouter une nouvelle adresse"
              onPress={handleAddAddress}
              variant="outline"
              icon={<Icon name="plus" type="Feather" size={20} color={Colors.primary} />}
              style={styles.addAddressButton}
            />
          </Animated.View>
        )}
      </ScrollView>

      {/* Add/Edit Address Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView 
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.modalBackButton} onPress={handleCloseModal}>
                <Icon name="x" type="Feather" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
              </Text>
              <TouchableOpacity 
                style={[styles.modalSaveButton, !formData.label.trim() && styles.modalSaveButtonDisabled]}
                onPress={handleSaveAddress}
                disabled={!formData.label.trim() || isLoading}
              >
                <Text style={[styles.modalSaveButtonText, !formData.label.trim() && styles.modalSaveButtonTextDisabled]}>
                  {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              {/* Address Type Selection */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Type d'adresse</Text>
                <View style={styles.typeSelector}>
                  {addressTypes.map((type) => (
                    <TouchableOpacity
                      key={type.key}
                      style={[
                        styles.typeOption,
                        formData.type === type.key && styles.typeOptionSelected,
                      ]}
                      onPress={() => handleInputChange('type', type.key as any)}
                    >
                      <Icon 
                        name={type.icon as any} 
                        type="Feather" 
                        size={20} 
                        color={formData.type === type.key ? Colors.white : type.color} 
                      />
                      <Text style={[
                        styles.typeOptionText,
                        formData.type === type.key && styles.typeOptionTextSelected,
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Form Fields */}
              <View style={styles.modalSection}>
                <Input
                  label="Libellé de l'adresse"
                  value={formData.label}
                  onChangeText={(value) => handleInputChange('label', value)}
                  error={errors.label}
                  placeholder="Ex: Domicile, Bureau, Entrepôt..."
                  leftIcon={<Icon name="tag" type="Feather" size={20} color={Colors.textSecondary} />}
                />

                <Input
                  label="Adresse"
                  value={formData.street}
                  onChangeText={(value) => handleInputChange('street', value)}
                  error={errors.street}
                  placeholder="1234 Rue de la Montagne"
                  leftIcon={<Icon name="map-pin" type="Feather" size={20} color={Colors.textSecondary} />}
                />

                <View style={styles.formRow}>
                  <View style={styles.formHalf}>
                    <Input
                      label="Ville"
                      value={formData.city}
                      onChangeText={(value) => handleInputChange('city', value)}
                      error={errors.city}
                      placeholder="Montréal"
                    />
                  </View>
                  <View style={styles.formQuarter}>
                    <Input
                      label="Province"
                      value={formData.province}
                      onChangeText={(value) => handleInputChange('province', value)}
                      error={errors.province}
                      placeholder="QC"
                      autoCapitalize="characters"
                      maxLength={2}
                    />
                  </View>
                </View>

                <Input
                  label="Code postal"
                  value={formData.postalCode}
                  onChangeText={(value) => handleInputChange('postalCode', value)}
                  error={errors.postalCode}
                  placeholder="H3G 1M8"
                  autoCapitalize="characters"
                  maxLength={7}
                  leftIcon={<Icon name="mail" type="Feather" size={20} color={Colors.textSecondary} />}
                />

                <Input
                  label="Pays"
                  value={formData.country}
                  onChangeText={(value) => handleInputChange('country', value)}
                  placeholder="Canada"
                  editable={false}
                  leftIcon={<Icon name="globe" type="Feather" size={20} color={Colors.textSecondary} />}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '15',
  },
  scrollView: {
    flex: 1,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  statsLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  addressesList: {
    paddingHorizontal: 20,
  },
  addressCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressLabelContainer: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  defaultBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  addressContent: {
    marginBottom: 12,
  },
  addressStreet: {
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  addressDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  addressCountry: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  setDefaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary + '10',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
  },
  addSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  addAddressButton: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  keyboardView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  modalBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  modalSaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  modalSaveButtonDisabled: {
    backgroundColor: Colors.textSecondary,
  },
  modalSaveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  modalSaveButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  modalScrollView: {
    flex: 1,
  },
  modalSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  typeOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  typeOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 8,
  },
  typeOptionTextSelected: {
    color: Colors.white,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formHalf: {
    flex: 2,
  },
  formQuarter: {
    flex: 1,
  },
});

export default AddressesScreen; 