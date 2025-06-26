import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Remove these imports:
// import * as Keychain from 'react-native-keychain';
// import ReactNativeBiometrics from 'react-native-biometrics';
import Icon from 'react-native-vector-icons/Ionicons';
import color from '../../constants/theme/color';

const BiometricRegistrationScreen = () => {
  const navigation = useNavigation();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const [biometricType, setBiometricType] = useState('Fingerprint');
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    startAnimations();
  }, []);

  const checkBiometricAvailability = async () => {
    // Mock biometric availability for development
    try {
      // For development, assume biometrics are available
      setIsBiometricAvailable(true);
      setBiometricType(Platform.OS === 'ios' ? 'FaceID' : 'Fingerprint');
    } catch (error) {
      console.log('Biometric availability check failed:', error);
      setIsBiometricAvailable(false);
    }
  };

  const startAnimations = () => {
    // Scale in animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Pulse animation
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  };

  const getBiometricIcon = () => {
    switch (biometricType) {
      case 'FaceID':
        return 'scan';
      case 'TouchID':
      case 'Fingerprint':
        return 'finger-print';
      default:
        return 'shield-checkmark';
    }
  };

  const getBiometricTitle = () => {
    switch (biometricType) {
      case 'FaceID':
        return 'Face ID के साथ सुरक्षित करें / Secure with Face ID';
      case 'TouchID':
        return 'Touch ID के साथ सुरक्षित करें / Secure with Touch ID';
      case 'Fingerprint':
        return 'फिंगरप्रिंट के साथ सुरक्षित करें / Secure with Fingerprint';
      default:
        return 'बायोमेट्रिक के साथ सुरक्षित करें / Secure with Biometrics';
    }
  };

  const getBiometricDescription = () => {
    switch (biometricType) {
      case 'FaceID':
        return 'Face ID का उपयोग करके तुरंत लॉगिन करें और लेनदेन को अधिकृत करें';
      case 'TouchID':
        return 'Touch ID का उपयोग करके तुरंत लॉगिन करें और लेनदेन को अधिकृत करें';
      case 'Fingerprint':
        return 'फिंगरप्रिंट का उपयोग करके तुरंत लॉगिन करें और लेनदेन को अधिकृत करें';
      default:
        return 'बायोमेट्रिक प्रमाणीकरण का उपयोग करके तुरंत लॉगिन करें और लेनदेन को अधिकृत करें';
    }
  };

  const enableBiometric = async () => {
    if (!isBiometricAvailable) {
      Alert.alert(
        'बायोमेट्रिक अनुपलब्ध / Biometric Unavailable',
        'आपके डिवाइस पर बायोमेट्रिक प्रमाणीकरण उपलब्ध नहीं है / Biometric authentication is not available on your device'
      );
      return;
    }

    setIsLoading(true);

    try {
      // Simulate biometric setup for development
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store biometric preference using AsyncStorage only
      await AsyncStorage.setItem('biometricEnabled', 'true');
      await AsyncStorage.setItem('biometricType', biometricType);

      Alert.alert(
        'सफल! / Success!',
        'बायोमेट्रिक प्रमाणीकरण सक्षम किया गया / Biometric authentication enabled',
        [
          {
            text: 'आगे बढ़ें / Continue',
            onPress: () => navigation.navigate('FinancialLiteracyAssessmentScreen'),
          },
        ]
      );
    } catch (error) {
      console.error('Biometric setup error:', error);
      Alert.alert(
        'त्रुटि / Error',
        'बायोमेट्रिक सेटअप में समस्या / Problem in biometric setup'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'छोड़ें? / Skip?',
      'क्या आप बायोमेट्रिक सेटअप छोड़ना चाहते हैं? आप इसे बाद में सेटिंग्स से सक्षम कर सकते हैं / Do you want to skip biometric setup? You can enable it later from settings',
      [
        {
          text: 'रद्द करें / Cancel',
          style: 'cancel',
        },
        {
          text: 'छोड़ें / Skip',
          onPress: async () => {
            await AsyncStorage.setItem('biometricEnabled', 'false');
            await AsyncStorage.setItem('biometricSkipped', 'true');
            navigation.navigate('FinancialLiteracyAssessmentScreen');
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={color.pureWhite[800]} />
          </TouchableOpacity>

          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '85%' }]} />
            </View>
            <Text style={styles.progressText}>Step 5 of 6 • Almost Done</Text>
          </View>
        </View>

        {/* Icon Section */}
        <View style={styles.iconSection}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  { scale: pulseAnim },
                ],
              },
            ]}
          >
            <Icon
              name={getBiometricIcon()}
              size={80}
              color={color.primaryGreen[500]}
            />
          </Animated.View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.title}>{getBiometricTitle()}</Text>
          <Text style={styles.description}>
            {getBiometricDescription()}
          </Text>

          {/* Benefits List */}
          <View style={styles.benefitsSection}>
            <View style={styles.benefitItem}>
              <Icon name="flash" size={20} color={color.primaryGreen[600]} />
              <Text style={styles.benefitText}>
                तुरंत लॉगिन / Quick Login
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="shield-checkmark" size={20} color={color.primaryGreen[600]} />
              <Text style={styles.benefitText}>
                उन्नत सुरक्षा / Advanced Security
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="lock-closed" size={20} color={color.primaryGreen[600]} />
              <Text style={styles.benefitText}>
                सुरक्षित लेनदेन / Secure Transactions
              </Text>
            </View>
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[
              styles.enableButton,
              (!isBiometricAvailable || isLoading) && styles.disabledButton,
            ]}
            onPress={enableBiometric}
            disabled={!isBiometricAvailable || isLoading}
            accessibilityLabel="Enable Biometric Login"
            accessibilityRole="button"
          >
            <Icon name="finger-print" size={20} color={color.pureWhite[50]} style={styles.buttonIcon} />
            <Text style={[
              styles.enableButtonText,
              (!isBiometricAvailable || isLoading) && styles.disabledButtonText,
            ]}>
              {isLoading ? 'सेटअप कर रहे हैं... / Setting up...' : 'बायोमेट्रिक लॉगिन सक्षम करें / Enable Biometric Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            disabled={isLoading}
            accessibilityLabel="Skip biometric setup"
            accessibilityRole="button"
          >
            <Text style={styles.skipButtonText}>अभी छोड़ें / Skip for Now</Text>
          </TouchableOpacity>

          {/* Info Text */}
          <Text style={styles.infoText}>
            {!isBiometricAvailable 
              ? 'आपके डिवाइस पर बायोमेट्रिक प्रमाणीकरण उपलब्ध नहीं है'
              : 'आप बाद में सेटिंग्स से भी इसे सक्षम कर सकते हैं'
            }
          </Text>
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
  iconSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: color.primaryGreen[50],
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: color.primaryGreen[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  contentSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: color.pureWhite[900],
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: color.pureWhite[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  benefitsSection: {
    width: '100%',
    backgroundColor: color.primaryGreen[50],
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: color.primaryGreen[200],
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  benefitText: {
    fontSize: 16,
    color: color.primaryGreen[800],
    fontWeight: '500',
    marginLeft: 12,
  },
  buttonSection: {
    paddingBottom: 40,
  },
  enableButton: {
    backgroundColor: color.primaryGreen[500],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
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
  buttonIcon: {
    marginRight: 8,
  },
  enableButtonText: {
    color: color.pureWhite[50],
    fontSize: 16,
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
  infoText: {
    fontSize: 12,
    color: color.pureWhite[500],
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});

export default BiometricRegistrationScreen;