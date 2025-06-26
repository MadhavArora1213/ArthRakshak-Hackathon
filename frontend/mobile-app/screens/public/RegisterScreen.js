import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import color from '../../constants/theme/color';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateName = (name) => {
    if (!name.trim()) {
      return 'नाम आवश्यक है / Name is required';
    }
    if (name.trim().length < 3) {
      return 'नाम कम से कम 3 अक्षर का होना चाहिए / Name must be at least 3 characters';
    }
    return '';
  };

  const validateMobile = (mobile) => {
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile) {
      return 'मोबाइल नंबर आवश्यक है / Mobile number is required';
    }
    if (cleanMobile.length !== 10) {
      return 'मोबाइल नंबर 10 अंकों का होना चाहिए / Mobile number must be 10 digits';
    }
    if (!cleanMobile.match(/^[6-9]\d{9}$/)) {
      return 'वैध भारतीय मोबाइल नंबर दर्ज करें / Enter valid Indian mobile number';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'वैध ईमेल पता दर्ज करें / Enter valid email address';
    }
    return '';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Format mobile number
    if (field === 'mobileNumber') {
      const cleanValue = value.replace(/\D/g, '');
      if (cleanValue.length <= 10) {
        setFormData(prev => ({ ...prev, [field]: cleanValue }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    newErrors.fullName = validateName(formData.fullName);
    newErrors.mobileNumber = validateMobile(formData.mobileNumber);
    newErrors.emailAddress = validateEmail(formData.emailAddress);

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      Alert.alert(
        'त्रुटि / Error',
        'कृपया सभी आवश्यक फ़ील्ड सही तरीके से भरें / Please fill all required fields correctly'
      );
      return;
    }

    setIsLoading(true);
    try {
      // Save registration data temporarily
      const registrationData = {
        fullName: formData.fullName.trim(),
        mobileNumber: `+91${formData.mobileNumber}`,
        emailAddress: formData.emailAddress.trim(),
        timestamp: new Date().toISOString(),
      };

      await AsyncStorage.setItem('registrationData', JSON.stringify(registrationData));
      
      // Navigate to phone verification
      navigation.navigate('PhoneVerificationScreen', {
        mobileNumber: formData.mobileNumber,
        fullName: formData.fullName.trim(),
      });
    } catch (error) {
      Alert.alert(
        'त्रुटि / Error',
        'कुछ गलत हुआ। कृपया पुनः प्रयास करें / Something went wrong. Please try again'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim().length >= 3 &&
      formData.mobileNumber.length === 10 &&
      validateMobile(formData.mobileNumber) === '' &&
      validateEmail(formData.emailAddress) === ''
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>पंजीकरण / Register</Text>
            <Text style={styles.subtitle}>अपना विवरण भरें और शुरू करें</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Icon name="person-outline" size={20} color={color.pureWhite[600]} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="पूरा नाम / Full Name"
                  placeholderTextColor={color.pureWhite[500]}
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange('fullName', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  accessibilityLabel="Full Name Input"
                />
              </View>
              {errors.fullName ? (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              ) : null}
            </View>

            {/* Mobile Number Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Icon name="call-outline" size={20} color={color.pureWhite[600]} style={styles.inputIcon} />
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={[styles.textInput, styles.mobileInput]}
                  placeholder="मोबाइल नंबर / Mobile Number"
                  placeholderTextColor={color.pureWhite[500]}
                  value={formData.mobileNumber}
                  onChangeText={(value) => handleInputChange('mobileNumber', value)}
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="next"
                  accessibilityLabel="Mobile Number Input"
                />
              </View>
              {errors.mobileNumber ? (
                <Text style={styles.errorText}>{errors.mobileNumber}</Text>
              ) : null}
            </View>

            {/* Email Address Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Icon name="mail-outline" size={20} color={color.pureWhite[600]} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="ईमेल / Email (वैकल्पिक / Optional)"
                  placeholderTextColor={color.pureWhite[500]}
                  value={formData.emailAddress}
                  onChangeText={(value) => handleInputChange('emailAddress', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                  accessibilityLabel="Email Address Input"
                />
              </View>
              {errors.emailAddress ? (
                <Text style={styles.errorText}>{errors.emailAddress}</Text>
              ) : null}
            </View>
          </View>

          {/* Continue Button */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                (!isFormValid() || isLoading) && styles.disabledButton,
              ]}
              onPress={handleContinue}
              disabled={!isFormValid() || isLoading}
              accessibilityLabel="Continue Registration"
              accessibilityRole="button"
            >
              <Text style={[
                styles.continueButtonText,
                (!isFormValid() || isLoading) && styles.disabledButtonText,
              ]}>
                {isLoading ? 'प्रतीक्षा करें... / Please wait...' : 'जारी रखें / Continue'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.helpText}>
              पंजीकरण करके आप हमारी सेवा की शर्तों से सहमत हैं
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.pureWhite[50],
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: color.pureWhite[900],
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: color.pureWhite[600],
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  formSection: {
    flex: 1,
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.pureWhite[100],
    borderWidth: 1,
    borderColor: color.pureWhite[300],
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 4,
    elevation: 1,
    shadowColor: color.pureWhite[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  countryCode: {
    fontSize: 16,
    color: color.pureWhite[800],
    fontWeight: '600',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: color.pureWhite[900],
    paddingVertical: 12,
    fontWeight: '500',
  },
  mobileInput: {
    marginLeft: 0,
  },
  errorText: {
    fontSize: 12,
    color: color.alertRed[600],
    marginTop: 5,
    marginLeft: 15,
    fontWeight: '500',
  },
  buttonSection: {
    paddingVertical: 30,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: color.primaryGreen[500],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: color.primaryGreen[700],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: color.pureWhite[400],
    elevation: 0,
    shadowOpacity: 0,
  },
  continueButtonText: {
    color: color.pureWhite[50],
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: color.pureWhite[600],
  },
  helpText: {
    fontSize: 12,
    color: color.pureWhite[500],
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});

export default RegisterScreen;