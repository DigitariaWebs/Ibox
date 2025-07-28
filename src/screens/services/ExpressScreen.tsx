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

interface ExpressScreenProps {
  navigation: any;
}

interface ServiceFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface DeliveryOption {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  duration: string;
  features: string[];
  popular?: boolean;
  color: string;
  maxWeight: string;
}

interface ExpressService {
  id: string;
  type: string;
  timeFrame: string;
  price: string;
  description: string;
  icon: string;
  benefits: string[];
  coverage: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
  serviceType: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight || 0;

const ExpressScreen: React.FC<ExpressScreenProps> = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState<string>('same-day');
  const [selectedService, setSelectedService] = useState<string>('express-standard');

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
      title: 'Livraison rapide',
      description: 'Expédition en moins de 2 heures',
      icon: 'zap',
      color: '#F59E0B',
    },
    {
      id: '2',
      title: 'Suivi en temps réel',
      description: 'Localisez votre colis à tout moment',
      icon: 'map-pin',
      color: '#10B981',
    },
    {
      id: '3',
      title: 'Garantie horaire',
      description: 'Remboursement si retard',
      icon: 'clock',
      color: '#EF4444',
    },
    {
      id: '4',
      title: 'Signature requise',
      description: 'Sécurité maximale à la livraison',
      icon: 'edit-3',
      color: '#8B5CF6',
    },
  ];

  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'same-day',
      name: 'Même jour',
      price: '15',
      description: 'Livraison dans les 4 heures',
      duration: '2-4h',
      maxWeight: '10kg',
      features: [
        'Prise en charge immédiate',
        'Livraison garantie le jour même',
        'Suivi GPS en temps réel',
        'Notification SMS/email',
        'Signature électronique',
        'Assurance 500$',
      ],
      popular: true,
      color: '#F59E0B',
    },
    {
      id: 'express-2h',
      name: 'Express 2h',
      price: '25',
      originalPrice: '30',
      description: 'Livraison ultra-rapide garantie',
      duration: '1-2h',
      maxWeight: '5kg',
      features: [
        'Prise en charge prioritaire',
        'Livraison en moins de 2h',
        'Coursier dédié',
        'Suivi minute par minute',
        'Confirmation photo',
        'Assurance 750$',
        'Support 24/7',
      ],
      color: '#EF4444',
    },
    {
      id: 'express-1h',
      name: 'Express 1h',
      price: '45',
      originalPrice: '55',
      description: 'Service premium ultra-rapide',
      duration: '30-60min',
      maxWeight: '3kg',
      features: [
        'Prise en charge immédiate',
        'Livraison en moins d\'1h',
        'Coursier VIP exclusif',
        'Suivi en direct',
        'Confirmation vidéo',
        'Assurance 1000$',
        'Support premium',
        'Emballage sécurisé',
      ],
      color: '#8B5CF6',
    },
  ];

  const expressServices: ExpressService[] = [
    {
      id: 'express-standard',
      type: 'Express Standard',
      timeFrame: '2-4 heures',
      price: 'À partir de 15$',
      description: 'Service express pour livraisons quotidiennes',
      icon: 'truck',
      coverage: 'Montréal et environs',
      benefits: ['Prise en charge rapide', 'Suivi GPS', 'Notification push'],
    },
    {
      id: 'express-business',
      type: 'Express Business',
      timeFrame: '1-2 heures',
      price: 'À partir de 25$',
      description: 'Solution professionnelle pour entreprises',
      icon: 'briefcase',
      coverage: 'Zone métropolitaine',
      benefits: ['Priorité absolue', 'Coursier professionnel', 'Facture groupée'],
    },
    {
      id: 'express-medical',
      type: 'Express Médical',
      timeFrame: '30-60 minutes',
      price: 'Devis sur mesure',
      description: 'Transport sécurisé pour le secteur médical',
      icon: 'heart',
      coverage: 'Urgence 24/7',
      benefits: ['Certification médicale', 'Transport réfrigéré', 'Traçabilité complète'],
    },
  ];

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Marie Dubois',
      role: 'Avocate',
      serviceType: 'Express 2h',
      rating: 5,
      comment: 'Service impeccable ! Mes documents urgents sont arrivés en temps record.',
      avatar: '👩‍💼',
    },
    {
      id: '2',
      name: 'Jean-Pierre Martin',
      role: 'Pharmacien',
      serviceType: 'Express Médical',
      rating: 5,
      comment: 'Transport médical fiable et sécurisé. Je recommande vivement !',
      avatar: '👨‍⚕️',
    },
    {
      id: '3',
      name: 'Sophie Lambert',
      role: 'Chef d\'entreprise',
      serviceType: 'Express Business',
      rating: 5,
      comment: 'Parfait pour nos besoins d\'entreprise. Toujours à l\'heure !',
      avatar: '👩‍💼',
    },
  ];

  const handleBooking = () => {
    navigation.navigate('BookingFlow', { 
      service: 'express',
      selectedOption,
      selectedService 
    });
  };

  const handleGetQuote = () => {
    Alert.alert(
      'Devis express',
      'Obtenez une estimation personnalisée pour votre livraison express',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Demander un devis', onPress: handleBooking },
      ]
    );
  };

  const handleTrackPackage = () => {
    Alert.alert(
      'Suivre un colis',
      'Entrez votre numéro de suivi pour localiser votre colis',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Suivre', onPress: () => console.log('Tracking started') },
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

  const DeliveryCard = ({ option }: { option: DeliveryOption }) => (
    <TouchableOpacity
      style={[
        styles.deliveryCard,
        selectedOption === option.id && styles.deliveryCardSelected,
        option.popular && styles.deliveryCardPopular,
      ]}
      onPress={() => setSelectedOption(option.id)}
      activeOpacity={0.8}
    >
      {option.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>POPULAIRE</Text>
        </View>
      )}
      
      <View style={styles.deliveryHeader}>
        <Text style={styles.deliveryName}>{option.name}</Text>
        <Text style={styles.deliveryDuration}>{option.duration} • Max {option.maxWeight}</Text>
        <View style={styles.deliveryPrice}>
          <Text style={styles.price}>{option.price}$</Text>
          <Text style={styles.priceUnit}>+</Text>
          {option.originalPrice && (
            <Text style={styles.originalPrice}>{option.originalPrice}$</Text>
          )}
        </View>
        <Text style={styles.deliveryDescription}>{option.description}</Text>
      </View>

      <View style={styles.deliveryFeatures}>
        {option.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Icon name="check" type="Feather" size={16} color={Colors.primary} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {selectedOption === option.id && (
        <View style={styles.selectedIndicator}>
          <Icon name="check-circle" type="Feather" size={20} color={Colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  const ServiceCard = ({ service }: { service: ExpressService }) => (
    <TouchableOpacity
      style={[
        styles.serviceCard,
        selectedService === service.id && styles.serviceCardSelected,
      ]}
      onPress={() => setSelectedService(service.id)}
      activeOpacity={0.8}
    >
      <View style={styles.serviceHeader}>
        <View style={styles.serviceIcon}>
          <Icon name={service.icon as any} type="Feather" size={24} color="#F59E0B" />
        </View>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceType}>{service.type}</Text>
          <Text style={styles.serviceTimeFrame}>{service.timeFrame}</Text>
          <Text style={styles.serviceDescription}>{service.description}</Text>
        </View>
        <View style={styles.servicePrice}>
          <Text style={styles.servicePriceText}>{service.price}</Text>
        </View>
      </View>
      
      <View style={styles.serviceCoverage}>
        <Icon name="map-pin" type="Feather" size={14} color="#F59E0B" />
        <Text style={styles.coverageText}>{service.coverage}</Text>
      </View>

      <View style={styles.benefitsList}>
        <Text style={styles.benefitsTitle}>Avantages:</Text>
        <View style={styles.benefits}>
          {service.benefits.map((benefit, index) => (
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
          <Text style={styles.testimonialService}>{testimonial.serviceType}</Text>
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
        colors={['#F59E0B', '#F97316', '#EA580C']}
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
            <Text style={styles.headerTitle}>Express</Text>
            <Text style={styles.headerSubtitle}>Livraison express ultra-rapide</Text>
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
            <Text style={styles.statValue}>30min</Text>
            <Text style={styles.statLabel}>Plus rapide</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>GPS</Text>
            <Text style={styles.statLabel}>Suivi</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24/7</Text>
            <Text style={styles.statLabel}>Support</Text>
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
          <Text style={styles.sectionTitle}>Pourquoi choisir Express ?</Text>
          <View style={styles.featuresGrid}>
            {serviceFeatures.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </View>
        </Animated.View>

        {/* Delivery Options */}
        <Animated.View
          style={[
            styles.deliverySection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Options de livraison</Text>
          <Text style={styles.sectionDescription}>
            Choisissez la vitesse qui vous convient
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.deliveryCards}
          >
            {deliveryOptions.map((option) => (
              <DeliveryCard key={option.id} option={option} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Express Services */}
        <Animated.View
          style={[
            styles.servicesSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Services spécialisés</Text>
          <View style={styles.expressServices}>
            {expressServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        </Animated.View>

        {/* Tracking Section */}
        <Animated.View
          style={[
            styles.trackingSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#F59E0B', '#F97316']}
            style={styles.trackingCard}
          >
            <Icon name="search" type="Feather" size={32} color={Colors.white} />
            <Text style={styles.trackingTitle}>Suivre un colis</Text>
            <Text style={styles.trackingSubtitle}>
              Localisez votre colis en temps réel avec votre numéro de suivi
            </Text>
            <Button
              title="Suivre maintenant"
              onPress={handleTrackPackage}
              style={styles.trackingButton}
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
              <Text style={styles.stepTitle}>Commandez</Text>
              <Text style={styles.stepDescription}>
                Sélectionnez votre service et planifiez la prise en charge
              </Text>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepTitle}>Suivez</Text>
              <Text style={styles.stepDescription}>
                Surveillez votre colis en temps réel sur la carte
              </Text>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepTitle}>Recevez</Text>
              <Text style={styles.stepDescription}>
                Livraison sécurisée avec confirmation et signature
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
            colors={['#F59E0B', '#F97316']}
            style={styles.ctaCard}
          >
            <Text style={styles.ctaTitle}>Besoin d'une livraison express ?</Text>
            <Text style={styles.ctaSubtitle}>
              Commandez maintenant et recevez votre colis en moins d'une heure
            </Text>
            <View style={styles.ctaButtons}>
              <Button
                title="Commander maintenant"
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
  deliverySection: {
    paddingVertical: 32,
    backgroundColor: Colors.white,
  },
  deliveryCards: {
    paddingHorizontal: 20,
    gap: 16,
  },
  deliveryCard: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  deliveryCardSelected: {
    borderColor: '#F59E0B',
    backgroundColor: '#F59E0B' + '05',
  },
  deliveryCardPopular: {
    borderColor: '#F59E0B',
    backgroundColor: '#F59E0B' + '05',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  deliveryHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  deliveryName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  deliveryDuration: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  deliveryPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F59E0B',
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
  deliveryDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  deliveryFeatures: {
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
  servicesSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  expressServices: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  serviceCardSelected: {
    borderColor: '#F59E0B',
    backgroundColor: '#F59E0B' + '05',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F59E0B' + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  serviceTimeFrame: {
    fontSize: 12,
    color: '#F59E0B',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  servicePrice: {
    alignItems: 'center',
  },
  servicePriceText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  serviceCoverage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  coverageText: {
    fontSize: 12,
    color: Colors.textSecondary,
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
  trackingSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: Colors.white,
  },
  trackingCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  trackingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 16,
    marginBottom: 8,
  },
  trackingSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  trackingButton: {
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
    backgroundColor: '#F59E0B',
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
  testimonialService: {
    fontSize: 11,
    color: '#F59E0B',
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

export default ExpressScreen; 