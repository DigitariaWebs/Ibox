import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '../Icon';
import { Colors } from '../../config/colors';
import HomeScreen from '../../HomeScreen';
import SettingsScreen from '../../SettingsScreen';

const Tab = createBottomTabNavigator();

export const BottomNavbar1: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 0,
        elevation: 8,
        height: 70,
        paddingBottom: 24,
        paddingTop: 8,
      },
      tabBarIcon: ({ focused }) => {
        let iconName: string = '';
        let iconType: any = 'Feather';
        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Search':
            iconName = 'search';
            break;
          case 'Settings':
            iconName = 'settings';
            break;
        }
        return (
          <Icon
            name={iconName}
            type={iconType}
            size={focused ? 28 : 24}
            color={focused ? Colors.primary : '#9CA3AF'}
            style={{ opacity: focused ? 1 : 0.7, transition: 'all 0.2s' }}
          />
        );
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={() => null} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
); 