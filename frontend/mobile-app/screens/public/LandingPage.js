import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import color from '../../constants/theme/color';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LandingPage = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Start pulsing animation for CTA
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  const trustIndicators = [
    {
      icon: 'shield-checkmark',
      text: '100% सुरक्षित',
      subText: 'Secure',
    },
    {
      icon: 'people',
      text: '2+ लाख उपयोगकर्ता',
      subText: '200K+ Users',
    },
    {
      icon: 'star',
      text: '4.8★ रेटिंग',
      subText: '4.8★ Rating',
    },
  ];

  const features = [
    {
      icon: 'phone-portrait',
      title: 'आसान ऐप',
      subtitle: 'Easy to Use',
      description: 'सरल भाषा में सीखें',
    },
    {
      icon: 'language',
      title: 'अपनी भाषा',
      subtitle: 'Your Language',
      description: '10+ भारतीय भाषाओं में',
    },
    {
      icon: 'warning',
      title: 'धोखाधड़ी अलर्ट',
      subtitle: 'Fraud Alerts',
      description: 'तुरंत चेतावनी पाएं',
    },
    {
      icon: 'gift',
      title: 'पुरस्कार जीतें',
      subtitle: 'Win Rewards',
      description: 'सीखकर कमाएं',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Hero Section */}
        <Animated.View 
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {/* Main Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.shieldContainer}>
              <Icon name="shield-checkmark" size={80} color={color.primaryGreen[500]} />
              <View style={styles.rupeeIconsContainer}>
                <Icon name="cash" size={24} color={color.infoYellow[600]} style={styles.floatingIcon1} />
                <Icon name="card" size={20} color={color.primaryGreen[400]} style={styles.floatingIcon2} />
                <Icon name="phone-portrait" size={18} color={color.infoYellow[500]} style={styles.floatingIcon3} />
              </View>
            </View>
          </View>

          {/* Main Headline */}
          <View style={styles.headlineContainer}>
            <Text style={styles.mainHeadline}>आपके पैसे का रखवाला</Text>
            <Text style={styles.subHeadline}>Empowering India's Financial Safety</Text>
            <Text style={styles.brandName}>ArthRakshak</Text>
          </View>

          {/* Trust Indicators */}
          <View style={styles.trustContainer}>
            {trustIndicators.map((item, index) => (
              <View key={index} style={styles.trustItem}>
                <Icon name={item.icon} size={20} color={color.primaryGreen[600]} />
                <Text style={styles.trustText}>{item.text}</Text>
                <Text style={styles.trustSubText}>{item.subText}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Features Preview */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>क्यों चुनें ArthRakshak?</Text>
          <Text style={styles.featuresSubtitle}>Why Choose ArthRakshak?</Text>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Icon name={feature.icon} size={28} color={color.primaryGreen[500]} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>₹50,000+</Text>
            <Text style={styles.statLabel}>औसत बचत / Avg Savings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>95%</Text>
            <Text style={styles.statLabel}>धोखाधड़ी से बचाव / Fraud Prevention</Text>
          </View>
        </View>

        {/* Voice Support Info */}
        <View style={styles.accessibilitySection}>
          <Icon name="volume-high" size={24} color={color.infoYellow[600]} />
          <Text style={styles.accessibilityText}>
            आवाज़ में सुनें / Listen with Voice Support
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Section */}
      <View style={styles.bottomSection}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>शुरुआत / Step 1 of 12</Text>
        </View>

        {/* Primary CTA */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('LanguageSelectionScreen')}
            accessibilityLabel="शुरू करें"
            accessibilityRole="button"
          >
            <Icon name="arrow-forward" size={24} color={color.pureWhite[50]} style={styles.buttonIcon} />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.primaryButtonText}>शुरू करें</Text>
              <Text style={styles.primaryButtonSubtext}>Get Started</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Secondary CTA */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('LanguageSelectionScreen')}
          accessibilityLabel="भाषा बदलें"
          accessibilityRole="button"
        >
          <Icon name="language" size={20} color={color.infoYellow[700]} style={styles.secondaryButtonIcon} />
          <View style={styles.buttonTextContainer}>
            <Text style={styles.secondaryButtonText}>भाषा बदलें</Text>
            <Text style={styles.secondaryButtonSubtext}>Change Language</Text>
          </View>
        </TouchableOpacity>

        {/* Help Text */}
        <Text style={styles.helpText}>
          मुफ्त है, हमेशा रहेगा / Free forever, no hidden charges
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.pureWhite[50],
  },
  scrollContainer: {
    paddingBottom: 200, // Space for fixed bottom section
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  illustrationContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.primaryGreen[50],
    borderRadius: 60,
    elevation: 3,
    shadowColor: color.primaryGreen[500],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  rupeeIconsContainer: {
    position: 'absolute',
    width: 160,
    height: 160,
  },
  floatingIcon1: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  floatingIcon2: {
    position: 'absolute',
    bottom: 20,
    left: 10,
  },
  floatingIcon3: {
    position: 'absolute',
    top: 30,
    left: 0,
  },
  headlineContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainHeadline: {
    fontSize: 28,
    fontWeight: 'bold',
    color: color.pureWhite[900],
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 36,
  },
  subHeadline: {
    fontSize: 16,
    color: color.pureWhite[600],
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 22,
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: color.primaryGreen[600],
    textAlign: 'center',
  },
  trustContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: color.pureWhite[800],
    textAlign: 'center',
    marginTop: 5,
  },
  trustSubText: {
    fontSize: 10,
    color: color.pureWhite[500],
    textAlign: 'center',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: color.pureWhite[100],
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: color.pureWhite[900],
    textAlign: 'center',
    marginBottom: 5,
  },
  featuresSubtitle: {
    fontSize: 14,
    color: color.pureWhite[600],
    textAlign: 'center',
    marginBottom: 25,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (screenWidth - 50) / 2,
    backgroundColor: color.pureWhite[50],
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: color.pureWhite[400],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: color.primaryGreen[50],
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: color.pureWhite[900],
    textAlign: 'center',
    marginBottom: 2,
  },
  featureSubtitle: {
    fontSize: 11,
    color: color.primaryGreen[600],
    textAlign: 'center',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 12,
    color: color.pureWhite[600],
    textAlign: 'center',
    lineHeight: 16,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: color.primaryGreen[50],
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: color.primaryGreen[200],
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: color.primaryGreen[700],
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: color.primaryGreen[600],
    textAlign: 'center',
    lineHeight: 16,
  },
  accessibilitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: color.infoYellow[50],
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  accessibilityText: {
    fontSize: 14,
    color: color.infoYellow[800],
    marginLeft: 10,
    fontWeight: '500',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: color.pureWhite[50],
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: color.pureWhite[200],
    elevation: 5,
    shadowColor: color.pureWhite[400],
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: 80,
    height: 4,
    backgroundColor: color.pureWhite[300],
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    width: '8%',
    height: '100%',
    backgroundColor: color.primaryGreen[500],
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: color.pureWhite[600],
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: color.primaryGreen[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: color.primaryGreen[700],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minHeight: 56, // Accessibility touch target
  },
  buttonIcon: {
    marginRight: 12,
  },
  secondaryButtonIcon: {
    marginRight: 8,
  },
  buttonTextContainer: {
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.pureWhite[50],
  },
  primaryButtonSubtext: {
    fontSize: 12,
    color: color.pureWhite[100],
    marginTop: 2,
  },
  secondaryButton: {
    backgroundColor: color.infoYellow[100],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: color.infoYellow[300],
    minHeight: 48, // Accessibility touch target
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: color.infoYellow[800],
  },
  secondaryButtonSubtext: {
    fontSize: 11,
    color: color.infoYellow[600],
    marginTop: 1,
  },
  helpText: {
    fontSize: 12,
    color: color.pureWhite[500],
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default LandingPage;