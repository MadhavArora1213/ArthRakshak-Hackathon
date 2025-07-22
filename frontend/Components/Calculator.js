import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing, Modal, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Login from './Login';

const { width, height } = Dimensions.get('window');

const Calculator = () => {
  // Authentication States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Budget Planner States
  const [currentMode, setCurrentMode] = useState('budget'); // Start with budget planner
  const [budgetData, setBudgetData] = useState({
    // User Profile
    userType: 'Working Professional',
    age: '',
    locationType: 'Urban',
    incomeSource: 'Salary',
    
    // Income
    incomeMonthly: '',
    incomeOther: '',
    
    // Fixed Expenses
    rent: '',
    electricity: '',
    internet: '',
    recharge: '',
    emi: '',
    insurance: '',
    schoolFees: '',
    fixedOthers: '',
    
    // Variable Expenses
    groceries: '',
    foodOutside: '',
    transport: '',
    entertainment: '',
    shopping: '',
    medical: '',
    travel: '',
    donation: '',
    variableOthers: '',
    
    // Savings Goal
    savingsTarget: '',
    savingsPercentGoal: '20%'
  });
  const [showBudgetReport, setShowBudgetReport] = useState(false);
  const [budgetPersonality, setBudgetPersonality] = useState('');
  
  // Original Calculator States
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [memory, setMemory] = useState(0);
  const [showMemory, setShowMemory] = useState(false);
  const [animatedValues] = useState(() => ({}));
  const [glowAnimations] = useState(() => ({}));
  const [showScientific, setShowScientific] = useState(false);
  const [angleMode, setAngleMode] = useState('deg');
  const [displayAnimation] = useState(new Animated.Value(1));
  const [calculatorScale] = useState(new Animated.Value(1));

  // Initialize animations for each button
  const initializeAnimations = useCallback(() => {
    const buttons = [
      'AC', 'DEL', '%', '÷',
      '7', '8', '9', '×',
      '4', '5', '6', '-',
      '1', '2', '3', '+',
      '+/-', '0', '.', '=',
      'M+', 'M-', 'MR', 'MC'
    ];

    buttons.forEach(button => {
      if (!animatedValues[button]) {
        animatedValues[button] = new Animated.Value(1);
        glowAnimations[button] = new Animated.Value(0);
      }
    });
  }, []); // Remove dependencies to prevent infinite loop

  useEffect(() => {
    initializeAnimations();
  }, [initializeAnimations]);

  const themes = {
    light: {
      background: '#fefbf6',
      calculatorBg: 'rgba(255, 255, 255, 0.95)',
      displayBg: 'rgba(255, 255, 255, 0.9)',
      displayText: '#1a202c',
      buttonPrimary: '#2dd4bf',
      buttonSecondary: '#fbbf24',
      buttonNeutral: 'rgba(255, 255, 255, 0.95)',
      buttonText: '#374151',
      operatorText: '#ffffff',
      shadow: 'rgba(0, 0, 0, 0.08)',
      brandText: '#1a202c',
      accent: '#06b6d4',
      cardShadow: 'rgba(0, 0, 0, 0.05)',
      glowPrimary: 'rgba(45, 212, 191, 0.3)',
      glowSecondary: 'rgba(251, 191, 36, 0.3)',
      scientificButton: '#8b5cf6',
      scientificGlow: 'rgba(139, 92, 246, 0.3)',
      errorColor: '#ef4444',
      successColor: '#10b981',
    },
    dark: {
      background: '#0f172a',
      calculatorBg: 'rgba(30, 41, 59, 0.95)',
      displayBg: 'rgba(30, 41, 59, 0.9)',
      displayText: '#f1f5f9',
      buttonPrimary: '#10b981',
      buttonSecondary: '#f59e0b',
      buttonNeutral: 'rgba(51, 65, 85, 0.9)',
      buttonText: '#e2e8f0',
      operatorText: '#ffffff',
      shadow: 'rgba(0, 0, 0, 0.3)',
      brandText: '#f1f5f9',
      accent: '#0891b2',
      cardShadow: 'rgba(0, 0, 0, 0.2)',
      glowPrimary: 'rgba(16, 185, 129, 0.4)',
      glowSecondary: 'rgba(245, 158, 11, 0.4)',
      scientificButton: '#7c3aed',
      scientificGlow: 'rgba(124, 58, 237, 0.4)',
      errorColor: '#ef4444',
      successColor: '#10b981',
    }
  };

  const currentTheme = themes[isDarkMode ? 'dark' : 'light'];

  // Budget calculation functions - Use useMemo to prevent recalculation on every render
  const calculateBudgetTotals = useMemo(() => {
    return () => {
      const incomeTotal = parseFloat(budgetData.incomeMonthly || 0) + parseFloat(budgetData.incomeOther || 0);
      
      const fixedTotal = parseFloat(budgetData.rent || 0) + parseFloat(budgetData.electricity || 0) + 
                        parseFloat(budgetData.internet || 0) + parseFloat(budgetData.recharge || 0) +
                        parseFloat(budgetData.emi || 0) + parseFloat(budgetData.insurance || 0) +
                        parseFloat(budgetData.schoolFees || 0) + parseFloat(budgetData.fixedOthers || 0);
      
      const variableTotal = parseFloat(budgetData.groceries || 0) + parseFloat(budgetData.foodOutside || 0) +
                           parseFloat(budgetData.transport || 0) + parseFloat(budgetData.entertainment || 0) +
                           parseFloat(budgetData.shopping || 0) + parseFloat(budgetData.medical || 0) +
                           parseFloat(budgetData.travel || 0) + parseFloat(budgetData.donation || 0) +
                           parseFloat(budgetData.variableOthers || 0);
      
      const expensesTotal = fixedTotal + variableTotal;
      const balanceRemaining = incomeTotal - expensesTotal;
      const savingsAchievedPercent = incomeTotal > 0 ? ((balanceRemaining / incomeTotal) * 100).toFixed(1) : 0;
      
      // Safe parsing of savings percentage goal
      let savingsPercentValue = 20; // default
      if (budgetData.savingsPercentGoal && budgetData.savingsPercentGoal !== 'Custom') {
        const parsed = parseInt(budgetData.savingsPercentGoal.replace('%', ''));
        if (!isNaN(parsed)) {
          savingsPercentValue = parsed;
        }
      }
      const savingsRecommended = (incomeTotal * savingsPercentValue) / 100;
      
      let budgetStatus = '⚠ Break-even';
      if (balanceRemaining > 0) budgetStatus = '🟢 Surplus';
      if (balanceRemaining < 0) budgetStatus = '🔴 Deficit';
      
      // Determine budget personality
      let personality = '🟡 Cautious Mover';
      if (savingsAchievedPercent >= 20) personality = '🟢 Smart Planner';
      else if (balanceRemaining < -1000) personality = '🔴 Budget Buster';
      else if (parseFloat(budgetData.entertainment || 0) > incomeTotal * 0.15) personality = '📺 Entertainment Lover';
      
      return {
        incomeTotal,
        fixedTotal,
        variableTotal,
        expensesTotal,
        balanceRemaining,
        savingsAchievedPercent,
        savingsRecommended,
        budgetStatus,
        personality
      };
    };
  }, [budgetData]);

  const generatePersonalizedTips = (totals) => {
    const tips = [];
    const { incomeTotal, balanceRemaining } = totals;
    
    if (balanceRemaining < 0) {
      tips.push("🚨 You're overspending! Start tracking variable costs and cut non-essential expenses.");
    }
    
    if (parseFloat(budgetData.rent || 0) > incomeTotal * 0.4) {
      tips.push("🏠 Your rent is > 40% of income. Try to negotiate or consider shared accommodation.");
    }
    
    if (parseFloat(budgetData.foodOutside || 0) > incomeTotal * 0.15) {
      tips.push("🍽️ High food delivery expenses! Cut back on outside food to save significantly.");
    }
    
    if (parseFloat(budgetData.entertainment || 0) > incomeTotal * 0.10) {
      tips.push("📺 Entertainment expenses are high. Review your subscriptions and movie expenses.");
    }
    
    if (balanceRemaining > incomeTotal * 0.3) {
      tips.push("💎 Excellent! You're saving well. Consider investing in mutual funds or FD.");
    }
    
    // Fraud awareness tip
    if (balanceRemaining < 0 || parseFloat(budgetData.emi || 0) > incomeTotal * 0.3) {
      tips.push("⚠️ FRAUD ALERT: When finances are tight, people are more vulnerable to cashback scams and fake loan offers. Stay alert!");
    }
    
    return tips;
  };

  const handleBudgetSubmit = () => {
    const totals = calculateBudgetTotals();
    if (totals.incomeTotal === 0) {
      Alert.alert('Error', 'Please enter your monthly income to continue.');
      return;
    }
    
    // Add to history
    const reportEntry = `Budget Report - Income: ₹${totals.incomeTotal}, Expenses: ₹${totals.expensesTotal}, Balance: ₹${totals.balanceRemaining}`;
    setHistory(prev => [reportEntry, ...prev.slice(0, 9)]);
    
    setShowBudgetReport(true);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Reset budget data
    setBudgetData({
      userType: 'Working Professional',
      age: '',
      locationType: 'Urban',
      incomeSource: 'Salary',
      incomeMonthly: '',
      incomeOther: '',
      rent: '',
      electricity: '',
      internet: '',
      recharge: '',
      emi: '',
      insurance: '',
      schoolFees: '',
      fixedOthers: '',
      groceries: '',
      foodOutside: '',
      transport: '',
      entertainment: '',
      shopping: '',
      medical: '',
      travel: '',
      donation: '',
      variableOthers: '',
      savingsTarget: '',
      savingsPercentGoal: '20%'
    });
  };

  const updateBudgetField = (field, value) => {
    setBudgetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderBudgetInput = (label, field, placeholder = '', keyboardType = 'numeric', isDropdown = false, options = []) => (
    <View style={styles.budgetInputContainer}>
      <Text style={[styles.budgetInputLabel, { color: currentTheme.brandText }]}>{label}</Text>
      {isDropdown ? (
        <View style={[styles.dropdownContainer, { backgroundColor: currentTheme.buttonNeutral }]}>
          <View style={styles.dropdownOptionsWrapper}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.dropdownOption,
                  { 
                    backgroundColor: budgetData[field] === option ? currentTheme.buttonPrimary : 'transparent',
                    borderColor: currentTheme.buttonPrimary
                  }
                ]}
                onPress={() => updateBudgetField(field, option)}
              >
                <Text style={[
                  styles.dropdownOptionText,
                  { color: budgetData[field] === option ? '#ffffff' : currentTheme.buttonText }
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <TextInput
          style={[
            styles.budgetInput,
            { 
              backgroundColor: currentTheme.buttonNeutral,
              color: currentTheme.buttonText,
              borderColor: currentTheme.buttonPrimary
            }
          ]}
          value={budgetData[field]}
          onChangeText={(value) => updateBudgetField(field, value)}
          placeholder={placeholder}
          placeholderTextColor={currentTheme.buttonText + '80'}
          keyboardType={keyboardType}
        />
      )}
    </View>
  );

  const renderBudgetReport = () => {
    const totals = calculateBudgetTotals();
    const tips = generatePersonalizedTips(totals);

    return (
      <Modal
        visible={showBudgetReport}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBudgetReport(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: currentTheme.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: currentTheme.brandText }]}>
              💰 Your Budget Report
            </Text>
            <TouchableOpacity onPress={() => setShowBudgetReport(false)}>
              <Ionicons name="close" size={24} color={currentTheme.brandText} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.reportContainer}>
            {/* Budget Personality Badge */}
            <View style={[styles.personalityBadge, { backgroundColor: currentTheme.buttonPrimary }]}>
              <Text style={styles.personalityText}>{budgetPersonality}</Text>
            </View>

            {/* Summary Table */}
            <View style={[styles.summaryCard, { backgroundColor: currentTheme.buttonNeutral }]}>
              <Text style={[styles.cardTitle, { color: currentTheme.brandText }]}>📊 Financial Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: currentTheme.buttonText }]}>Total Income</Text>
                <Text style={[styles.summaryValue, { color: currentTheme.buttonPrimary }]}>₹{totals.incomeTotal.toLocaleString()}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: currentTheme.buttonText }]}>Fixed Expenses</Text>
                <Text style={[styles.summaryValue, { color: currentTheme.errorColor }]}>₹{totals.fixedTotal.toLocaleString()}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: currentTheme.buttonText }]}>Variable Expenses</Text>
                <Text style={[styles.summaryValue, { color: currentTheme.errorColor }]}>₹{totals.variableTotal.toLocaleString()}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: currentTheme.buttonText }]}>Total Expenses</Text>
                <Text style={[styles.summaryValue, { color: currentTheme.errorColor }]}>₹{totals.expensesTotal.toLocaleString()}</Text>
              </View>
              
              <View style={[styles.summaryRow, styles.summaryRowHighlight]}>
                <Text style={[styles.summaryLabel, { color: currentTheme.brandText, fontWeight: 'bold' }]}>Remaining Balance</Text>
                <Text style={[
                  styles.summaryValue, 
                  { 
                    color: totals.balanceRemaining >= 0 ? currentTheme.successColor : currentTheme.errorColor,
                    fontWeight: 'bold'
                  }
                ]}>
                  ₹{totals.balanceRemaining.toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: currentTheme.buttonText }]}>Savings %</Text>
                <Text style={[styles.summaryValue, { color: currentTheme.buttonPrimary }]}>{totals.savingsAchievedPercent}%</Text>
              </View>
              
              <View style={styles.statusContainer}>
                <Text style={[styles.budgetStatus, { color: currentTheme.brandText }]}>{totals.budgetStatus}</Text>
              </View>
            </View>

            {/* Personalized Tips */}
            <View style={[styles.tipsCard, { backgroundColor: currentTheme.buttonNeutral }]}>
              <Text style={[styles.cardTitle, { color: currentTheme.brandText }]}>💡 Personalized Tips</Text>
              {tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={[styles.tipText, { color: currentTheme.buttonText }]}>{tip}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: currentTheme.buttonPrimary }]}
                onPress={() => {
                  Alert.alert('Export', 'Budget report exported successfully!');
                }}
              >
                <Ionicons name="download-outline" size={20} color="#ffffff" />
                <Text style={styles.actionButtonText}>Export PDF</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: currentTheme.buttonSecondary }]}
                onPress={() => {
                  Alert.alert('Share', 'Budget report shared to WhatsApp!');
                }}
              >
                <Ionicons name="share-outline" size={20} color="#ffffff" />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderLoginPage = () => (
    <Login navigation={{ navigate: handleLogin }} onLoginSuccess={handleLogin} />
  );

  const renderBudgetPlanner = () => (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView 
        style={styles.budgetContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      {/* User Profile Section */}
      <View style={[styles.budgetSection, { backgroundColor: currentTheme.buttonNeutral }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.brandText }]}>👤 User Profile</Text>
        
        {renderBudgetInput('User Type', 'userType', '', 'default', true, 
          ['Student', 'Working Professional', 'Senior Citizen', 'Rural Worker'])}
        
        {renderBudgetInput('Age', 'age', 'Enter your age')}
        
        {renderBudgetInput('Location Type', 'locationType', '', 'default', true, ['Urban', 'Rural'])}
        
        {renderBudgetInput('Income Source', 'incomeSource', '', 'default', true, 
          ['Salary', 'Stipend', 'Business', 'Daily Wage', 'Pension', 'Other'])}
      </View>

      {/* Income Section */}
      <View style={[styles.budgetSection, { backgroundColor: currentTheme.buttonNeutral }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.brandText }]}>💰 Income</Text>
        
        {renderBudgetInput('Monthly Income (₹)', 'incomeMonthly', 'Enter monthly income')}
        {renderBudgetInput('Other Income (₹)', 'incomeOther', 'Freelance, side income, etc.')}
      </View>

      {/* Fixed Expenses Section */}
      <View style={[styles.budgetSection, { backgroundColor: currentTheme.buttonNeutral }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.brandText }]}>🏠 Fixed Expenses</Text>
        
        {renderBudgetInput('Rent / Hostel / PG Fees (₹)', 'rent', 'Monthly rent')}
        {renderBudgetInput('Electricity + Water Bill (₹)', 'electricity', 'Utility bills')}
        {renderBudgetInput('Internet / Mobile Plan (₹)', 'internet', 'Internet & mobile')}
        {renderBudgetInput('Monthly Mobile Recharge (₹)', 'recharge', 'Mobile recharge cost')}
        {renderBudgetInput('EMIs (Loans, Credit Cards) (₹)', 'emi', 'Monthly EMIs')}
        {renderBudgetInput('Insurance Premiums (₹)', 'insurance', 'Insurance payments')}
        {renderBudgetInput('School / Tuition Fees (₹)', 'schoolFees', 'Education fees')}
        {renderBudgetInput('Other Fixed Expenses (₹)', 'fixedOthers', 'Other fixed costs')}
      </View>

      {/* Variable Expenses Section */}
      <View style={[styles.budgetSection, { backgroundColor: currentTheme.buttonNeutral }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.brandText }]}>🛒 Variable Expenses</Text>
        
        {renderBudgetInput('Groceries / Ration (₹)', 'groceries', 'Monthly groceries')}
        {renderBudgetInput('Food Delivery / Mess / Eating Out (₹)', 'foodOutside', 'Outside food')}
        {renderBudgetInput('Transport / Fuel / Public Travel (₹)', 'transport', 'Transportation costs')}
        {renderBudgetInput('Subscriptions / Movies / Events (₹)', 'entertainment', 'Entertainment')}
        {renderBudgetInput('Shopping (Clothes, Gadgets, Essentials) (₹)', 'shopping', 'Shopping expenses')}
        {renderBudgetInput('Health & Medicines (₹)', 'medical', 'Medical expenses')}
        {renderBudgetInput('Travel (personal or business) (₹)', 'travel', 'Travel costs')}
        {renderBudgetInput('Gifting / Donations / Festivals (₹)', 'donation', 'Gifts & donations')}
        {renderBudgetInput('Other Variable Expenses (₹)', 'variableOthers', 'Other variable costs')}
      </View>

      {/* Savings Goal Section */}
      <View style={[styles.budgetSection, { backgroundColor: currentTheme.buttonNeutral }]}>
        <Text style={[styles.sectionTitle, { color: currentTheme.brandText }]}>🎯 Savings Goal</Text>
        
        {renderBudgetInput('Target Savings Amount (₹)', 'savingsTarget', 'Desired savings')}
        {renderBudgetInput('Savings % Goal', 'savingsPercentGoal', '', 'default', true, ['10%', '20%', '30%', 'Custom'])}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: currentTheme.buttonPrimary }]}
        onPress={handleBudgetSubmit}
      >
        <Text style={styles.submitButtonText}>📊 Generate Budget Report</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: currentTheme.background }
      ]}
    >
      {/* Header - Only show when logged in */}
      {isLoggedIn && (
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Text style={[styles.brandText, { color: currentTheme.brandText }]}>
              🛡️ ArthRakshak
            </Text>
            <Text style={[styles.brandSubtext, { color: currentTheme.brandText }]}>
              Smart Budget Planner 💰
            </Text>
          </View>
          
          <View style={styles.headerControls}>
            <TouchableOpacity
              onPress={() => setShowHistory(true)}
              style={[styles.iconButton, { backgroundColor: currentTheme.buttonNeutral }]}
            >
              <Ionicons name="time-outline" size={20} color={currentTheme.buttonText} />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={toggleTheme}
              style={[styles.iconButton, { backgroundColor: currentTheme.buttonNeutral }]}
            >
              <Ionicons 
                name={isDarkMode ? "sunny-outline" : "moon-outline"} 
                size={20} 
                color={currentTheme.buttonText} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={[styles.iconButton, { backgroundColor: currentTheme.errorColor }]}
            >
              <Ionicons name="log-out-outline" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Main Content */}
      {isLoggedIn ? renderBudgetPlanner() : renderLoginPage()}
      
      {/* Budget Report Modal */}
      {renderBudgetReport()}
      
      {/* History Modal */}
      <Modal
        visible={showHistory}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: currentTheme.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: currentTheme.brandText }]}>
              Budget History
            </Text>
            <TouchableOpacity onPress={() => setShowHistory(false)}>
              <Ionicons name="close" size={24} color={currentTheme.brandText} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.reportContainer}>
            {history.length === 0 ? (
              <Text style={[styles.cardTitle, { color: currentTheme.brandText, textAlign: 'center', marginTop: 50 }]}>
                No budget history yet
              </Text>
            ) : (
              history.map((item, index) => (
                <View key={index} style={[styles.summaryCard, { backgroundColor: currentTheme.buttonNeutral }]}>
                  <Text style={[styles.cardTitle, { color: currentTheme.brandText }]}>{item}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  brandContainer: {
    flex: 1,
  },
  brandText: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'Inter',
    letterSpacing: -0.5,
  },
  brandSubtext: {
    fontSize: 15,
    opacity: 0.8,
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  // Budget Planner Styles
  budgetContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  budgetSection: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 18,
    fontFamily: 'Inter',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  budgetInputContainer: {
    marginBottom: 15,
  },
  budgetInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  budgetInput: {
    borderWidth: 2,
    borderRadius: 15,
    padding: 18,
    fontSize: 16,
    fontFamily: 'Inter',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownContainer: {
    borderRadius: 12,
    padding: 12,
    marginTop: 5,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
  },
  dropdownOptionText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  submitButton: {
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    transform: [{ scale: 1 }],
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Inter',
    letterSpacing: 0.5,
  },
  // Modal and Report Styles
  modalContainer: {
    flex: 1,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'Inter',
    letterSpacing: -0.5,
  },
  reportContainer: {
    flex: 1,
    paddingTop: 20,
  },
  personalityBadge: {
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  personalityText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  summaryCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    fontFamily: 'Inter',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  summaryRowHighlight: {
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: 15,
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  budgetStatus: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  tipsCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tipItem: {
    padding: 12,
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2dd4bf',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter',
  },
  
  // Improved dropdown styles
  dropdownOptionsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 8,
  },
  dropdownOption: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 2,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dropdownOptionText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
});

export default Calculator;
