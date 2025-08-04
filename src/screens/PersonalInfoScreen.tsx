import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Modal,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Text, Icon } from '../ui';
import { Colors } from '../config/colors';
import { RootState, setUserData } from '../store/store';

interface PersonalInfoScreenProps {
  navigation: any;
}

const PersonalInfoScreen: React.FC<PersonalInfoScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.userData);
  const accountType = useSelector((state: RootState) => state.user.accountType);

  // Simple state - no complex objects
  const [firstName, setFirstName] = useState(userData.firstName || '');
  const [lastName, setLastName] = useState(userData.lastName || '');
  const [email, setEmail] = useState(userData.email || '');
  const [phone, setPhone] = useState('+1 (514) 555-0123');
  const [address, setAddress] = useState('1234 Rue Sainte-Catherine');
  const [city, setCity] = useState('Montreal');
  const [postalCode, setPostalCode] = useState('H3G 1M8');
  const [dateOfBirth, setDateOfBirth] = useState('1990-05-15');
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(setUserData({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        loginMethod: userData.loginMethod,
        accountType: accountType,
      }));

      Alert.alert('Success', 'Information saved successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save information');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Select your birth date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const DatePickerModal = () => {
    const [tempDate, setTempDate] = useState(new Date(dateOfBirth || '1990-01-01'));
    
    const years = Array.from({length: 80}, (_, i) => new Date().getFullYear() - 18 - i);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const days = Array.from({length: 31}, (_, i) => i + 1);

    const handleDateSelect = () => {
      const formattedDate = tempDate.toLocaleDateString('en-CA');
      setDateOfBirth(formattedDate);
      setShowDatePicker(false);
    };
    
    return (
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Date of Birth</Text>
              <TouchableOpacity onPress={handleDateSelect}>
                <Text style={styles.modalDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.datePickerContainer}>
              <View style={styles.dateColumn}>
                <Text style={styles.dateColumnTitle}>Month</Text>
                <ScrollView style={styles.dateScrollView} showsVerticalScrollIndicator={false}>
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={`month-${index}`}
                      style={[
                        styles.dateOption,
                        tempDate.getMonth() === index && styles.selectedDateOption
                      ]}
                      onPress={() => setTempDate(new Date(tempDate.getFullYear(), index, tempDate.getDate()))}
                    >
                      <Text style={[
                        styles.dateOptionText,
                        tempDate.getMonth() === index && styles.selectedDateOptionText
                      ]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.dateColumn}>
                <Text style={styles.dateColumnTitle}>Day</Text>
                <ScrollView style={styles.dateScrollView} showsVerticalScrollIndicator={false}>
                  {days.map(day => (
                    <TouchableOpacity
                      key={`day-${day}`}
                      style={[
                        styles.dateOption,
                        tempDate.getDate() === day && styles.selectedDateOption
                      ]}
                      onPress={() => setTempDate(new Date(tempDate.getFullYear(), tempDate.getMonth(), day))}
                    >
                      <Text style={[
                        styles.dateOptionText,
                        tempDate.getDate() === day && styles.selectedDateOptionText
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.dateColumn}>
                <Text style={styles.dateColumnTitle}>Year</Text>
                <ScrollView style={styles.dateScrollView} showsVerticalScrollIndicator={false}>
                  {years.map(year => (
                    <TouchableOpacity
                      key={`year-${year}`}
                      style={[
                        styles.dateOption,
                        tempDate.getFullYear() === year && styles.selectedDateOption
                      ]}
                      onPress={() => setTempDate(new Date(year, tempDate.getMonth(), tempDate.getDate()))}
                    >
                      <Text style={[
                        styles.dateOptionText,
                        tempDate.getFullYear() === year && styles.selectedDateOptionText
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" type="Feather" size={28} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Information</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <ImageBackground
              source={{ uri: 'https://i.pravatar.cc/120?img=2' }}
              style={styles.profileImage}
              imageStyle={styles.profileImageStyle}
            >
              <TouchableOpacity style={styles.editImageButton}>
                <Icon name="camera" type="Feather" size={14} color={Colors.white} />
              </TouchableOpacity>
            </ImageBackground>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.profileTitle}>Complete Your Profile</Text>
            <Text style={styles.profileSubtitle}>Update your personal information</Text>
          </View>
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Personal Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="John"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
              <View style={styles.nameField}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Doe"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="john.doe@example.com"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 (514) 555-0123"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Address Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Street Address</Text>
              <TextInput
                style={styles.textInput}
                value={address}
                onChangeText={setAddress}
                placeholder="1234 Main Street"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>

            <View style={styles.addressRow}>
              <View style={styles.cityField}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.textInput}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Montreal"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
              <View style={styles.postalField}>
                <Text style={styles.inputLabel}>Postal Code</Text>
                <TextInput
                  style={styles.textInput}
                  value={postalCode}
                  onChangeText={setPostalCode}
                  placeholder="H3G 1M8"
                  placeholderTextColor={Colors.textTertiary}
                  autoCapitalize="characters"
                  maxLength={7}
                />
              </View>
            </View>
          </View>

          {/* Additional Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  {formatDisplayDate(dateOfBirth)}
                </Text>
                <Icon name="calendar" type="Feather" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Information'}
            </Text>
            {!isLoading && (
              <Icon name="check" type="Feather" size={20} color={Colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      <DatePickerModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 28,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageStyle: {
    borderRadius: 30,
  },
  editImageButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  headerInfo: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    minHeight: 48,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  nameField: {
    flex: 1,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 16,
  },
  cityField: {
    flex: 2,
  },
  postalField: {
    flex: 1,
  },
  datePickerButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    backgroundColor: Colors.surface,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.textTertiary,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.white,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  modalCancelText: {
    fontSize: 17,
    color: Colors.textSecondary,
  },
  modalDoneText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.primary,
  },
  datePickerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: 300,
  },
  dateColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  dateColumnTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  dateScrollView: {
    maxHeight: 200,
  },
  dateOption: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedDateOption: {
    backgroundColor: Colors.primary,
  },
  dateOptionText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  selectedDateOptionText: {
    color: Colors.white,
    fontWeight: '600',
  },
});

export default PersonalInfoScreen;