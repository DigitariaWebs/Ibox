# 🍎 expo-maps on iOS Setup Guide

## Current Status for iPhone Users

On **iPhone**, your app will use **Apple Maps** through `expo-maps`, which provides the best native experience.

## ⚠️ Important: expo-maps Requires Development Build

**expo-maps does NOT work in Expo Go** - you need to build the app to see actual maps.

### Option 1: EAS Development Build (Recommended)

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to your Expo account
eas login

# Configure EAS (if not done already)
eas build:configure

# Build for iOS (requires Apple Developer account)
eas build --platform ios --profile development

# Install on your iPhone
# The build will provide a link to install the app
```

### Option 2: Local Development Build

```bash
# Install expo-dev-client
npx expo install expo-dev-client

# Run iOS build locally (requires Xcode)
npx expo run:ios
```

## 📱 What You'll See

### In Expo Go (Current)
- ❌ "Carte disponible avec react-native-maps ou EAS build" message
- ⚠️ Fallback UI or react-native-maps (if available)

### With Development Build
- ✅ **Native Apple Maps** via expo-maps
- ✅ Smooth zoom transition animation
- ✅ User location and native controls
- ✅ All expo-maps features working

## 🔧 Your Current Configuration

Your app is already configured correctly:

```json
// app.json
{
  "plugins": [
    [
      "expo-maps",
      {
        "requestLocationPermission": true,
        "locationPermission": "Allow $(PRODUCT_NAME) to use your location for better service delivery"
      }
    ]
  ],
  "ios": {
    "infoPlist": {
      "NSLocationWhenInUseUsageDescription": "This app uses location to provide better delivery services"
    }
  }
}
```

## 🚀 Quick Test

1. **In Expo Go**: You'll see fallback UI
2. **Build with EAS**: You'll see native Apple Maps with smooth animations

## 📋 Build Steps for iPhone

```bash
# 1. Make sure you're logged in
eas login

# 2. Build for iOS development
eas build --platform ios --profile development

# 3. Install the generated IPA file on your iPhone
# (EAS will provide installation instructions)

# 4. Test the map transition!
```

## 🎯 Expected Result

With a development build, you'll get:
- **Native Apple Maps** rendering
- **Smooth zoom transition** from SearchMapOverlay to full screen
- **User location** and **native controls**
- **Best iOS experience** possible

The transition will look amazing with native Apple Maps! 🗺️✨