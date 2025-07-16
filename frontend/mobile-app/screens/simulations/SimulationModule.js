import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Animated,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { SCREEN_TYPES, SIMULATION_TYPES } from '../../constants/simulationTypes';
import { getSimulationById } from '../../constants/simulationData';
import { playVoice, stopVoice } from '../../utils/voiceUtils';
import { RISK_ACTIONS } from '../../utils/fraudScoring';

const { width } = Dimensions.get('window');

const SimulationModule = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { simulationId } = route.params;
  
  const [simulation, setSimulation] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userInputs, setUserInputs] = useState({});
  const [recordedActions, setRecordedActions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  
  const soundRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  // Timer ref
  const timerRef = useRef(null);
  
  // Load simulation data
  useEffect(() => {
    const loadSimulation = async () => {
      try {
        const simulationData = getSimulationById(simulationId);
        if (!simulationData) {
          throw new Error('Simulation not found');
        }
        
        setSimulation(simulationData);
        setTimeRemaining(simulationData.steps[0]?.countdownSeconds || 0);
        setIsLoading(false);
        
        // Animate in the first step
        animateStepIn();
      } catch (error) {
        console.error('Error loading simulation:', error);
        Alert.alert('Error', 'Failed to load simulation');
        navigation.goBack();
      }
    };
    
    loadSimulation();
    
    return () => {
      // Clean up when component unmounts
      if (soundRef.current) {
        stopVoice(soundRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [simulationId]);
  
  // Effect for countdown timer
  useEffect(() => {
    if (!isLoading && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoading, currentStepIndex, timeRemaining]);
  
  // Play voice over when step changes
  useEffect(() => {
    const playStepAudio = async () => {
      if (isLoading || !simulation) return;
      
      const currentStep = simulation.steps[currentStepIndex];
      if (currentStep && currentStep.audioFile) {
        try {
          setIsVoicePlaying(true);
          const sound = await playVoice(currentStep.audioFile);
          soundRef.current = sound;
          
          // Set handler for when audio finishes
          sound.setOnPlaybackStatusUpdate(status => {
            if (status.didJustFinish) {
              setIsVoicePlaying(false);
            }
          });
        } catch (error) {
          console.error('Error playing audio:', error);
          setIsVoicePlaying(false);
        }
      }
    };
    
    playStepAudio();
    
    // Clean up previous audio
    return () => {
      if (soundRef.current) {
        stopVoice(soundRef.current);
        soundRef.current = null;
      }
    };
  }, [currentStepIndex, simulation, isLoading]);
  
  const animateStepIn = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const animateStepOut = (callback) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset animations
      slideAnim.setValue(0);
      
      // Execute callback after animation
      if (callback) callback();
    });
  };
  
  const handleUserAction = (action) => {
    // Record the action if it's risky
    if (action.isRisky) {
      let actionId;
      
      switch (action.id) {
        case 'verify_now':
          actionId = 'CLICKED_PHISHING_LINK';
          break;
        case 'submit_card_details':
          actionId = 'ENTERED_CARD_INFO';
          break;
        case 'share_otp':
          actionId = 'SHARED_OTP';
          break;
        default:
          actionId = action.id;
      }
      
      setRecordedActions(prev => [...prev, actionId]);
    }
    
    // Process the action result
    const nextStepId = action.leadsTo;
    if (!nextStepId) return;
    
    // Find the index of the next step
    const nextIndex = simulation.steps.findIndex(step => step.id === nextStepId);
    
    if (nextIndex !== -1) {
      // If it's a result type step, navigate to results screen
      if (simulation.steps[nextIndex].type === 'RESULT') {
        const outcome = simulation.steps[nextIndex].outcome;
        
        navigation.navigate('ResultScreen', {
          recordedActions,
          outcome,
          simulationId,
        });
        return;
      }
      
      // Otherwise transition to the next step
      animateStepOut(() => {
        setCurrentStepIndex(nextIndex);
        setTimeRemaining(simulation.steps[nextIndex]?.countdownSeconds || 0);
        animateStepIn();
      });
    }
  };
  
  const handleInputChange = (fieldId, value) => {
    setUserInputs(prev => ({ ...prev, [fieldId]: value }));
  };
  
  // Format time remaining as MM:SS
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading simulation...</Text>
      </View>
    );
  }
  
  const currentStep = simulation.steps[currentStepIndex];
  
  // Interpolate animation values
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [width, 0, -width],
  });
  
  // Render different UI based on screen type
  const renderStepContent = () => {
    switch (currentStep.screenType) {
      case SCREEN_TYPES.EMAIL:
        return renderEmailScreen();
      case SCREEN_TYPES.WEBSITE:
        return renderWebsiteScreen();
      case SCREEN_TYPES.CALL:
        return renderCallScreen();
      case SCREEN_TYPES.SMS:
        return renderSmsScreen();
      default:
        return (
          <View style={styles.genericContainer}>
            <Text style={styles.stepTitle}>{currentStep.title}</Text>
            <Text style={styles.stepDescription}>{JSON.stringify(currentStep.content)}</Text>
          </View>
        );
    }
  };
  
  const renderEmailScreen = () => {
    const { from, to, subject, body, date, urgencyLabel } = currentStep.content;
    
    return (
      <View style={styles.emailContainer}>
        {urgencyLabel && (
          <View style={styles.urgencyBanner}>
            <Icon name="alert-circle" size={16} color="#FFFFFF" />
            <Text style={styles.urgencyText}>{urgencyLabel}</Text>
          </View>
        )}
        
        <View style={styles.emailHeader}>
          <Text style={styles.emailSubject}>{subject}</Text>
          <Text style={styles.emailDate}>{date}</Text>
        </View>
        
        <View style={styles.emailSender}>
          <View style={styles.emailAvatarContainer}>
            <Text style={styles.emailAvatar}>SB</Text>
          </View>
          <View style={styles.emailSenderInfo}>
            <Text style={styles.emailSenderName}>SBI Security Team</Text>
            <Text style={styles.emailSenderAddress}>{from}</Text>
          </View>
        </View>
        
        <View style={styles.emailBody}>
          <Text style={styles.emailBodyText}>
            {body.split('Verify Now').map((part, index, arr) => {
              // If not the last part, add a button after it
              if (index < arr.length - 1) {
                return (
                  <React.Fragment key={index}>
                    {part}
                    <TouchableOpacity
                      onPress={() => handleUserAction(currentStep.actions.find(a => a.id === 'verify_now'))}
                    >
                      <Text style={styles.emailActionButton}>Verify Now</Text>
                    </TouchableOpacity>
                  </React.Fragment>
                );
              }
              return part;
            })}
          </Text>
        </View>
      </View>
    );
  };
  
  const renderWebsiteScreen = () => {
    const { url, logo, headline, instruction, fields, submitButton, urgencyText, securityHint } = currentStep.content;
    
    return (
      <View style={styles.websiteContainer}>
        <View style={styles.browserBar}>
          <Icon name="alert-circle" size={16} color="#F87171" />
          <Text style={styles.browserUrl}>{url}</Text>
        </View>
        
        {securityHint && (
          <View style={styles.securityWarning}>
            <Icon name="warning" size={14} color="#F87171" />
            <Text style={styles.securityWarningText}>{securityHint}</Text>
          </View>
        )}
        
        <ScrollView style={styles.websiteContent}>
          <Image source={logo} style={styles.websiteLogo} resizeMode="contain" />
          <Text style={styles.websiteHeadline}>{headline}</Text>
          <Text style={styles.websiteInstruction}>{instruction}</Text>
          
          {urgencyText && (
            <View style={styles.urgencyTimerContainer}>
              <Icon name="time-outline" size={18} color="#F87171" />
              <Text style={styles.urgencyTimer}>{urgencyText}</Text>
            </View>
          )}
          
          <View style={styles.formContainer}>
            {fields.map((field) => (
              <View key={field.id} style={styles.formField}>
                <Text style={styles.formLabel}>{field.label}</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={field.placeholder}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={field.id === 'cvv'}
                  keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                  maxLength={field.maxLength}
                  value={userInputs[field.id] || ''}
                  onChangeText={(text) => handleInputChange(field.id, text)}
                />
              </View>
            ))}
            
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => handleUserAction(currentStep.actions.find(a => a.id === 'submit_card_details'))}
            >
              <Text style={styles.submitButtonText}>{submitButton}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };
  
  const renderCallScreen = () => {
    const { callerID, callDuration, transcription, otpMessage, inputLabel } = currentStep.content;
    
    return (
      <View style={styles.callContainer}>
        <View style={styles.callHeader}>
          <Icon name="call" size={26} color="#10B981" />
          <Text style={styles.callerName}>{currentStep.title}</Text>
          <Text style={styles.callDuration}>{callDuration}</Text>
        </View>
        
        <View style={styles.callTranscription}>
          <Text style={styles.transcriptionTitle}>Call Transcript</Text>
          <Text style={styles.transcriptionText}>{transcription}</Text>
        </View>
        
        <View style={styles.otpMessageContainer}>
          <Icon name="chatbox-ellipses-outline" size={20} color="#3B82F6" />
          <View style={styles.otpMessage}>
            <Text style={styles.otpMessageSender}>SBI</Text>
            <Text style={styles.otpMessageText}>{otpMessage}</Text>
          </View>
        </View>
        
        <View style={styles.otpInputContainer}>
          <Text style={styles.otpInputLabel}>{inputLabel}</Text>
          <TextInput
            style={styles.otpInput}
            placeholder="Enter 6-digit OTP"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={6}
            value={userInputs.otp || ''}
            onChangeText={(text) => handleInputChange('otp', text)}
          />
          
          <TouchableOpacity
            style={styles.otpSubmitButton}
            onPress={() => handleUserAction(currentStep.actions.find(a => a.id === 'share_otp'))}
          >
            <Text style={styles.otpSubmitButtonText}>Submit OTP</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.refuseButton}
            onPress={() => handleUserAction(currentStep.actions.find(a => a.id === 'refuse_otp'))}
          >
            <Text style={styles.refuseButtonText}>Refuse to Share OTP</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderSmsScreen = () => {
    // Implementation for SMS screen if needed
    return null;
  };
  
  return (
    <View style={styles.container}>
      {/* Simulation Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            Alert.alert(
              'Exit Simulation',
              'Are you sure you want to exit this simulation? Your progress will be lost.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Exit',
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          }}
        >
          <Icon name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{simulation.title}</Text>
          <Text style={styles.stepIndicator}>
            Step {currentStepIndex + 1} of {simulation.steps.filter(s => s.type !== 'RESULT').length}
          </Text>
        </View>
        
        {/* Timer display */}
        {timeRemaining > 0 && (
          <View style={styles.timerContainer}>
            <Icon name="time-outline" size={16} color="#F87171" />
            <Text style={styles.timerText}>{formatTimeRemaining()}</Text>
          </View>
        )}
      </View>
      
      {/* Voice indicator */}
      {isVoicePlaying && (
        <View style={styles.voiceIndicator}>
          <Icon name="volume-high" size={14} color="#3B82F6" />
          <Text style={styles.voiceIndicatorText}>Voice playing...</Text>
        </View>
      )}
      
      {/* Content container with animation */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [
              { translateX },
              { scale: scaleAnim },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        {renderStepContent()}
      </Animated.View>
      
      {/* Alternative actions footer */}
      <View style={styles.actionsContainer}>
        {currentStep.screenType === SCREEN_TYPES.EMAIL && (
          <TouchableOpacity
            style={styles.alternativeAction}
            onPress={() => handleUserAction(currentStep.actions.find(a => a.id === 'ignore_email'))}
          >
            <Icon name="close-circle-outline" size={20} color="#4B5563" />
            <Text style={styles.alternativeActionText}>Ignore Email</Text>
          </TouchableOpacity>
        )}
        
        {currentStep.screenType === SCREEN_TYPES.WEBSITE && (
          <TouchableOpacity
            style={styles.alternativeAction}
            onPress={() => handleUserAction(currentStep.actions.find(a => a.id === 'close_website'))}
          >
            <Icon name="close-circle-outline" size={20} color="#4B5563" />
            <Text style={styles.alternativeActionText}>Close Website</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4B5563',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  stepIndicator: {
    fontSize: 12,
    color: '#6B7280',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 5,
  },
  voiceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
  },
  voiceIndicatorText: {
    fontSize: 12,
    color: '#3B82F6',
    marginLeft: 5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  alternativeAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  alternativeActionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4B5563',
  },
  
  // Email screen styles
  emailContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  urgencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  urgencyText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  emailHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  emailSubject: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  emailDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  emailSender: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  emailAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emailAvatar: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  emailSenderInfo: {
    flex: 1,
  },
  emailSenderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  emailSenderAddress: {
    fontSize: 12,
    color: '#6B7280',
  },
  emailBody: {
    padding: 16,
  },
  emailBodyText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  emailActionButton: {
    color: '#2563EB',
    fontWeight: '600',
  },
  
  // Website screen styles
  websiteContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  browserBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  browserUrl: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  securityWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FECACA',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  securityWarningText: {
    flex: 1,
    fontSize: 12,
    color: '#DC2626',
    marginLeft: 6,
  },
  websiteContent: {
    flex: 1,
    padding: 16,
  },
  websiteLogo: {
    width: 120,
    height: 60,
    alignSelf: 'center',
    marginVertical: 16,
  },
  websiteHeadline: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  websiteInstruction: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 16,
  },
  urgencyTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 24,
  },
  urgencyTimer: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Call screen styles
  callContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  callHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  callerName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
  },
  callDuration: {
    fontSize: 14,
    color: '#6B7280',
  },
  callTranscription: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginHorizontal: 12,
  },
  transcriptionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  transcriptionText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  otpMessageContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  otpMessage: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  otpMessageSender: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  otpMessageText: {
    fontSize: 14,
    color: '#1F2937',
  },
  otpInputContainer: {
    padding: 16,
    marginTop: 16,
    marginHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  otpInputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
  },
  otpInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 2,
  },
  otpSubmitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  otpSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  refuseButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  refuseButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Generic container
  genericContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
});

export default SimulationModule;