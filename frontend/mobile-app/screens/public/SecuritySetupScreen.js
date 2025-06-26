import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Remove these imports:
// import * as Keychain from 'react-native-keychain';
// import ReactNativeBiometrics from 'react-native-biometrics';
import Icon from 'react-native-vector-icons/Ionicons';
import color from '../../constants/theme/color';

const SecuritySetupScreen = () => {
  const navigation = useNavigation();
  const pinRef = useRef(null);
  const confirmPinRef = useRef(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState('Fingerprint');
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(true);

  useEffect(() => {
    checkBiometricAvailability();
    setTimeout(() => {
      pinRef.current?.focus();
    }, 500);
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      // Mock biometric availability for development
      setIsBiometricAvailable(true);
      setBiometricType(Platform.OS === 'ios' ? 'FaceID' : 'Fingerprint');
    } catch (error) {
      console.log('Biometric check error:', error);
      setIsBiometricAvailable(false);
    }
  };

  const validatePin = (pinValue) => {
    if (!pinValue) {
      return 'PIN आवश्यक है / PIN is required';
    }
    if (pinValue.length !== 4) {
      return 'PIN 4 अंकों का होना चाहिए / PIN must be 4 digits';
    }
    if (!/^\d{4}$/.test(pinValue)) {
      return 'केवल संख्याएं स्वीकार्य हैं / Only numbers allowed';
    }
    return '';
  };

  const validateConfirmPin = (confirmPinValue) => {
    if (!confirmPinValue) {
      return 'PIN की पुष्टि आवश्यक है / Confirm PIN is required';
    }
    if (confirmPinValue !== pin) {
      return 'PIN मैच नहीं कर रहे / PINs do not match';
    }
    return '';
  };

  const handlePinChange = (value) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;
    
    if (value.length <= 4) {
      setPin(value);
      if (error) setError('');
      
      // Auto-focus confirm PIN when 4 digits entered
      if (value.length === 4) {
        confirmPinRef.current?.focus();
      }
    }
  };

  const handleConfirmPinChange = (value) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;
    
    if (value.length <= 4) {
      setConfirmPin(value);
      if (error) setError('');
    }
  };

  const triggerShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const storePinSecurely = async (pinValue) => {
    try {
      // Store PIN using AsyncStorage for development
      await AsyncStorage.setItem('userPIN', pinValue);
      await AsyncStorage.setItem('pinCreatedAt', new Date().toISOString());
      return true;
    } catch (error) {
      console.error('PIN storage error:', error);
      return false;
    }
  };

  const setupBiometric = async () => {
    try {
      // Mock biometric setup for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      await AsyncStorage.setItem('biometricEnabled', 'true');
      await AsyncStorage.setItem('biometricType', biometricType);
      return true;
    } catch (error) {
      console.error('Biometric setup error:', error);
      return false;
    }
  };

  const handleContinue = async () => {
    const pinError = validatePin(pin);
    const confirmPinError = validateConfirmPin(confirmPin);

    if (pinError || confirmPinError) {
      setError(pinError || confirmPinError);
      triggerShakeAnimation();
      return;
    }

    setIsLoading(true);

    try {
      // Store PIN securely
      const pinStored = await storePinSecurely(pin);
      if (!pinStored) {
        Alert.alert('त्रुटि / Error', 'PIN संग्रहीत करने में समस्या / Problem storing PIN');
        return;
      }

      // Setup biometric if enabled
      if (isBiometricEnabled && isBiometricAvailable) {
        const biometricSetup = await setupBiometric();
        if (!biometricSetup) {
          Alert.alert(
            'बायोमेट्रिक सेटअप / Biometric Setup',
            'बायोमेट्रिक सेटअप विफल। आप PIN का उपयोग कर सकते हैं / Biometric setup failed. You can use PIN'
          );
        }
      }

      // Save security setup completion
      await AsyncStorage.setItem('securitySetupComplete', 'true');

      Alert.alert(
        'सुरक्षा सेटअप पूर्ण! / Security Setup Complete!',
        'आपका खाता सुरक्षित है। अब बायोमेट्रिक सेटअप करें / Your account is secure. Now setup biometric authentication',
        [
          {
            text: 'आगे बढ़ें / Continue',
            onPress: () => navigation.navigate('BiometricRegistrationScreen'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('त्रुटि / Error', 'सुरक्षा सेटअप में समस्या / Problem in security setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isFormValid = () => {
    return (
      pin.length === 4 &&
      confirmPin.length === 4 &&
      pin === confirmPin &&
      validatePin(pin) === ''
    );
  };

  const getBiometricIcon = () => {
    switch (biometricType) {
      case 'FaceID':
        return 'scan';
      case 'TouchID':
      case 'Fingerprint':
        return 'finger-print';
      default:
        return 'lock-closed';
    }
  };

  const getBiometricLabel = () => {
    switch (biometricType) {
      case 'FaceID':
        return 'Face ID सक्षम करें / Enable Face ID';
      case 'TouchID':
        return 'Touch ID सक्षम करें / Enable Touch ID';
      case 'Fingerprint':
        return 'फिंगरप्रिंट सक्षम करें / Enable Fingerprint';
      default:
        return 'बायोमेट्रिक लॉगिन सक्षम करें / Enable Biometric Login';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header with Back Button */}
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={color.pureWhite[800]} />
          </TouchableOpacity>

          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '70%' }]} />
            </View>
            <Text style={styles.progressText}>Step 4 of 6 • Security Setup</Text>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Icon name="shield-checkmark" size={60} color={color.primaryGreen[500]} />
          <Text style={styles.title}>सुरक्षा सेटअप / Security Setup</Text>
          <Text style={styles.subtitle}>
            अपने खाते को सुरक्षित करने के लिए 4-अंकीय PIN बनाएं
          </Text>
        </View>

        {/* PIN Input Section */}
        <Animated.View style={[styles.pinSection, { transform: [{ translateX: shakeAnimation }] }]}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>4-अंकीय PIN बनाएं / Create 4-digit PIN</Text>
            <TextInput
              ref={pinRef}
              style={styles.pinInput}
              value={pin}
              onChangeText={handlePinChange}
              placeholder="● ● ● ●"
              placeholderTextColor={color.pureWhite[500]}
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              returnKeyType="next"
              onSubmitEditing={() => confirmPinRef.current?.focus()}
              accessibilityLabel="Create PIN"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PIN की पुष्टि करें / Confirm PIN</Text>
            <TextInput
              ref={confirmPinRef}
              style={[
                styles.pinInput,
                confirmPin && pin !== confirmPin && styles.pinInputError,
              ]}
              value={confirmPin}
              onChangeText={handleConfirmPinChange}
              placeholder="● ● ● ●"
              placeholderTextColor={color.pureWhite[500]}
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              accessibilityLabel="Confirm PIN"
            />
          </View>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
        </Animated.View>

        {/* Biometric Section */}
        {isBiometricAvailable && (
          <View style={styles.biometricSection}>
            <View style={styles.biometricOption}>
              <View style={styles.biometricInfo}>
                <Icon name={getBiometricIcon()} size={24} color={color.primaryGreen[600]} />
                <Text style={styles.biometricLabel}>{getBiometricLabel()}</Text>
              </View>
              <Switch
                value={isBiometricEnabled}
                onValueChange={setIsBiometricEnabled}
                trackColor={{ false: color.pureWhite[300], true: color.primaryGreen[200] }}
                thumbColor={isBiometricEnabled ? color.primaryGreen[500] : color.pureWhite[500]}
                ios_backgroundColor={color.pureWhite[300]}
              />
            </View>
            <Text style={styles.biometricHint}>
              {isBiometricEnabled 
                ? 'आप PIN या बायोमेट्रिक से लॉगिन कर सकेंगे / You can login with PIN or biometric'
                : 'बायोमेट्रिक लॉगिन तेज़ और सुरक्षित है / Biometric login is fast and secure'
              }
            </Text>
          </View>
        )}

        {/* Security Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>सुरक्षा सुझाव / Security Tips:</Text>
          <Text style={styles.tipText}>• अपना PIN किसी के साथ साझा न करें</Text>
          <Text style={styles.tipText}>• PIN को याद रखें या सुरक्षित स्थान पर लिखें</Text>
          <Text style={styles.tipText}>• नियमित रूप से अपना PIN बदलें</Text>
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
            accessibilityLabel="Continue Securely"
            accessibilityRole="button"
          >
            <Text style={[
              styles.continueButtonText,
              (!isFormValid() || isLoading) && styles.disabledButtonText,
            ]}>
              {isLoading ? 'सेटअप कर रहे हैं... / Setting up...' : 'सुरक्षित रूप से जारी रखें / Continue Securely'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.pureWhite[50],
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressSection: {
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
  titleSection: {
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
  pinSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: color.pureWhite[800],
    fontWeight: '600',
    marginBottom: 10,
  },
  pinInput: {
    backgroundColor: color.pureWhite[100],
    borderWidth: 2,
    borderColor: color.pureWhite[300],
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 24,
    fontWeight: 'bold',
    color: color.pureWhite[900],
    textAlign: 'center',
    letterSpacing: 8,
    elevation: 1,
    shadowColor: color.pureWhite[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pinInputError: {
    borderColor: color.alertRed[500],
    backgroundColor: color.alertRed[50],
  },
  errorText: {
    fontSize: 12,
    color: color.alertRed[600],
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
  biometricSection: {
    backgroundColor: color.primaryGreen[50],
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: color.primaryGreen[200],
  },
  biometricOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  biometricInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  biometricLabel: {
    fontSize: 16,
    color: color.primaryGreen[800],
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  biometricHint: {
    fontSize: 12,
    color: color.primaryGreen[700],
    lineHeight: 18,
  },
  tipsSection: {
    backgroundColor: color.infoYellow[50],
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: color.infoYellow[500],
  },
  tipsTitle: {
    fontSize: 14,
    color: color.infoYellow[800],
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: color.infoYellow[700],
    lineHeight: 18,
    marginBottom: 3,
  },
  buttonSection: {
    flex: 1,
    justifyContent: 'flex-end',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SecuritySetupScreen;