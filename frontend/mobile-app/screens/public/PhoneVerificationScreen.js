import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Vibration,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import color from '../../constants/theme/color';

const PhoneVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mobileNumber, fullName } = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    startTimer();
    // Auto-focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const startTimer = () => {
    setTimer(30);
    setCanResend(false);
  };

  const handleOtpChange = (value, index) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const maskPhoneNumber = (number) => {
    if (number.length >= 4) {
      return `+91 XXXXX${number.slice(-4)}`;
    }
    return `+91 ${number}`;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isOtpComplete = () => {
    return otp.every(digit => digit !== '');
  };

  const simulateOtpVerification = (otpString) => {
    // Simulate API call - in real app, call your backend
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // For demo: accept 123456 as valid OTP
        if (otpString === '123456') {
          resolve({ success: true });
        } else {
          reject({ error: 'Invalid OTP' });
        }
      }, 2000);
    });
  };

  const handleVerifyOtp = async () => {
    if (!isOtpComplete()) return;

    setIsLoading(true);
    const otpString = otp.join('');

    try {
      await simulateOtpVerification(otpString);
      
      // Save verification status
      await AsyncStorage.setItem('phoneVerified', 'true');
      await AsyncStorage.setItem('verifiedMobile', `+91${mobileNumber}`);

      // Show success feedback
      Alert.alert(
        'सफल! / Success!',
        'मोबाइल नंबर सत्यापित हो गया / Mobile number verified successfully',
        [
          {
            text: 'आगे बढ़ें / Continue',
            onPress: () => navigation.navigate('SecuritySetupScreen'),
          },
        ]
      );
    } catch (error) {
      // Vibration feedback on error
      if (Platform.OS === 'ios') {
        Vibration.vibrate();
      } else {
        Vibration.vibrate(100);
      }

      Alert.alert(
        'त्रुटि / Error',
        'गलत OTP। कृपया पुनः प्रयास करें / Wrong OTP. Please try again'
      );
      
      // Clear OTP and focus first input
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'OTP भेजा गया / OTP Sent',
        'नया OTP आपके मोबाइल पर भेजा गया है / New OTP sent to your mobile'
      );
      
      // Clear current OTP and restart timer
      setOtp(['', '', '', '', '', '']);
      startTimer();
      inputRefs.current[0]?.focus();
    } catch (error) {
      Alert.alert(
        'त्रुटि / Error',
        'OTP भेजने में समस्या। कृपया पुनः प्रयास करें / Problem sending OTP. Please try again'
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleEditNumber = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Icon name="phone-portrait-outline" size={60} color={color.primaryGreen[500]} />
          <Text style={styles.title}>मोबाइल सत्यापन / Phone Verification</Text>
          <Text style={styles.subtitle}>
            OTP भेजा गया है / OTP sent to
          </Text>
          <Text style={styles.phoneNumber}>{maskPhoneNumber(mobileNumber)}</Text>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditNumber}>
            <Text style={styles.editButtonText}>नंबर बदलें / Edit Number</Text>
          </TouchableOpacity>
        </View>

        {/* OTP Input Section */}
        <View style={styles.otpSection}>
          <Text style={styles.otpLabel}>6-अंकीय OTP दर्ज करें / Enter 6-digit OTP</Text>
          
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => inputRefs.current[index] = ref}
                style={[
                  styles.otpInput,
                  digit && styles.otpInputFilled,
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
                textAlign="center"
                accessibilityLabel={`OTP digit ${index + 1}`}
              />
            ))}
          </View>
        </View>

        {/* Timer and Resend Section */}
        <View style={styles.timerSection}>
          {!canResend ? (
            <Text style={styles.timerText}>
              Resend OTP in {formatTime(timer)}
            </Text>
          ) : (
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOtp}
              disabled={isResending}
            >
              <Text style={styles.resendButtonText}>
                {isResending ? 'भेजा जा रहा है... / Sending...' : 'OTP दोबारा भेजें / Resend OTP'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[
              styles.verifyButton,
              (!isOtpComplete() || isLoading) && styles.disabledButton,
            ]}
            onPress={handleVerifyOtp}
            disabled={!isOtpComplete() || isLoading}
            accessibilityLabel="Verify OTP"
            accessibilityRole="button"
          >
            <Text style={[
              styles.verifyButtonText,
              (!isOtpComplete() || isLoading) && styles.disabledButtonText,
            ]}>
              {isLoading ? 'सत्यापित कर रहे हैं... / Verifying...' : 'सत्यापित करें / Verify'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.helpText}>
            OTP प्राप्त नहीं हुआ? कृपया अपना स्पैम फ़ोल्डर जांचें
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
    alignItems: 'center',
    paddingVertical: 40,
    paddingBottom: 50,
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
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.primaryGreen[700],
    textAlign: 'center',
    marginBottom: 15,
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  editButtonText: {
    color: color.primaryGreen[600],
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  otpSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  otpLabel: {
    fontSize: 16,
    color: color.pureWhite[700],
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: color.pureWhite[300],
    borderRadius: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: color.pureWhite[900],
    backgroundColor: color.pureWhite[100],
    elevation: 1,
    shadowColor: color.pureWhite[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  otpInputFilled: {
    borderColor: color.primaryGreen[500],
    backgroundColor: color.primaryGreen[50],
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 14,
    color: color.pureWhite[600],
    fontWeight: '500',
  },
  resendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resendButtonText: {
    color: color.primaryGreen[600],
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  buttonSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  verifyButton: {
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
  verifyButtonText: {
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

export default PhoneVerificationScreen;