import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Text, Icon } from './ui';
import { useTranslation } from './config/i18n';

const SettingsScreen: React.FC<any> = ({ navigation }) => {
  const { t } = useTranslation();
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32 }}>
        <Text variant="h1" weight="bold" align="center" color="primary" style={{ marginBottom: 8 }}>
          {t('settings_title')}
        </Text>
        <Button
          title={t('change_language')}
          icon={<Icon name="globe" type="Feather" color="#fff" size={20} />}
          onPress={() => navigation.navigate('LanguageSelection')}
          style={{ marginTop: 24 }}
        />
      </View>
    </ScrollView>
  );
};

export default SettingsScreen; 