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
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { Text, Icon, Button } from '../../ui';
import { Colors } from '../../config/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

interface StockageScreenProps {
  navigation: any;
}

interface ServiceFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface StorageUnit {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  size: string;
  features: string[];
  popular?: boolean;
  color: string;
  dimensions: string;
}

interface StorageOption {
  id: string;
  type: string;
  duration: string;
  price: string;
  description: string;
  icon: string;
  benefits: string[];
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
  storageType: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight || 0;

const StockageScreen: React.FC<StockageScreenProps> = ({ navigation }) => {
  const [selectedUnit, setSelectedUnit] = useState<string>('medium');
  const [selectedOption, setSelectedOption] = useState<string>('court-terme');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const serviceFeatures: ServiceFeature[] = [
    {
      id: '1',
      title: 'Accès 24/7',
      description: 'Accédez à vos biens à tout moment',
      icon: 'clock',
      color: '#8B5CF6',
    },
    {
      id: '2',
      title: 'Sécurité maximale',
      description: 'Surveillance vidéo et contrôle d\'accès',
      icon: 'shield',
      color: '#10B981',
    },
    {
      id: '3',
      title: 'Climatisation',
      description: 'Environnement contrôlé et protégé',
      icon: 'thermometer',
      color: '#F59E0B',
    },
    {
      id: '4',
      title: 'Assurance incluse',
      description: 'Protection complète de vos biens',
      icon: 'umbrella',
      color: '#EF4444',
    },
  ];

  const storageUnits: StorageUnit[] = [
    {
      id: 'small',
      name: 'Petit',
      price: '49',
      description: 'Idéal pour documents et objets personnels',
      size: '1m²',
      dimensions: '1m × 1m × 2m',
      features: [
        'Casier sécurisé',
        'Accès 24/7',
        'Surveillance vidéo',
        'Assurance 1 000$',
        'Environnement sec',
        'Accès par badge',
      ],
      color: '#10B981',
    },
    {
      id: 'medium',
      name: 'Moyen',
      price: '89',
      originalPrice: '99',
      description: 'Parfait pour meubles et électroménager',
      size: '5m²',
      dimensions: '2m × 2.5m × 2.5m',
      features: [
        'Unité spacieuse',
        'Climatisation incluse',
        'Accès véhicule',
        'Assurance 5 000$',
        'Éclairage LED',
        'Prises électriques',
        'Matériel d\'emballage',
      ],
      popular: true,
      color: '#8B5CF6',
    },
    {
      id: 'large',
      name: 'Grand',
      price: '149',
      originalPrice: '169',
      description: 'Solution complète pour tout type de biens',
      size: '10m²',
      dimensions: '3m × 3.5m × 3m',
      features: [
        'Espace généreux',
        'Climatisation premium',
        'Accès camion direct',
        'Assurance 10 000$',
        'Système anti-humidité',
        'Prises multiples',
        'Service de manutention',
        'Inventaire digital',
      ],
      color: '#EF4444',
    },
  ];

  const storageOptions: StorageOption[] = [
    {
      id: 'court-terme',
      type: 'Court terme',
      duration: '1-6 mois',
      price: 'Prix standard',
      description: 'Stockage temporaire flexible',
      icon: 'calendar',
      benefits: ['Flexibilité maximum', 'Pas d\'engagement', 'Facturation mensuelle'],
    },
    {
      id: 'long-terme',
      type: 'Long terme',
      duration: '6+ mois',
      price: '15% de réduction',
      description: 'Économies pour stockage prolongé',
      icon: 'trending-down',
      benefits: ['Tarif préférentiel', 'Priorité d\'accès', 'Services gratuits'],
    },
    {
      id: 'entreprise',
      type: 'Entreprise',
      duration: 'Sur mesure',
      price: 'Devis personnalisé',
      description: 'Solutions professionnelles adaptées',
      icon: 'briefcase',
      benefits: ['Espaces dédiés', 'Factures groupées', 'Service premium'],
    },
  ];

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Julie Lessard',
      role: 'Propriétaire',
      storageType: 'Unité moyenne',
      rating: 5,
      comment: 'Excellent service ! Mes affaires sont en sécurité et j\'y accède quand je veux.',
      avatar: '👩‍💼',
    },
    {
      id: '2',
      name: 'Marc Bouchard',
      role: 'Entrepreneur',
      storageType: 'Unité grande',
      rating: 5,
      comment: 'Parfait pour mon inventaire d\'entreprise. Climatisation et sécurité au top.',
      avatar: '👨‍💼',
    },
    {
      id: '3',
      name: 'Sarah Chen',
      role: 'Étudiante',
      storageType: 'Unité petite',
      rating: 5,
      comment: 'Solution abordable pour stocker mes affaires pendant les vacances.',
      avatar: '👩‍🎓',
    },
  ];

  const handleBooking = () => {
    console.log('🏢 StockageScreen: Navigating to facility map with selections:', {
      selectedUnit: storageUnits.find(unit => unit.id === selectedUnit),
      selectedOption: storageOptions.find(option => option.id === selectedOption)
    });
    
    navigation.navigate('StorageFacilityMap', { 
      service: 'storage',
      selectedUnit: storageUnits.find(unit => unit.id === selectedUnit),
      selectedOption: storageOptions.find(option => option.id === selectedOption)
    });
  };

  const handleGetQuote = () => {
    Alert.alert(
      'Devis personnalisé',
      'Obtenez une estimation pour vos besoins de stockage',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Demander un devis', onPress: handleBooking },
      ]
    );
  };

  const handleVirtualTour = () => {
    Alert.alert(
      'Visite virtuelle',
      'Découvrez nos installations en réalité virtuelle',
      [
        { text: 'Plus tard', style: 'cancel' },
        { text: 'Commencer la visite', onPress: () => console.log('Virtual tour started') },
      ]
    );
  };

  const FeatureCard = ({ feature }: { feature: ServiceFeature }) => (
    <View style={styles.featureCard}>
      <View style={[styles.featureIcon, { backgroundColor: feature.color + '15' }]}>
        <Icon name={feature.icon as any} type="Feather" size={24} color={feature.color} />
      </View>
      <Text style={styles.featureTitle}>{feature.title}</Text>
      <Text style={styles.featureDescription}>{feature.description}</Text>
    </View>
  );

  const UnitCard = ({ unit }: { unit: StorageUnit }) => (
    <TouchableOpacity
      style={[
        styles.unitCard,
        selectedUnit === unit.id && styles.unitCardSelected,
        unit.popular && styles.unitCardPopular,
      ]}
      onPress={() => setSelectedUnit(unit.id)}
      activeOpacity={0.8}
    >
      {unit.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>POPULAIRE</Text>
        </View>
      )}
      
      <View style={styles.unitHeader}>
        <Text style={styles.unitName}>{unit.name}</Text>
        <Text style={styles.unitSize}>{unit.size} • {unit.dimensions}</Text>
        <View style={styles.unitPrice}>
          <Text style={styles.price}>{unit.price}$</Text>
          <Text style={styles.priceUnit}>/mois</Text>
          {unit.originalPrice && (
            <Text style={styles.originalPrice}>{unit.originalPrice}$</Text>
          )}
        </View>
        <Text style={styles.unitDescription}>{unit.description}</Text>
      </View>

      <View style={styles.unitFeatures}>
        {unit.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Icon name="check" type="Feather" size={16} color={Colors.primary} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {selectedUnit === unit.id && (
        <View style={styles.selectedIndicator}>
          <Icon name="check-circle" type="Feather" size={20} color={Colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  const StorageOption = ({ option }: { option: StorageOption }) => (
    <TouchableOpacity
      style={[
        styles.storageOption,
        selectedOption === option.id && styles.storageOptionSelected,
      ]}
      onPress={() => setSelectedOption(option.id)}
      activeOpacity={0.8}
    >
      <View style={styles.storageOptionHeader}>
        <View style={styles.storageIcon}>
          <Icon name={option.icon as any} type="Feather" size={24} color="#8B5CF6" />
        </View>
        <View style={styles.storageInfo}>
          <Text style={styles.storageType}>{option.type}</Text>
          <Text style={styles.storageDuration}>{option.duration}</Text>
          <Text style={styles.storageDescription}>{option.description}</Text>
        </View>
        <View style={styles.storagePrice}>
          <Text style={styles.storagePriceText}>{option.price}</Text>
        </View>
      </View>
      
      <View style={styles.benefitsList}>
        <Text style={styles.benefitsTitle}>Avantages:</Text>
        <View style={styles.benefits}>
          {option.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Text style={styles.benefitText}>• {benefit}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
    <View style={styles.testimonialCard}>
      <View style={styles.testimonialHeader}>
        <Text style={styles.testimonialAvatar}>{testimonial.avatar}</Text>
        <View style={styles.testimonialInfo}>
          <Text style={styles.testimonialName}>{testimonial.name}</Text>
          <Text style={styles.testimonialRole}>{testimonial.role}</Text>
          <Text style={styles.testimonialStorage}>{testimonial.storageType}</Text>
        </View>
        <View style={styles.testimonialRating}>
          {Array.from({ length: testimonial.rating }).map((_, index) => (
            <Icon key={index} name="star" type="Feather" size={12} color="#F59E0B" />
          ))}
        </View>
      </View>
      <Text style={styles.testimonialComment}>"{testimonial.comment}"</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Full Screen Header with Gradient */}
      <LinearGradient
        colors={['#8B5CF6', '#A855F7', '#C084FC']}
        style={styles.fullScreenHeader}
      >
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" type="Feather" size={24} color={Colors.white} />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Stockage</Text>
            <Text style={styles.headerSubtitle}>Entreposage sécurisé et climatisé</Text>
          </View>

          <TouchableOpacity style={styles.shareButton}>
            <Icon name="share" type="Feather" size={24} color={Colors.white} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.heroStats,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24/7</Text>
            <Text style={styles.statLabel}>Accès</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>Sécurisé</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>10K$</Text>
            <Text style={styles.statLabel}>Assurance</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Service Features */}
        <Animated.View
          style={[
            styles.featuresSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Pourquoi choisir notre stockage ?</Text>
          <View style={styles.featuresGrid}>
            {serviceFeatures.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </View>
        </Animated.View>

        {/* Storage Units */}
        <Animated.View
          style={[
            styles.unitsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Nos unités de stockage</Text>
          <Text style={styles.sectionDescription}>
            Trouvez l'espace parfait pour vos besoins
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.unitsCards}
          >
            {storageUnits.map((unit) => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Storage Options */}
        <Animated.View
          style={[
            styles.optionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Options de stockage</Text>
          <View style={styles.storageOptions}>
            {storageOptions.map((option) => (
              <StorageOption key={option.id} option={option} />
            ))}
          </View>
        </Animated.View>

        {/* Virtual Tour Section */}
        <Animated.View
          style={[
            styles.tourSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
            style={styles.tourCard}
          >
            <Icon name="eye" type="Feather" size={32} color={Colors.white} />
            <Text style={styles.tourTitle}>Visite virtuelle</Text>
            <Text style={styles.tourSubtitle}>
              Explorez nos installations en réalité virtuelle avant de réserver
            </Text>
            <Button
              title="Commencer la visite"
              onPress={handleVirtualTour}
              style={styles.tourButton}
            />
          </LinearGradient>
        </Animated.View>

        {/* Process Steps */}
        <Animated.View
          style={[
            styles.processSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
          <View style={styles.processSteps}>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepTitle}>Choisissez</Text>
              <Text style={styles.stepDescription}>
                Sélectionnez la taille d'unité qui vous convient
              </Text>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepTitle}>Réservez</Text>
              <Text style={styles.stepDescription}>
                Réservation en ligne simple et rapide
              </Text>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepTitle}>Stockez</Text>
              <Text style={styles.stepDescription}>
                Accédez à votre unité 24h/24 et 7j/7
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Testimonials */}
        <Animated.View
          style={[
            styles.testimonialsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Témoignages clients</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonials}
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Call to Action */}
        <Animated.View
          style={[
            styles.ctaSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
            style={styles.ctaCard}
          >
            <Text style={styles.ctaTitle}>Besoin d'espace de stockage ?</Text>
            <Text style={styles.ctaSubtitle}>
              Réservez votre unité dès maintenant et bénéficiez du premier mois à -50%
            </Text>
            <View style={styles.ctaButtons}>
              <Button
                title="Réserver maintenant"
                onPress={handleBooking}
                style={styles.ctaButton}
              />
              <Button
                title="Obtenir un devis"
                onPress={handleGetQuote}
                variant="outline"
                style={[styles.ctaButton, styles.ctaButtonOutline]}
              />
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  fullScreenHeader: {
    paddingTop: STATUS_BAR_HEIGHT + 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    width: SCREEN_WIDTH,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  unitsSection: {
    paddingVertical: 32,
    backgroundColor: Colors.white,
  },
  unitsCards: {
    paddingHorizontal: 20,
    gap: 16,
  },
  unitCard: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  unitCardSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF6' + '05',
  },
  unitCardPopular: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF6' + '05',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  unitHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  unitName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  unitSize: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  unitPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  priceUnit: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 18,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  unitDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  unitFeatures: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  optionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  storageOptions: {
    gap: 16,
  },
  storageOption: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  storageOptionSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF6' + '05',
  },
  storageOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  storageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6' + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  storageInfo: {
    flex: 1,
  },
  storageType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  storageDuration: {
    fontSize: 12,
    color: '#8B5CF6',
    marginBottom: 4,
  },
  storageDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  storagePrice: {
    alignItems: 'center',
  },
  storagePriceText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  benefitsList: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  benefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  benefitItem: {
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  benefitText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tourSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: Colors.white,
  },
  tourCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  tourTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 16,
    marginBottom: 8,
  },
  tourSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  tourButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: Colors.white,
    marginBottom: 0,
  },
  processSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  processSteps: {
    gap: 24,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
    marginTop: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    flex: 1,
    marginTop: 8,
  },
  testimonialsSection: {
    paddingVertical: 32,
    backgroundColor: Colors.white,
  },
  testimonials: {
    paddingHorizontal: 20,
    gap: 16,
  },
  testimonialCard: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  testimonialAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  testimonialRole: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  testimonialStorage: {
    fontSize: 11,
    color: '#8B5CF6',
  },
  testimonialRating: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialComment: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  ctaCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  ctaButtons: {
    width: '100%',
    gap: 12,
  },
  ctaButton: {
    marginBottom: 0,
  },
  ctaButtonOutline: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: Colors.white,
  },
});

export default StockageScreen; 