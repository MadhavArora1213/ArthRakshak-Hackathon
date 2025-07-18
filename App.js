import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Import your screens
import LandingPage from './frontend/mobile-app/screens/public/LandingPage';
import LanguageSelectionScreen from './frontend/mobile-app/screens/public/LanguageSelectionScreen';
import RegisterScreen from './frontend/mobile-app/screens/public/RegisterScreen';
import PhoneVerificationScreen from './frontend/mobile-app/screens/public/PhoneVerificationScreen';
import AadhaarVerificationScreen from './frontend/mobile-app/screens/public/AadhaarVerificationScreen';
import SecuritySetupScreen from './frontend/mobile-app/screens/public/SecuritySetupScreen';
import BiometricRegistrationScreen from './frontend/mobile-app/screens/public/BiometricRegistrationScreen';
import FinancialLiteracyAssessmentScreen from './frontend/mobile-app/screens/public/FinancialLiteracyAssessmentScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false, // Hide headers for clean look
          animation: 'slide_from_right', // Smooth transitions
          gestureEnabled: true, // Enable swipe back gesture
        }}
      >
        {/* Public/Onboarding Screens */}
        <Stack.Screen 
          name="Landing" 
          component={LandingPage}
          options={{
            gestureEnabled: false, // Disable back gesture on landing
          }}
        />
        <Stack.Screen 
          name="LanguageSelectionScreen" 
          component={LanguageSelectionScreen}
        />
        <Stack.Screen 
          name="RegisterScreen" 
          component={RegisterScreen}
        />
        <Stack.Screen 
          name="PhoneVerificationScreen" 
          component={PhoneVerificationScreen}
        />
        <Stack.Screen 
          name="AadhaarVerificationScreen" 
          component={AadhaarVerificationScreen}
        />
        <Stack.Screen 
          name="SecuritySetupScreen" 
          component={SecuritySetupScreen}
        />
        <Stack.Screen 
          name="BiometricRegistrationScreen" 
          component={BiometricRegistrationScreen}
        />
        <Stack.Screen 
          name="FinancialLiteracyAssessmentScreen" 
          component={FinancialLiteracyAssessmentScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}