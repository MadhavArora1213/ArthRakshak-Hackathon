import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import color from '../../constants/theme/color'; // Remove 's' from colors

const { width: screenWidth } = Dimensions.get('window');

const LandingPage = () => {
  const navigation = useNavigation();

  const features = [
    {
      id: 1,
      icon: require('../../../assets/icons/secure-banking.png'),
      title: 'सुरक्षित बैंकिंग',
      description: 'बैंक धोखाधड़ी से बचाव के तरीके सीखें',
    },
    {
      id: 2,
      icon: require('../../../assets/icons/language.png'),
      title: 'अपनी भाषा में सीखें',
      description: 'हिंदी में वित्तीय शिक्षा प्राप्त करें',
    },
    {
      id: 3,
      icon: require('../../../assets/icons/fraud-alert.png'),
      title: 'धोखाधड़ी अलर्ट',
      description: 'तुरंत चेतावनी और सुरक्षा टिप्स पाएं',
    },
    {
      id: 4,
      icon: require('../../../assets/icons/rewards.png'),
      title: 'सीखने के पुरस्कार',
      description: 'सीखकर कैशबैक और रिवार्ड्स जीतें',
    },
  ];

  const steps = [
    {
      step: '1',
      title: 'रजिस्टर करें',
      description: 'अपना खाता बनाएं और शुरुआत करें',
    },
    {
      step: '2',
      title: 'सीखें',
      description: 'वित्तीय सुरक्षा के बारे में जानें',
    },
    {
      step: '3',
      title: 'सुरक्षित रहें',
      description: 'धोखाधड़ी से अपना बचाव करें',
    },
    {
      step: '4',
      title: 'आगे बढ़ें',
      description: 'अपनी वित्तीय स्थिति सुधारें',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'सुनीता शर्मा',
      location: 'दिल्ली',
      quote: 'ArthRakshak से मैंने बैंक स्कैम से बचना सीखा',
      avatar: require('../../../assets/testimonials/user1.png'),
    },
    {
      id: 2,
      name: 'राज कुमार',
      location: 'मुंबई',
      quote: 'अब मैं अपने पैसे बेहतर तरीके से संभालता हूं',
      avatar: require('../../../assets/testimonials/user2.png'),
    },
  ];

  const partnerLogos = [
    require('../../../assets/partners/sbi.png'),
    require('../../../assets/partners/hdfc.png'),
    require('../../../assets/partners/icici.png'),
    require('../../../assets/partners/axis.png'),
  ];

  const renderFeatureCard = ({ item }) => (
    <View style={styles.featureCard}>
      <Image source={item.icon} style={styles.featureIcon} />
      <Text style={styles.featureTitle}>{item.title}</Text>
      <Text style={styles.featureDescription}>{item.description}</Text>
    </View>
  );

  const renderTestimonial = ({ item }) => (
    <View style={styles.testimonialCard}>
      <Image source={item.avatar} style={styles.avatarImage} />
      <Text style={styles.testimonialQuote}>"{item.quote}"</Text>
      <Text style={styles.testimonialName}>{item.name}</Text>
      <Text style={styles.testimonialLocation}>{item.location}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={require('../../../assets/landing/hero.png')}
            style={styles.heroImage}
            accessibilityLabel="ArthRakshak Hero Banner"
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>ArthRakshak – आपका वित्तीय रक्षक</Text>
            <Text style={styles.heroSubtitle}>सीखिए, सुरक्षित रहिए, आगे बढ़िए</Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('RegisterScreen')}
              accessibilityLabel="शुरुआत करें बटन"
            >
              <Text style={styles.ctaButtonText}>शुरुआत करें</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>मुख्य विशेषताएं</Text>
          <FlatList
            data={features}
            renderItem={renderFeatureCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuresContainer}
          />
        </View>

        {/* Steps Timeline */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>कैसे काम करता है</Text>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
              {index < steps.length - 1 && <View style={styles.stepConnector} />}
            </View>
          ))}
        </View>

        {/* Community Trust */}
        <View style={styles.communitySection}>
          <View style={styles.trustBadge}>
            <Text style={styles.trustBadgeText}>2 लाख+ उपयोगकर्ताओं का भरोसा</Text>
          </View>
          <Text style={styles.sectionTitle}>उपयोगकर्ता की राय</Text>
          <FlatList
            data={testimonials}
            renderItem={renderTestimonial}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialsContainer}
          />
        </View>

        {/* Partner Logos */}
        <View style={styles.partnersSection}>
          <Text style={styles.sectionTitle}>हमारे साझीदार बैंक</Text>
          <View style={styles.partnersGrid}>
            {partnerLogos.map((logo, index) => (
              <Image
                key={index}
                source={logo}
                style={styles.partnerLogo}
                accessibilityLabel={`Partner bank ${index + 1}`}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.pureWhite[50],
  },
  heroSection: {
    position: 'relative',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: screenWidth,
    height: 300,
    position: 'absolute',
    resizeMode: 'cover',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: color.pureWhite[50],
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: color.pureWhite[100],
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: color.primaryGreen[500],
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: color.primaryGreen[700],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  ctaButtonText: {
    color: color.pureWhite[50],
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuresSection: {
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: color.pureWhite[900],
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    paddingHorizontal: 10,
  },
  featureCard: {
    width: 200,
    backgroundColor: color.pureWhite[50],
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: color.pureWhite[400],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIcon: {
    width: 50,
    height: 50,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.pureWhite[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: color.pureWhite[600],
    textAlign: 'center',
    lineHeight: 20,
  },
  stepsSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: color.pureWhite[100],
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    position: 'relative',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.primaryGreen[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: color.pureWhite[50],
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
    paddingTop: 5,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.pureWhite[900],
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: color.pureWhite[600],
    lineHeight: 20,
  },
  stepConnector: {
    position: 'absolute',
    left: 19,
    top: 40,
    width: 2,
    height: 20,
    backgroundColor: color.primaryGreen[300],
  },
  communitySection: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  trustBadge: {
    backgroundColor: color.infoYellow[100],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  trustBadgeText: {
    color: color.infoYellow[800],
    fontSize: 14,
    fontWeight: 'bold',
  },
  testimonialsContainer: {
    paddingHorizontal: 10,
  },
  testimonialCard: {
    width: 280,
    backgroundColor: color.pureWhite[50],
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: color.pureWhite[400],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 15,
  },
  testimonialQuote: {
    fontSize: 14,
    color: color.pureWhite[700],
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
    lineHeight: 20,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.pureWhite[900],
    marginBottom: 5,
  },
  testimonialLocation: {
    fontSize: 12,
    color: color.pureWhite[500],
  },
  partnersSection: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: color.pureWhite[100],
  },
  partnersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partnerLogo: {
    width: (screenWidth - 60) / 2,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 20,
    opacity: 0.7,
  },
});

export default LandingPage;