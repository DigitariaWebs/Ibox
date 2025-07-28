import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Text, Icon } from '../ui';
import { Colors } from '../config/colors';

const { width } = Dimensions.get('window');

interface ServicesScreenProps {
  navigation: any;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconFamily: 'Ionicons' | 'MaterialIcons';
  color: string;
  price: string;
  features: string[];
  screen?: string;
}

const services: ServiceItem[] = [
  {
    id: 'express',
    title: 'Express Delivery',
    description: 'Fast same-day delivery for urgent packages',
    icon: 'flash',
    iconFamily: 'Ionicons',
    color: '#FF6B6B',
    price: 'From $15',
    features: ['Same-day delivery', 'Real-time tracking', 'Priority handling'],
    screen: 'ExpressScreen',
  },
  {
    id: 'standard',
    title: 'Standard Delivery',
    description: 'Reliable delivery for everyday packages',
    icon: 'cube-outline',
    iconFamily: 'Ionicons',
    color: '#4ECDC4',
    price: 'From $8',
    features: ['Next-day delivery', 'Package insurance', 'Flexible pickup'],
  },
  {
    id: 'moving',
    title: 'Moving Service',
    description: 'Professional moving assistance for furniture and large items',
    icon: 'local-shipping',
    iconFamily: 'MaterialIcons',
    color: '#45B7D1',
    price: 'From $50',
    features: ['Professional movers', 'Furniture protection', 'Assembly service'],
    screen: 'DemenagementScreen',
  },
  {
    id: 'storage',
    title: 'Storage Service',
    description: 'Secure storage solutions for your belongings',
    icon: 'archive',
    iconFamily: 'Ionicons',
    color: '#96CEB4',
    price: 'From $25/month',
    features: ['Climate controlled', '24/7 security', 'Easy access'],
    screen: 'StockageScreen',
  },
  {
    id: 'colis',
    title: 'Package Delivery',
    description: 'Simple package delivery for documents and small items',
    icon: 'mail',
    iconFamily: 'Ionicons',
    color: '#F7B731',
    price: 'From $5',
    features: ['Document delivery', 'Small packages', 'Quick pickup'],
    screen: 'ColisScreen',
  },
  {
    id: 'international',
    title: 'International Shipping',
    description: 'Global shipping solutions for worldwide delivery',
    icon: 'airplane',
    iconFamily: 'Ionicons',
    color: '#A55EEA',
    price: 'Quote required',
    features: ['Worldwide shipping', 'Customs handling', 'Express options'],
  },
];

const ServicesScreen: React.FC<ServicesScreenProps> = ({ navigation }) => {
  const handleServicePress = (service: ServiceItem) => {
    if (service.screen) {
      navigation.navigate(service.screen);
    } else {
      // Navigate to HomeScreen and let user select this service
      navigation.navigate('HomeScreen', { selectedService: service.id });
    }
  };

  const renderServiceIcon = (service: ServiceItem) => {
    const IconComponent = service.iconFamily === 'Ionicons' ? Ionicons : MaterialIcons;
    return (
      <IconComponent
        name={service.icon as any}
        size={32}
        color="white"
      />
    );
  };

  const ServiceCard = ({ service }: { service: ServiceItem }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => handleServicePress(service)}
      activeOpacity={0.8}
    >
      <View style={[styles.serviceIconContainer, { backgroundColor: service.color }]}>
        {renderServiceIcon(service)}
      </View>
      
      <View style={styles.serviceContent}>
        <Text style={styles.serviceTitle}>{service.title}</Text>
        <Text style={styles.serviceDescription}>{service.description}</Text>
        
        <View style={styles.servicePriceContainer}>
          <Text style={styles.servicePrice}>{service.price}</Text>
        </View>
        
        <View style={styles.featuresContainer}>
          {service.features.slice(0, 2).map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
          {service.features.length > 2 && (
            <Text style={styles.moreFeatures}>+{service.features.length - 2} more</Text>
          )}
        </View>
      </View>
      
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Services</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Delivery Solutions for Every Need</Text>
          <Text style={styles.heroSubtitle}>
            From express packages to full moving services, we've got you covered
          </Text>
        </View>

        {/* Services Grid */}
        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Available Services</Text>
          
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        </View>

        {/* Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Why Choose iBox?</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, { backgroundColor: Colors.primary + '15' }]}>
                <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.infoCardTitle}>Secure & Reliable</Text>
              <Text style={styles.infoCardText}>
                Your packages are insured and tracked throughout the delivery process
              </Text>
            </View>
            
            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, { backgroundColor: '#F59E0B15' }]}>
                <Ionicons name="time" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.infoCardTitle}>Fast Delivery</Text>
              <Text style={styles.infoCardText}>
                Same-day and next-day delivery options available
              </Text>
            </View>
            
            <View style={styles.infoCard}>
              <View style={[styles.infoIcon, { backgroundColor: '#10B98115' }]}>
                <Ionicons name="headset" size={24} color="#10B981" />
              </View>
              <Text style={styles.infoCardTitle}>24/7 Support</Text>
              <Text style={styles.infoCardText}>
                Our customer support team is always here to help
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to get started?</Text>
          <Text style={styles.ctaSubtitle}>Book a delivery now and experience the difference</Text>
          
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <Text style={styles.ctaButtonText}>Book Now</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  servicesContainer: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  servicesGrid: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  servicePriceContainer: {
    marginBottom: 12,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  featuresContainer: {
    gap: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  moreFeatures: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  arrowContainer: {
    marginLeft: 8,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  infoGrid: {
    gap: 16,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  infoCardText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default ServicesScreen; 