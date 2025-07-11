import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Text } from '../ui';
import { Colors } from '../config/colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ShippingOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface WeightOption {
  id: string;
  range: string;
  description: string;
}

const shippingOptions: ShippingOption[] = [
  {
    id: 'colis',
    title: 'Colis',
    description: 'Envoi de petits colis et paquets',
    icon: 'cube-outline',
  },
  {
    id: 'palette_eu',
    title: 'Palette Européenne',
    description: 'Standard européen 120x80cm',
    icon: 'grid-outline',
  },
  {
    id: 'palette_us',
    title: 'Palette Américaine',
    description: 'Standard américain 120x100cm',
    icon: 'apps-outline',
  },
  {
    id: 'demenagement',
    title: 'Déménagement',
    description: 'Service de déménagement complet',
    icon: 'home-outline',
  },
];

const weightOptions: WeightOption[] = [
  { id: '0-15', range: '0-15 kg', description: 'Colis léger' },
  { id: '15-30', range: '15-30 kg', description: 'Colis moyen' },
  { id: '30-plus', range: '30+ kg', description: 'Colis lourd' },
];

interface ShippingModalProps {
  visible: boolean;
  onClose: () => void;
  destinationAddress: string;
  distance: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const ShippingModal: React.FC<ShippingModalProps> = ({
  visible,
  onClose,
  destinationAddress,
  distance,
  coordinates,
}) => {
  const [step, setStep] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (visible) {
      setStep(1);
      setSelectedShipping(null);
      setSelectedWeight(null);
      setEstimatedPrice(null);
      setIsLoading(false);
      setRequestSent(false);
    }
  }, [visible]);

  const calculatePrice = () => {
    // Basic price calculation logic (you can adjust this)
    const basePrice = 20; // Base price in CAD
    const distanceNum = parseFloat(distance.replace('km', ''));
    const weightMultiplier = selectedWeight === '0-15' ? 1 : selectedWeight === '15-30' ? 1.5 : 2;
    const shippingMultiplier = 
      selectedShipping === 'colis' ? 1 :
      selectedShipping === 'palette_eu' ? 2 :
      selectedShipping === 'palette_us' ? 2.5 : 3;

    return Math.round(basePrice * distanceNum * weightMultiplier * shippingMultiplier);
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setEstimatedPrice(calculatePrice());
      setStep(4);
    }
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setRequestSent(true);
    } catch (error) {
      console.error('Error sending request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Détails de la destination</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={24} color={Colors.primary} />
          <Text style={styles.detailText}>{destinationAddress}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="navigate" size={24} color={Colors.primary} />
          <Text style={styles.detailText}>Distance: {distance}</Text>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Type d'envoi</Text>
      <ScrollView style={styles.optionsContainer}>
        {shippingOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              selectedShipping === option.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedShipping(option.id)}
          >
            <Ionicons
              name={option.icon as any}
              size={28}
              color={selectedShipping === option.id ? Colors.white : Colors.primary}
            />
            <View style={styles.optionTextContainer}>
              <Text style={[
                styles.optionTitle,
                selectedShipping === option.id && styles.selectedText
              ]}>
                {option.title}
              </Text>
              <Text style={[
                styles.optionDescription,
                selectedShipping === option.id && styles.selectedText
              ]}>
                {option.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Poids de l'envoi</Text>
      <ScrollView style={styles.optionsContainer}>
        {weightOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              selectedWeight === option.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedWeight(option.id)}
          >
            <Ionicons
              name="scale-outline"
              size={28}
              color={selectedWeight === option.id ? Colors.white : Colors.primary}
            />
            <View style={styles.optionTextContainer}>
              <Text style={[
                styles.optionTitle,
                selectedWeight === option.id && styles.selectedText
              ]}>
                {option.range}
              </Text>
              <Text style={[
                styles.optionDescription,
                selectedWeight === option.id && styles.selectedText
              ]}>
                {option.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Résumé de l'envoi</Text>
      <ScrollView style={styles.summaryScrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Destination:</Text>
            <Text style={styles.summaryValue}>{destinationAddress}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Distance:</Text>
            <Text style={styles.summaryValue}>{distance}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Type d'envoi:</Text>
            <Text style={styles.summaryValue}>
              {shippingOptions.find(opt => opt.id === selectedShipping)?.title}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Poids:</Text>
            <Text style={styles.summaryValue}>
              {weightOptions.find(opt => opt.id === selectedWeight)?.range}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Prix estimé:</Text>
            <Text style={styles.priceValue}>{estimatedPrice} CAD</Text>
          </View>
        </View>

        {!requestSent ? (
          <TouchableOpacity
            style={[styles.sendRequestButton, isLoading && styles.disabledButton]}
            onPress={handleSendRequest}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={Colors.white} size="small" />
                <Text style={styles.sendRequestButtonText}>Envoi en cours...</Text>
              </View>
            ) : (
              <>
                <Ionicons name="paper-plane" size={20} color={Colors.white} />
                <Text style={styles.sendRequestButtonText}>Envoyer la demande</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={40} color={Colors.primary} />
            </View>
            <Text style={styles.successText}>Demande envoyée avec succès!</Text>
            <Text style={styles.successSubtext}>
              Nous vous contacterons bientôt pour confirmer votre demande.
            </Text>
            <TouchableOpacity
              style={styles.closeSuccessButton}
              onPress={onClose}
            >
              <Text style={styles.closeSuccessButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            {!requestSent && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
            <View style={styles.stepIndicator}>
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.stepDot,
                    i === step && styles.activeStepDot,
                    i < step && styles.completedStepDot,
                  ]}
                />
              ))}
            </View>
            {!requestSent && <View style={styles.closeButton} />}
          </View>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          {step < 4 && (
            <TouchableOpacity
              style={[
                styles.continueButton,
                ((step === 2 && !selectedShipping) || (step === 3 && !selectedWeight)) &&
                  styles.disabledButton,
              ]}
              onPress={handleContinue}
              disabled={(step === 2 && !selectedShipping) || (step === 3 && !selectedWeight)}
            >
              <Text style={styles.continueButtonText}>Continuer</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    minHeight: '75%', // Increased from 50%
    maxHeight: '92%', // Increased from 90%
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  closeButton: {
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 10,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
  },
  activeStepDot: {
    backgroundColor: Colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  completedStepDot: {
    backgroundColor: Colors.primary,
  },
  stepContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  optionsContainer: {
    flex: 1,
    paddingTop: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    gap: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  selectedText: {
    color: Colors.white,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  priceContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
  },
  summaryScrollContainer: {
    flex: 1,
  },
  sendRequestButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sendRequestButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  closeSuccessButton: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 32,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  closeSuccessButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShippingModal; 