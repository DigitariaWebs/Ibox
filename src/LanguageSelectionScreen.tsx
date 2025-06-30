import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button, Text } from './ui';
import { useTranslation } from './config/i18n';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: require('../assets/images/flag_en.png') },
  { code: 'fr', label: 'Français', flag: require('../assets/images/flag_fr.png') },
];

const LanguageSelectionScreen: React.FC<any> = ({ navigation }) => {
  const { t, locale, setLocale } = useTranslation();
  const [saved, setSaved] = useState(false);

  const handleSelect = (code: 'en' | 'fr') => {
    setLocale(code);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      if (navigation && navigation.replace) {
        navigation.replace('Main'); // Go to main app (Home/BottomNav)
      }
    }, 800);
  };

  return (
    <View style={styles.container}>
      <Text variant="h1" weight="bold" align="center" style={styles.title}>
        {t('select_language')}
      </Text>
      <View style={styles.list}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.card, locale === lang.code && styles.selectedCard]}
            onPress={() => handleSelect(lang.code as 'en' | 'fr')}
            activeOpacity={0.8}
          >
            <Image source={lang.flag} style={styles.flag} />
            <Text style={styles.langLabel} weight="semibold">
              {lang.label}
            </Text>
            <View style={[styles.radioOuter, locale === lang.code && styles.radioOuterSelected]}>
              {locale === lang.code && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        title={saved ? t('saved') || 'Saved!' : t('save_settings') || 'Save Settings'}
        onPress={handleSave}
        variant="primary"
        style={styles.saveButton}
        disabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f6f8fa',
  },
  title: {
    marginBottom: 32,
  },
  list: {
    width: '100%',
    marginBottom: 32,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#2563EB',
    backgroundColor: '#e8f0fe',
  },
  flag: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 16,
  },
  langLabel: {
    fontSize: 18,
    flex: 1,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  radioOuterSelected: {
    borderColor: '#2563EB',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  saveButton: {
    width: '100%',
    borderRadius: 24,
    marginTop: 8,
  },
});

export default LanguageSelectionScreen; 