import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const StudentLoanPlanner = () => {
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    userType: 'Student',
    loanAmount: 500000,
    interestRate: 10.5,
    loanTermYears: 10,
    moratoriumPeriod: 6,
    monthlyIncome: '50000',
    repaymentStartDate: '2024-06-01'
  });

  const [results, setResults] = useState({
    emiAmount: 0,
    totalInterest: 0,
    totalRepayment: 0,
    repaymentEndDate: '',
    showResults: false
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMoratorium, setShowMoratorium] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);

  // Sample database records for UI demonstration
  const sampleData = [
    {
      id: 1,
      user_type: 'Student',
      loan_amount: 500000,
      interest_rate: 10.5,
      loan_term_years: 10,
      moratorium_period: 6,
      monthly_income: 50000,
      repayment_start_date: '2024-06-01',
      emi_amount: 6607,
      total_interest: 292840,
      total_repayment: 792840,
      repayment_end_date: '2034-06-01'
    },
    {
      id: 2,
      user_type: 'Parent',
      loan_amount: 800000,
      interest_rate: 9.5,
      loan_term_years: 12,
      moratorium_period: 0,
      monthly_income: 75000,
      repayment_start_date: '2024-01-01',
      emi_amount: 8956,
      total_interest: 489472,
      total_repayment: 1289472,
      repayment_end_date: '2036-01-01'
    },
    {
      id: 3,
      user_type: 'Student',
      loan_amount: 300000,
      interest_rate: 11.0,
      loan_term_years: 8,
      moratorium_period: 12,
      monthly_income: 35000,
      repayment_start_date: '2024-12-01',
      emi_amount: 4458,
      total_interest: 127968,
      total_repayment: 427968,
      repayment_end_date: '2032-12-01'
    }
  ];

  // Modern color scheme
  const colors = {
    primary: '#F5E65C', // Yellow
    secondary: '#FFF8B4', // Light yellow
    background: '#FFFEF7', // Cream white
    dark: '#2D5016', // Updated green
    accent: '#4CAF50', // Bright green
    success: '#81C784',
    warning: '#FFB74D',
    error: '#E57373',
    text: '#2D5016', // Updated green for text
    lightText: '#6B7B47' // Lighter green
  };

  const darkColors = {
    primary: '#6B7B47',
    secondary: '#8BC34A',
    background: '#1A2E05',
    dark: '#2D5016',
    accent: '#4CAF50',
    success: '#81C784',
    warning: '#FFB74D',
    error: '#E57373',
    text: '#FFFEF7',
    lightText: '#B8C49A'
  };

  const currentColors = isDarkMode ? darkColors : colors;

  // Calculate EMI using standard formula
  const calculateEMI = (principal, rate, tenure) => {
    const monthlyRate = rate / (12 * 100);
    const months = tenure * 12;
    
    if (monthlyRate === 0) {
      return principal / months;
    }
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
               (Math.pow(1 + monthlyRate, months) - 1);
    
    return emi;
  };

  // Calculate repayment end date
  const calculateEndDate = (startDate, loanTermYears, moratoriumPeriod) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    start.setMonth(start.getMonth() + moratoriumPeriod + (loanTermYears * 12));
    return start.toISOString().split('T')[0];
  };

  // Add missing navigation function
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Handle form input changes - fixed for React Native
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle range slider changes
  const handleRangeChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form - Fixed validation logic
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.loanAmount || parseFloat(formData.loanAmount) < 50000) {
      newErrors.loanAmount = 'Loan amount must be at least ₹50,000';
    }
    
    if (!formData.interestRate || parseFloat(formData.interestRate) < 1 || parseFloat(formData.interestRate) > 20) {
      newErrors.interestRate = 'Interest rate must be between 1% and 20%';
    }
    
    if (!formData.loanTermYears || parseInt(formData.loanTermYears) < 1 || parseInt(formData.loanTermYears) > 25) {
      newErrors.loanTermYears = 'Loan term must be between 1 and 25 years';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission - Fixed for React Native
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsCalculating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { loanAmount, interestRate, loanTermYears, moratoriumPeriod, repaymentStartDate } = formData;
      
      // Ensure numeric values
      const principal = parseFloat(loanAmount) || 0;
      const rate = parseFloat(interestRate) || 0;
      const term = parseInt(loanTermYears) || 0;
      const moratorium = parseInt(moratoriumPeriod) || 0;
      
      const emi = calculateEMI(principal, rate, term);
      const totalRepayment = emi * term * 12;
      const totalInterest = totalRepayment - principal;
      const endDate = calculateEndDate(repaymentStartDate, term, moratorium);
      
      setResults({
        emiAmount: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalRepayment: Math.round(totalRepayment),
        repaymentEndDate: endDate,
        showResults: true
      });
      
    } catch (error) {
      Alert.alert('Error', 'Failed to calculate loan details. Please try again.');
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Format currency - Enhanced formatting
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '₹0';
    
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      }).format(Math.round(amount));
    } catch (error) {
      // Fallback formatting
      return `₹${Math.round(amount).toLocaleString('en-IN')}`;
    }
  };

  // Calculate EMI to income ratio
  const getEmiToIncomeRatio = () => {
    if (!formData.monthlyIncome || !results.emiAmount) return null;
    return ((results.emiAmount / parseFloat(formData.monthlyIncome)) * 100).toFixed(1);
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      userType: 'Student',
      loanAmount: 500000,
      interestRate: 10.5,
      loanTermYears: 10,
      moratoriumPeriod: 0,
      monthlyIncome: '',
      repaymentStartDate: ''
    });
    setResults({
      emiAmount: 0,
      totalInterest: 0,
      totalRepayment: 0,
      repaymentEndDate: '',
      showResults: false
    });
    setErrors({});
  };

  // Export functions - simplified for React Native
  const exportToPDF = () => {
    Alert.alert('Export Feature', 'PDF export feature would be implemented with react-native-pdf-lib or similar library');
  };

  // Voice input simulation
  const startVoiceInput = () => {
    Alert.alert('Voice Input', '🎙️ Voice input feature would be implemented with @react-native-voice/voice');
  };

  const emiRatio = getEmiToIncomeRatio();

  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        translucent={true}
        backgroundColor="transparent"
      />
      <ScrollView 
        style={[styles.container, { 
          backgroundColor: currentColors.background,
        }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapper}>
          {/* Header */}
          <View style={[
            styles.header, 
            { 
              backgroundColor: currentColors.upd,
              paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 50
            }
          ]}>
            <TouchableOpacity 
              style={[styles.backButton, {
                top: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 50
              }]}
              onPress={handleGoBack}
            >
              <Text style={[styles.backButtonText, { color: currentColors.dark }]}>← Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.toggleBtn, {
                top: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 50
              }]}
              onPress={() => setIsDarkMode(!isDarkMode)}
            >
              <Text style={[styles.toggleBtnText, { color: currentColors.dark }]}>
                {isDarkMode ? '🌞' : '🌙'}
              </Text>
            </TouchableOpacity>
            
            <Text style={[styles.title, { color: currentColors.dark }]}>
              🎓 Student Loan Planner
            </Text>
            <Text style={[styles.subtitle, { color: currentColors.dark }]}>
              Plan your educational investment with smart calculations
            </Text>
          </View>

          <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
            {/* Input Form Section */}
            <View style={[
              styles.formSection, 
              { backgroundColor: currentColors.background }
            ]}>
              <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
                📝 Loan Details
              </Text>
              
              {/* User Type Field */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, {color: currentColors.text}]}>
                  👤 User Type
                </Text>
                <TouchableOpacity 
                  style={[styles.input, {
                    borderColor: currentColors.dark,
                    backgroundColor: currentColors.background,
                  }]}
                  onPress={() => {
                    Alert.alert(
                      'Select User Type',
                      'Choose your user type',
                      [
                        {text: 'Student', onPress: () => handleInputChange('userType', 'Student')},
                        {text: 'Parent', onPress: () => handleInputChange('userType', 'Parent')},
                        {text: 'Guardian', onPress: () => handleInputChange('userType', 'Guardian')},
                        {text: 'Cancel', style: 'cancel'}
                      ]
                    );
                  }}
                >
                  <Text style={[{color: currentColors.text}, !formData.userType && {color: currentColors.lightText}]}>
                    {formData.userType || 'Select user type'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Loan Amount */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, {color: currentColors.text}]}>
                  💰 Loan Amount (₹)
                </Text>
                <TextInput
                  style={[styles.input, {
                    borderColor: errors.loanAmount ? currentColors.error : currentColors.dark,
                    backgroundColor: currentColors.background,
                    color: currentColors.text
                  }]}
                  value={formData.loanAmount.toString()}
                  onChangeText={(value) => handleInputChange('loanAmount', value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter loan amount (e.g., 500000)"
                  placeholderTextColor={currentColors.lightText}
                  keyboardType="numeric"
                  maxLength={8}
                />
                {errors.loanAmount && <Text style={[styles.errorText, {color: currentColors.error}]}>{errors.loanAmount}</Text>}
              </View>

              {/* Interest Rate */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, {color: currentColors.text}]}>
                  📈 Interest Rate (% per annum)
                </Text>
                <TextInput
                  style={[styles.input, {
                    borderColor: errors.interestRate ? currentColors.error : currentColors.dark,
                    backgroundColor: currentColors.background,
                    color: currentColors.text
                  }]}
                  value={formData.interestRate.toString()
                  }
                  onChangeText={(value) => {
                    // Allow decimal numbers
                    const cleaned = value.replace(/[^0-9.]/g, '');
                    if (cleaned.split('.').length <= 2) {
                      handleInputChange('interestRate', cleaned);
                    }
                  }}
                  placeholder="e.g., 10.5"
                  placeholderTextColor={currentColors.lightText}
                  keyboardType="decimal-pad"
                  maxLength={5}
                />
                {errors.interestRate && <Text style={[styles.errorText, {color: currentColors.error}]}>{errors.interestRate}</Text>}
              </View>

              {/* Loan Term */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, {color: currentColors.text}]}>
                  📆 Loan Term (Years)
                </Text>
                <TextInput
                  style={[styles.input, {
                    borderColor: errors.loanTermYears ? currentColors.error : currentColors.primary,
                    backgroundColor: currentColors.background,
                    color: currentColors.text
                  }]}
                  value={formData.loanTermYears.toString()}
                  onChangeText={(value) => handleInputChange('loanTermYears', value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter loan term (e.g., 10)"
                  placeholderTextColor={currentColors.lightText}
                  keyboardType="numeric"
                  maxLength={2}
                />
                {errors.loanTermYears && <Text style={[styles.errorText, {color: currentColors.error}]}>{errors.loanTermYears}</Text>}
              </View>

              {/* Moratorium Checkbox */}
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setShowMoratorium(!showMoratorium)}
              >
                <Text style={[styles.checkbox, {color: currentColors.text}]}>
                  {showMoratorium ? '☑️' : '☐'} 🕓 Moratorium Period (Optional)
                </Text>
              </TouchableOpacity>

              {/* Moratorium Period */}
              {showMoratorium && (
                <View style={styles.formGroup}>
                  <Text style={[styles.label, {color: currentColors.text}]}>
                    🕓 Moratorium Period (Months)
                  </Text>
                  <TextInput
                    style={[styles.input, {
                      borderColor: currentColors.primary,
                      backgroundColor: currentColors.background,
                      color: currentColors.text
                    }]}
                    value={formData.moratoriumPeriod.toString()}
                    onChangeText={(value) => handleInputChange('moratoriumPeriod', value.replace(/[^0-9]/g, ''))}
                    placeholder="Months (0-24)"
                    placeholderTextColor={currentColors.lightText}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
              )}

              {/* Monthly Income */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, {color: currentColors.text}]}>
                  💼 Expected Monthly Income (₹)
                </Text>
                <TextInput
                  style={[styles.input, {
                    borderColor: currentColors.primary,
                    backgroundColor: currentColors.background,
                    color: currentColors.text
                  }]}
                  value={formData.monthlyIncome}
                  onChangeText={(value) => handleInputChange('monthlyIncome', value.replace(/[^0-9]/g, ''))}
                  placeholder="Expected monthly income"
                  placeholderTextColor={currentColors.lightText}
                  keyboardType="numeric"
                  maxLength={8}
                />
              </View>

              {/* Repayment Start Date */}
              <View style={styles.formGroup}>
                <Text style={[styles.label, {color: currentColors.text}]}>
                  ⏳ Repayment Start Date
                </Text>
                <TextInput
                  style={[styles.input, {
                    borderColor: currentColors.primary,
                    backgroundColor: currentColors.background,
                    color: currentColors.text
                  }]}
                  value={formData.repaymentStartDate}
                  onChangeText={(value) => handleInputChange('repaymentStartDate', value)}
                  placeholder="YYYY-MM-DD (e.g., 2024-06-01)"
                  placeholderTextColor={currentColors.lightText}
                  maxLength={10}
                />
              </View>

              {/* Action Buttons */}
              <TouchableOpacity 
                style={[
                  styles.button, 
                  {
                    backgroundColor: currentColors.accent,
                    shadowColor: currentColors.accent,
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 8,
                  },
                  isCalculating && styles.buttonDisabled
                ]}
                onPress={handleSubmit}
                disabled={isCalculating}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>
                  {isCalculating ? '🔄 Calculating...' : '✨ Calculate EMI & Plan'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.resetBtn, { borderColor: currentColors.error }]
                }
                onPress={resetForm}
              >
                <Text style={[styles.resetBtnText, { color: currentColors.error }]}
                >
                  🔄 Reset All Fields
                </Text>
              </TouchableOpacity>
            </View>

            {/* Results Section */}
            <View style={[
              styles.resultsSection, 
              { backgroundColor: currentColors.background }
            ]}>
              <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
                📊 Calculation Results
              </Text>

              {/* Loading */}
              {isCalculating && (
                <View style={styles.loadingContainer}>
                  <Text style={[styles.loadingText, { color: currentColors.lightText }]}>
                    🔄 Calculating your loan details...
                  </Text>
                  <Text style={[styles.loadingSubtext, { color: currentColors.lightText }]}>
                    Please wait a moment
                  </Text>
                </View>
              )}

              {/* Results Display */}
              {results.showResults && !isCalculating && (
                <View style={styles.resultsContainer}>
                  {/* Main EMI Card */}
                  <View style={[
                    styles.resultCard, 
                    styles.mainResult, 
                    {
                      backgroundColor: currentColors.accent,
                      shadowColor: currentColors.accent,
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 5,
                    }
                  ]}>
                    <Text style={[styles.resultLabel, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                      📊 Monthly EMI
                    </Text>
                    <Text style={[styles.resultValue, styles.primaryValue]}>
                      {formatCurrency(results.emiAmount)}
                    </Text>
                    <Text style={[styles.resultSubtext, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                      💡 Your monthly payment commitment
                    </Text>
                  </View>

                  {/* Other Result Cards */}
                  <View style={[
                    styles.resultCard,
                    {
                      backgroundColor: currentColors.background,
                      borderColor: currentColors.dark,
                      borderWidth: 2,
                      shadowColor: currentColors.error,
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 5,
                    }
                  ]}>
                    <Text style={[styles.resultLabel, { color: currentColors.lightText }]}>
                      💸 Total Interest Payable
                    </Text>
                    <Text style={[styles.resultValue, { color: currentColors.error }]}>
                      {formatCurrency(results.totalInterest)}
                    </Text>
                    <Text style={[styles.resultSubtext, { color: currentColors.lightText }]}>
                      Extra cost over principal
                    </Text>
                  </View>

                  <View style={[styles.resultCard, {
                    backgroundColor: currentColors.background,
                    borderColor: currentColors.dark
                  }]}>
                    <Text style={[styles.resultLabel, {color: currentColors.lightText}]}>
                      📉 Total Repayment Amount
                    </Text>
                    <Text style={[styles.resultValue, {color: currentColors.warning}]}>
                      {formatCurrency(results.totalRepayment)}
                    </Text>
                    <Text style={[styles.resultSubtext, {color: currentColors.lightText}]}>
                      Principal + Interest
                    </Text>
                  </View>

                  {/* EMI Affordability Check */}
                  {formData.monthlyIncome && (
                    <View style={[styles.resultCard, {
                      backgroundColor: emiRatio > 40 ? currentColors.error + '20' : currentColors.success + '20',
                      borderColor: emiRatio > 40 ? currentColors.error : currentColors.success
                    }]}
                    >
                      <Text style={[styles.resultLabel, {color: currentColors.lightText}]}>
                        💡 EMI to Income Ratio
                      </Text>
                      <Text style={[styles.resultValue, {
                        color: emiRatio > 40 ? currentColors.error : currentColors.success
                      }]}>
                        {emiRatio}%
                      </Text>
                      <Text style={[styles.resultSubtext, {color: currentColors.lightText}]}>
                        {emiRatio > 40 ? '⚠️ High EMI burden' : '✅ Manageable EMI'}
                      </Text>
                    </View>
                  )}

                  {results.repaymentEndDate && (
                    <View style={[styles.resultCard, {
                      backgroundColor: currentColors.background,
                      borderColor: currentColors.primary
                    }]}>
                      <Text style={[styles.resultLabel, {color: currentColors.lightText}]}>
                        📅 Repayment End Date
                      </Text>
                      <Text style={[styles.resultValue, {color: currentColors.accent}]}>
                        {new Date(results.repaymentEndDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Placeholder */}
              {!results.showResults && !isCalculating && (
                <View style={[
                  styles.placeholderContainer,
                  {
                    backgroundColor: currentColors.background,
                    borderColor: currentColors.primary,
                  }
                ]}>
                  <Text style={styles.placeholderIcon}>📊</Text>
                  <Text style={[styles.placeholderTitle, { color: currentColors.text }]}>
                    Ready to Calculate?
                  </Text>
                  <Text style={[styles.placeholderText, { color: currentColors.lightText }]}>
                    Fill in your loan details and tap "Calculate EMI & Plan" to see your personalized results
                  </Text>
                  
                  <View style={styles.featuresList}>
                    <Text style={[styles.featureItem, { color: currentColors.lightText }]}
                    >
                      ✨ Accurate EMI calculations
                    </Text>
                    <Text style={[styles.featureItem, { color: currentColors.lightText }]}
                    >
                      🔥 Interest breakdown analysis
                    </Text>
                    <Text style={[styles.featureItem, { color: currentColors.lightText }]}
                    >
                      💎 Affordability assessment
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF7', // Cream white
  },
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  header: {
    backgroundColor: '#004030', // Yellow
    paddingBottom: 30,
    paddingHorizontal: 20,
    position: 'relative',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#004030',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleBtn: {
    position: 'absolute',
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    zIndex: 1,
  },
  toggleBtnText: {
    color: '#495057',
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  mainContent: {
    flex: 1,
  },
  formSection: {
    padding: 40,
    backgroundColor: '#fefbf6',
  },
  resultsSection: {
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: 16,
    borderWidth: 2,
    borderColor: '#a9d6e5',
    borderRadius: 16,
    fontSize: 16,
    backgroundColor: '#fefbf6',
    color: '#495057',
  },
  checkboxContainer: {
    marginBottom: 15,
  },
  checkbox: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    width: '100%',
    padding: 18,
    backgroundColor: '#74c0fc',
    borderRadius: 16,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  resetBtn: {
    width: '100%',
    padding: 12,
    borderWidth: 2,
    borderColor: '#ff6b6b',
    borderRadius: 16,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  resetBtnText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#f8f9fa',
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#a9d6e5',
  },
  mainResult: {
    backgroundColor: '#74c0fc',
  },
  resultLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#74c0fc',
    marginBottom: 8,
  },
  primaryValue: {
    color: 'white',
    fontSize: 28,
  },
  resultSubtext: {
    fontSize: 14,
    opacity: 0.8,
    color: 'white',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 60,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6c757d',
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: 80,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#a9d6e5',
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 15,
  },
  placeholderText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#6c757d',
    maxWidth: 300,
  },
  // New table styles
  tableSection: {
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  tableSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleTableBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#74c0fc',
  },
  toggleTableBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  tableDescription: {
    fontSize: 14,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableHeader: {
    backgroundColor: '#a9d6e5',
  },
  tableCell: {
    padding: 12,
    fontSize: 12,
    borderRightWidth: 1,
    borderRightColor: '#dee2e6',
    textAlign: 'center',
  },
  tableCellHeader: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  // Column widths
  idColumn: { width: 50 },
  userTypeColumn: { width: 80 },
  amountColumn: { width: 120 },
  rateColumn: { width: 70 },
  termColumn: { width: 70 },
  moratoriumColumn: { width: 80 },
  incomeColumn: { width: 100 },
  dateColumn: { width: 100 },
  emiColumn: { width: 100 },
  interestColumn: { width: 120 },
  totalColumn: { width: 120 },
  endDateColumn: { width: 100 },
  // Schema styles
  schemaContainer: {
    marginTop: 30,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
  },
  schemaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  schemaContent: {
    marginBottom: 20,
  },
  schemaSection: {
    marginBottom: 20,
  },
  schemaSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  schemaField: {
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 10,
  },
  dbActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
  },
  dbActionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  dbActionBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultsContainer: {
    gap: 15,
  },
  featuresList: {
    marginTop: 20,
    alignItems: 'center',
  },
  featureItem: {
    fontSize: 14,
    marginVertical: 2,
    textAlign: 'center',
  },
  loadingSpinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderTopColor: 'transparent',
    marginBottom: 20,
    alignSelf: 'center',
  },
});

export default StudentLoanPlanner;
  