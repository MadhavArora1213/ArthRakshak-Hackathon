import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import color from '../../constants/theme/color';

const FinancialLiteracyAssessmentScreen = () => {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      id: 1,
      question: "बचत खाता क्या है? / What is a savings account?",
      options: [
        { id: 'a', text: 'एक ऐसा खाता जहाँ पैसा जमा करने पर ब्याज मिलता है / An account that earns interest on deposits', correct: true },
        { id: 'b', text: 'केवल खरीदारी के लिए उपयोग होने वाला कार्ड / A card used only for shopping', correct: false },
        { id: 'c', text: 'लोन लेने का तरीका / A way to take loans', correct: false },
        { id: 'd', text: 'निवेश करने का साधन / A tool for investment', correct: false }
      ]
    },
    {
      id: 2,
      question: "मुद्रास्फीति (Inflation) का मतलब क्या है? / What does inflation mean?",
      options: [
        { id: 'a', text: 'कीमतों में कमी / Decrease in prices', correct: false },
        { id: 'b', text: 'कीमतों में वृद्धि / Increase in prices', correct: true },
        { id: 'c', text: 'पैसे की कमी / Shortage of money', correct: false },
        { id: 'd', text: 'बैंक की दरें / Bank rates', correct: false }
      ]
    },
    {
      id: 3,
      question: "क्रेडिट स्कोर क्यों महत्वपूर्ण है? / Why is credit score important?",
      options: [
        { id: 'a', text: 'यह आपकी उम्र बताता है / It tells your age', correct: false },
        { id: 'b', text: 'यह लोन मिलने में मदद करता है / It helps in getting loans', correct: true },
        { id: 'c', text: 'यह आपकी नौकरी तय करता है / It determines your job', correct: false },
        { id: 'd', text: 'यह टैक्स बचाता है / It saves taxes', correct: false }
      ]
    },
    {
      id: 4,
      question: "FD का मतलब क्या है? / What does FD stand for?",
      options: [
        { id: 'a', text: 'Fixed Deposit / फिक्स्ड डिपॉजिट', correct: true },
        { id: 'b', text: 'Final Document / फाइनल डॉक्यूमेंट', correct: false },
        { id: 'c', text: 'Foreign Dollar / फॉरेन डॉलर', correct: false },
        { id: 'd', text: 'Fund Distribution / फंड डिस्ट्रिब्यूशन', correct: false }
      ]
    },
    {
      id: 5,
      question: "बीमा क्यों जरूरी है? / Why is insurance necessary?",
      options: [
        { id: 'a', text: 'टैक्स बचाने के लिए / To save taxes', correct: false },
        { id: 'b', text: 'वित्तीय सुरक्षा के लिए / For financial security', correct: true },
        { id: 'c', text: 'पैसा कमाने के लिए / To earn money', correct: false },
        { id: 'd', text: 'दोस्तों को दिखाने के लिए / To show friends', correct: false }
      ]
    },
    {
      id: 6,
      question: "SIP का पूरा नाम क्या है? / What is the full form of SIP?",
      options: [
        { id: 'a', text: 'Systematic Investment Plan / सिस्टेमैटिक इन्वेस्टमेंट प्लान', correct: true },
        { id: 'b', text: 'Savings Investment Program / सेविंग्स इन्वेस्टमेंट प्रोग्राम', correct: false },
        { id: 'c', text: 'Simple Interest Plan / सिंपल इंटरेस्ट प्लान', correct: false },
        { id: 'd', text: 'Secure Investment Policy / सिक्योर इन्वेस्टमेंट पॉलिसी', correct: false }
      ]
    },
    {
      id: 7,
      question: "आपातकालीन फंड कितने महीने का खर्च होना चाहिए? / How many months of expenses should an emergency fund cover?",
      options: [
        { id: 'a', text: '1-2 महीने / 1-2 months', correct: false },
        { id: 'b', text: '3-6 महीने / 3-6 months', correct: true },
        { id: 'c', text: '1 साल / 1 year', correct: false },
        { id: 'd', text: 'आपातकालीन फंड की जरूरत नहीं / No need for emergency fund', correct: false }
      ]
    }
  ];

  const animateToNextQuestion = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      slideAnim.setValue(0);
    });
  };

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!selectedOption) {
      Alert.alert(
        'विकल्प चुनें / Select Option',
        'कृपया कोई विकल्प चुनें / Please select an option'
      );
      return;
    }

    // Store answer
    const newAnswers = {
      ...answers,
      [currentQuestion]: {
        questionId: questions[currentQuestion].id,
        selectedOption,
        isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.correct || false
      }
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      animateToNextQuestion();
    } else {
      handleSubmit(newAnswers);
    }
  };

  const calculateScore = (userAnswers) => {
    const correctAnswers = Object.values(userAnswers).filter(answer => answer.isCorrect).length;
    const totalQuestions = questions.length;
    const percentage = (correctAnswers / totalQuestions) * 100;

    if (percentage >= 70) return 'advanced';
    if (percentage >= 40) return 'intermediate';
    return 'basic';
  };

  const getScoreMessage = (level) => {
    switch (level) {
      case 'advanced':
        return 'उत्कृष्ट! आपका वित्तीय ज्ञान अच्छा है / Excellent! Your financial knowledge is good';
      case 'intermediate':
        return 'अच्छा! कुछ और सीखने की जरूरत है / Good! Need to learn a bit more';
      default:
        return 'शुरुआत! हम आपको बुनियादी बातें सिखाएंगे / Beginning! We will teach you the basics';
    }
  };

  const handleSubmit = async (finalAnswers) => {
    setIsLoading(true);

    try {
      const financialLevel = calculateScore(finalAnswers);
      const assessmentData = {
        answers: finalAnswers,
        score: Object.values(finalAnswers).filter(answer => answer.isCorrect).length,
        totalQuestions: questions.length,
        financialLevel,
        completedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('financialAssessment', JSON.stringify(assessmentData));
      await AsyncStorage.setItem('financialLevel', financialLevel);

      // Show results
      setTimeout(() => {
        Alert.alert(
          'मूल्यांकन पूर्ण! / Assessment Complete!',
          getScoreMessage(financialLevel),
          [
            {
              text: 'आगे बढ़ें / Continue',
              onPress: () => navigation.navigate('GoalSettingWizardScreen'),
            },
          ]
        );
      }, 1500);
    } catch (error) {
      Alert.alert('त्रुटि / Error', 'मूल्यांकन सहेजने में समस्या / Problem saving assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="calculator" size={60} color={color.primaryGreen[500]} />
          <Text style={styles.loadingText}>परिणाम की गणना कर रहे हैं... / Calculating results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Test Your Financial Skills</Text>
          <Text style={styles.subtitle}>Help us personalize your learning experience</Text>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {questions.length}
          </Text>
        </View>

        {/* Question Card */}
        <Animated.View style={[
          styles.questionCard,
          {
            opacity: fadeAnim,
            transform: [{
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 20]
              })
            }]
          }
        ]}>
          <Text style={styles.questionText}>{currentQuestionData.question}</Text>

          <View style={styles.optionsContainer}>
            {currentQuestionData.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  selectedOption === option.id && styles.selectedOption,
                ]}
                onPress={() => handleOptionSelect(option.id)}
                accessibilityLabel={`Option ${option.id}`}
                accessibilityRole="button"
              >
                <View style={[
                  styles.optionIndicator,
                  selectedOption === option.id && styles.selectedIndicator,
                ]}>
                  {selectedOption === option.id && (
                    <Icon name="checkmark" size={16} color={color.pureWhite[50]} />
                  )}
                </View>
                <Text style={[
                  styles.optionText,
                  selectedOption === option.id && styles.selectedOptionText,
                ]}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Navigation Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !selectedOption && styles.disabledButton,
            ]}
            onPress={handleNext}
            disabled={!selectedOption}
            accessibilityLabel={currentQuestion === questions.length - 1 ? "Submit assessment" : "Next question"}
            accessibilityRole="button"
          >
            <Text style={[
              styles.nextButtonText,
              !selectedOption && styles.disabledButtonText,
            ]}>
              {currentQuestion === questions.length - 1 ? 'सबमिट करें / Submit' : 'अगला / Next'}
            </Text>
            <Icon 
              name={currentQuestion === questions.length - 1 ? "checkmark" : "arrow-forward"} 
              size={20} 
              color={selectedOption ? color.pureWhite[50] : color.pureWhite[600]} 
              style={styles.buttonIcon} 
            />
          </TouchableOpacity>
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
    paddingVertical: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: color.pureWhite[900],
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: color.pureWhite[600],
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  progressSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: color.pureWhite[300],
    borderRadius: 3,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: color.infoYellow[500],
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: color.pureWhite[600],
    fontWeight: '600',
  },
  questionCard: {
    backgroundColor: color.pureWhite[100],
    borderRadius: 16,
    padding: 25,
    marginBottom: 30,
    elevation: 2,
    shadowColor: color.pureWhite[400],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  questionText: {
    fontSize: 18,
    color: color.pureWhite[900],
    fontWeight: '600',
    lineHeight: 26,
    marginBottom: 25,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.pureWhite[50],
    borderWidth: 2,
    borderColor: color.pureWhite[300],
    borderRadius: 12,
    padding: 15,
    elevation: 1,
    shadowColor: color.pureWhite[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedOption: {
    borderColor: color.primaryGreen[500],
    backgroundColor: color.primaryGreen[50],
    elevation: 2,
  },
  optionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: color.pureWhite[400],
    backgroundColor: color.pureWhite[100],
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    backgroundColor: color.primaryGreen[500],
    borderColor: color.primaryGreen[500],
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: color.pureWhite[800],
    lineHeight: 22,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: color.primaryGreen[800],
    fontWeight: '600',
  },
  buttonSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: color.primaryGreen[500],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: color.primaryGreen[700],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: color.pureWhite[400],
    elevation: 0,
    shadowOpacity: 0,
  },
  nextButtonText: {
    color: color.pureWhite[50],
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: color.pureWhite[600],
  },
  buttonIcon: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 18,
    color: color.primaryGreen[700],
    textAlign: 'center',
    marginTop: 15,
  },
});

export default FinancialLiteracyAssessmentScreen;