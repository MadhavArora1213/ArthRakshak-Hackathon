import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Animated,
  SafeAreaView
} from 'react-native';
import { calculateRiskScore, getRecoveryRecommendations, getPreventionTips } from '../../utils/fraudScoring';
import { RISK_LEVELS } from '../../constants/simulationTypes';
import FeedbackPanel from './components/FeedbackPanel';

const ResultScreen = ({ route, navigation }) => {
  // Get recorded actions from navigation params
  const { recordedActions } = route.params || { recordedActions: [] };
  
  // Animation value for score display
  const [scoreAnimation] = useState(new Animated.Value(0));
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Calculate score and risk level
  const { totalScore, riskLevel, actions } = calculateRiskScore(recordedActions);
  
  // Get recovery recommendations and prevention tips
  const recoverySteps = getRecoveryRecommendations(recordedActions);
  const preventionTips = getPreventionTips(riskLevel);

  // Animate score when component mounts
  useEffect(() => {
    Animated.timing(scoreAnimation, {
      toValue: totalScore,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    // Update animated score during animation
    const listener = scoreAnimation.addListener(({ value }) => {
      setAnimatedScore(Math.round(value));
    });

    return () => {
      scoreAnimation.removeListener(listener);
    };
  }, []);

  // Get current risk level color and label
  const getRiskLevelStyle = () => {
    return {
      color: RISK_LEVELS[riskLevel].color,
      fontSize: 24,
      fontWeight: 'bold',
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Simulation Complete</Text>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1053/1053210.png' }} 
            style={styles.headerImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Your Fraud Risk Score</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{animatedScore}</Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
          <Text style={getRiskLevelStyle()}>
            {RISK_LEVELS[riskLevel].label} Risk
          </Text>

          {/* Score bar */}
          <View style={styles.scoreBarContainer}>
            <Animated.View 
              style={[
                styles.scoreBar, 
                { 
                  width: scoreAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                  }),
                  backgroundColor: RISK_LEVELS[riskLevel].color 
                }
              ]} 
            />
          </View>
        </View>

        {/* What Went Wrong Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ❌ What Went Wrong
          </Text>
          {actions.length > 0 ? (
            actions.map((action, index) => (
              <FeedbackPanel 
                key={`action-${index}`}
                title={action.message}
                description={action.advice}
                iconType="error"
              />
            ))
          ) : (
            <Text style={styles.noActionsText}>
              Great job! You avoided major security mistakes.
            </Text>
          )}
        </View>

        {/* Recovery Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            🛡️ How to Recover from Fraud
          </Text>
          {recoverySteps.map((step, index) => (
            <FeedbackPanel 
              key={`recovery-${index}`}
              title={step.title}
              description={step.description}
              iconType="recovery"
            />
          ))}
        </View>

        {/* Prevention Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            📚 Tips to Prevent Future Fraud
          </Text>
          {preventionTips.map((tip, index) => (
            <FeedbackPanel 
              key={`tip-${index}`}
              title={tip.title}
              description={tip.description}
              iconType="tip"
            />
          ))}
        </View>

        {/* End message */}
        <View style={styles.endMessageContainer}>
          <Text style={styles.endMessage}>
            "You just experienced a simulation that millions fall for every year.
            But now you know the signs.
            Stay alert. Stay protected. Be your own ArthRakshak."
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Landing')}
        >
          <Text style={styles.buttonText}>Return Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <Text style={styles.secondaryButtonText}>Try Another Simulation</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    flex: 1,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    marginVertical: 10,
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreMax: {
    fontSize: 16,
    color: '#666',
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  scoreBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    width: '100%',
    marginTop: 15,
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 15,
  },
  noActionsText: {
    color: '#4CAF50',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 10,
  },
  endMessageContainer: {
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    padding: 20,
    marginVertical: 15,
  },
  endMessage: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1e3a8a',
  },
  secondaryButtonText: {
    color: '#1e3a8a',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ResultScreen;