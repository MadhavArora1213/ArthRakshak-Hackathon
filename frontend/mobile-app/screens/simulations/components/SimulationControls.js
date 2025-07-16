import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Animated,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

/**
 * SimulationControls component for navigation and progress tracking
 * 
 * @param {Object} props Component props
 * @param {number} props.currentStep Current step number
 * @param {number} props.totalSteps Total steps in simulation
 * @param {Function} props.onNext Handler for next button
 * @param {Function} props.onPrevious Handler for previous button
 * @param {Function} props.onExit Handler for exit button
 * @param {boolean} props.allowBack Whether to show back button
 * @param {boolean} props.allowSkip Whether to show skip button
 * @param {Object} props.progress Progress details object
 */
const SimulationControls = ({
  currentStep = 1,
  totalSteps = 3,
  onNext,
  onPrevious,
  onExit,
  allowBack = true,
  allowSkip = false,
  progress = null
}) => {
  // Calculate progress
  const progressPercentage = ((currentStep) / totalSteps) * 100;

  return (
    <View style={styles.container}>
      {/* Progress indicators */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View 
            style={[
              styles.progressBar,
              { width: `${progressPercentage}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>
      
      {/* Button controls */}
      <View style={styles.controlsContainer}>
        {allowBack && currentStep > 1 ? (
          <TouchableOpacity 
            style={[styles.button, styles.backButton]} 
            onPress={onPrevious}
          >
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/271/271220.png' }}
              style={styles.buttonIcon}
              resizeMode="contain"
            />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderButton} />
        )}
        
        {currentStep < totalSteps ? (
          <TouchableOpacity 
            style={[styles.button, styles.nextButton]} 
            onPress={onNext}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/271/271228.png' }}
              style={styles.buttonIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.finishButton]} 
            onPress={onNext}
          >
            <Text style={styles.finishButtonText}>Finish</Text>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5290/5290058.png' }}
              style={styles.buttonIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Exit button */}
      {onExit && (
        <TouchableOpacity 
          style={styles.exitButton} 
          onPress={onExit}
        >
          <Text style={styles.exitButtonText}>Exit Simulation</Text>
        </TouchableOpacity>
      )}
      
      {/* Skip button (if allowed) */}
      {allowSkip && (
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={() => onNext(true)}
        >
          <Text style={styles.skipButtonText}>Skip this step</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  progressContainer: {
    marginVertical: 15,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1e3a8a',
    borderRadius: 3,
  },
  progressText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: width * 0.35,
  },
  buttonIcon: {
    width: 16,
    height: 16,
    tintColor: '#fff',
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  backButtonText: {
    color: '#1e3a8a',
    fontWeight: '500',
    marginLeft: 6,
  },
  nextButton: {
    backgroundColor: '#1e3a8a',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 6,
  },
  finishButton: {
    backgroundColor: '#4CAF50',
  },
  finishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 6,
  },
  placeholderButton: {
    minWidth: width * 0.35,
  },
  exitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 8,
  },
  exitButtonText: {
    color: '#757575',
    fontSize: 12,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 8,
  },
  skipButtonText: {
    color: '#9e9e9e',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});

export default SimulationControls;