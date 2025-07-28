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
  Linking,
  Platform,
} from 'react-native';
import { Text, Icon, Button } from '../ui';
import { Colors } from '../config/colors';

interface HelpSupportScreenProps {
  navigation: any;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'delivery' | 'payment' | 'account';
}

interface ContactOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  action: () => void;
}

const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({ navigation }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'Comment suivre ma commande ?',
      answer: 'Vous pouvez suivre votre commande en temps réel dans la section "Historique des commandes". Chaque commande dispose d\'un numéro de suivi unique que vous pouvez utiliser pour voir la position exacte de votre colis.',
      category: 'delivery',
    },
    {
      id: '2',
      question: 'Quels sont les moyens de paiement acceptés ?',
      answer: 'Nous acceptons toutes les cartes de crédit et de débit (Visa, Mastercard, American Express), ainsi que les paiements par Apple Pay et Google Pay. Tous les paiements sont sécurisés et chiffrés.',
      category: 'payment',
    },
    {
      id: '3',
      question: 'Comment modifier mon adresse de livraison ?',
      answer: 'Rendez-vous dans Paramètres > Adresses pour ajouter, modifier ou supprimer vos adresses de livraison. Vous pouvez définir une adresse par défaut pour faciliter vos futures commandes.',
      category: 'account',
    },
    {
      id: '4',
      question: 'Quel est le délai de livraison ?',
      answer: 'Les délais de livraison varient selon le service choisi :\n• Colis Express : 2-4h\n• Colis Standard : 24-48h\n• Palette : 1-3 jours\n• Camion : Sur rendez-vous\n• Stockage : Accès immédiat',
      category: 'delivery',
    },
    {
      id: '5',
      question: 'Comment annuler une commande ?',
      answer: 'Vous pouvez annuler une commande tant qu\'elle n\'est pas en cours de livraison. Allez dans "Historique des commandes", sélectionnez votre commande et appuyez sur "Annuler". Le remboursement sera automatique.',
      category: 'general',
    },
    {
      id: '6',
      question: 'Que faire si mon colis est endommagé ?',
      answer: 'En cas de colis endommagé, contactez immédiatement notre support avec des photos du dommage. Nous traiterons votre réclamation dans les 24h et organiserons un remplacement ou remboursement.',
      category: 'delivery',
    },
    {
      id: '7',
      question: 'Comment fonctionne l\'assurance ?',
      answer: 'L\'assurance Premium couvre vos colis jusqu\'à 1000$ contre la perte, le vol ou les dommages. L\'assurance Standard couvre jusqu\'à 100$. La couverture est activée automatiquement lors de l\'expédition.',
      category: 'general',
    },
    {
      id: '8',
      question: 'Comment changer mon mot de passe ?',
      answer: 'Allez dans Paramètres > Informations personnelles > Sécurité. Vous pourrez y modifier votre mot de passe, activer l\'authentification à deux facteurs et gérer vos sessions actives.',
      category: 'account',
    },
  ];

  const categories = [
    { key: 'all', label: 'Toutes', count: faqData.length },
    { key: 'general', label: 'Général', count: faqData.filter(f => f.category === 'general').length },
    { key: 'delivery', label: 'Livraison', count: faqData.filter(f => f.category === 'delivery').length },
    { key: 'payment', label: 'Paiement', count: faqData.filter(f => f.category === 'payment').length },
    { key: 'account', label: 'Compte', count: faqData.filter(f => f.category === 'account').length },
  ];

  const contactOptions: ContactOption[] = [
    {
      id: 'chat',
      title: 'Chat en direct',
      subtitle: 'Disponible 24/7 • Réponse immédiate',
      icon: 'message-circle',
      color: '#0AA5A8',
      action: () => {
        Alert.alert(
          'Chat en direct',
          'Le chat en direct sera bientôt disponible. En attendant, vous pouvez nous contacter par email ou téléphone.',
          [{ text: 'OK' }]
        );
      },
    },
    {
      id: 'phone',
      title: 'Téléphone',
      subtitle: '+1 (514) 555-0123 • Lun-Ven 8h-18h',
      icon: 'phone',
      color: '#3B82F6',
      action: () => {
        const phoneNumber = Platform.OS === 'ios' ? 'tel:+15145550123' : 'tel:+15145550123';
        Linking.openURL(phoneNumber).catch(() => {
          Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application téléphone');
        });
      },
    },
    {
      id: 'email',
      title: 'Email',
      subtitle: 'support@ibox.ca • Réponse sous 2h',
      icon: 'mail',
      color: '#F97316',
      action: () => {
        const emailUrl = 'mailto:support@ibox.ca?subject=Demande de support iBox';
        Linking.openURL(emailUrl).catch(() => {
          Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application email');
        });
      },
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      subtitle: '+1 (514) 555-0124 • Réponse rapide',
      icon: 'message-square',
      color: '#10B981',
      action: () => {
        const whatsappUrl = 'whatsapp://send?phone=15145550124&text=Bonjour, j\'ai besoin d\'aide avec iBox';
        Linking.openURL(whatsappUrl).catch(() => {
          Alert.alert(
            'WhatsApp non trouvé',
            'WhatsApp n\'est pas installé sur votre appareil. Voulez-vous nous contacter par SMS ?',
            [
              { text: 'Annuler', style: 'cancel' },
              { 
                text: 'SMS', 
                onPress: () => Linking.openURL('sms:+15145550124?body=Bonjour, j\'ai besoin d\'aide avec iBox')
              },
            ]
          );
        });
      },
    },
  ];

  const handleFAQPress = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setExpandedFAQ(null); // Collapse any expanded FAQ when switching categories
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const handleReportBug = () => {
    const emailUrl = 'mailto:bugs@ibox.ca?subject=Rapport de bug iBox&body=Décrivez le problème rencontré :\n\nÉtapes pour reproduire :\n1. \n2. \n3. \n\nComportement attendu :\n\nComportement observé :\n\nInformations système :\n- Appareil : \n- Version iOS/Android : \n- Version de l\'app : 1.2.0';
    Linking.openURL(emailUrl).catch(() => {
      Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application email');
    });
  };

  const handleFeatureRequest = () => {
    const emailUrl = 'mailto:features@ibox.ca?subject=Demande de fonctionnalité iBox&body=Décrivez la fonctionnalité souhaitée :\n\nPourquoi cette fonctionnalité serait-elle utile ?\n\nComment imaginez-vous qu\'elle fonctionne ?\n\n';
    Linking.openURL(emailUrl).catch(() => {
      Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application email');
    });
  };

  const CategoryFilter = ({ category }: { category: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryFilter,
        selectedCategory === category.key && styles.categoryFilterActive,
      ]}
      onPress={() => handleCategoryFilter(category.key)}
    >
      <Text style={[
        styles.categoryFilterText,
        selectedCategory === category.key && styles.categoryFilterTextActive,
      ]}>
        {category.label}
      </Text>
      <View style={[
        styles.categoryFilterBadge,
        selectedCategory === category.key && styles.categoryFilterBadgeActive,
      ]}>
        <Text style={[
          styles.categoryFilterBadgeText,
          selectedCategory === category.key && styles.categoryFilterBadgeTextActive,
        ]}>
          {category.count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const FAQItem = ({ faq }: { faq: FAQItem }) => {
    const isExpanded = expandedFAQ === faq.id;
    
    return (
      <View style={styles.faqItem}>
        <TouchableOpacity
          style={styles.faqQuestion}
          onPress={() => handleFAQPress(faq.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.faqQuestionText}>{faq.question}</Text>
          <Icon 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            type="Feather" 
            size={20} 
            color={Colors.textSecondary} 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.faqAnswer}>
            <Text style={styles.faqAnswerText}>{faq.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  const ContactCard = ({ option }: { option: ContactOption }) => (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={option.action}
      activeOpacity={0.7}
    >
      <View style={[styles.contactIcon, { backgroundColor: option.color + '15' }]}>
        <Icon name={option.icon as any} type="Feather" size={24} color={option.color} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactTitle}>{option.title}</Text>
        <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
      </View>
      <Icon name="arrow-right" type="Feather" size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

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
                      <Icon name="chevron-left" type="Feather" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide et support</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" type="Feather" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <Animated.View
          style={[
            styles.welcomeSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.welcomeCard}>
            <Icon name="help-circle" type="Feather" size={32} color={Colors.primary} />
            <Text style={styles.welcomeTitle}>Comment pouvons-nous vous aider ?</Text>
            <Text style={styles.welcomeText}>
              Trouvez rapidement des réponses à vos questions ou contactez notre équipe de support
            </Text>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          style={[
            styles.quickActionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('OrderHistory')}>
              <Icon name="package" type="Feather" size={20} color={Colors.primary} />
              <Text style={styles.quickActionText}>Mes commandes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={handleReportBug}>
              <Icon name="alert-circle" type="Feather" size={20} color="#EF4444" />
              <Text style={styles.quickActionText}>Signaler un bug</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={handleFeatureRequest}>
              <Icon name="help-circle" type="Feather" size={20} color="#F59E0B" />
              <Text style={styles.quickActionText}>Suggestion</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Contact Options */}
        <Animated.View
          style={[
            styles.contactSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Contactez-nous</Text>
          <Text style={styles.sectionDescription}>
            Notre équipe de support est là pour vous aider
          </Text>
          
          <View style={styles.contactList}>
            {contactOptions.map((option) => (
              <ContactCard key={option.id} option={option} />
            ))}
          </View>
        </Animated.View>

        {/* FAQ Section */}
        <Animated.View
          style={[
            styles.faqSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          <Text style={styles.sectionDescription}>
            Trouvez des réponses aux questions les plus courantes
          </Text>

          {/* Category Filters */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <CategoryFilter key={category.key} category={category} />
            ))}
          </ScrollView>

          {/* FAQ List */}
          <View style={styles.faqList}>
            {filteredFAQs.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </View>
        </Animated.View>

        {/* App Information */}
        <Animated.View
          style={[
            styles.appInfoSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Informations de l'application</Text>
          
          <View style={styles.appInfoList}>
            <View style={styles.appInfoItem}>
              <Text style={styles.appInfoLabel}>Version</Text>
              <Text style={styles.appInfoValue}>1.2.0</Text>
            </View>
            <View style={styles.appInfoItem}>
              <Text style={styles.appInfoLabel}>Dernière mise à jour</Text>
              <Text style={styles.appInfoValue}>15 janvier 2024</Text>
            </View>
            <View style={styles.appInfoItem}>
              <Text style={styles.appInfoLabel}>Plateforme</Text>
              <Text style={styles.appInfoValue}>{Platform.OS === 'ios' ? 'iOS' : 'Android'}</Text>
            </View>
          </View>

          <View style={styles.appInfoActions}>
            <Button
              title="Conditions d'utilisation"
              onPress={() => Linking.openURL('https://ibox.ca/terms')}
              variant="outline"
              style={styles.appInfoButton}
            />
            <Button
              title="Politique de confidentialité"
              onPress={() => Linking.openURL('https://ibox.ca/privacy')}
              variant="outline"
              style={styles.appInfoButton}
            />
          </View>
        </Animated.View>
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginTop: 8,
    textAlign: 'center',
  },
  contactSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
  },
  contactList: {
    gap: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  faqSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingBottom: 20,
    gap: 12,
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  categoryFilterActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  categoryFilterTextActive: {
    color: Colors.white,
  },
  categoryFilterBadge: {
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryFilterBadgeActive: {
    backgroundColor: Colors.white + '20',
  },
  categoryFilterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryFilterBadgeTextActive: {
    color: Colors.white,
  },
  faqList: {
    gap: 8,
  },
  faqItem: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  faqAnswerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  appInfoSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 20,
  },
  appInfoList: {
    marginBottom: 20,
  },
  appInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  appInfoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  appInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  appInfoActions: {
    gap: 12,
  },
  appInfoButton: {
    marginBottom: 0,
  },
});

export default HelpSupportScreen; 