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

interface DemenagementScreenProps {
  navigation: any;
}

interface ServiceFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface MovingPackage {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
  size: string;
}

interface MovingOption {
  id: string;
  type: string;
  duration: string;
  price: string;
  description: string;
  icon: string;
  included: string[];
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
  location: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight || 0;

const DemenagementScreen: React.FC<DemenagementScreenProps> = ({ navigation }) => {
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [selectedOption, setSelectedOption] = useState<string>('complet');

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
      title: 'Équipe professionnelle',
      description: 'Déménageurs expérimentés et assurés',
      icon: 'users',
      color: '#3B82F6',
    },
    {
      id: '2',
      title: 'Matériel inclus',
      description: 'Sangles, couvertures, diable fournis',
      icon: 'package',
      color: '#10B981',
    },
    {
      id: '3',
      title: 'Assurance complète',
      description: 'Protection jusqu\'à 10 000$ incluse',
      icon: 'shield',
      color: '#F59E0B',
    },
    {
      id: '4',
      title: 'Devis gratuit',
      description: 'Estimation précise à domicile',
      icon: 'clipboard',
      color: '#8B5CF6',
    },
  ];

  const movingPackages: MovingPackage[] = [
    {
      id: 'premium',
      name: 'Premium',
      price: '299',
      originalPrice: '349',
      description: 'Service complet clé en main',
      size: '4+ pièces',
      features: [
        'Équipe de 4 déménageurs',
        'Camion 20 pieds inclus',
        'Emballage/déballage complet',
        'Démontage/remontage meubles',
        'Assurance premium 10 000$',
        'Nettoyage de base',
        'Suivi en temps réel',
      ],
      color: '#EF4444',
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '199',
      description: 'Parfait pour la plupart des besoins',
      size: '2-3 pièces',
      features: [
        'Équipe de 3 déménageurs',
        'Camion 14 pieds inclus',
        'Emballage objets fragiles',
        'Démontage/remontage meubles',
        'Assurance standard 5 000$',
        'Matériel de protection',
        'Support téléphonique',
      ],
      popular: true,
      color: '#3B82F6',
    },
    {
      id: 'economique',
      name: 'Économique',
      price: '129',
      description: 'Solution abordable et efficace',
      size: '1-2 pièces',
      features: [
        'Équipe de 2 déménageurs',
        'Camion 10 pieds inclus',
        'Transport sécurisé',
        'Matériel de base fourni',
        'Assurance basic 2 000$',
        'Service rapide',
      ],
      color: '#6B7280',
    },
  ];

  const movingOptions: MovingOption[] = [
    {
      id: 'complet',
      type: 'Service complet',
      duration: 'Journée complète',
      price: 'À partir de 199$',
      description: 'Prise en charge totale de votre déménagement',
      icon: 'home',
      included: ['Emballage', 'Transport', 'Déballage', 'Montage'],
    },
    {
      id: 'transport',
      type: 'Transport uniquement',
      duration: 'Demi-journée',
      price: 'À partir de 89$',
      description: 'Transport de vos biens déjà emballés',
      icon: 'truck',
      included: ['Chargement', 'Transport', 'Déchargement'],
    },
    {
      id: 'main-oeuvre',
      type: 'Main d\'œuvre',
      duration: 'Par heure',
      price: '35$/heure',
      description: 'Aide pour emballage et manutention',
      icon: 'tool',
      included: ['Emballage', 'Démontage', 'Portage'],
    },
  ];

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Catherine Morin',
      role: 'Propriétaire',
      location: 'Montréal → Laval',
      rating: 5,
      comment: 'Équipe fantastique ! Mon déménagement s\'est déroulé sans stress et dans les délais.',
      avatar: '👩‍💼',
    },
    {
      id: '2',
      name: 'Pierre Dubois',
      role: 'Famille',
      location: 'Québec → Montréal',
      rating: 5,
      comment: 'Service impeccable, très professionnels et soigneux avec nos affaires.',
      avatar: '👨‍👩‍👧‍👦',
    },
    {
      id: '3',
      name: 'Marie Tremblay',
      role: 'Étudiante',
      location: 'Sherbrooke → Montréal',
      rating: 5,
      comment: 'Rapport qualité-prix excellent, je recommande vivement !',
      avatar: '👩‍🎓',
    },
  ];

  const handleBooking = () => {
    navigation.navigate('BookingFlow', { 
      service: 'demenagement',
      selectedPackage,
      selectedOption 
    });
  };

  const handleGetQuote = () => {
    Alert.alert(
      'Devis gratuit',
      'Obtenez une estimation personnalisée pour votre déménagement',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Demander un devis', onPress: handleBooking },
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

  const PackageCard = ({ pkg }: { pkg: MovingPackage }) => (
    <TouchableOpacity
      style={[
        styles.packageCard,
        selectedPackage === pkg.id && styles.packageCardSelected,
        pkg.popular && styles.packageCardPopular,
      ]}
      onPress={() => setSelectedPackage(pkg.id)}
      activeOpacity={0.8}
    >
      {pkg.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>POPULAIRE</Text>
        </View>
      )}
      
      <View style={styles.packageHeader}>
        <Text style={styles.packageName}>{pkg.name}</Text>
        <Text style={styles.packageSize}>{pkg.size}</Text>
        <View style={styles.packagePrice}>
          <Text style={styles.price}>{pkg.price}$</Text>
          {pkg.originalPrice && (
            <Text style={styles.originalPrice}>{pkg.originalPrice}$</Text>
          )}
        </View>
        <Text style={styles.packageDescription}>{pkg.description}</Text>
      </View>

      <View style={styles.packageFeatures}>
        {pkg.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Icon name="check" type="Feather" size={16} color={Colors.primary} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {selectedPackage === pkg.id && (
        <View style={styles.selectedIndicator}>
          <Icon name="check-circle" type="Feather" size={20} color={Colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  const MovingOption = ({ option }: { option: MovingOption }) => (
    <TouchableOpacity
      style={[
        styles.movingOption,
        selectedOption === option.id && styles.movingOptionSelected,
      ]}
      onPress={() => setSelectedOption(option.id)}
      activeOpacity={0.8}
    >
      <View style={styles.movingOptionHeader}>
        <View style={styles.movingIcon}>
          <Icon name={option.icon as any} type="Feather" size={24} color={Colors.primary} />
        </View>
        <View style={styles.movingInfo}>
          <Text style={styles.movingType}>{option.type}</Text>
          <Text style={styles.movingDuration}>{option.duration}</Text>
          <Text style={styles.movingDescription}>{option.description}</Text>
        </View>
        <View style={styles.movingPrice}>
          <Text style={styles.movingPriceText}>{option.price}</Text>
        </View>
      </View>
      
      <View style={styles.includedServices}>
        <Text style={styles.includedTitle}>Inclus:</Text>
        <View style={styles.includedList}>
          {option.included.map((service, index) => (
            <View key={index} style={styles.includedItem}>
              <Text style={styles.includedText}>• {service}</Text>
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
          <Text style={styles.testimonialLocation}>{testimonial.location}</Text>
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
        colors={['#3B82F6', '#6366F1', '#8B5CF6']}
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
            <Text style={styles.headerTitle}>Déménagement</Text>
            <Text style={styles.headerSubtitle}>Service professionnel et sécurisé</Text>
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
            <Text style={styles.statValue}>500+</Text>
            <Text style={styles.statLabel}>Déménagements</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.9★</Text>
            <Text style={styles.statLabel}>Satisfaction</Text>
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
          <Text style={styles.sectionTitle}>Pourquoi choisir notre service ?</Text>
          <View style={styles.featuresGrid}>
            {serviceFeatures.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </View>
        </Animated.View>

        {/* Moving Packages */}
        <Animated.View
          style={[
            styles.packagesSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Nos forfaits déménagement</Text>
          <Text style={styles.sectionDescription}>
            Choisissez le forfait qui correspond à vos besoins
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.packagesCards}
          >
            {movingPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Moving Options */}
        <Animated.View
          style={[
            styles.optionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Options de service</Text>
          <View style={styles.movingOptions}>
            {movingOptions.map((option) => (
              <MovingOption key={option.id} option={option} />
            ))}
          </View>
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
              <Text style={styles.stepTitle}>Devis gratuit</Text>
              <Text style={styles.stepDescription}>
                Évaluation à domicile et estimation personnalisée
              </Text>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepTitle}>Planification</Text>
              <Text style={styles.stepDescription}>
                Organisation et préparation du déménagement
              </Text>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepTitle}>Exécution</Text>
              <Text style={styles.stepDescription}>
                Déménagement professionnel et sécurisé
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
            colors={['#3B82F6', '#6366F1']}
            style={styles.ctaCard}
          >
            <Text style={styles.ctaTitle}>Prêt pour votre déménagement ?</Text>
            <Text style={styles.ctaSubtitle}>
              Obtenez un devis gratuit et réservez votre équipe
            </Text>
            <View style={styles.ctaButtons}>
              <Button
                title="Demander un devis"
                onPress={handleGetQuote}
                style={styles.ctaButton}
              />
              <Button
                title="Réserver maintenant"
                onPress={handleBooking}
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
  packagesSection: {
    paddingVertical: 32,
    backgroundColor: Colors.white,
  },
  packagesCards: {
    paddingHorizontal: 20,
    gap: 16,
  },
  packageCard: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  packageCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6' + '05',
  },
  packageCardPopular: {
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6' + '05',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  packageHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  packageName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  packageSize: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  packagePrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3B82F6',
  },
  originalPrice: {
    fontSize: 18,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  packageDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  packageFeatures: {
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
  movingOptions: {
    gap: 16,
  },
  movingOption: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  movingOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6' + '05',
  },
  movingOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  movingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6' + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  movingInfo: {
    flex: 1,
  },
  movingType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  movingDuration: {
    fontSize: 12,
    color: '#3B82F6',
    marginBottom: 4,
  },
  movingDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  movingPrice: {
    alignItems: 'center',
  },
  movingPriceText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  includedServices: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  includedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  includedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  includedItem: {
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  includedText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  processSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: Colors.white,
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
    backgroundColor: '#3B82F6',
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
  },
  testimonials: {
    paddingHorizontal: 20,
    gap: 16,
  },
  testimonialCard: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: Colors.white,
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
  testimonialLocation: {
    fontSize: 11,
    color: '#3B82F6',
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

export default DemenagementScreen; 