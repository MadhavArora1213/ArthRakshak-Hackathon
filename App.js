import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, Platform } from 'react-native';

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
import LoadingFlow from './frontend/Components/Loding';
import Login from './frontend/Components/Login';
import SignUp from './frontend/Components/SignUp';
import Dashboard from './frontend/Components/Dashboard';
import EnhancedDashboard from './frontend/Components/EnhancedDashboard';
import Calculator from './frontend/Components/Calculator';
import Chatbot from './frontend/Components/Chatbot';
import ChatbotRN from './frontend/Components/ChatbotRN';
import StudentLoanPlanner from './frontend/Components/student-loan-planner';
import FinancialTips from './frontend/Components/FinancialTips';
import DtiCalculator from './frontend/Components/Dti_calculator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />} */}
      <Stack.Navigator 
        initialRouteName="FinancialTips"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        {/* Only one FinancialTips screen should be present */}
        <Stack.Screen
          name="FinancialTips"
          component={FinancialTips}
          options={{
            title: 'Financial Tips',
            headerShown: false,
          }}
        />
        {/* Remove duplicate FinancialTips and any other duplicate screens */}
        {/* 
        <Stack.Screen 
          name="LoadingFlow" 
          component={LoadingFlow}
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{
            gestureEnabled: false, // Disable back gesture on login
          }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUp}
          options={{
            title: 'Create Account',
            headerShown: false,
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

        {/* DTI Calculator Screen */}
        <Stack.Screen 
          name="DtiCalculator" 
          component={DtiCalculator}
          options={{
            title: 'DTI Calculator',
            headerShown: false,
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
        
        {/* Chatbot Screen */}
        <Stack.Screen 
          name="Chatbot" 
          component={ChatbotRN}
          options={{
            title: 'ArthRakshak Assistant',
            headerShown: false,
          }}
        />

        {/* Student Loan Planner Screen - Updated with proper configuration */}
        <Stack.Screen 
          name="StudentLoanPlanner" 
          component={StudentLoanPlanner}
          options={{
            title: 'Student Loan Planner',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}