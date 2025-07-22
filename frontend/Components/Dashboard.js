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
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState('Kashish Singh'); // This would come from user context/props
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-50));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [notificationCount] = useState(3);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Entrance animations
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
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    return () => clearInterval(timer);
  }, []);

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
      title: 'Scan Fraud Message',
      subtitle: 'Upload & analyze',
      icon: '🔍',
      color: '#00C853',
      onPress: () => console.log('Scan pressed'),
    },
    {
      id: 2,
      title: 'Fraud Awareness Quiz',
      subtitle: 'Test your knowledge',
      icon: '🧠',
      color: '#00C853',
      onPress: () => console.log('Quiz pressed'),
    },
    {
      id: 3,
      title: 'Financial Habits',
      subtitle: 'Track your progress',
      icon: '📈',
      color: '#00C853',
      onPress: () => console.log('Habits pressed'),
    },
    {
      id: 4,
      title: 'Learning Modules',
      subtitle: 'Expand knowledge',
      icon: '📚',
      color: '#00C853',
      onPress: () => console.log('Learning pressed'),
    },
    {
      id: 5,
      title: 'Scam Statistics',
      subtitle: 'India insights',
      icon: '📊',
      color: '#00C853',
      onPress: () => console.log('Statistics pressed'),
    },
    {
      id: 6,
      title: 'Profile & Settings',
      subtitle: 'Manage account',
      icon: '👤',
      color: '#00C853',
      onPress: () => console.log('Profile pressed'),
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'Phishing',
      message: 'Suspicious link detected in SMS',
      time: '2 hours ago',
      severity: 'high',
    },
    {
      id: 2,
      type: 'UPI Fraud',
      message: 'Fake payment request identified',
      time: '5 hours ago',
      severity: 'medium',
    },
    {
      id: 3,
      type: 'OTP Scam',
      message: 'Multiple OTP requests from unknown app',
      time: '1 day ago',
      severity: 'low',
    },
  ];

  const AnimatedCard = ({ children, delay = 0 }) => {
    const [cardScale] = useState(new Animated.Value(0.95));

    useEffect(() => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.spring(cardScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View style={{ transform: [{ scale: cardScale }] }}>
        {children}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FFFDE7" />
      
      {/* Header Bar */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>ArthRakshak</Text>
          <View style={styles.logoAccent} />
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.profileContainer}>
            <View style={styles.profilePicture}>
              <Text style={styles.profileInitial}>{userName.charAt(0)}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <Animated.View 
          style={[
            styles.welcomeSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.welcomeText}>Welcome back, {userName} 👋</Text>
          <Text style={styles.welcomeSubtext}>Stay informed. Stay secure.</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
          </View>
        </Animated.View>

        {/* Alert Banner */}
        <AnimatedCard delay={200}>
          <View style={styles.alertBanner}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <Text style={styles.alertText}>
              {notificationCount} new phishing scams detected near your area
            </Text>
          </View>
        </AnimatedCard>

        {/* Interactive Cards Section */}
        <View style={styles.cardsSection}>
          {/* Recent Fraud Alerts */}
          <AnimatedCard delay={300}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Recent Fraud Alerts</Text>
                <Text style={styles.cardIcon}>🚨</Text>
              </View>
              {recentAlerts.map((alert, index) => (
                <View key={alert.id} style={styles.alertItem}>
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
                </View>
              ))}
            </View>
          </AnimatedCard>

          {/* Tips of the Day */}
          <AnimatedCard delay={400}>
            <View style={styles.tipCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Tip of the Day</Text>
                <Text style={styles.cardIcon}>💡</Text>
              </View>
              <Text style={styles.tipText}>
                Never share your OTP with anyone. Banks and legitimate services will never ask for OTP over phone calls.
              </Text>
            </View>
          </AnimatedCard>

          {/* Account Activity */}
          <AnimatedCard delay={500}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Account Activity</Text>
                <Text style={styles.cardIcon}>📱</Text>
              </View>
              <View style={styles.activityItem}>
                <Text style={styles.activityText}>Last login: Today, 2:30 PM</Text>
                <Text style={styles.activityLocation}>Location: Mumbai, Maharashtra</Text>
              </View>
              <View style={styles.activityItem}>
                <Text style={styles.activityText}>Previous login: Yesterday, 6:45 PM</Text>
                <Text style={styles.activityLocation}>Location: Mumbai, Maharashtra</Text>
              </View>
            </View>
          </AnimatedCard>

          {/* Awareness Score */}
          <AnimatedCard delay={600}>
            <View style={styles.scoreCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Awareness Score</Text>
                <Text style={styles.cardIcon}>🏆</Text>
              </View>
              <View style={styles.scoreContainer}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreNumber}>85</Text>
                  <Text style={styles.scoreLabel}>%</Text>
                </View>
                <View style={styles.scoreInfo}>
                  <Text style={styles.scoreBadge}>🥇 Gold Level</Text>
                  <Text style={styles.scoreDescription}>
                    Excellent fraud awareness! Keep learning to maintain your score.
                  </Text>
                </View>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Navigation Grid */}
        <View style={styles.navigationSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.navigationGrid}>
            {navigationItems.map((item, index) => (
              <AnimatedCard key={item.id} delay={700 + (index * 100)}>
                <TouchableOpacity 
                  style={styles.navItem}
                  onPress={item.onPress}
                  activeOpacity={0.8}
                >
                  <Text style={styles.navIcon}>{item.icon}</Text>
                  <Text style={styles.navTitle}>{item.title}</Text>
                  <Text style={styles.navSubtitle}>{item.subtitle}</Text>
                </TouchableOpacity>
              </AnimatedCard>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerText}>Support & Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerText}>Contact Us</Text>
          </TouchableOpacity>
          <View style={styles.securityBadge}>
            <Text style={styles.securityText}>🔒 Secured by ArthRakshak</Text>
          </View>
        </View>
      </ScrollView>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00C853',
  },
  logoAccent: {
    width: 4,
    height: 24,
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
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 20,
  },
  welcomeSection: {
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00C853',
    marginBottom: 5,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00C853',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF176',
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cardsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tipCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFF176',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00C853',
  },
  cardIcon: {
    fontSize: 24,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  alertContent: {
    flex: 1,
  },
  alertType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00C853',
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    color: '#888',
  },
  severityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  activityItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  activityLocation: {
    fontSize: 12,
    color: '#888',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  scoreInfo: {
    flex: 1,
  },
  scoreBadge: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00C853',
    marginBottom: 5,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  navigationSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00C853',
    marginBottom: 15,
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navItem: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E8F5E8',
  },
  navIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  navTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00C853',
    textAlign: 'center',
    marginBottom: 5,
  },
  navSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#00C853',
    fontWeight: '600',
  },
  securityBadge: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#E8F5E8',
    borderRadius: 20,
  },
  securityText: {
    fontSize: 12,
    color: '#00C853',
    fontWeight: '600',
  },
});

export default Dashboard;
