import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { initializeAudio } from '../../utils/voiceUtils';

const HomeScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Initialize audio system when component mounts
    initializeAudio();
  }, []);

  const handleStartSimulation = () => {
    navigation.navigate('SimulationModule', { 
      simulationId: 'credit_card_fraud_simulation'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#1E3A8A', '#3B82F6']}
            style={styles.headerGradient}
          >
            <Text style={styles.appName}>ArthRakshak</Text>
            <Text style={styles.tagline}>Experience fraud before it happens to you</Text>
            
            <View style={styles.heroContainer}>
              <Image 
                source={require('../../assets/simulations/images/fraud_prevention.png')}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Why Simulate Fraud?</Text>
          
          <View style={styles.benefitCard}>
            <View style={styles.benefitIconContainer}>
              <Icon name="shield-checkmark" size={36} color="#3B82F6" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Learn by Experience</Text>
              <Text style={styles.benefitText}>
                Experience real fraud scenarios in a safe environment to recognize warning signs
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={styles.benefitIconContainer}>
              <Icon name="eye-outline" size={36} color="#3B82F6" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Know the Warning Signs</Text>
              <Text style={styles.benefitText}>
                Identify red flags in emails, websites and phone calls
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={styles.benefitIconContainer}>
              <Icon name="build-outline" size={36} color="#3B82F6" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Build Protection Skills</Text>
              <Text style={styles.benefitText}>
                Learn practical safety measures to protect your finances
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1.2 लाख+</Text>
              <Text style={styles.statLabel}>Fraud cases yearly</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹2,500 करोड़</Text>
              <Text style={styles.statLabel}>Lost to scams</Text>
            </View>
          </View>

          <Text style={styles.quoteText}>
            "The best way to prevent fraud is to recognize it before it happens."
          </Text>

          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartSimulation}
          >
            <Text style={styles.startButtonText}>Start Simulation</Text>
            <Icon name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.disclaimerContainer}>
            <Icon name="information-circle-outline" size={16} color="#6B7280" />
            <Text style={styles.disclaimerText}>
              This is a simulation for educational purposes only
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    width: '100%',
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    marginTop: 8,
  },
  heroContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  heroImage: {
    width: 220,
    height: 170,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 20,
    marginVertical: 24,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  statLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: '#D1D5DB',
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
  },
  startButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingBottom: 20,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
});

export default HomeScreen;