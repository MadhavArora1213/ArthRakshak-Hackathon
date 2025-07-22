import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [memory, setMemory] = useState(0);
  const [showMemory, setShowMemory] = useState(false);
  const [animatedValues] = useState({});
  const [glowAnimations] = useState({});
  const [showFinanceLabels, setShowFinanceLabels] = useState(false);
  const [showScientific, setShowScientific] = useState(false);
  const [angleMode, setAngleMode] = useState('deg'); // deg or rad
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
  }, [animatedValues, glowAnimations]);

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

  const financeLabels = [
    { label: 'Rent', value: '25000', icon: '🏠' },
    { label: 'EMI', value: '15000', icon: '🏦' },
    { label: 'Food', value: '8000', icon: '🍽️' },
    { label: 'Fuel', value: '5000', icon: '⛽' },
    { label: 'Bills', value: '3000', icon: '💡' },
    { label: 'Shopping', value: '10000', icon: '🛒' },
    { label: 'Salary', value: '50000', icon: '💰' },
    { label: 'Savings', value: '20000', icon: '💎' },
  ];

  const animateButton = (buttonKey) => {
    // Enhanced press animation with scale only (rotation removed to fix native driver issue)
    Animated.sequence([
      Animated.timing(animatedValues[buttonKey], {
        toValue: 0.92,
        duration: 80,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[buttonKey], {
        toValue: 1.02,
        duration: 120,
        easing: Easing.out(Easing.back(1.8)),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[buttonKey], {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // Enhanced glow animation with color transition
    Animated.sequence([
      Animated.timing(glowAnimations[buttonKey], {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(glowAnimations[buttonKey], {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const inputNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
      
      // Add to history
      const calculation = `${currentValue} ${operation} ${inputValue} = ${newValue}`;
      setHistory(prev => [calculation, ...prev.slice(0, 9)]);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperator);
  };

  const calculate = (firstValue, secondValue, operation) => {
    try {
      switch (operation) {
        case '+':
          return firstValue + secondValue;
        case '-':
          return firstValue - secondValue;
        case '×':
          return firstValue * secondValue;
        case '÷':
          return secondValue !== 0 ? firstValue / secondValue : 'Error';
        case '%':
          return (firstValue * secondValue) / 100;
        case '^':
          return Math.pow(firstValue, secondValue);
        case 'mod':
          return firstValue % secondValue;
        default:
          return secondValue;
      }
    } catch (error) {
      return 'Error';
    }
  };

  // Scientific functions
  const scientificCalculation = (func, value = null) => {
    try {
      const currentValue = value !== null ? value : parseFloat(display);
      let result;
      
      switch (func) {
        case 'sin':
          result = angleMode === 'deg' ? Math.sin(currentValue * Math.PI / 180) : Math.sin(currentValue);
          break;
        case 'cos':
          result = angleMode === 'deg' ? Math.cos(currentValue * Math.PI / 180) : Math.cos(currentValue);
          break;
        case 'tan':
          result = angleMode === 'deg' ? Math.tan(currentValue * Math.PI / 180) : Math.tan(currentValue);
          break;
        case 'log':
          result = currentValue > 0 ? Math.log10(currentValue) : 'Error';
          break;
        case 'ln':
          result = currentValue > 0 ? Math.log(currentValue) : 'Error';
          break;
        case 'sqrt':
          result = currentValue >= 0 ? Math.sqrt(currentValue) : 'Error';
          break;
        case 'x²':
          result = Math.pow(currentValue, 2);
          break;
        case '1/x':
          result = currentValue !== 0 ? 1 / currentValue : 'Error';
          break;
        case 'π':
          result = Math.PI;
          break;
        case 'e':
          result = Math.E;
          break;
        case '!':
          result = factorial(currentValue);
          break;
        default:
          result = currentValue;
      }
      
      return typeof result === 'number' && !isFinite(result) ? 'Error' : result;
    } catch (error) {
      return 'Error';
    }
  };

  const factorial = (n) => {
    if (n < 0 || n !== Math.floor(n)) return 'Error';
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const calculation = `${previousValue} ${operation} ${inputValue} = ${newValue}`;
      
      // Animate display change
      Animated.sequence([
        Animated.timing(displayAnimation, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(displayAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
      
      // Add to history
      setHistory(prev => [calculation, ...prev.slice(0, 19)]);
    }
  };

  const handleScientificFunction = (func) => {
    const result = scientificCalculation(func);
    
    // Animate display change
    Animated.sequence([
      Animated.timing(displayAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(displayAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    setDisplay(String(result));
    setWaitingForNewValue(true);
    
    // Add to history
    const calculation = `${func}(${display}) = ${result}`;
    setHistory(prev => [calculation, ...prev.slice(0, 19)]);
  };

  const toggleTheme = () => {
    // Animate theme change
    Animated.sequence([
      Animated.timing(calculatorScale, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(calculatorScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsDarkMode(!isDarkMode);
  };

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const deleteLast = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const inputDecimal = () => {
    if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  // Memory functions
  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
    setShowMemory(true);
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
    setShowMemory(true);
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
  };

  const memoryClear = () => {
    setMemory(0);
    setShowMemory(false);
  };

  const handleButtonPress = (buttonKey, action) => {
    animateButton(buttonKey);
    action();
  };

  const renderButton = (title, onPress, style = {}, textStyle = {}) => {
    const buttonScale = animatedValues[title] || new Animated.Value(1);
    const buttonGlow = glowAnimations[title] || new Animated.Value(0);

    const isOperator = ['÷', '×', '-', '+', '=', '^', 'mod'].includes(title);
    const isFunction = ['AC', 'DEL', '%', '+/-'].includes(title);
    const isScientific = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'x²', '1/x', 'π', 'e', '!'].includes(title);

    const dynamicGlowStyle = {
      shadowColor: isOperator ? currentTheme.glowPrimary : 
                   isFunction ? currentTheme.glowSecondary :
                   isScientific ? currentTheme.scientificGlow :
                   currentTheme.cardShadow,
      shadowOpacity: buttonGlow.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.6],
      }),
      shadowRadius: buttonGlow.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 15],
      }),
      elevation: buttonGlow.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 12],
      }),
    };

    const transformStyle = {
      transform: [{ scale: buttonScale }]
    };

    return (
      <Animated.View style={[dynamicGlowStyle, transformStyle]}>
        <TouchableOpacity
          style={[styles.button, style, {
            shadowColor: currentTheme.cardShadow,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }]}
          onPress={() => handleButtonPress(title, onPress)}
          activeOpacity={0.85}
        >
          <Animated.Text 
            style={[
              styles.buttonText, 
              textStyle,
              isScientific && { fontSize: title.length > 2 ? 18 : 24 },
              {
                transform: [{
                  scale: buttonGlow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05],
                  })
                }]
              }
            ]}
          >
            {title}
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderFinanceButton = (item) => (
    <TouchableOpacity
      key={item.label}
      style={[
        styles.financeButton, 
        { 
          backgroundColor: currentTheme.buttonSecondary,
          borderWidth: 1,
          borderColor: 'rgba(251, 191, 36, 0.2)',
          shadowColor: currentTheme.glowSecondary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
        }
      ]}
      onPress={() => {
        // Animate selection
        Animated.sequence([
          Animated.timing(displayAnimation, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(displayAnimation, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
        
        setDisplay(item.value);
        setShowFinanceLabels(false);
      }}
    >
      <Text style={[styles.financeButtonIcon]}>{item.icon}</Text>
      <Text style={[styles.financeButtonText, { color: currentTheme.buttonText }]}>
        {item.label}
      </Text>
      <Text style={[styles.financeButtonValue, { color: currentTheme.buttonText }]}>
        ₹{item.value}
      </Text>
      <View style={[styles.financeButtonAccent, { backgroundColor: currentTheme.accent }]} />
    </TouchableOpacity>
  );

  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: currentTheme.background },
        { transform: [{ scale: calculatorScale }] }
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Text style={[styles.brandText, { color: currentTheme.brandText }]}>
            ArthRakshak
          </Text>
          <Text style={[styles.brandSubtext, { color: currentTheme.brandText }]}>
            Smart Calculator
          </Text>
        </View>
        
        <View style={styles.headerControls}>
          {showMemory && (
            <View style={[styles.memoryIndicator, { backgroundColor: currentTheme.buttonPrimary }]}>
              <Text style={styles.memoryText}>M</Text>
            </View>
          )}
          
          <TouchableOpacity
            onPress={() => setShowScientific(!showScientific)}
            style={[styles.iconButton, { backgroundColor: showScientific ? currentTheme.scientificButton : currentTheme.buttonNeutral }]}
          >
            <Text style={[styles.iconButtonText, { color: showScientific ? '#ffffff' : currentTheme.buttonText }]}>
              f(x)
            </Text>
          </TouchableOpacity>
          
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
        </View>
      </View>

      {/* Calculator Body */}
      <View style={[
        styles.calculatorBody, 
        { 
          backgroundColor: currentTheme.calculatorBg,
          shadowColor: currentTheme.cardShadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
          elevation: 15,
        }
      ]}>
        {/* Display */}
        <View style={[
          styles.display, 
          { 
            backgroundColor: currentTheme.displayBg,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }
        ]}>
          <Animated.Text 
            style={[
              styles.displayText, 
              { 
                color: display === 'Error' ? currentTheme.errorColor : currentTheme.displayText,
                textShadowColor: 'rgba(0, 0, 0, 0.1)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
                transform: [{ scale: displayAnimation }]
              }
            ]}
          >
            {display}
          </Animated.Text>
          {operation && (
            <Text style={[
              styles.operationText, 
              { 
                color: currentTheme.buttonPrimary,
                textShadowColor: 'rgba(0, 0, 0, 0.1)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }
            ]}>
              {previousValue} {operation}
            </Text>
          )}
          {showScientific && (
            <View style={styles.angleModeContainer}>
              <TouchableOpacity
                onPress={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')}
                style={[styles.angleModeButton, { backgroundColor: currentTheme.accent }]}
              >
                <Text style={styles.angleModeText}>{angleMode.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={[styles.displayGlow, { backgroundColor: currentTheme.accent }]} />
        </View>

        {/* Scientific Functions */}
        {showScientific && (
          <View style={styles.scientificRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scientificScroll}>
              {renderButton('sin', () => handleScientificFunction('sin'), [styles.scientificButton, { backgroundColor: currentTheme.scientificButton }], { color: '#ffffff' })}
              {renderButton('cos', () => handleScientificFunction('cos'), [styles.scientificButton, { backgroundColor: currentTheme.scientificButton }], { color: '#ffffff' })}
              {renderButton('tan', () => handleScientificFunction('tan'), [styles.scientificButton, { backgroundColor: currentTheme.scientificButton }], { color: '#ffffff' })}
              {renderButton('log', () => handleScientificFunction('log'), [styles.scientificButton, { backgroundColor: currentTheme.scientificButton }], { color: '#ffffff' })}
              {renderButton('ln', () => handleScientificFunction('ln'), [styles.scientificButton, { backgroundColor: currentTheme.scientificButton }], { color: '#ffffff' })}
              {renderButton('sqrt', () => handleScientificFunction('sqrt'), [styles.scientificButton, { backgroundColor: currentTheme.scientificButton }], { color: '#ffffff' })}
              {renderButton('x²', () => handleScientificFunction('x²'), [styles.scientificButton, { backgroundColor: currentTheme.scientificButton }], { color: '#ffffff' })}
              {renderButton('1/x', () => handleScientificFunction('1/x'), [styles.scientificButton, { backgroundColor: currentTheme.scientificButton }], { color: '#ffffff' })}
              {renderButton('π', () => handleScientificFunction('π'), [styles.scientificButton, { backgroundColor: currentTheme.scientificButton }], { color: '#ffffff' })}
              {renderButton('e', () => handleScientificFunction('e'), [styles.scientificButton, { backgroundColor: currentTheme.scientificButton }], { color: '#ffffff' })}
              {renderButton('!', () => handleScientificFunction('!'), [styles.scientificButton, { backgroundColor: currentTheme.scientificButton }], { color: '#ffffff' })}
            </ScrollView>
          </View>
        )}

        {/* Finance Labels Row */}
        <View style={styles.financeRow}>
          <TouchableOpacity
            onPress={() => setShowFinanceLabels(!showFinanceLabels)}
            style={[styles.financeToggle, { backgroundColor: currentTheme.buttonSecondary }]}
          >
            <Text style={[styles.financeToggleText, { color: currentTheme.buttonText }]}>
              ₹ Quick Add
            </Text>
            <Ionicons 
              name={showFinanceLabels ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={currentTheme.buttonText} 
            />
          </TouchableOpacity>
        </View>

        {showFinanceLabels && (
          <View style={styles.financeLabelsContainer}>
            {financeLabels.map(renderFinanceButton)}
          </View>
        )}

        {/* Memory Buttons */}
        <View style={styles.memoryRow}>
          {renderButton('M+', memoryAdd, [styles.memoryButton, { backgroundColor: currentTheme.buttonSecondary }], { color: currentTheme.buttonText })}
          {renderButton('M-', memorySubtract, [styles.memoryButton, { backgroundColor: currentTheme.buttonSecondary }], { color: currentTheme.buttonText })}
          {renderButton('MR', memoryRecall, [styles.memoryButton, { backgroundColor: currentTheme.buttonSecondary }], { color: currentTheme.buttonText })}
          {renderButton('MC', memoryClear, [styles.memoryButton, { backgroundColor: currentTheme.buttonSecondary }], { color: currentTheme.buttonText })}
        </View>

        {/* Main Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Row 1 */}
          <View style={styles.buttonRow}>
            {renderButton('AC', clearAll, [styles.functionButton, { backgroundColor: currentTheme.buttonPrimary }], { color: currentTheme.operatorText })}
            {renderButton('DEL', deleteLast, [styles.functionButton, { backgroundColor: currentTheme.buttonPrimary }], { color: currentTheme.operatorText })}
            {renderButton('%', () => inputOperator('%'), [styles.operatorButton, { backgroundColor: currentTheme.buttonSecondary }], { color: currentTheme.buttonText })}
            {renderButton('÷', () => inputOperator('÷'), [styles.operatorButton, { backgroundColor: currentTheme.buttonPrimary }], { color: currentTheme.operatorText })}
          </View>

          {/* Row 2 */}
          <View style={styles.buttonRow}>
            {renderButton('7', () => inputNumber(7), [styles.numberButton, { backgroundColor: currentTheme.buttonNeutral }], { color: currentTheme.buttonText })}
            {renderButton('8', () => inputNumber(8), [styles.numberButton, { backgroundColor: currentTheme.buttonNeutral }], { color: currentTheme.buttonText })}
            {renderButton('9', () => inputNumber(9), [styles.numberButton, { backgroundColor: currentTheme.buttonNeutral }], { color: currentTheme.buttonText })}
            {renderButton('×', () => inputOperator('×'), [styles.operatorButton, { backgroundColor: currentTheme.buttonPrimary }], { color: currentTheme.operatorText })}
          </View>

          {/* Row 3 */}
          <View style={styles.buttonRow}>
            {renderButton('4', () => inputNumber(4), [styles.numberButton, { backgroundColor: currentTheme.buttonNeutral }], { color: currentTheme.buttonText })}
            {renderButton('5', () => inputNumber(5), [styles.numberButton, { backgroundColor: currentTheme.buttonNeutral }], { color: currentTheme.buttonText })}
            {renderButton('6', () => inputNumber(6), [styles.numberButton, { backgroundColor: currentTheme.buttonNeutral }], { color: currentTheme.buttonText })}
            {renderButton('-', () => inputOperator('-'), [styles.operatorButton, { backgroundColor: currentTheme.buttonPrimary }], { color: currentTheme.operatorText })}
          </View>

          {/* Row 4 */}
          <View style={styles.buttonRow}>
            {renderButton('1', () => inputNumber(1), [styles.numberButton, { backgroundColor: currentTheme.buttonNeutral }], { color: currentTheme.buttonText })}
            {renderButton('2', () => inputNumber(2), [styles.numberButton, { backgroundColor: currentTheme.buttonNeutral }], { color: currentTheme.buttonText })}
            {renderButton('3', () => inputNumber(3), [styles.numberButton, { backgroundColor: currentTheme.buttonNeutral }], { color: currentTheme.buttonText })}
            {renderButton('+', () => inputOperator('+'), [styles.operatorButton, { backgroundColor: currentTheme.buttonPrimary }], { color: currentTheme.operatorText })}
          </View>

          {/* Row 5 */}
          <View style={styles.buttonRow}>
            {renderButton('+/-', toggleSign, [styles.functionButton, { backgroundColor: currentTheme.buttonSecondary }], { color: currentTheme.buttonText })}
            {renderButton('0', () => inputNumber(0), [styles.numberButton, { backgroundColor: currentTheme.buttonNeutral }], { color: currentTheme.buttonText })}
            {renderButton('.', inputDecimal, [styles.numberButton, { backgroundColor: currentTheme.buttonNeutral }], { color: currentTheme.buttonText })}
            {renderButton('=', performCalculation, [styles.equalsButton, { backgroundColor: currentTheme.buttonPrimary }], { color: currentTheme.operatorText })}
          </View>
        </View>
      </View>

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
              Calculation History
            </Text>
            <TouchableOpacity onPress={() => setShowHistory(false)}>
              <Ionicons name="close" size={24} color={currentTheme.brandText} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.historyList}>
            {history.length === 0 ? (
              <Text style={[styles.noHistoryText, { color: currentTheme.brandText }]}>
                No calculations yet
              </Text>
            ) : (
              history.map((calculation, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.historyItem, { backgroundColor: currentTheme.buttonNeutral }]}
                  onPress={() => {
                    const result = calculation.split(' = ')[1];
                    setDisplay(result);
                    setShowHistory(false);
                  }}
                >
                  <Text style={[styles.historyText, { color: currentTheme.buttonText }]}>
                    {calculation}
                  </Text>
                </TouchableOpacity>
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
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  memoryIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  memoryText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
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
  iconButtonText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  scientificRow: {
    marginBottom: 18,
  },
  scientificScroll: {
    flexDirection: 'row',
  },
  scientificButton: {
    width: 70,
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  angleModeContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  angleModeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  angleModeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  financeButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  calculatorBody: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 35,
    padding: 24,
  },
  display: {
    minHeight: 130,
    borderRadius: 25,
    padding: 24,
    marginBottom: 24,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  displayGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.6,
  },
  displayText: {
    fontSize: 52,
    fontWeight: '300',
    textAlign: 'right',
    fontFamily: 'Inter',
    letterSpacing: -1,
  },
  operationText: {
    fontSize: 18,
    textAlign: 'right',
    opacity: 0.8,
    fontFamily: 'Inter',
    fontWeight: '500',
    marginTop: 4,
  },
  financeRow: {
    marginBottom: 18,
  },
  financeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  financeToggleText: {
    fontSize: 17,
    fontWeight: '700',
    marginRight: 10,
    fontFamily: 'Inter',
  },
  financeLabelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  financeButton: {
    flex: 1,
    minWidth: '30%',
    padding: 14,
    borderRadius: 15,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  financeButtonAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 4,
    height: '100%',
    opacity: 0.7,
  },
  financeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  financeButtonValue: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Inter',
    marginTop: 2,
  },
  memoryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  memoryButton: {
    flex: 1,
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonsContainer: {
    flex: 1,
    gap: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 14,
    flex: 1,
  },
  button: {
    flex: 1,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonText: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Inter',
    letterSpacing: -0.5,
  },
  numberButton: {
    // Enhanced styling will be applied dynamically
  },
  operatorButton: {
    // Enhanced styling will be applied dynamically
  },
  functionButton: {
    // Enhanced styling will be applied dynamically
  },
  equalsButton: {
    // Enhanced styling will be applied dynamically
  },
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
  historyList: {
    flex: 1,
    paddingTop: 24,
  },
  noHistoryText: {
    textAlign: 'center',
    fontSize: 18,
    opacity: 0.6,
    marginTop: 60,
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  historyItem: {
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyText: {
    fontSize: 17,
    fontFamily: 'Inter',
    fontWeight: '500',
  },
});

export default Calculator;
