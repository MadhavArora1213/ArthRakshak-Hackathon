import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Animated, 
    Dimensions, 
    StatusBar,
    ScrollView,
    TextInput,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Create Language Context
export const LanguageContext = createContext();

const LoadingFlow = () => {
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState('language');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.9));
    const [floatAnim] = useState(new Animated.Value(0));
    const [selectedCard, setSelectedCard] = useState(null);
    const [pulseAnim] = useState(new Animated.Value(1));
    const [glowAnim] = useState(new Animated.Value(0));
    const [shimmerAnim] = useState(new Animated.Value(0));
    const [breathingAnim] = useState(new Animated.Value(1));

    const languages = [
        { code: 'en', name: 'English', localName: 'English', flag: '🇬🇧', desc: 'Continue in English', accent: '#1f77b4' },
        { code: 'hi', name: 'Hindi', localName: 'हिंदी', flag: '🇮🇳', desc: 'हिंदी में जारी रखें', accent: '#ff7f0e' },
        { code: 'gu', name: 'Gujarati', localName: 'ગુજરાતી', flag: '🇮🇳', desc: 'ગુજરાતીમાં ચાલુ રાખો', accent: '#2ca02c' },
        { code: 'mr', name: 'Marathi', localName: 'मराठी', flag: '🇮🇳', desc: 'मराठीत सुरू ठेवा', accent: '#d62728' },
        { code: 'ta', name: 'Tamil', localName: 'தமிழ்', flag: '🇮🇳', desc: 'தமிழில் தொடரவும்', accent: '#9467bd' },
        { code: 'te', name: 'Telugu', localName: 'తెలుగు', flag: '🇮🇳', desc: 'తెలుగులో కొనసాగించండి', accent: '#8c564b' },
        { code: 'bn', name: 'Bengali', localName: 'বাংলা', flag: '🇮🇳', desc: 'বাংলায় চালিয়ে যান', accent: '#e377c2' }
    ];

    // Initialize cardAnimations after languages array is defined
    const [cardAnimations] = useState(() => 
        languages.map(() => new Animated.Value(0))
    );

    // Enhanced Multilingual content with more comprehensive translations
    const content = {
        en: {
            // Login Screen
            welcome: "Welcome Back",
            signIn: "Sign in to your account",
            email: "Email Address",
            password: "Password",
            remember: "Remember me",
            forgot: "Forgot Password?",
            signInBtn: "Sign In",
            continueWith: "or continue with",
            noAccount: "Don't have an account?",
            signUp: "Sign up",
            brandDesc: "Secure your financial future with comprehensive protection",
            
            // Loading Screen
            loadingTitle: "Setting up your experience...",
            loadingSubtitle: "Just a moment while we prepare everything for you",
            
            // Dashboard Content (for after login)
            dashboard: "Dashboard",
            balance: "Balance",
            transactions: "Transactions",
            investments: "Investments",
            profile: "Profile",
            settings: "Settings",
            logout: "Logout",
            
            // Common Actions
            save: "Save",
            cancel: "Cancel",
            delete: "Delete",
            edit: "Edit",
            view: "View",
            add: "Add",
            search: "Search",
            filter: "Filter",
            
            // Financial Terms
            income: "Income",
            expense: "Expense",
            budget: "Budget",
            savings: "Savings",
            loans: "Loans",
            insurance: "Insurance"
        },
        hi: {
            // Login Screen
            welcome: "वापस आपका स्वागत है",
            signIn: "अपने खाते में साइन इन करें",
            email: "ईमेल पता",
            password: "पासवर्ड",
            remember: "मुझे याद रखें",
            forgot: "पासवर्ड भूल गए?",
            signInBtn: "साइन इन करें",
            continueWith: "या इसके साथ जारी रखें",
            noAccount: "खाता नहीं है?",
            signUp: "साइन अप करें",
            brandDesc: "व्यापक सुरक्षा के साथ अपना वित्तीय भविष्य सुरक्षित करें",
            
            // Loading Screen
            loadingTitle: "आपका अनुभव तैयार कर रहे हैं...",
            loadingSubtitle: "कृपया प्रतीक्षा करें जब तक हम सब कुछ तैयार करते हैं",
            
            // Dashboard Content
            dashboard: "डैशबोर्ड",
            balance: "बैलेंस",
            transactions: "लेन-देन",
            investments: "निवेश",
            profile: "प्रोफाइल",
            settings: "सेटिंग्स",
            logout: "लॉग आउट",
            
            // Common Actions
            save: "सेव करें",
            cancel: "रद्द करें",
            delete: "डिलीट करें",
            edit: "संपादित करें",
            view: "देखें",
            add: "जोड़ें",
            search: "खोजें",
            filter: "फिल्टर",
            
            // Financial Terms
            income: "आय",
            expense: "खर्च",
            budget: "बजट",
            savings: "बचत",
            loans: "ऋण",
            insurance: "बीमा"
        },
        gu: {
            // Login Screen
            welcome: "પાછા આવવા બદલ આભાર",
            signIn: "તમારા એકાઉન્ટમાં સાઇન ઇન કરો",
            email: "ઇમેઇલ સરનામું",
            password: "પાસવર્ડ",
            remember: "મને યાદ રાખો",
            forgot: "પાસવર્ડ ભૂલી ગયા?",
            signInBtn: "સાઇન ઇન કરો",
            continueWith: "અથવા આની સાથે ચાલુ રાખો",
            noAccount: "એકાઉન્ટ નથી?",
            signUp: "સાઇન અપ કરો",
            brandDesc: "વ્યાપક સુરક્ષા સાથે તમારું નાણાકીય ભવિષ્ય સુરક્ષિત કરો",
            
            // Loading Screen
            loadingTitle: "તમારો અનુભવ તૈયાર કરી રહ્યાં છીએ...",
            loadingSubtitle: "કૃપા કરીને રાહ જુઓ જ્યારે અમે બધું તૈયાર કરીએ છીએ",
            
            // Dashboard Content
            dashboard: "ડેશબોર્ડ",
            balance: "બેલેન્સ",
            transactions: "ટ્રાન્ઝેક્શન",
            investments: "રોકાણ",
            profile: "પ્રોફાઇલ",
            settings: "સેટિંગ્સ",
            logout: "લૉગ આઉટ",
            
            // Common Actions
            save: "સેવ કરો",
            cancel: "રદ કરો",
            delete: "ડિલીટ કરો",
            edit: "સંપાદિત કરો",
            view: "જુઓ",
            add: "ઉમેરો",
            search: "શોધો",
            filter: "ફિલ્ટર",
            
            // Financial Terms
            income: "આવક",
            expense: "ખર્ચ",
            budget: "બજેટ",
            savings: "બચત",
            loans: "લોન",
            insurance: "વીમો"
        },
        mr: {
            // Login Screen
            welcome: "परतीचे स्वागत",
            signIn: "तुमच्या खात्यात साइन इन करा",
            email: "ईमेल पत्ता",
            password: "पासवर्ड",
            remember: "मला लक्षात ठेवा",
            forgot: "पासवर्ड विसरलात?",
            signInBtn: "साइन इन करा",
            continueWith: "किंवा यासह सुरू ठेवा",
            noAccount: "खाते नाही?",
            signUp: "साइन अप करा",
            brandDesc: "व्यापक संरक्षणासह तुमचे आर्थिक भविष्य सुरक्षित करा",
            
            // Loading Screen
            loadingTitle: "तुमचा अनुभव तयार करत आहोत...",
            loadingSubtitle: "कृपया प्रतीक्षा करा आम्ही सर्व काही तयार करत आहोत",
            
            // Dashboard Content
            dashboard: "डॅशबोर्ड",
            balance: "शिल्लक",
            transactions: "व्यवहार",
            investments: "गुंतवणूक",
            profile: "प्रोफाइल",
            settings: "सेटिंग्ज",
            logout: "लॉग आउट",
            
            // Common Actions
            save: "सेव्ह करा",
            cancel: "रद्द करा",
            delete: "डिलीट करा",
            edit: "संपादित करा",
            view: "पहा",
            add: "जोडा",
            search: "शोधा",
            filter: "फिल्टर",
            
            // Financial Terms
            income: "उत्पन्न",
            expense: "खर्च",
            budget: "बजेट",
            savings: "बचत",
            loans: "कर्ज",
            insurance: "विमा"
        },
        ta: {
            // Login Screen
            welcome: "மீண்டும் வரவேற்கிறோம்",
            signIn: "உங்கள் கணக்கில் உள்நுழையவும்",
            email: "மின்னஞ்சல் முகவரி",
            password: "கடவுச்சொல்",
            remember: "என்னை நினைவில் வைத்துக்கொள்ளுங்கள்",
            forgot: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
            signInBtn: "உள்நுழையவும்",
            continueWith: "அல்லது இதனுடன் தொடரவும்",
            noAccount: "கணக்கு இல்லையா?",
            signUp: "பதிவு செய்யவும்",
            brandDesc: "விரிவான பாதுகாப்புடன் உங்கள் நிதி எதிர்காலத்தை பாதுகாக்கவும்",
            
            // Loading Screen
            loadingTitle: "உங்கள் அனுபவத்தை அமைத்துக்கொண்டிருக்கிறோம்...",
            loadingSubtitle: "நாங்கள் எல்லாவற்றையும் தயார் செய்யும் வரை தயவுசெய்து காத்திருங்கள்",
            
            // Dashboard Content
            dashboard: "டாஷ்போர்டு",
            balance: "இருப்பு",
            transactions: "பரிவர்த்தனைகள்",
            investments: "முதலீடுகள்",
            profile: "சுயவிவரம்",
            settings: "அமைப்புகள்",
            logout: "வெளியேறு",
            
            // Common Actions
            save: "சேமிக்கவும்",
            cancel: "ரத்து செய்யவும்",
            delete: "நீக்கவும்",
            edit: "திருத்தவும்",
            view: "பார்க்கவும்",
            add: "சேர்க்கவும்",
            search: "தேடவும்",
            filter: "வடிகட்டவும்",
            
            // Financial Terms
            income: "வருமானம்",
            expense: "செலவு",
            budget: "பட்ஜெட்",
            savings: "சேமிப்பு",
            loans: "கடன்கள்",
            insurance: "காப்பீடு"
        },
        te: {
            // Login Screen
            welcome: "తిరిగి స్వాగతం",
            signIn: "మీ ఖాతాకు సైన్ ఇన్ చేయండి",
            email: "ఇమెయిల్ చిరునామా",
            password: "పాస్‌వర్డ్",
            remember: "నన్ను గుర్తుంచుకోండి",
            forgot: "పాస్‌వర్డ్ మర్చిపోయారా?",
            signInBtn: "సైన్ ఇన్ చేయండి",
            continueWith: "లేదా దీనితో కొనసాగించండి",
            noAccount: "ఖాతా లేదా?",
            signUp: "సైన్ అప్ చేయండి",
            brandDesc: "సమగ్ర రక్షణతో మీ ఆర్థిక భవిష్యత్తును భద్రపరచండి",
            
            // Loading Screen
            loadingTitle: "మీ అనుభవాన్ని సెట్ చేస్తున్నాము...",
            loadingSubtitle: "మేము అన్నింటినీ సిద్ధం చేసే వరకు దయచేసి వేచి ఉండండి",
            
            // Dashboard Content
            dashboard: "డాష్‌బోర్డ్",
            balance: "బ్యాలెన్స్",
            transactions: "లావాదేవీలు",
            investments: "పెట్టుబడులు",
            profile: "ప్రొఫైల్",
            settings: "సెట్టింగులు",
            logout: "లాగ్ అవుట్",
            
            // Common Actions
            save: "సేవ్ చేయండి",
            cancel: "రద్దు చేయండి",
            delete: "తొలగించండి",
            edit: "సవరించండి",
            view: "చూడండి",
            add: "జోడించండి",
            search: "వెతకండి",
            filter: "ఫిల్టర్",
            
            // Financial Terms
            income: "ఆదాయం",
            expense: "ఖర్చు",
            budget: "బడ్జెట్",
            savings: "పొదుపు",
            loans: "రుణాలు",
            insurance: "బీమా"
        },
        bn: {
            // Login Screen
            welcome: "পুনরায় স্বাগতম",
            signIn: "আপনার অ্যাকাউন্টে সাইন ইন করুন",
            email: "ইমেইল ঠিকানা",
            password: "পাসওয়ার্ড",
            remember: "আমাকে মনে রাখুন",
            forgot: "পাসওয়ার্ড ভুলে গেছেন?",
            signInBtn: "সাইন ইন করুন",
            continueWith: "অথবা এর সাথে চালিয়ে যান",
            noAccount: "অ্যাকাউন্ট নেই?",
            signUp: "সাইন আপ করুন",
            brandDesc: "ব্যাপক সুরক্ষা সহ আপনার আর্থিক ভবিষ্যত সুরক্ষিত করুন",
            
            // Loading Screen
            loadingTitle: "আপনার অভিজ্ঞতা সেট আপ করছি...",
            loadingSubtitle: "আমরা সবকিছু প্রস্তুত করার সময় অনুগ্রহ করে অপেক্ষা করুন",
            
            // Dashboard Content
            dashboard: "ড্যাশবোর্ড",
            balance: "ব্যালেন্স",
            transactions: "লেনদেন",
            investments: "বিনিয়োগ",
            profile: "প্রোফাইল",
            settings: "সেটিংস",
            logout: "লগ আউট",
            
            // Common Actions
            save: "সেভ করুন",
            cancel: "বাতিল করুন",
            delete: "মুছে ফেলুন",
            edit: "সম্পাদনা করুন",
            view: "দেখুন",
            add: "যোগ করুন",
            search: "অনুসন্ধান করুন",
            filter: "ফিল্টার",
            
            // Financial Terms
            income: "আয়",
            expense: "ব্যয়",
            budget: "বাজেট",
            savings: "সঞ্চয়",
            loans: "ঋণ",
            insurance: "বীমা"
        }
    };

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 80,
                friction: 8,
                useNativeDriver: true,
            })
        ]).start();

        // Floating animation for logo
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -10,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Pulsing animation for logo
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Glowing animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false,
                })
            ])
        ).start();

        // Shimmer effect for cards
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 2500,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 2500,
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Breathing animation for background
        Animated.loop(
            Animated.sequence([
                Animated.timing(breathingAnim, {
                    toValue: 1.05,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(breathingAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Staggered card animations
        const animateCards = () => {
            if (cardAnimations && cardAnimations.length > 0) {
                const animations = cardAnimations.map((anim, index) =>
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 600,
                        delay: index * 150,
                        useNativeDriver: true,
                    })
                );
                Animated.stagger(100, animations).start();
            }
        };

        const timeoutId = setTimeout(animateCards, 800);
        
        return () => {
            clearTimeout(timeoutId);
        };
    }, [currentStep, cardAnimations, fadeAnim, scaleAnim, floatAnim, pulseAnim, glowAnim, shimmerAnim, breathingAnim]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        languagePage: {
            flex: 1,
            backgroundColor: '#1a4d3a',
            paddingTop: StatusBar.currentHeight + 20,
        },
        backgroundPattern: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.08,
        },
        gradientOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(26, 77, 58, 0.85)',
        },
        floatingElements: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        floatingCircle: {
            position: 'absolute',
            borderRadius: 50,
            backgroundColor: 'rgba(58, 208, 143, 0.1)',
        },
        scrollContainer: {
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: 40,
        },
        headerSection: {
            alignItems: 'center',
            paddingVertical: 50,
            marginBottom: 20,
        },
        logoContainer: {
            position: 'relative',
            marginBottom: 30,
        },
        logoCircle: {
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#3ad08f',
            shadowOffset: { width: 0, height: 15 },
            shadowOpacity: 0.6,
            shadowRadius: 25,
            elevation: 25,
        },
        logoGlow: {
            position: 'absolute',
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: 'rgba(58, 208, 143, 0.2)',
            top: -10,
            left: -10,
        },
        logoInnerGlow: {
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: 'rgba(58, 208, 143, 0.1)',
            top: 10,
            left: 10,
        },
        logoText: {
            fontSize: 45,
            color: '#3ad08f',
            fontWeight: 'bold',
            textShadowColor: 'rgba(58, 208, 143, 0.3)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 5,
        },
        appTitle: {
            fontSize: 40,
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: 12,
            textShadowColor: 'rgba(0,0,0,0.6)',
            textShadowOffset: { width: 0, height: 4 },
            textShadowRadius: 10,
            letterSpacing: 3,
        },
        tagline: {
            fontSize: 20,
            color: 'rgba(255, 255, 255, 0.95)',
            fontWeight: '600',
            letterSpacing: 1.5,
            textShadowColor: 'rgba(0,0,0,0.4)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
        },
        sparkle: {
            position: 'absolute',
            color: '#ffd700',
            fontSize: 12,
        },
        sectionHeader: {
            alignItems: 'center',
            marginBottom: 40,
            paddingHorizontal: 20,
        },
        selectionTitle: {
            fontSize: 32,
            fontWeight: '900',
            color: 'white',
            textAlign: 'center',
            marginBottom: 12,
            textShadowColor: 'rgba(0,0,0,0.5)',
            textShadowOffset: { width: 0, height: 3 },
            textShadowRadius: 8,
            letterSpacing: 1,
        },
        selectionSubtitle: {
            fontSize: 18,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            fontWeight: '500',
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 3,
            letterSpacing: 0.5,
        },
        languageCard: {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 28,
            padding: 24,
            marginVertical: 12,
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.15)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 15,
            elevation: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            overflow: 'hidden',
        },
        cardShimmer: {
            position: 'absolute',
            top: 0,
            left: -100,
            width: 100,
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            transform: [{ skewX: '-20deg' }],
        },
        languageCardSelected: {
            backgroundColor: 'rgba(58, 208, 143, 0.15)',
            borderColor: '#3ad08f',
            borderWidth: 3,
            transform: [{ scale: 1.05 }],
            shadowColor: '#3ad08f',
            shadowOpacity: 0.6,
            shadowRadius: 20,
            elevation: 16,
        },
        cardLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        cardRight: {
            alignItems: 'flex-end',
        },
        flag: {
            fontSize: 40,
            marginRight: 20,
        },
        cardContent: {
            flex: 1,
        },
        cardTitle: {
            fontSize: 22,
            fontWeight: '800',
            color: 'white',
            marginBottom: 5,
            textShadowColor: 'rgba(0,0,0,0.4)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 3,
        },
        cardDesc: {
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.85)',
            fontWeight: '500',
            lineHeight: 18,
        },
        cardCode: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '800',
            backgroundColor: 'rgba(58, 208, 143, 0.2)',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(58, 208, 143, 0.3)',
        },
        selectIndicator: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            marginTop: 8,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.3)',
        },
        selectIndicatorActive: {
            backgroundColor: '#3ad08f',
            borderColor: '#ffffff',
            shadowColor: '#3ad08f',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
            elevation: 8,
        },
        checkIcon: {
            color: '#ffffff',
            fontSize: 18,
            fontWeight: '900',
        },
        loadingPage: {
            flex: 1,
            backgroundColor: '#0f172a',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
        },
        loadingGradientOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
        },
        loadingLogo: {
            marginBottom: 60,
            alignItems: 'center',
        },
        loadingIcon: {
            fontSize: 80,
            marginBottom: 40,
            color: '#3ad08f',
            textShadowColor: 'rgba(58, 208, 143, 0.5)',
            textShadowOffset: { width: 0, height: 4 },
            textShadowRadius: 10,
        },
        loadingTitle: {
            fontSize: 32,
            fontWeight: '800',
            color: 'white',
            textAlign: 'center',
            marginBottom: 15,
            textShadowColor: 'rgba(0,0,0,0.4)',
            textShadowOffset: { width: 0, height: 3 },
            textShadowRadius: 8,
            letterSpacing: 1,
        },
        loadingSubtitle: {
            fontSize: 19,
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            marginBottom: 60,
            lineHeight: 26,
            fontWeight: '500',
        },
        progressContainer: {
            width: width * 0.9,
            alignItems: 'center',
        },
        progressBar: {
            width: '100%',
            height: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 5,
            marginBottom: 25,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        progressFill: {
            height: '100%',
            backgroundColor: '#3ad08f',
            borderRadius: 5,
            shadowColor: '#3ad08f',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 6,
        },
        progressText: {
            fontSize: 20,
            fontWeight: '700',
            color: 'white',
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
        },
        loginPage: {
            flex: 1,
            backgroundColor: '#f8fffe',
        },
        loginHeader: {
            backgroundColor: '#2d5a3d',
            paddingTop: StatusBar.currentHeight + 35,
            paddingHorizontal: 30,
            paddingBottom: 45,
            borderBottomLeftRadius: 35,
            borderBottomRightRadius: 35,
        },
        loginHeaderOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(58, 208, 143, 0.1)',
            borderBottomLeftRadius: 35,
            borderBottomRightRadius: 35,
        },
        brandSection: {
            alignItems: 'center',
            marginTop: 30,
        },
        brandIcon: {
            fontSize: 55,
            color: '#ffffff',
            marginBottom: 18,
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 0, height: 3 },
            textShadowRadius: 6,
        },
        brandTitle: {
            fontSize: 32,
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: 10,
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 5,
            letterSpacing: 1,
        },
        brandDesc: {
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.95)',
            textAlign: 'center',
            lineHeight: 22,
            paddingHorizontal: 25,
            fontWeight: '500',
        },
        loginForm: {
            padding: 30,
            paddingTop: 50,
        },
        formHeader: {
            alignItems: 'center',
            marginBottom: 50,
        },
        formTitle: {
            fontSize: 30,
            fontWeight: '900',
            color: '#1a202c',
            marginBottom: 8,
            textShadowColor: 'rgba(0,0,0,0.1)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
        },
        formSubtitle: {
            fontSize: 17,
            color: '#64748b',
            fontWeight: '500',
        },
        inputContainer: {
            marginBottom: 28,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#e2e8f0',
            borderRadius: 18,
            paddingHorizontal: 20,
            backgroundColor: 'white',
            shadowColor: '#3ad08f',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 6,
        },
        inputWrapperFocused: {
            borderColor: '#3ad08f',
            shadowColor: '#3ad08f',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 15,
            elevation: 8,
        },
        inputIcon: {
            fontSize: 22,
            color: '#3ad08f',
            marginRight: 18,
        },
        input: {
            flex: 1,
            paddingVertical: 20,
            fontSize: 17,
            color: '#1a202c',
            fontWeight: '600',
        },
        loginBtn: {
            borderRadius: 18,
            alignItems: 'center',
            marginBottom: 40,
            shadowColor: '#3ad08f',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 12,
        },
        loginBtnGradient: {
            width: '100%',
            paddingVertical: 20,
            borderRadius: 18,
            alignItems: 'center',
            backgroundColor: '#3ad08f',
        },
        loginBtnText: {
            color: 'white',
            fontSize: 18,
            fontWeight: '800',
            letterSpacing: 1,
            textShadowColor: 'rgba(0,0,0,0.2)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
        },
        loginScrollContent: {
            flexGrow: 1,
        },
        formOptions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 35,
        },
        checkboxContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        checkbox: {
            width: 20,
            height: 20,
            borderWidth: 2,
            borderColor: '#3ad08f',
            borderRadius: 5,
            marginRight: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        checkboxText: {
            fontSize: 15,
            color: '#4a5568',
            fontWeight: '500',
        },
        forgotPassword: {
            fontSize: 15,
            color: '#3ad08f',
            fontWeight: '600',
        },
        loginBtnOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderRadius: 18,
        },
        divider: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 25,
        },
        dividerLine: {
            flex: 1,
            height: 1,
            backgroundColor: '#e2e8f0',
        },
        dividerText: {
            marginHorizontal: 20,
            fontSize: 15,
            color: '#a0aec0',
            fontWeight: '500',
        },
        socialLogin: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 35,
        },
        socialBtn: {
            flex: 0.48,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 15,
            borderWidth: 2,
            borderColor: '#e2e8f0',
            borderRadius: 12,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
        },
        socialBtnText: {
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '600',
        },
        signupLink: {
            alignItems: 'center',
            paddingBottom: 30,
        },
        signupText: {
            fontSize: 15,
            color: '#718096',
            fontWeight: '500',
        },
        signupBtn: {
            color: '#3ad08f',
            fontWeight: '700',
        },
        languageSection: {
            flex: 1,
            paddingTop: 20,
        },
    });

    const getCurrentContent = () => {
        return content[selectedLanguage] || content.en;
    };

    // Save language to AsyncStorage for persistence
    const saveLanguagePreference = async (langCode) => {
        try {
            await AsyncStorage.setItem('@selectedLanguage', langCode);
        } catch (error) {
            console.log('Error saving language preference:', error);
        }
    };

    // Load saved language preference
    const loadLanguagePreference = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('@selectedLanguage');
            if (savedLanguage) {
                setSelectedLanguage(savedLanguage);
                setSelectedCard(savedLanguage);
            }
        } catch (error) {
            console.log('Error loading language preference:', error);
        }
    };

    useEffect(() => {
        loadLanguagePreference();
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 80,
                friction: 8,
                useNativeDriver: true,
            })
        ]).start();

        // Floating animation for logo
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -10,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Pulsing animation for logo
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Glowing animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false,
                })
            ])
        ).start();

        // Shimmer effect for cards
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 2500,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 2500,
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Breathing animation for background
        Animated.loop(
            Animated.sequence([
                Animated.timing(breathingAnim, {
                    toValue: 1.05,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(breathingAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Staggered card animations
        const animateCards = () => {
            if (cardAnimations && cardAnimations.length > 0) {
                const animations = cardAnimations.map((anim, index) =>
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 600,
                        delay: index * 150,
                        useNativeDriver: true,
                    })
                );
                Animated.stagger(100, animations).start();
            }
        };

        const timeoutId = setTimeout(animateCards, 800);
        
        return () => {
            clearTimeout(timeoutId);
        };
    }, [currentStep, cardAnimations, fadeAnim, scaleAnim, floatAnim, pulseAnim, glowAnim, shimmerAnim, breathingAnim]);

    const handleLanguageSelect = (langCode) => {
        setSelectedCard(langCode);
        setSelectedLanguage(langCode);
        saveLanguagePreference(langCode); // Save to AsyncStorage
        
        // Add a small delay for visual feedback
        setTimeout(() => {
            setCurrentStep('loading');
            
            // Simulate loading progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 12 + 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => setCurrentStep('login'), 800);
                }
                setLoadingProgress(progress);
            }, 150);
        }, 500);
    };

    const handleLogin = () => {
        // Pass language data to Dashboard
        navigation.navigate('Dashboard', { 
            selectedLanguage: selectedLanguage,
            languageContent: getCurrentContent(),
            languages: languages
        });
    };

    const LanguageSelectionPage = () => (
        <View style={styles.container}>
            <View style={styles.languagePage}>
                <View style={styles.gradientOverlay} />
                
                {/* Floating background elements */}
                <Animated.View style={[
                    styles.floatingElements,
                    { transform: [{ scale: breathingAnim }] }
                ]}>
                    <View style={[styles.floatingCircle, {
                        width: 100, height: 100, top: 50, left: 30,
                        opacity: 0.1
                    }]} />
                    <View style={[styles.floatingCircle, {
                        width: 60, height: 60, top: 200, right: 40,
                        opacity: 0.08
                    }]} />
                    <View style={[styles.floatingCircle, {
                        width: 80, height: 80, bottom: 150, left: 50,
                        opacity: 0.06
                    }]} />
                </Animated.View>
                
                <StatusBar backgroundColor="#1a4d3a" barStyle="light-content" />
                
                <ScrollView 
                    style={styles.container}
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                >
                    <Animated.View style={[
                        styles.headerSection,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}>
                        <View style={styles.logoContainer}>
                            <Animated.View style={[
                                styles.logoGlow,
                                { opacity: glowAnim }
                            ]} />
                            <View style={styles.logoInnerGlow} />
                            <Animated.View style={[
                                styles.logoCircle,
                                { 
                                    transform: [
                                        { translateY: floatAnim },
                                        { scale: pulseAnim }
                                    ]
                                }
                            ]}>
                                <Text style={styles.logoText}>🛡️</Text>
                            </Animated.View>
                            
                            {/* Sparkle effects */}
                            <Animated.Text style={[
                                styles.sparkle,
                                { top: 20, right: 10, opacity: glowAnim }
                            ]}>✨</Animated.Text>
                            <Animated.Text style={[
                                styles.sparkle,
                                { bottom: 15, left: 5, opacity: glowAnim }
                            ]}>⭐</Animated.Text>
                        </View>
                        
                        <Text style={styles.appTitle}>ArthRakshak</Text>
                        <Text style={styles.tagline}>Your Financial Guardian</Text>
                    </Animated.View>
                    
                    <View style={styles.languageSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.selectionTitle}>Choose Your Language</Text>
                            <Text style={styles.selectionSubtitle}>भाषा चुनें / Select Language</Text>
                        </View>
                        
                        <View>
                            {languages && languages.length > 0 && languages.map((lang, index) => (
                                <Animated.View
                                    key={lang.code}
                                    style={{
                                        opacity: cardAnimations[index] || new Animated.Value(1),
                                        transform: [{
                                            translateY: cardAnimations[index] ? cardAnimations[index].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [50, 0]
                                            }) : 0
                                        }]
                                    }}
                                >
                                    <TouchableOpacity
                                        style={[
                                            styles.languageCard,
                                            selectedCard === lang.code && styles.languageCardSelected
                                        ]}
                                        onPress={() => handleLanguageSelect(lang.code)}
                                        activeOpacity={0.85}
                                    >
                                        {/* Shimmer effect */}
                                        <Animated.View style={[
                                            styles.cardShimmer,
                                            {
                                                transform: [{
                                                    translateX: shimmerAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [-100, width + 100]
                                                    })
                                                }]
                                            }
                                        ]} />
                                        
                                        <View style={styles.cardLeft}>
                                            <Text style={styles.flag}>{lang.flag}</Text>
                                            <View style={styles.cardContent}>
                                                <Text style={styles.cardTitle}>{lang.localName}</Text>
                                                <Text style={styles.cardDesc}>{lang.desc}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.cardRight}>
                                            <Text style={styles.cardCode}>{lang.code.toUpperCase()}</Text>
                                            <View style={[
                                                styles.selectIndicator,
                                                selectedCard === lang.code && styles.selectIndicatorActive
                                            ]}>
                                                {selectedCard === lang.code && (
                                                    <Text style={styles.checkIcon}>✓</Text>
                                                )}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );

    const LoadingPage = () => {
        const currentContent = getCurrentContent();
        
        return (
            <View style={styles.container}>
                <View style={styles.loadingPage}>
                    <View style={styles.loadingGradientOverlay} />
                    <StatusBar backgroundColor="#0f172a" barStyle="light-content" />
                    <Animated.View style={[
                        styles.loadingLogo,
                        { transform: [{ translateY: floatAnim }] }
                    ]}>
                        <Text style={styles.loadingIcon}>🛡️</Text>
                    </Animated.View>
                    
                    <Text style={styles.loadingTitle}>
                        {currentContent.loadingTitle}
                    </Text>
                    <Text style={styles.loadingSubtitle}>
                        {currentContent.loadingSubtitle}
                    </Text>
                    
                    <ActivityIndicator size="large" color="#3ad08f" style={{ marginBottom: 40 }} />
                    
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View 
                                style={[
                                    styles.progressFill,
                                    { width: `${loadingProgress}%` }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>{Math.round(loadingProgress)}%</Text>
                    </View>
                </View>
            </View>
        );
    };

    const LoginPage = () => {
        const currentContent = getCurrentContent();
        
        return (
            <View style={styles.loginPage}>
                <StatusBar backgroundColor="#2d5a3d" barStyle="light-content" />
                <ScrollView 
                    contentContainerStyle={styles.loginScrollContent}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                >
                    <View style={styles.loginHeader}>
                        <View style={styles.loginHeaderOverlay} />
                        <View style={styles.brandSection}>
                            <Text style={styles.brandIcon}>🛡️</Text>
                            <Text style={styles.brandTitle}>ArthRakshak</Text>
                            <Text style={styles.brandDesc}>
                                {currentContent.brandDesc}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={styles.loginForm}>
                        <View style={styles.formHeader}>
                            <Text style={styles.formTitle}>{currentContent.welcome}</Text>
                            <Text style={styles.formSubtitle}>{currentContent.signIn}</Text>
                        </View>
                        
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputIcon}>📧</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={currentContent.email}
                                    placeholderTextColor="#a0aec0"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                        
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputIcon}>🔒</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={currentContent.password}
                                    placeholderTextColor="#a0aec0"
                                    secureTextEntry
                                />
                            </View>
                        </View>
                        
                        <View style={styles.formOptions}>
                            <View style={styles.checkboxContainer}>
                                <View style={styles.checkbox}>
                                    {/* Add checkbox logic here */}
                                </View>
                                <Text style={styles.checkboxText}>{currentContent.remember}</Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={styles.forgotPassword}>{currentContent.forgot}</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                            <View style={styles.loginBtnGradient}>
                                <View style={styles.loginBtnOverlay} />
                                <Text style={styles.loginBtnText}>{currentContent.signInBtn}</Text>
                            </View>
                        </TouchableOpacity>
                        
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>{currentContent.continueWith}</Text>
                            <View style={styles.dividerLine} />
                        </View>
                        
                        <View style={styles.socialLogin}>
                            <TouchableOpacity style={[styles.socialBtn, { borderColor: '#db4437' }]}>
                                <Text style={{ color: '#db4437', fontSize: 20, fontWeight: 'bold' }}>G</Text>
                                <Text style={[styles.socialBtnText, { color: '#db4437' }]}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialBtn, { borderColor: '#4267b2' }]}>
                                <Text style={{ color: '#4267b2', fontSize: 20, fontWeight: 'bold' }}>f</Text>
                                <Text style={[styles.socialBtnText, { color: '#4267b2' }]}>Facebook</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.signupLink}>
                            <Text style={styles.signupText}>
                                {currentContent.noAccount}{' '}
                                <Text style={styles.signupBtn} onPress={() => navigation.navigate('SignUp')}>
                                    {currentContent.signUp}
                                </Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    };

    return (
        <LanguageContext.Provider value={{
            selectedLanguage,
            setSelectedLanguage,
            getCurrentContent,
            languages,
            content
        }}>
            <View style={styles.container}>
                {currentStep === 'language' && <LanguageSelectionPage />}
                {currentStep === 'loading' && <LoadingPage />}
                {currentStep === 'login' && <LoginPage />}
            </View>
        </LanguageContext.Provider>
    );
};

// Hook to use language context in other components
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageContext.Provider');
    }
    return context;
};


export default LoadingFlow;


