import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Easing,
  Alert,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  PulseAnimation,
  FadeInAnimation,
  SlideInAnimation,
  BounceAnimation,
  FloatingAnimation,
} from './AnimatedComponents';

const { width, height } = Dimensions.get('window');

const EnhancedDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState('Kashish Singh');
  const [notificationCount] = useState(3);
  const [awarenessScore] = useState(85);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  // Animation values
  const [headerAnim] = useState(new Animated.Value(0));
  const [cardAnimations] = useState(Array(6).fill().map(() => new Animated.Value(0)));
  const [progressAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Start entrance animations
    startEntranceAnimations();

    // Start pulse animation for notifications
    startPulseAnimation();

    return () => clearInterval(timer);
  }, []);

  const startEntranceAnimations = () => {
    // Header animation
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();

    // Staggered card animations
    const cardAnimationPromises = cardAnimations.map((anim, index) => {
      return new Promise((resolve) => {
        Animated.sequence([
          Animated.delay(index * 150),
          Animated.spring(anim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start(resolve);
      });
    });

    // Progress bar animation
    setTimeout(() => {
      Animated.timing(progressAnim, {
        toValue: awarenessScore / 100,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }, 1000);
  };

  const startPulseAnimation = () => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const navigationItems = [
    {
      id: 1,
      title: 'Scan Fraud',
      subtitle: 'Upload & analyze',
      icon: '🔍',
      gradient: ['#004030', '#006B3C'],
      onPress: handleScanFraud,
    },
    {
      id: 2,
      title: 'Take Quiz',
      subtitle: 'Test knowledge',
      icon: '🧠',
      gradient: ['#004030', '#006B3C'],
      onPress: () => console.log('Quiz pressed'),
    },
    {
      id: 3,
      title: 'Track Habits',
      subtitle: 'Monitor progress',
      icon: '📈',
      gradient: ['#004030', '#006B3C'],
      onPress: () => console.log('Habits pressed'),
    },
    {
      id: 4,
      title: 'Learn More',
      subtitle: 'Expand knowledge',
      icon: '📚',
      gradient: ['#004030', '#006B3C'],
      onPress: () => console.log('Learning pressed'),
    },
    {
      id: 5,
      title: 'Statistics',
      subtitle: 'View insights',
      icon: '📊',
      gradient: ['#004030', '#006B3C'],
      onPress: () => console.log('Statistics pressed'),
    },
    {
      id: 6,
      title: 'Profile',
      subtitle: 'Manage account',
      icon: '👤',
      gradient: ['#004030', '#006B3C'],
      onPress: () => console.log('Profile pressed'),
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'Phishing Alert',
      message: 'Suspicious link detected in SMS',
      time: '2 hours ago',
      severity: 'high',
      icon: '🎣',
      detailedInfo: {
        title: '🎣 Phishing Alert Detected',
        description: 'A suspicious phishing attempt has been detected targeting your bank account.',
        details: [
          '• Fraudulent SMS claiming to be from your bank',
          '• Contains suspicious link asking for login credentials',
          '• Sender number is not from official bank',
          '• Message has spelling errors and urgent language'
        ],
        prevention: [
          '✅ Never click on suspicious links in SMS',
          '✅ Always verify with your bank directly',
          '✅ Check sender number authenticity',
          '✅ Look for spelling and grammar mistakes',
          '✅ Banks never ask for passwords via SMS'
        ],
        action: 'Report this SMS to your bank and delete it immediately'
      }
    },
    {
      id: 2,
      type: 'UPI Fraud',
      message: 'Fake payment request identified',
      time: '5 hours ago',
      severity: 'medium',
      icon: '💳',
      detailedInfo: {
        title: '💳 UPI Fraud Attempt',
        description: 'A fraudulent UPI payment request has been detected and blocked.',
        details: [
          '• Fake UPI payment request from unknown number',
          '• Using similar name to trick you',
          '• Requesting immediate payment for fake emergency',
          '• No proper merchant verification'
        ],
        prevention: [
          '✅ Always verify payment requests',
          '✅ Check merchant details carefully',
          '✅ Never pay to unknown UPI IDs',
          '✅ Verify emergency calls independently',
          '✅ Use only trusted payment platforms'
        ],
        action: 'Block the UPI ID and report to authorities'
      }
    },
    {
      id: 3,
      type: 'OTP Scam',
      message: 'Multiple OTP requests detected',
      time: '1 day ago',
      severity: 'low',
      icon: '🔐',
      detailedInfo: {
        title: '🔐 OTP Scam Warning',
        description: 'Multiple suspicious OTP requests detected from different services.',
        details: [
          '• Unusual number of OTP requests in short time',
          '• Requests from unfamiliar services',
          '• Potential SIM swapping attempt',
          '• Account takeover risk detected'
        ],
        prevention: [
          '✅ Never share OTP with anyone',
          '✅ Banks never ask for OTP over phone',
          '✅ Enable additional security on accounts',
          '✅ Monitor account activity regularly',
          '✅ Contact bank if suspicious activity'
        ],
        action: 'Change passwords and enable 2FA on all accounts'
      }
    },
  ];

  const handleAlertPress = (alert) => {
    setSelectedAlert(alert);
    setModalVisible(true);
  };

  const handleScanFraud = () => {
    Alert.alert(
      '🔍 Scan Fraud Detection',
      'Upload suspicious messages, emails, or screenshots to detect potential fraud patterns.',
      [
        { text: 'Upload Image', onPress: () => console.log('Upload image') },
        { text: 'Scan QR Code', onPress: () => console.log('Scan QR') },
        { text: 'Text Analysis', onPress: () => console.log('Text analysis') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const tipOfTheDay = [
    "Never share your OTP with anyone. Banks will never ask for OTP over phone calls.",
    "Always verify sender's identity before clicking on any financial links.",
    "Use official banking apps and avoid third-party payment platforms for sensitive transactions.",
    "Enable two-factor authentication for all your financial accounts.",
    "Regularly check your bank statements for unauthorized transactions.",
  ];

  const AnimatedCard = ({ children, index = 0, style = {} }) => {
    const cardAnim = cardAnimations[index] || new Animated.Value(1);
    
    return (
      <Animated.View
        style={[
          {
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
              { scale: cardAnim },
            ],
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    );
  };

  const CircularProgress = ({ progress, size = 80, strokeWidth = 8 }) => {
    const [circumference] = useState(2 * Math.PI * ((size - strokeWidth) / 2));
    const [progressAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
      Animated.timing(progressAnimation, {
        toValue: progress,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }, [progress]);

    return (
      <View style={styles.progressContainer}>
        <View style={[styles.progressCircle, { width: size, height: size }]}>
          <View style={styles.progressInner}>
            <Text style={styles.progressText}>{Math.round(progress * 100)}</Text>
            <Text style={styles.progressLabel}>%</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FFFDE7" />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, 0],
                }),
              },
            ],
            opacity: headerAnim,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <FloatingAnimation distance={5} duration={3000}>
            <Text style={styles.logo}>ArthRakshak</Text>
          </FloatingAnimation>
          <View style={styles.logoAccent} />
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <PulseAnimation minScale={0.9} maxScale={1.1} duration={2000}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Text style={styles.notificationIcon}>🔔</Text>
                {notificationCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>{notificationCount}</Text>
                  </View>
                )}
              </Animated.View>
            </PulseAnimation>
          </TouchableOpacity>
          
          <BounceAnimation delay={500}>
            <View style={styles.profileContainer}>
              <View style={styles.profilePicture}>
                <Text style={styles.profileInitial}>{userName.charAt(0)}</Text>
              </View>
            </View>
          </BounceAnimation>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <AnimatedCard index={0}>
          <View style={styles.welcomeSection}>
            <SlideInAnimation direction="right" delay={300}>
              <Text style={styles.welcomeText}>Welcome back, {userName} 👋</Text>
              <Text style={styles.welcomeSubtext}>Stay informed. Stay secure.</Text>
            </SlideInAnimation>
            
            <FadeInAnimation delay={800}>
              <View style={styles.timeContainer}>
                <View style={styles.timeCard}>
                  <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                  <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
                </View>
              </View>
            </FadeInAnimation>
          </View>
        </AnimatedCard>

        {/* Alert Banner */}
        <AnimatedCard index={1}>
          <PulseAnimation minScale={0.98} maxScale={1.02} duration={3000}>
            <View style={styles.alertBanner}>
              <Text style={styles.alertIcon}>⚠️</Text>
              <Text style={styles.alertText}>
                {notificationCount} new phishing scams detected near your area
              </Text>
              <View style={styles.alertPulse} />
            </View>
          </PulseAnimation>
        </AnimatedCard>

        {/* Interactive Cards Section */}
        <View style={styles.cardsSection}>
          {/* Recent Fraud Alerts */}
          <AnimatedCard index={2}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Recent Fraud Alerts</Text>
                <Text style={styles.cardIcon}>🚨</Text>
              </View>
              {recentAlerts.map((alert, index) => (
                <SlideInAnimation key={alert.id} direction="left" delay={1000 + (index * 200)}>
                  <TouchableOpacity 
                    style={styles.alertItem} 
                    activeOpacity={0.7}
                    onPress={() => handleAlertPress(alert)}
                  >
                    <View style={styles.alertIconContainer}>
                      <Text style={styles.alertItemIcon}>{alert.icon}</Text>
                    </View>
                    <View style={styles.alertContent}>
                      <Text style={styles.alertType}>{alert.type}</Text>
                      <Text style={styles.alertMessage}>{alert.message}</Text>
                      <Text style={styles.alertTime}>{alert.time}</Text>
                    </View>
                    <View style={[
                      styles.severityIndicator,
                      { backgroundColor: alert.severity === 'high' ? '#FF5722' : 
                                       alert.severity === 'medium' ? '#FF9800' : '#4CAF50' }
                    ]} />
                    <Text style={styles.alertArrow}>▶</Text>
                  </TouchableOpacity>
                </SlideInAnimation>
              ))}
            </View>
          </AnimatedCard>

          {/* Tips of the Day */}
          <AnimatedCard index={3}>
            <View style={styles.tipCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>💡 Tip of the Day</Text>
                <FloatingAnimation distance={3} duration={2500}>
                  <Text style={styles.cardIcon}>💡</Text>
                </FloatingAnimation>
              </View>
              <FadeInAnimation delay={1500}>
                <Text style={styles.tipText}>
                  {tipOfTheDay[Math.floor(Math.random() * tipOfTheDay.length)]}
                </Text>
              </FadeInAnimation>
            </View>
          </AnimatedCard>

          {/* Awareness Score */}
          <AnimatedCard index={4}>
            <View style={styles.scoreCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Your Awareness Score</Text>
                <Text style={styles.cardIcon}>🏆</Text>
              </View>
              <View style={styles.scoreContainer}>
                <CircularProgress progress={awarenessScore / 100} />
                <View style={styles.scoreInfo}>
                  <BounceAnimation delay={2000}>
                    <Text style={styles.scoreBadge}>🥇 Gold Level</Text>
                  </BounceAnimation>
                  <FadeInAnimation delay={2200}>
                    <Text style={styles.scoreDescription}>
                      Excellent fraud awareness! Keep learning to maintain your score.
                    </Text>
                  </FadeInAnimation>
                </View>
              </View>
            </View>
          </AnimatedCard>

          {/* Account Activity */}
          <AnimatedCard index={5}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Account Activity</Text>
                <Text style={styles.cardIcon}>📱</Text>
              </View>
              <SlideInAnimation direction="up" delay={1800}>
                <View style={styles.activityItem}>
                  <View style={styles.activityIndicator} />
                  <View>
                    <Text style={styles.activityText}>Last login: Today, 2:30 PM</Text>
                    <Text style={styles.activityLocation}>📍 Mumbai, Maharashtra</Text>
                  </View>
                </View>
              </SlideInAnimation>
              <SlideInAnimation direction="up" delay={2000}>
                <View style={styles.activityItem}>
                  <View style={[styles.activityIndicator, { backgroundColor: '#FFF176' }]} />
                  <View>
                    <Text style={styles.activityText}>Previous login: Yesterday, 6:45 PM</Text>
                    <Text style={styles.activityLocation}>📍 Mumbai, Maharashtra</Text>
                  </View>
                </View>
              </SlideInAnimation>
            </View>
          </AnimatedCard>
        </View>

        {/* Navigation Grid */}
        <View style={styles.navigationSection}>
          <SlideInAnimation direction="left" delay={2200}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </SlideInAnimation>
          <View style={styles.navigationGrid}>
            {navigationItems.map((item, index) => (
              <BounceAnimation key={item.id} delay={2400 + (index * 100)}>
                <TouchableOpacity 
                  style={styles.navItem}
                  onPress={item.onPress}
                  activeOpacity={0.8}
                >
                  <FloatingAnimation distance={5} duration={2000 + (index * 200)}>
                    <Text style={styles.navIcon}>{item.icon}</Text>
                  </FloatingAnimation>
                  <Text style={styles.navTitle}>{item.title}</Text>
                  <Text style={styles.navSubtitle}>{item.subtitle}</Text>
                  <View style={styles.navAccent} />
                </TouchableOpacity>
              </BounceAnimation>
            ))}
          </View>
        </View>

        {/* Footer */}
        <FadeInAnimation delay={3000}>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton}>
              <Text style={styles.footerText}>📞 Support & Help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton}>
              <Text style={styles.footerText}>💬 Contact Us</Text>
            </TouchableOpacity>
            <View style={styles.securityBadge}>
              <PulseAnimation minScale={0.95} maxScale={1.05} duration={4000}>
                <Text style={styles.securityText}>🔒 Secured by ArthRakshak</Text>
              </PulseAnimation>
            </View>
          </View>
        </FadeInAnimation>
      </ScrollView>

      {/* Alert Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedAlert && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedAlert.detailedInfo.title}</Text>
                  <TouchableOpacity 
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalScrollView}>
                  <Text style={styles.modalDescription}>
                    {selectedAlert.detailedInfo.description}
                  </Text>
                  
                  <Text style={styles.modalSectionTitle}>🚨 Alert Details:</Text>
                  {selectedAlert.detailedInfo.details.map((detail, index) => (
                    <Text key={index} style={styles.modalDetailItem}>{detail}</Text>
                  ))}
                  
                  <Text style={styles.modalSectionTitle}>🛡️ Prevention Tips:</Text>
                  {selectedAlert.detailedInfo.prevention.map((tip, index) => (
                    <Text key={index} style={styles.modalDetailItem}>{tip}</Text>
                  ))}
                  
                  <View style={styles.modalActionContainer}>
                    <Text style={styles.modalActionTitle}>🎯 Recommended Action:</Text>
                    <Text style={styles.modalActionText}>
                      {selectedAlert.detailedInfo.action}
                    </Text>
                  </View>
                </ScrollView>
                
                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={styles.modalButton}
                    onPress={() => {
                      setModalVisible(false);
                      Alert.alert('Reported', 'Thank you for reporting this fraud attempt!');
                    }}
                  >
                    <Text style={styles.modalButtonText}>📞 Report Fraud</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                      📚 Learn More
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDE7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFDE7',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E8',
    elevation: 4,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#004030',
  },
  logoAccent: {
    width: 4,
    height: 26,
    backgroundColor: '#FFF176',
    marginLeft: 8,
    borderRadius: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginRight: 15,
    padding: 8,
  },
  notificationIcon: {
    fontSize: 26,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF5722',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFDE7',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileContainer: {
    marginLeft: 10,
  },
  profilePicture: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#004030',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF176',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  welcomeSection: {
    padding: 25,
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#004030',
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#004030',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 17,
    color: '#666',
    marginBottom: 20,
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeCard: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004030',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF176',
    marginHorizontal: 20,
    marginTop: 15,
    padding: 18,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#FFF176',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  alertIcon: {
    fontSize: 26,
    marginRight: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  alertPulse: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF176',
    opacity: 0.3,
  },
  cardsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  tipCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
    elevation: 6,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
    elevation: 6,
    shadowColor: '#FFF176',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#FFF176',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#004030',
  },
  cardIcon: {
    fontSize: 26,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  alertItemIcon: {
    fontSize: 20,
  },
  alertContent: {
    flex: 1,
  },
  alertType: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#004030',
    marginBottom: 3,
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  alertTime: {
    fontSize: 12,
    color: '#888',
  },
  severityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  tipText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  activityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#004030',
    marginRight: 15,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
    fontWeight: '500',
  },
  activityLocation: {
    fontSize: 12,
    color: '#888',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    marginRight: 25,
  },
  progressCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#E8F5E8',
    position: 'relative',
  },
  progressInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004030',
  },
  progressLabel: {
    fontSize: 14,
    color: '#004030',
  },
  scoreInfo: {
    flex: 1,
  },
  scoreBadge: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#004030',
    marginBottom: 8,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  navigationSection: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004030',
    marginBottom: 20,
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navItem: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#E8F5E8',
    position: 'relative',
    overflow: 'hidden',
  },
  navIcon: {
    fontSize: 42,
    marginBottom: 12,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#004030',
    textAlign: 'center',
    marginBottom: 6,
  },
  navSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  navAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FFF176',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginBottom: 12,
    backgroundColor: '#E8F5E8',
    borderRadius: 25,
  },
  footerText: {
    fontSize: 14,
    color: '#004030',
    fontWeight: '600',
  },
  securityBadge: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E8F5E8',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#004030',
  },
  securityText: {
    fontSize: 13,
    color: '#004030',
    fontWeight: '600',
  },
  alertArrow: {
    fontSize: 16,
    color: '#004030',
    marginLeft: 10,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004030',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    padding: 20,
    paddingBottom: 10,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004030',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  modalDetailItem: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  modalActionContainer: {
    backgroundColor: '#E8F5E8',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#004030',
  },
  modalActionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#004030',
    marginBottom: 8,
  },
  modalActionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#004030',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: '#E8F5E8',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalButtonTextSecondary: {
    color: '#004030',
  },
});

export default EnhancedDashboard;
