import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import color from '../../constants/theme/color';

const { width: screenWidth } = Dimensions.get('window');

const LanguageSelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const languages = [
    {
      id: 'english',
      name: 'English',
      nativeName: 'English',
      flag: require('../../../assets/flags/english.png'),
      locale: 'en',
    },
    {
      id: 'hindi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: require('../../../assets/flags/hindi.png'),
      locale: 'hi',
    },
    {
      id: 'tamil',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      flag: require('../../../assets/flags/tamil.png'),
      locale: 'ta',
    },
    {
      id: 'telugu',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      flag: require('../../../assets/flags/telugu.png'),
      locale: 'te',
    },
    {
      id: 'bangla',
      name: 'Bangla',
      nativeName: 'বাংলা',
      flag: require('../../../assets/flags/bangla.png'),
      locale: 'bn',
    },
    {
      id: 'marathi',
      name: 'Marathi',
      nativeName: 'मराठी',
      flag: require('../../../assets/flags/marathi.png'),
      locale: 'mr',
    },
    {
      id: 'gujarati',
      name: 'Gujarati',
      nativeName: 'ગુજરાતી',
      flag: require('../../../assets/flags/gujarati.png'),
      locale: 'gu',
    },
    {
      id: 'kannada',
      name: 'Kannada',
      nativeName: 'ಕನ್ನಡ',
      flag: require('../../../assets/flags/kannada.png'),
      locale: 'kn',
    },
    {
      id: 'odia',
      name: 'Odia',
      nativeName: 'ଓଡ଼ିଆ',
      flag: require('../../../assets/flags/odia.png'),
      locale: 'or',
    },
    {
      id: 'punjabi',
      name: 'Punjabi',
      nativeName: 'ਪੰਜਾਬੀ',
      flag: require('../../../assets/flags/punjabi.png'),
      locale: 'pa',
    },
  ];

  useEffect(() => {
    checkExistingLanguage();
    detectSystemLanguage();
  }, []);

  const checkExistingLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        navigation.replace('RegisterScreen');
      }
    } catch (error) {
      console.log('Error checking saved language:', error);
    }
  };

  const detectSystemLanguage = () => {
    const systemLocale = Localization.locale;
    const detectedLanguage = languages.find(lang => 
      systemLocale.startsWith(lang.locale)
    );
    if (detectedLanguage) {
      setSelectedLanguage(detectedLanguage.id);
    }
  };

  const handleLanguageSelect = (languageId) => {
    setSelectedLanguage(languageId);
  };

  const handleContinue = async () => {
    try {
      const selectedLang = languages.find(lang => lang.id === selectedLanguage);
      await AsyncStorage.setItem('selectedLanguage', selectedLanguage);
      await AsyncStorage.setItem('selectedLocale', selectedLang.locale);
      
      // Here you would typically update your i18n locale
      // i18n.locale = selectedLang.locale;
      
      navigation.navigate('RegisterScreen');
    } catch (error) {
      Alert.alert('Error', 'Failed to save language preference');
    }
  };

  const renderLanguageItem = ({ item, index }) => {
    const isSelected = selectedLanguage === item.id;
    const itemsPerRow = 2;
    const isLastItem = index === languages.length - 1;
    const isOddItem = languages.length % 2 !== 0 && isLastItem;

    return (
      <TouchableOpacity
        style={[
          styles.languageButton,
          isSelected && styles.selectedLanguageButton,
          isOddItem && styles.fullWidthButton,
        ]}
        onPress={() => handleLanguageSelect(item.id)}
        accessibilityLabel={`Select ${item.name} language`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        <Image source={item.flag} style={styles.flagIcon} />
        <View style={styles.languageTextContainer}>
          <Text style={[styles.languageName, isSelected && styles.selectedLanguageName]}>
            {item.name}
          </Text>
          <Text style={[styles.nativeLanguageName, isSelected && styles.selectedNativeLanguageName]}>
            {item.nativeName}
          </Text>
        </View>
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>भाषा चुनें / Select Your Language</Text>
          <Text style={styles.subtitle}>
            हम आपकी पसंदीदा भाषा में मार्गदर्शन करेंगे
          </Text>
        </View>

        {/* Language Selection Grid */}
        <View style={styles.languageGrid}>
          <FlatList
            data={languages}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.languageListContainer}
            columnWrapperStyle={styles.languageRow}
          />
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedLanguage && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!selectedLanguage}
            accessibilityLabel="Continue to registration"
            accessibilityRole="button"
          >
            <Text style={[
              styles.continueButtonText,
              !selectedLanguage && styles.disabledButtonText,
            ]}>
              आगे बढ़ें / Continue
            </Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: color.pureWhite[900],
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: color.pureWhite[600],
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  languageGrid: {
    flex: 1,
    marginBottom: 20,
  },
  languageListContainer: {
    paddingBottom: 20,
  },
  languageRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  languageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.pureWhite[50],
    borderWidth: 2,
    borderColor: color.pureWhite[300],
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    minHeight: 80,
    elevation: 2,
    shadowColor: color.pureWhite[400],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedLanguageButton: {
    borderColor: color.primaryGreen[500],
    backgroundColor: color.primaryGreen[50],
  },
  fullWidthButton: {
    marginHorizontal: 5,
    maxWidth: (screenWidth - 50) / 2,
    alignSelf: 'flex-start',
  },
  flagIcon: {
    width: 32,
    height: 24,
    marginRight: 12,
    resizeMode: 'contain',
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: color.pureWhite[900],
    marginBottom: 2,
  },
  selectedLanguageName: {
    color: color.primaryGreen[700],
  },
  nativeLanguageName: {
    fontSize: 14,
    color: color.pureWhite[600],
    fontWeight: '500',
  },
  selectedNativeLanguageName: {
    color: color.primaryGreen[600],
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: color.primaryGreen[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkmark: {
    color: color.pureWhite[50],
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingVertical: 20,
    paddingBottom: 30,
  },
  continueButton: {
    backgroundColor: color.primaryGreen[500],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
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
  continueButtonText: {
    color: color.pureWhite[50],
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: color.pureWhite[600],
  },
});