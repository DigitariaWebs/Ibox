import './global.css';
import React from 'react';
import { SafeAreaView, ScrollView, View, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { MotiView } from 'moti';
import * as Font from 'expo-font';
import { fontAssets, Fonts } from './src/config/fonts';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Text, SearchInput, Card, Input, Icon } from './src/ui';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/store';
import LanguageSelectionScreen from './src/LanguageSelectionScreen';
import AuthSelectionScreen from './src/AuthSelectionScreen';
import { RootState } from './src/store/store';
import LoadingScreen from './src/LoadingScreen';
import OnboardingScreen from './src/OnboardingScreen';
import LoginScreen from './src/LoginScreen';
import HomeScreen from './src/HomeScreen';
import TransporterHomeScreen from './src/screens/TransporterHomeScreen';
import SettingsScreen from './src/SettingsScreen';
import { SignUpProvider } from './src/contexts/SignUpContext';
import OnboardingEntryScreen from './src/screens/signup/OnboardingEntryScreen';
import AccountTypeScreen from './src/screens/signup/AccountTypeScreen';
import IdentityScreen from './src/screens/signup/IdentityScreen';
import OTPVerificationScreen from './src/screens/signup/OTPVerificationScreen';
import AddressLocaleScreen from './src/screens/signup/AddressLocaleScreen';
import CustomerExtrasScreen from './src/screens/signup/CustomerExtrasScreen';
import PaymentMethodScreen from './src/screens/signup/PaymentMethodScreen';
import CustomerAccountTypeScreen from './src/screens/signup/CustomerAccountTypeScreen';
import BusinessDetailsScreen from './src/screens/signup/BusinessDetailsScreen';
import TransporterVehicleScreen from './src/screens/signup/TransporterVehicleScreen';
import TransporterComplianceScreen from './src/screens/signup/TransporterComplianceScreen';
import TransporterBankingScreen from './src/screens/signup/TransporterBankingScreen';
import ConfirmationScreen from './src/screens/signup/ConfirmationScreen';
import MapScreen from './src/screens/MapScreen';
import PersonalInfoScreen from './src/screens/PersonalInfoScreen';
import AddressesScreen from './src/screens/AddressesScreen';
import PaymentMethodsScreen from './src/screens/PaymentMethodsScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import AboutScreen from './src/screens/AboutScreen';
import ColisScreen from './src/screens/services/ColisScreen';
import DemenagementScreen from './src/screens/services/DemenagementScreen';
import StockageScreen from './src/screens/services/StockageScreen';
import ExpressScreen from './src/screens/services/ExpressScreen';
import PackagePhotoScreen from './src/screens/PackagePhotoScreen';
import MeasuringScreen from './src/screens/MeasuringScreen';
import OrderSummaryScreen from './src/screens/OrderSummaryScreen';
import DriverSearchScreen from './src/screens/DriverSearchScreen';
import DriverFoundScreen from './src/screens/DriverFoundScreen';

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

const RootNavigator = () => {
  const language = useSelector((state: RootState) => state.language.value);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthSelection" component={AuthSelectionScreen} />
        <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OnboardingEntry" component={OnboardingEntryScreen} />
        <Stack.Screen name="AccountTypeScreen" component={AccountTypeScreen} />
        <Stack.Screen name="IdentityScreen" component={IdentityScreen} />
        <Stack.Screen name="OTPVerificationScreen" component={OTPVerificationScreen} />
        <Stack.Screen name="AddressLocaleScreen" component={AddressLocaleScreen} />
        <Stack.Screen name="PaymentMethodScreen" component={PaymentMethodScreen} />
        <Stack.Screen name="CustomerAccountTypeScreen" component={CustomerAccountTypeScreen} />
        <Stack.Screen name="BusinessDetailsScreen" component={BusinessDetailsScreen} />
        <Stack.Screen name="CustomerExtrasScreen" component={CustomerExtrasScreen} />
        <Stack.Screen name="TransporterVehicleScreen" component={TransporterVehicleScreen} />
        <Stack.Screen name="TransporterComplianceScreen" component={TransporterComplianceScreen} />
        <Stack.Screen name="TransporterBankingScreen" component={TransporterBankingScreen} />
        <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="TransporterHomeScreen" component={TransporterHomeScreen} />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen 
          name="MapScreen" 
          component={MapScreen}
          options={{
            presentation: 'transparentModal',
            animation: 'none',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="PersonalInfo" 
          component={PersonalInfoScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Addresses" 
          component={AddressesScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="PaymentMethods" 
          component={PaymentMethodsScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="OrderHistory" 
          component={OrderHistoryScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="HelpSupport" 
          component={HelpSupportScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="About" 
          component={AboutScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ColisService" 
          component={ColisScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DemenagementScreen"
          component={DemenagementScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StockageScreen"
          component={StockageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ExpressScreen"
          component={ExpressScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="PackagePhoto" 
          component={PackagePhotoScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Measuring" 
          component={MeasuringScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="OrderSummary" 
          component={OrderSummaryScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="DriverSearch" 
          component={DriverSearchScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="DriverFound" 
          component={DriverFoundScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  const fontsLoaded = useLoadFonts();
  const [appReady, setAppReady] = React.useState(false);
  const [onboardingComplete, setOnboardingComplete] = React.useState(false);
  
  if (!fontsLoaded) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
          <ActivityIndicator size="large" color="#0AA5A8" />
          <Text style={{ marginTop: 16 }}>Loading fonts...</Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  if (!appReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LoadingScreen onLoadingComplete={() => setAppReady(true)} />
      </GestureHandlerRootView>
    );
  }

  if (!onboardingComplete) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <OnboardingScreen onGetStarted={() => setOnboardingComplete(true)} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SignUpProvider>
            <RootNavigator />
          </SignUpProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
