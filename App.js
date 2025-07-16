import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Fraud Simulation Screens
import HomeScreen from './frontend/mobile-app/screens/simulations/HomeScreen';
import SimulationModule from './frontend/mobile-app/screens/simulations/SimulationModule';
import ResultScreen from './frontend/mobile-app/screens/simulations/ResultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        {/* Fraud Simulation Flow */}
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SimulationModule" component={SimulationModule} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} />

        {/* 
        // Public/Onboarding Screens (commented out for demo)
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="LanguageSelectionScreen" component={LanguageSelectionScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="PhoneVerificationScreen" component={PhoneVerificationScreen} />
        <Stack.Screen name="AadhaarVerificationScreen" component={AadhaarVerificationScreen} />
        <Stack.Screen name="SecuritySetupScreen" component={SecuritySetupScreen} />
        <Stack.Screen name="BiometricRegistrationScreen" component={BiometricRegistrationScreen} />
        <Stack.Screen name="FinancialLiteracyAssessmentScreen" component={FinancialLiteracyAssessmentScreen} />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}