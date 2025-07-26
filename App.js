import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AudioProvider } from './frontend/mobile-app/context/AudioContext'; // <-- import this

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

// Import your simulation screen
import InvestmentFraudSimulation from './frontend/mobile-app/screens/public/InvestmentFraudSimulation';
// If you have a Quiz or SimulationList screen, import them as well:
// import Quiz from './frontend/Components/Quiz';
// import SimulationList from './frontend/mobile-app/screens/public/SimulationList';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="InvestmentFraudSimulation"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        >
          <Stack.Screen
            name="InvestmentFraudSimulation"
            component={InvestmentFraudSimulation}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioProvider>
  );
}