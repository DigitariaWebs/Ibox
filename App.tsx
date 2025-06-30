import './global.css';
import React from 'react';
import { SafeAreaView, ScrollView, View, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { MotiView } from 'moti';
import * as Font from 'expo-font';
import { fontAssets, Fonts } from './src/config/fonts';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Text, SearchInput, Card, Input, Icon, BottomNavbar1 } from './src/ui';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/store';
import LanguageSelectionScreen from './src/LanguageSelectionScreen';
import { RootState } from './src/store/store';

// Import store and actions
import { increment, decrement, incrementByAmount } from './src/store/store';

function useLoadFonts() {
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      await Font.loadAsync(fontAssets);
      setLoaded(true);
    })();
  }, []);
  return loaded;
}

const FontShowcase: React.FC = () => (
  <View style={{ marginBottom: 32 }}>
    <Text variant="h3" weight="semibold" style={{ marginBottom: 16 }}>
      Font Showcase
    </Text>
    <View style={{ gap: 12 }}>
      <Text style={{ fontFamily: Fonts.PlayfairDisplay.Variable, fontSize: 22 }}>
        PlayfairDisplay VariableFont
      </Text>
      <Text style={{ fontFamily: Fonts.Roboto.Variable, fontSize: 22 }}>
        Roboto VariableFont
      </Text>
      <Text style={{ fontFamily: Fonts.Montserrat.Variable, fontSize: 22 }}>
        Montserrat VariableFont
      </Text>
      <Text style={{ fontFamily: Fonts.SFProDisplay.Bold, fontSize: 22 }}>
        SF Pro Display Bold
      </Text>
      <Text style={{ fontFamily: Fonts.SFProDisplay.Medium, fontSize: 22 }}>
        SF Pro Display Medium
      </Text>
      <Text style={{ fontFamily: Fonts.SFProDisplay.Regular, fontSize: 22 }}>
        SF Pro Display Regular
      </Text>
      <Text style={{ fontFamily: Fonts.SFProDisplay.ThinItalic, fontSize: 22 }}>
        SF Pro Display ThinItalic
      </Text>
      <Text style={{ fontFamily: Fonts.WayCome.Regular, fontSize: 22 }}>
        WayCome Regular
      </Text>
    </View>
  </View>
);

const IconShowcase: React.FC = () => (
  <View style={{ marginBottom: 32 }}>
    <Text variant="h3" weight="semibold" style={{ marginBottom: 16 }}>
      Icon Showcase
    </Text>
    <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
      <Icon name="search" type="Feather" size={32} color="#2563EB" />
      <Icon name="user" type="FontAwesome" size={32} color="#10B981" />
      <Icon name="star" type="MaterialIcons" size={32} color="#F59E0B" />
      <Icon name="check" type="Feather" size={32} color="#22C55E" />
      <Icon name="alert-circle" type="Feather" size={32} color="#EF4444" />
    </View>
  </View>
);

const Stack = createNativeStackNavigator();

export const HomeScreen: React.FC<any> = ({ navigation }) => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32 }}>
        <Text variant="h1" weight="bold" align="center" color="primary" style={{ marginBottom: 8 }}>
          Home
        </Text>
        <Button
          title="Go to Settings"
          icon={<Icon name="settings" type="Feather" color="#fff" size={20} />}
          onPress={() => navigation.navigate('Settings')}
          style={{ marginBottom: 24 }}
        />
        <Text variant="h3" weight="semibold" style={{ marginBottom: 16 }}>
          Redux Counter
        </Text>
        <View style={{ backgroundColor: '#F3F4F6', borderRadius: 12, padding: 24, alignItems: 'center' }}>
          <Text variant="h2" weight="bold" color="primary" style={{ marginBottom: 16 }}>
            {count}
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <Button title="Increment" onPress={() => dispatch(increment())} variant="primary" size="sm" />
            <Button title="Decrement" onPress={() => dispatch(decrement())} variant="secondary" size="sm" />
          </View>
          <Button title="+5" onPress={() => dispatch(incrementByAmount(5))} variant="outline" size="sm" />
        </View>
      </View>
    </ScrollView>
  );
};

export const SettingsScreen: React.FC<any> = ({ navigation }) => (
  <ScrollView style={{ flex: 1 }}>
    <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32 }}>
      <Text variant="h1" weight="bold" align="center" color="primary" style={{ marginBottom: 8 }}>
        Settings
      </Text>
      <Button
        title="Change Language"
        icon={<Icon name="globe" type="Feather" color="#fff" size={20} />}
        onPress={() => navigation.navigate('LanguageSelection')}
        style={{ marginTop: 24 }}
      />
    </View>
  </ScrollView>
);

const RootNavigator = () => {
  const language = useSelector((state: RootState) => state.language.value);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {(!language || language === 'en' || language === 'fr') ? (
          <>
            <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
            <Stack.Screen name="Main" component={BottomNavbar1} />
          </>
        ) : (
          <Stack.Screen name="Main" component={BottomNavbar1} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  const fontsLoaded = useLoadFonts();
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 16 }}>Loading fonts...</Text>
      </View>
    );
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootNavigator />
      </PersistGate>
    </Provider>
  );
}
