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

// Import our new components
import Login from './frontend/Components/Login';
import Dashboard from './frontend/Components/Dashboard';
import EnhancedDashboard from './frontend/Components/EnhancedDashboard';
import Calculator from './frontend/Components/Calculator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Calculator"
        screenOptions={{
          headerShown: false, // Hide headers for clean look
          animation: 'slide_from_right', // Smooth transitions
          gestureEnabled: true, // Enable swipe back gesture
        }}
      >
        {/* Authentication Screens */}
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{
            gestureEnabled: false, // Disable back gesture on login
          }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard}
        />
        <Stack.Screen 
          name="EnhancedDashboard" 
          component={EnhancedDashboard}
        />
        <Stack.Screen 
          name="Calculator" 
          component={Calculator}
          options={{
            title: 'ArthRakshak Budget Planner',
            headerShown: false,
            headerStyle: {
              backgroundColor: '#3ad08f',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        
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