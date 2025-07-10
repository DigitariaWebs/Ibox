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

interface ColisScreenProps {
  navigation: any;
}

interface ServiceFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface PricingTier {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
}

interface DeliveryOption {
  id: string;
  type: string;
  time: string;
  price: string;
  description: string;
  icon: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight || 0;

const ColisScreen: React.FC<ColisScreenProps> = ({ navigation }) => {
  const [selectedTier, setSelectedTier] = useState<string>('standard');
  const [selectedDelivery, setSelectedDelivery] = useState<string>('express');

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
      title: 'Suivi en temps réel',
      description: 'Suivez votre colis à chaque étape avec GPS',
      icon: 'map-pin',
      color: '#0AA5A8',
    },
    {
      id: '2',
      title: 'Assurance incluse',
      description: 'Protection jusqu\'à 1000$ automatique',
      icon: 'shield',
      color: '#10B981',
    },
    {
      id: '3',
      title: 'Livraison flexible',
      description: 'Choisissez votre créneau préféré',
      icon: 'clock',
      color: '#F59E0B',
    },
    {
      id: '4',
      title: 'Support 24/7',
      description: 'Assistance disponible à tout moment',
      icon: 'headphones',
      color: '#8B5CF6',
    },
  ];

  const pricingTiers: PricingTier[] = [
    {
      id: 'express',
      name: 'Express',
      price: '12.99',
      originalPrice: '15.99',
      description: 'Livraison rapide 2-4h',
      features: [
        'Livraison 2-4 heures',
        'Suivi GPS en temps réel',
        'Assurance 500$',
        'Notification SMS/Email',
        'Support prioritaire',
      ],
      color: '#EF4444',
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '8.99',
      description: 'Livraison 24-48h',
      features: [
        'Livraison 24-48 heures',
        'Suivi GPS',
        'Assurance 300$',
        'Notification par email',
        'Support standard',
      ],
      popular: true,
      color: '#0AA5A8',
    },
    {
      id: 'economy',
      name: 'Économique',
      price: '5.99',
      description: 'Livraison 3-5 jours',
      features: [
        'Livraison 3-5 jours',
        'Suivi basique',
        'Assurance 100$',
        'Notification par email',
        'Support standard',
      ],
      color: '#6B7280',
    },
  ];

  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'express',
      type: 'Express',
      time: '2-4 heures',
      price: '12.99',
      description: 'Livraison ultra-rapide',
      icon: 'zap',
    },
    {
      id: 'sameday',
      type: 'Même jour',
      time: '4-8 heures',
      price: '9.99',
      description: 'Livraison le jour même',
      icon: 'calendar',
    },
    {
      id: 'standard',
      type: 'Standard',
      time: '24-48h',
      price: '8.99',
      description: 'Livraison rapide',
      icon: 'truck',
    },
  ];

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Marie Dubois',
      role: 'Propriétaire boutique',
      rating: 5,
      comment: 'Service impeccable ! Mes clients reçoivent leurs commandes en temps record.',
      avatar: '👩‍💼',
    },
    {
      id: '2',
      name: 'Jean Martin',
      role: 'Particulier',
      rating: 5,
      comment: 'Application fantastique, suivi précis et livreurs très professionnels.',
      avatar: '👨‍💻',
    },
    {
      id: '3',
      name: 'Sophie Chen',
      role: 'E-commerce',
      rating: 5,
      comment: 'iBox révolutionne ma logistique. Tarifs compétitifs et service fiable.',
      avatar: '👩‍💻',
    },
  ];

  const handleBooking = () => {
    navigation.navigate('BookingFlow', { 
      service: 'colis',
      selectedTier,
      selectedDelivery 
    });
  };

  const handleGetQuote = () => {
    Alert.alert(
      'Devis personnalisé',
      'Obtenez un devis personnalisé en quelques minutes',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Continuer', onPress: handleBooking },
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

  const PricingCard = ({ tier }: { tier: PricingTier }) => (
    <TouchableOpacity
      style={[
        styles.pricingCard,
        selectedTier === tier.id && styles.pricingCardSelected,
        tier.popular && styles.pricingCardPopular,
      ]}
      onPress={() => setSelectedTier(tier.id)}
      activeOpacity={0.8}
    >
      {tier.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>POPULAIRE</Text>
        </View>
      )}
      
      <View style={styles.pricingHeader}>
        <Text style={styles.pricingName}>{tier.name}</Text>
        <View style={styles.pricingPrice}>
          <Text style={styles.price}>{tier.price}$</Text>
          {tier.originalPrice && (
            <Text style={styles.originalPrice}>{tier.originalPrice}$</Text>
          )}
        </View>
        <Text style={styles.pricingDescription}>{tier.description}</Text>
      </View>

      <View style={styles.pricingFeatures}>
        {tier.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Icon name="check" type="Feather" size={16} color={Colors.primary} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {selectedTier === tier.id && (
        <View style={styles.selectedIndicator}>
          <Icon name="check-circle" type="Feather" size={20} color={Colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  const DeliveryOption = ({ option }: { option: DeliveryOption }) => (
    <TouchableOpacity
      style={[
        styles.deliveryOption,
        selectedDelivery === option.id && styles.deliveryOptionSelected,
      ]}
      onPress={() => setSelectedDelivery(option.id)}
      activeOpacity={0.8}
    >
      <View style={styles.deliveryIcon}>
        <Icon name={option.icon as any} type="Feather" size={20} color={Colors.primary} />
      </View>
      <View style={styles.deliveryInfo}>
        <Text style={styles.deliveryType}>{option.type}</Text>
        <Text style={styles.deliveryTime}>{option.time}</Text>
        <Text style={styles.deliveryDescription}>{option.description}</Text>
      </View>
      <View style={styles.deliveryPrice}>
        <Text style={styles.deliveryPriceText}>{option.price}$</Text>
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
        colors={['#0AA5A8', '#4DC5C8', '#7B68EE']}
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
            <Icon name="arrow-left" type="Feather" size={24} color={Colors.white} />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Service Colis</Text>
            <Text style={styles.headerSubtitle}>Livraison rapide et suivie</Text>
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
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>Satisfaction</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2-4h</Text>
            <Text style={styles.statLabel}>Livraison</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1000$</Text>
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
          <Text style={styles.sectionTitle}>Pourquoi choisir notre service colis ?</Text>
          <View style={styles.featuresGrid}>
            {serviceFeatures.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </View>
        </Animated.View>

        {/* Pricing Tiers */}
        <Animated.View
          style={[
            styles.pricingSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Choisissez votre formule</Text>
          <Text style={styles.sectionDescription}>
            Des tarifs transparents adaptés à tous vos besoins
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pricingCards}
          >
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.id} tier={tier} />
            ))}
          </ScrollView>
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
          <View style={styles.deliveryOptions}>
            {deliveryOptions.map((option) => (
              <DeliveryOption key={option.id} option={option} />
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
              <Text style={styles.stepTitle}>Réservez</Text>
              <Text style={styles.stepDescription}>
                Sélectionnez votre service et renseignez les détails
              </Text>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepTitle}>Collecte</Text>
              <Text style={styles.stepDescription}>
                Notre transporteur récupère votre colis
              </Text>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepTitle}>Livraison</Text>
              <Text style={styles.stepDescription}>
                Votre colis est livré à destination
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
          <Text style={styles.sectionTitle}>Ce que disent nos clients</Text>
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
            colors={['#0AA5A8', '#4DC5C8']}
            style={styles.ctaCard}
          >
            <Text style={styles.ctaTitle}>Prêt à expédier votre colis ?</Text>
            <Text style={styles.ctaSubtitle}>
              Obtenez un devis instantané et réservez en quelques clics
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
  pricingSection: {
    paddingVertical: 32,
    backgroundColor: Colors.white,
  },
  pricingCards: {
    paddingHorizontal: 20,
    gap: 16,
  },
  pricingCard: {
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  pricingCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  pricingCardPopular: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  pricingHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pricingName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  pricingPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: 18,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  pricingDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  pricingFeatures: {
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
  deliverySection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  deliveryOptions: {
    gap: 12,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  deliveryOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  deliveryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 2,
  },
  deliveryDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  deliveryPrice: {
    alignItems: 'center',
  },
  deliveryPriceText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
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
    backgroundColor: Colors.primary,
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

export default ColisScreen; 