import AsyncStorage from '@react-native-async-storage/async-storage';

export const getLanguageFromStorage = async () => {
    try {
        const savedLanguage = await AsyncStorage.getItem('@selectedLanguage');
        return savedLanguage || 'en';
    } catch (error) {
        console.log('Error loading language:', error);
        return 'en';
    }
};

export const saveLanguageToStorage = async (language) => {
    try {
        await AsyncStorage.setItem('@selectedLanguage', language);
    } catch (error) {
        console.log('Error saving language:', error);
    }
};

export const getContentByLanguage = (language, contentObject) => {
    return contentObject[language] || contentObject.en;
};
