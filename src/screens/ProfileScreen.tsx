import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ClientProfileScreen from './ClientProfileScreen';
import DriverProfileScreen from './DriverProfileScreen';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  
  // Determine which profile screen to show based on user type from auth context
  if (user?.userType === 'transporter' || user?.userType === 'driver') {
    return <DriverProfileScreen navigation={navigation} />;
  }
  
  // Default to client profile for customers
  return <ClientProfileScreen navigation={navigation} />;
};

export default ProfileScreen;