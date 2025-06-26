import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import color from '../../constants/theme/color';

const AadhaarVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const inputRef = useRef(null);

  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [formattedAadhaar, setFormattedAadhaar] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Auto-focus input on screen load
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  const formatAadhaarNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Limit to 12 digits
    const limited = cleaned.substring(0, 12);
    
    // Format as XXXX-XXXX-XXXX
    let formatted = '';
    for (let i = 0; i < limited.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += '-';
      }
      formatted += limited[i];
    }
    
    return { cleaned: limited, formatted };
  };

  const validateAadhaar = (aadhaar) => {
    if (!aadhaar) {
      return 'आधार नंबर आवश्यक है / Aadhaar number is required';
    }
    
    if (aadhaar.length !== 12) {
      return 'आधार नंबर 12 अंकों का होना चाहिए / Aadhaar number must be 12 digits';
    }
    
    // Basic pattern validation (should not start with 0 or 1)
    if (aadhaar.startsWith('0') || aadhaar.startsWith('1')) {
      return 'वैध आधार नंबर दर्ज करें / Enter valid Aadhaar number';
    }
    
    return '';
  };

  const handleAadhaarChange = (value) => {
    const { cleaned, formatted } = formatAadhaarNumber(value);
    
    setAadhaarNumber(cleaned);
    setFormattedAadhaar(formatted);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const simulateAadhaarValidation = (aadhaar) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // For demo: accept any valid 12-digit number not starting with 0 or 1
        if (aadhaar.length === 12 && !aadhaar.startsWith('0') && !aadhaar.startsWith('1')) {
          resolve({ success: true, verified: true });
        } else {
          reject({ error: 'Invalid Aadhaar number' });
        }
      }, 2000);
    });
  };

  const handleValidateAadhaar = async () => {
    const validationError = validateAadhaar(aadhaarNumber);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await simulateAadhaarValidation(aadhaarNumber);
      
      // Save verification status (DO NOT save actual Aadhaar number)
      await AsyncStorage.setItem('aadhaarVerified', 'true');
      await AsyncStorage.setItem('aadhaarLastFour', aadhaarNumber.slice(-4));
      
      Alert.alert(
        'सत्यापन सफल! / Verification Successful!',
        'आधार सत्यापन पूरा हुआ / Aadhaar verification completed',
        [
          {
            text: 'आगे बढ़ें / Continue',
            onPress: () => navigation.navigate('SecuritySetupScreen'),
          },
        ]
      );
    } catch (error) {
      setError('सत्यापन विफल। कृपया पुनः प्रयास करें / Verification failed. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'छोड़ें? / Skip?',
      'क्या आप आधार सत्यापन छोड़ना चाहते हैं? इसे बाद में भी किया जा सकता है / Do you want to skip Aadhaar verification? This can be done later too',
      [
        {
          text: 'रद्द करें / Cancel',
          style: 'cancel',
        },
        {
          text: 'छोड़ें / Skip',
          onPress: async () => {
            await AsyncStorage.setItem('aadhaarSkipped', 'true');
            navigation.navigate('SecuritySetupScreen');
          },
        },
      ]
    );
  };

  const isValidAadhaar = () => {
    return aadhaarNumber.length === 12 && validateAadhaar(aadhaarNumber) === '';
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
          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
            <Text style={styles.progressText}>Step 3 of 5 • 60% Complete</Text>
          </View>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Icon name="card-outline" size={60} color={color.primaryGreen[500]} />
            <Text style={styles.title}>आधार सत्यापन / Aadhaar Verification</Text>
            <Text style={styles.subtitle}>
              पहचान की पुष्टि के लिए अपना आधार नंबर दर्ज करें
            </Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>आधार नंबर / Aadhaar Number</Text>
            
            <View style={[
              styles.inputWrapper,
              isFocused && styles.inputWrapperFocused,
              error && styles.inputWrapperError,
            ]}>
              <Icon name="card" size={20} color={color.pureWhite[600]} style={styles.inputIcon} />
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                placeholder="XXXX-XXXX-XXXX"
                placeholderTextColor={color.pureWhite[500]}
                value={formattedAadhaar}
                onChangeText={handleAadhaarChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="numeric"
                maxLength={14} // Including hyphens
                secureTextEntry={!isFocused}
                returnKeyType="done"
                onSubmitEditing={handleValidateAadhaar}
                accessibilityLabel="Aadhaar Number Input"
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
            
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
          </View>

          {/* Assurance Message */}
          <View style={styles.assuranceSection}>
            <Icon name="shield-checkmark" size={20} color={color.primaryGreen[600]} />
            <Text style={styles.assuranceText}>
              आपका आधार केवल पहचान सत्यापन के लिए उपयोग होता है। हम संवेदनशील व्यक्तिगत डेटा संग्रहीत नहीं करते हैं。
            </Text>
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[
                styles.validateButton,
                (!isValidAadhaar() || isLoading) && styles.disabledButton,
              ]}
              onPress={handleValidateAadhaar}
              disabled={!isValidAadhaar() || isLoading}
              accessibilityLabel="Validate Aadhaar"
              accessibilityRole="button"
            >
              <Text style={[
                styles.validateButtonText,
                (!isValidAadhaar() || isLoading) && styles.disabledButtonText,
              ]}>
                {isLoading ? 'जाँच रहे हैं... / Validating...' : 'जाँच करें / Validate'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              accessibilityLabel="Skip Aadhaar verification"
              accessibilityRole="button"
            >
              <Text style={styles.skipButtonText}>अभी छोड़ें / Skip for now</Text>
            </TouchableOpacity>

            <Text style={styles.helpText}>
              आधार सत्यापन वैकल्पिक है लेकिन बेहतर सुरक्षा के लिए अनुशंसित है
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
  progressSection: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: color.pureWhite[300],
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: color.primaryGreen[500],
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: color.pureWhite[600],
    fontWeight: '500',
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: color.pureWhite[900],
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: color.pureWhite[600],
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  inputSection: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    color: color.pureWhite[800],
    fontWeight: '600',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.pureWhite[100],
    borderWidth: 2,
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
  inputWrapperFocused: {
    borderColor: color.primaryGreen[500],
    backgroundColor: color.primaryGreen[50],
    elevation: 2,
  },
  inputWrapperError: {
    borderColor: color.alertRed[500],
    backgroundColor: color.alertRed[50],
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: color.pureWhite[900],
    paddingVertical: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  errorText: {
    fontSize: 12,
    color: color.alertRed[600],
    marginTop: 5,
    marginLeft: 15,
    fontWeight: '500',
  },
  assuranceSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: color.primaryGreen[50],
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: color.primaryGreen[500],
  },
  assuranceText: {
    flex: 1,
    fontSize: 14,
    color: color.primaryGreen[800],
    lineHeight: 20,
    marginLeft: 10,
    fontWeight: '500',
  },
  buttonSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  validateButton: {
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
  validateButtonText: {
    color: color.pureWhite[50],
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: color.pureWhite[600],
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  skipButtonText: {
    color: color.pureWhite[600],
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  helpText: {
    fontSize: 12,
    color: color.pureWhite[500],
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});

export default AadhaarVerificationScreen;