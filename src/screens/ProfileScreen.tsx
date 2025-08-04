import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import ClientProfileScreen from './ClientProfileScreen';
import DriverProfileScreen from './DriverProfileScreen';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const userType = useSelector((state: RootState) => state.user.accountType);
  
  // Determine which profile screen to show based on user type
  if (userType === 'transporter' || userType === 'driver') {
    return <DriverProfileScreen navigation={navigation} />;
  }
  
  // Default to client profile for customers
  return <ClientProfileScreen navigation={navigation} />;
};

export default ProfileScreen;