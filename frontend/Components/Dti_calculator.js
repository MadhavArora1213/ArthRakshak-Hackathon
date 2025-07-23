import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';

const DtiCalculator = () => {
  const [monthlyDebt, setMonthlyDebt] = useState('');
  const [grossIncome, setGrossIncome] = useState('');
  const [dtiResult, setDtiResult] = useState(null);
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};
    
    if (!monthlyDebt || parseFloat(monthlyDebt) <= 0) {
      newErrors.monthlyDebt = 'Monthly debt must be greater than 0';
    }
    
    if (!grossIncome || parseFloat(grossIncome) <= 0) {
      newErrors.grossIncome = 'Gross income must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Simple UUID generator for React Native
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const calculateDTI = () => {
    if (!validateInputs()) return;
    
    const debt = parseFloat(monthlyDebt);
    const income = parseFloat(grossIncome);
    const dtiPct = (debt / income) * 100;
    
    let riskLevel = '';
    let riskColor = '';
    
    if (dtiPct <= 20) {
      riskLevel = 'Excellent';
      riskColor = '#22c55e';
    } else if (dtiPct <= 36) {
      riskLevel = 'Good';
      riskColor = '#84cc16';
    } else if (dtiPct <= 43) {
      riskLevel = 'Fair';
      riskColor = '#f59e0b';
    } else {
      riskLevel = 'High Risk';
      riskColor = '#ef4444';
    }
    
    setDtiResult({
      dti_pct: dtiPct.toFixed(2),
      risk_level: riskLevel,
      risk_color: riskColor,
      history_id: generateUUID(),
      created_at: new Date().toISOString()
    });
  };

  const handleReset = () => {
    setMonthlyDebt('');
    setGrossIncome('');
    setDtiResult(null);
    setErrors({});
  };

  const handleCalculate = () => {
    calculateDTI();
  };

  const styles = {
    container: {
      flexGrow: 1,
      backgroundColor: '#004030',
      padding: 20,
      justifyContent: 'flex-start',
      alignItems: 'center',
      minHeight: '100%',
    },
    calculator: {
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderRadius: 30,
      padding: 30,
      width: '100%',
      maxWidth: 600,
      shadowColor: '#004030',
      shadowOffset: { width: 0, height: 15 },
      shadowOpacity: 0.25,
      shadowRadius: 25,
      elevation: 15,
      borderWidth: 1,
      borderColor: 'rgba(0, 64, 48, 0.1)',
    },
    header: {
      alignItems: 'center',
      marginBottom: 30,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      backgroundColor: 'rgba(0, 64, 48, 0.05)',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    titleIcon: {
      fontSize: 36,
      marginRight: 12,
    },
    title: {
      fontSize: 26,
      fontWeight: '900',
      color: '#004030',
      letterSpacing: 0.5,
    },
    subtitle: {
      color: '#006B4F',
      fontSize: 16,
      textAlign: 'center',
      fontWeight: '500',
      marginTop: 8,
    },
    inputSection: {
      marginBottom: 25,
    },
    inputGroup: {
      marginBottom: 25,
    },
    inputLabel: {
      fontWeight: '700',
      color: '#004030',
      marginBottom: 12,
      fontSize: 17,
      letterSpacing: 0.3,
    },
    inputWrapper: {
      position: 'relative',
      shadowColor: '#004030',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    currencySymbol: {
      position: 'absolute',
      left: 18,
      top: 20,
      color: '#004030',
      fontWeight: '700',
      fontSize: 18,
      zIndex: 1,
    },
    inputField: {
      width: '100%',
      paddingVertical: 18,
      paddingLeft: 45,
      paddingRight: 18,
      borderWidth: 2,
      borderColor: '#B8E6D3',
      borderRadius: 15,
      fontSize: 17,
      backgroundColor: '#ffffff',
      color: '#004030',
      fontWeight: '600',
    },
    inputFieldError: {
      borderColor: '#DC2626',
      backgroundColor: '#FEF2F2',
    },
    errorMessage: {
      color: '#DC2626',
      fontSize: 14,
      marginTop: 6,
      fontWeight: '500',
    },
    resultSection: {
      marginVertical: 25,
    },
    resultCard: {
      backgroundColor: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
      backgroundColor: '#F0FDF4',
      borderRadius: 20,
      padding: 25,
      borderWidth: 2,
      borderColor: '#004030',
      shadowColor: '#004030',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    resultHeader: {
      fontSize: 22,
      fontWeight: '800',
      color: '#004030',
      marginBottom: 20,
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    dtiDisplay: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      backgroundColor: 'rgba(0, 64, 48, 0.05)',
      padding: 20,
      borderRadius: 15,
    },
    dtiPercentage: {
      alignItems: 'flex-start',
    },
    percentageValue: {
      fontSize: 52,
      fontWeight: '900',
      color: '#004030',
      textShadowColor: 'rgba(0, 64, 48, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    percentageLabel: {
      color: '#006B4F',
      fontSize: 15,
      fontWeight: '600',
      marginTop: 4,
    },
    riskBadge: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    riskBadgeText: {
      color: 'white',
      fontWeight: '800',
      fontSize: 15,
      textTransform: 'uppercase',
      letterSpacing: 1,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    progressBar: {
      width: '100%',
      height: 12,
      backgroundColor: '#E5E7EB',
      borderRadius: 6,
      marginBottom: 25,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#004030',
    },
    progressFill: {
      height: '100%',
      borderRadius: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    guidelinesTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#004030',
      marginBottom: 15,
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    guidelineItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#B8E6D3',
      backgroundColor: 'rgba(0, 64, 48, 0.02)',
      marginVertical: 1,
      borderRadius: 8,
    },
    guidelineItemLast: {
      borderBottomWidth: 0,
    },
    guidelineRange: {
      fontWeight: '700',
      color: '#004030',
      fontSize: 15,
    },
    guidelineText: {
      fontWeight: '600',
      fontSize: 15,
    },
    calculationDetails: {
      marginTop: 20,
      paddingTop: 20,
      borderTopWidth: 2,
      borderTopColor: '#B8E6D3',
      backgroundColor: 'rgba(0, 64, 48, 0.03)',
      padding: 15,
      borderRadius: 10,
    },
    calculationText: {
      color: '#006B4F',
      fontSize: 15,
      marginVertical: 3,
      fontWeight: '500',
    },
    timestamp: {
      fontStyle: 'italic',
      fontWeight: '400',
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginTop: 20,
    },
    button: {
      paddingVertical: 18,
      paddingHorizontal: 30,
      borderRadius: 15,
      minWidth: 130,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
    calculateBtn: {
      backgroundColor: '#004030',
      borderWidth: 2,
      borderColor: '#006B4F',
    },
    calculateBtnDisabled: {
      opacity: 0.6,
      backgroundColor: '#9CA3AF',
    },
    calculateBtnText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 17,
      letterSpacing: 0.5,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    resetBtn: {
      backgroundColor: '#ffffff',
      borderWidth: 2,
      borderColor: '#004030',
    },
    resetBtnText: {
      color: '#004030',
      fontWeight: '700',
      fontSize: 17,
      letterSpacing: 0.5,
    },
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#004030" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.calculator}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleIcon}>📊</Text>
                <Text style={styles.title}>DTI Calculator</Text>
              </View>
              <Text style={styles.subtitle}>
                Calculate your Debt-to-Income ratio and assess your financial health
              </Text>
            </View>

            <View>
              <View style={styles.inputSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    💳 Monthly Debt Payments
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                      value={monthlyDebt}
                      onChangeText={setMonthlyDebt}
                      placeholder="Enter monthly debt amount"
                      placeholderTextColor="#9CA3AF"
                      style={[
                        styles.inputField,
                        errors.monthlyDebt && styles.inputFieldError
                      ]}
                      keyboardType="numeric"
                    />
                  </View>
                  {errors.monthlyDebt && (
                    <Text style={styles.errorMessage}>{errors.monthlyDebt}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    💰 Gross Monthly Income
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                      value={grossIncome}
                      onChangeText={setGrossIncome}
                      placeholder="Enter gross monthly income"
                      placeholderTextColor="#9CA3AF"
                      style={[
                        styles.inputField,
                        errors.grossIncome && styles.inputFieldError
                      ]}
                      keyboardType="numeric"
                    />
                  </View>
                  {errors.grossIncome && (
                    <Text style={styles.errorMessage}>{errors.grossIncome}</Text>
                  )}
                </View>
              </View>

              {dtiResult && (
                <View style={styles.resultSection}>
                  <View style={styles.resultCard}>
                    <Text style={styles.resultHeader}>🎯 Your DTI Results</Text>
                    
                    <View style={styles.dtiDisplay}>
                      <View style={styles.dtiPercentage}>
                        <Text style={styles.percentageValue}>{dtiResult.dti_pct}%</Text>
                        <Text style={styles.percentageLabel}>Debt-to-Income Ratio</Text>
                      </View>
                      
                      <View style={[styles.riskBadge, { backgroundColor: dtiResult.risk_color }]}>
                        <Text style={styles.riskBadgeText}>{dtiResult.risk_level}</Text>
                      </View>
                    </View>

                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(dtiResult.dti_pct, 100)}%`,
                            backgroundColor: dtiResult.risk_color
                          }
                        ]}
                      />
                    </View>

                    <View>
                      <Text style={styles.guidelinesTitle}>📋 DTI Guidelines</Text>
                      <View style={styles.guidelineItem}>
                        <Text style={styles.guidelineRange}>≤ 20%</Text>
                        <Text style={[styles.guidelineText, { color: '#22c55e' }]}>🟢 Excellent</Text>
                      </View>
                      <View style={styles.guidelineItem}>
                        <Text style={styles.guidelineRange}>21% - 36%</Text>
                        <Text style={[styles.guidelineText, { color: '#84cc16' }]}>🟡 Good</Text>
                      </View>
                      <View style={styles.guidelineItem}>
                        <Text style={styles.guidelineRange}>37% - 43%</Text>
                        <Text style={[styles.guidelineText, { color: '#f59e0b' }]}>🟠 Fair</Text>
                      </View>
                      <View style={[styles.guidelineItem, styles.guidelineItemLast]}>
                        <Text style={styles.guidelineRange}>&gt; 43%</Text>
                        <Text style={[styles.guidelineText, { color: '#ef4444' }]}>🔴 High Risk</Text>
                      </View>
                    </View>

                    <View style={styles.calculationDetails}>
                      <Text style={styles.calculationText}>
                        💡 Calculation: ₹{monthlyDebt} ÷ ₹{grossIncome} × 100 = {dtiResult.dti_pct}%
                      </Text>
                      <Text style={[styles.calculationText, styles.timestamp]}>
                        📅 Calculated on: {new Date(dtiResult.created_at).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  onPress={handleCalculate}
                  style={[
                    styles.button,
                    styles.calculateBtn,
                    (!monthlyDebt || !grossIncome) && styles.calculateBtnDisabled
                  ]}
                  disabled={!monthlyDebt || !grossIncome}
                >
                  <Text style={styles.calculateBtnText}>Calculate DTI</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleReset}
                  style={[styles.button, styles.resetBtn]}
                >
                  <Text style={styles.resetBtnText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};


export default DtiCalculator;
