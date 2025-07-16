import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Platform,
  Animated
} from 'react-native';
import { SCREEN_TYPES } from '../../../constants/simulationTypes';

/**
 * ScenarioCard component - Displays different fraud scenario UIs
 * 
 * @param {Object} props Component props
 * @param {string} props.type Screen type (EMAIL, SMS, WEBSITE, etc.)
 * @param {string} props.title Title of the scenario
 * @param {string} props.content Content to display
 * @param {Object} props.actions Actions available in the scenario
 * @param {number} props.timeLimit Time limit in seconds (0 for no limit)
 * @param {Function} props.onAction Callback when user performs an action
 * @param {Function} props.onTimerEnd Callback when timer ends
 * @param {Object} props.inputFields Input fields configuration
 * @param {Object} props.styling Custom styling options
 */
const ScenarioCard = ({
  type = SCREEN_TYPES.EMAIL,
  title,
  content,
  actions = [],
  timeLimit = 0,
  onAction,
  onTimerEnd,
  inputFields = [],
  styling = {}
}) => {
  // State for timer and inputs
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [inputs, setInputs] = useState({});
  const [pulseAnimation] = useState(new Animated.Value(1));

  // Start timer if timeLimit is set
  useEffect(() => {
    let timer;
    if (timeLimit > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            onTimerEnd && onTimerEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      // Start pulsing animation for urgency
      startPulseAnimation();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLimit]);

  // Pulse animation for timer
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Handle input change
  const handleInputChange = (id, value) => {
    setInputs(prevInputs => ({
      ...prevInputs,
      [id]: value
    }));
  };

  // Handle action click
  const handleAction = (actionId) => {
    if (onAction) {
      onAction(actionId, inputs);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get header content based on screen type
  const renderHeader = () => {
    switch(type) {
      case SCREEN_TYPES.EMAIL:
        return (
          <View style={styles.emailHeader}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/482/482138.png' }} 
              style={styles.emailIcon}
            />
            <Text style={styles.emailTitle}>
              {title || 'New Email'}
            </Text>
          </View>
        );
      case SCREEN_TYPES.SMS:
        return (
          <View style={styles.smsHeader}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2190/2190552.png' }} 
              style={styles.smsIcon}
            />
            <Text style={styles.smsTitle}>
              {title || 'New Message'}
            </Text>
          </View>
        );
      case SCREEN_TYPES.WEBSITE:
        return (
          <View style={styles.websiteHeader}>
            <View style={styles.urlBar}>
              <Text numberOfLines={1} style={styles.urlText}>
                {title || 'https://secure-banking.com'}
              </Text>
            </View>
          </View>
        );
      case SCREEN_TYPES.CALL:
        return (
          <View style={styles.callHeader}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2933/2933193.png' }} 
              style={styles.callIcon}
            />
            <Text style={styles.callTitle}>
              {title || 'Incoming Call'}
            </Text>
          </View>
        );
      default:
        return (
          <View style={styles.defaultHeader}>
            <Text style={styles.defaultTitle}>{title || 'Scenario'}</Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, styling.container]}>
      {renderHeader()}
      
      {/* Timer display if time limit exists */}
      {timeLimit > 0 && (
        <Animated.View 
          style={[
            styles.timerContainer,
            { transform: [{ scale: pulseAnimation }] }
          ]}
        >
          <Text style={[styles.timerText, timeLeft < 10 ? styles.timerWarning : null]}>
            {formatTime(timeLeft)}
          </Text>
        </Animated.View>
      )}

      {/* Main content */}
      <View style={[styles.contentContainer, styling.contentContainer]}>
        <Text style={[styles.contentText, styling.contentText]}>{content}</Text>
      </View>
      
      {/* Input fields */}
      {inputFields.length > 0 && (
        <View style={styles.inputSection}>
          {inputFields.map((field) => (
            <View key={field.id} style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{field.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                secureTextEntry={field.secure}
                keyboardType={field.keyboardType || 'default'}
                value={inputs[field.id]}
                onChangeText={(value) => handleInputChange(field.id, value)}
                maxLength={field.maxLength}
              />
            </View>
          ))}
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionsContainer}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionButton, 
              action.isPrimary ? styles.primaryButton : styles.secondaryButton,
              styling.actionButton
            ]}
            onPress={() => handleAction(action.id)}
          >
            <Text style={[
              styles.actionText, 
              action.isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
              styling.actionText
            ]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 15,
  },
  // Email header styles
  emailHeader: {
    backgroundColor: '#f1f3f4',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  emailIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  emailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  // SMS header styles
  smsHeader: {
    backgroundColor: '#e9f5ff',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#c5e1f9',
  },
  smsIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  smsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0277bd',
  },
  // Website header styles
  websiteHeader: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  urlBar: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  urlText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  // Call header styles
  callHeader: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#c8e6c9',
  },
  callIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  callTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  // Default header styles
  defaultHeader: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  defaultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  // Timer styles
  timerContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ffcdd2',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  timerWarning: {
    color: '#b71c1c',
  },
  // Content styles
  contentContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  contentText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  // Input fields
  inputSection: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  // Actions
  actionsContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginLeft: 10,
    marginBottom: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1e3a8a',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1e3a8a',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#1e3a8a',
  },
});

export default ScenarioCard;