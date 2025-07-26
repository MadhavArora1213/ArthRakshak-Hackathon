"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Alert,
  StatusBar,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Clipboard from "expo-clipboard"
import * as Sharing from "expo-sharing"
import { useAudio } from "../../context/AudioContext"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const isTablet = screenWidth > 768
const isSmall = screenWidth < 375

// Simple 3-Color Palette
const COLORS = {
  // Primary Colors
  lightGreen: "#4CAF50",
  lightGreenLight: "#81C784",
  lightGreenDark: "#388E3C",

  white: "#FFFFFF",
  offWhite: "#F8F9FA",

  skin: "#FDBCB4",
  skinLight: "#FFE0DB",
  skinDark: "#F4A394",

  // Functional Colors
  text: "#2E2E2E",
  textLight: "#666666",
  textMuted: "#999999",

  error: "#F44336",
  warning: "#FF9800",

  // Transparent overlays
  overlay: "rgba(0, 0, 0, 0.1)",
  overlayLight: "rgba(0, 0, 0, 0.05)",
}

const STEPS = {
  INTRO: 0,
  SOCIAL_PROOF: 1,
  FAKE_PLATFORM: 2,
  INVESTMENT: 3,
  FAKE_RETURNS: 4,
  WITHDRAWAL_TRAP: 5,
  SCAM_REVEALED: 6,
  RESULTS: 7,
}

const LANGUAGES = [
  { label: "English", value: "en", flag: "🇺🇸", nativeName: "English" },
  { label: "हिंदी", value: "hi", flag: "🇮🇳", nativeName: "हिंदी" },
  { label: "ਪੰਜਾਬੀ", value: "pa", flag: "🇮🇳", nativeName: "ਪੰਜਾਬੀ" },
]

// Complete translations for all languages
const translations = {
  en: {
    title: "Investment Fraud Simulation",
    subtitle: "Learn to protect yourself from scams safely",
    startSimulation: "Start Learning",
    playAudio: "🔊 Listen",
    next: "Next",
    continue: "Continue",
    suspicious: "🚨 This looks suspicious",
    joinNow: "💰 Join Now - Get 300% Returns!",
    invest: "💸 Invest Now",
    withdraw: "💰 Withdraw Profits",
    payFee: "💳 Pay Processing Fee",
    scamRevealed: "🚨 SCAM REVEALED!",
    tryAgain: "Try Again",
    shareResults: "Share Results",
    yourScore: "Your Awareness Score",
    viewDashboard: "📊 View Dashboard",
    moreInfo: "ℹ️ Need more info",
    refuseFee: "🚫 This is a scam!",
    seeScore: "See Your Score",
    investmentConfirmed: "✅ Investment Confirmed!",
    readyToWithdraw: "💰 Ready to Withdraw?",
    processingFeeRequired: "⚠️ Processing Fee Required",
    timeRemaining: "⏰ Time remaining",
    totalBalance: "💰 Total Balance",
    currentProfit: "📈 Current Profit",
    quickStart: "⚡ Quick Start Investment",
    guaranteed: "✅ Guaranteed in 7 days",
    availableForWithdrawal: "💰 Available for withdrawal",
    customerSupport: "💬 Customer Support",
    onlineNow: "🟢 Online now",
    websiteDisappeared: "💥 The website has disappeared!",
    simulationComplete: "🎉 Simulation Complete!",
    performanceDescription: "Here's how you performed against investment fraud tactics",
    excellentDetector: "🏆 Excellent - Scam Detector!",
    goodStayAlert: "👍 Good - Stay Alert",
    needsImprovement: "⚠️ Needs Improvement",
    correctlyIdentified: "You correctly identified",
    outOf: "out of",
    redFlagsText: "red flags",
    shareMessage: "I just completed an investment fraud simulation and learned to protect myself from scams! 🛡️",
    withdrawalAmount: "💰 Withdrawal Amount",
    processingFee: "💳 Processing Fee",
    youllReceive: "✅ You'll receive",
    chooseLanguage: "🌍 Choose Your Language",
    whatYoullLearn: "🎯 What You'll Learn",
    safeEnvironment: "Safe Environment",
    noRealMoney: "No real money at risk",
    realScenarios: "Real Scenarios",
    basedOnActualCases: "Based on actual fraud cases",
    getCertified: "Get Certified",
    earnAwarenessBadge: "Earn your awareness badge",
    lostAnnually: "Lost Annually",
    peopleAffected: "People Affected",
    successRate: "Success Rate",
    progress: "Progress",
    step: "Step",
    of: "of",
    complete: "Complete",
    mostPopular: "MOST POPULAR",
    profit: "Profit",
    investmentSummary: "📊 Investment Summary",
    investment: "💰 Investment",
    expectedReturns: "📈 Expected Returns",
    roi: "🎯 ROI",
    duration: "⏰ Duration",
    status: "🟢 Status",
    active: "Active",
    days: "days",
    whatHappensNext: "🚀 What happens next:",
    aiAlgorithmStarts: "AI algorithm starts trading immediately",
    realTimeProfitUpdates: "Real-time profit updates in dashboard",
    withdrawProfitsAnytime: "Withdraw profits anytime after 24 hours",
    getNotifications: "Get notifications for every trade",
    myTradingDashboard: "💰 My Trading Dashboard",
    realTimeAiResults: "Real-time AI Results",
    liveTrading: "LIVE TRADING",
    liveAiTrading: "🤖 Live AI Trading",
    bankGradeSecurity: "Bank-grade security",
    instantProcessing: "Instant processing",
    guaranteed100: "100% guaranteed",
    withdrawalBreakdown: "💰 Withdrawal Breakdown",
    serviceCharge: "Service charge",
    sessionExpiresIn: "Session expires in:",
    websiteNotFound: "404 - Website Not Found",
    domainNoLongerExists: 'The domain "quickreturns.com" no longer exists',
    howScamsWork:
      "This is exactly how investment scams work. The scammers have vanished with your money, just like they do to thousands of people every day.",
    lostAnnuallyInIndia: "Lost annually in India",
    peopleAffectedYearly: "People affected yearly",
    redFlagsEncountered: "🚩 Red Flags You Encountered:",
    unrealisticReturns: "Unrealistic returns (300% in 7 days)",
    timePressure: "Time pressure and urgency tactics",
    fakeTestimonials: "Fake testimonials and social proof",
    processingFeesForWithdrawals: "Processing fees for withdrawals",
    unverifiedPlatform: "Unverified platform credentials",
    noRegulatoryCompliance: "No regulatory compliance info",
    achievementUnlocked: "🏆 Achievement Unlocked!",
    investmentFraudAwareness: "Investment Fraud Awareness - Level 1",
    howToProtectYourself: "🛡️ How to Protect Yourself:",
    neverInvestBasedOnSocialMedia: "Never invest based on social media posts",
    researchPlatformCompliance: "Research platform's regulatory compliance",
    beWaryOfGuaranteedReturns: "Be wary of guaranteed high returns",
    neverPayUpfrontFees: "Never pay upfront fees for withdrawals",
    verifyCompanyRegistration: "Verify company registration details",
    consultFinancialAdvisors: "Consult financial advisors before investing",
  },
  hi: {
    title: "निवेश धोखाधड़ी सिमुलेशन",
    subtitle: "सुरक्षित तरीके से घोटालों से अपनी सुरक्षा करना सीखें",
    startSimulation: "सीखना शुरू करें",
    playAudio: "🔊 सुनें",
    next: "अगला",
    continue: "जारी रखें",
    suspicious: "🚨 यह संदिग्ध लगता है",
    joinNow: "💰 अभी जुड़ें - 300% रिटर्न पाएं!",
    invest: "💸 अभी निवेश करें",
    withdraw: "💰 मुनाफा निकालें",
    payFee: "💳 प्रोसेसिंग फीस भुगतान करें",
    scamRevealed: "🚨 घोटाला उजागर!",
    tryAgain: "फिर से कोशिश करें",
    shareResults: "परिणाम साझा करें",
    yourScore: "आपका जागरूकता स्कोर",
    viewDashboard: "📊 डैशबोर्ड देखें",
    moreInfo: "ℹ️ और जानकारी चाहिए",
    refuseFee: "🚫 यह घोटाला है!",
    seeScore: "अपना स्कोर देखें",
    investmentConfirmed: "✅ निवेश की पुष्टि!",
    readyToWithdraw: "💰 निकालने के लिए तैयार?",
    processingFeeRequired: "⚠️ प्रोसेसिंग फीस आवश्यक",
    timeRemaining: "⏰ समय शेष",
    totalBalance: "💰 कुल बैलेंस",
    currentProfit: "📈 वर्तमान मुनाफा",
    quickStart: "⚡ त्वरित शुरुआत निवेश",
    guaranteed: "✅ 7 दिनों में गारंटीशुदा",
    availableForWithdrawal: "💰 निकासी के लिए उपलब्ध",
    customerSupport: "💬 ग्राहक सहायता",
    onlineNow: "🟢 अभी ऑनलाइन",
    websiteDisappeared: "💥 वेबसाइट गायब हो गई!",
    simulationComplete: "🎉 सिमुलेशन पूर्ण!",
    performanceDescription: "निवेश धोखाधड़ी की रणनीति के खिलाफ आपका प्रदर्शन",
    excellentDetector: "🏆 उत्कृष्ट - घोटाला डिटेक्टर!",
    goodStayAlert: "👍 अच्छा - सतर्क रहें",
    needsImprovement: "⚠️ सुधार की आवश्यकता",
    correctlyIdentified: "आपने सही तरीके से पहचाना",
    outOf: "में से",
    redFlagsText: "लाल झंडे",
    shareMessage: "मैंने अभी-अभी एक निवेश धोखाधड़ी सिमुलेशन पूरा किया है और घोटालों से अपनी सुरक्षा करना सीखा है! 🛡️",
    withdrawalAmount: "💰 निकासी राशि",
    processingFee: "💳 प्रोसेसिंग फीस",
    youllReceive: "✅ आपको मिलेगा",
    chooseLanguage: "🌍 अपनी भाषा चुनें",
    whatYoullLearn: "🎯 आप क्या सीखेंगे",
    safeEnvironment: "सुरक्षित वातावरण",
    noRealMoney: "कोई वास्तविक पैसा जोखिम में नहीं",
    realScenarios: "वास्तविक परिदृश्य",
    basedOnActualCases: "वास्तविक धोखाधड़ी के मामलों पर आधारित",
    getCertified: "प्रमाणित हों",
    earnAwarenessBadge: "अपना जागरूकता बैज अर्जित करें",
    lostAnnually: "वार्षिक नुकसान",
    peopleAffected: "प्रभावित लोग",
    successRate: "सफलता दर",
    progress: "प्रगति",
    step: "चरण",
    of: "का",
    complete: "पूर्ण",
    mostPopular: "सबसे लोकप्रिय",
    profit: "मुनाफा",
    investmentSummary: "📊 निवेश सारांश",
    investment: "💰 निवेश",
    expectedReturns: "📈 अपेक्षित रिटर्न",
    roi: "🎯 ROI",
    duration: "⏰ अवधि",
    status: "🟢 स्थिति",
    active: "सक्रिय",
    days: "दिन",
    whatHappensNext: "🚀 आगे क्या होता है:",
    aiAlgorithmStarts: "AI एल्गोरिदम तुरंत ट्रेडिंग शुरू करता है",
    realTimeProfitUpdates: "डैशबोर्ड में रियल-टाइम प्रॉफिट अपडेट",
    withdrawProfitsAnytime: "24 घंटे बाद कभी भी मुनाफा निकालें",
    getNotifications: "हर ट्रेड के लिए नोटिफिकेशन पाएं",
    myTradingDashboard: "💰 मेरा ट्रेडिंग डैशबोर्ड",
    realTimeAiResults: "रियल-टाइम AI परिणाम",
    liveTrading: "लाइव ट्रेडिंग",
    liveAiTrading: "🤖 लाइव AI ट्रेडिंग",
    bankGradeSecurity: "बैंक-ग्रेड सुरक्षा",
    instantProcessing: "तत्काल प्रसंस्करण",
    guaranteed100: "100% गारंटीशुदा",
    withdrawalBreakdown: "💰 निकासी विवरण",
    serviceCharge: "सेवा शुल्क",
    sessionExpiresIn: "सत्र समाप्त होता है:",
    websiteNotFound: "404 - वेबसाइट नहीं मिली",
    domainNoLongerExists: 'डोमेन "quickreturns.com" अब मौजूद नहीं है',
    howScamsWork:
      "यही तो निवेश घोटाले का काम करने का तरीका है। ठग आपके पैसे के साथ गायब हो गए हैं, बिल्कुल वैसे ही जैसे वे हर दिन हजारों लोगों के साथ करते हैं।",
    lostAnnuallyInIndia: "भारत में वार्षिक नुकसान",
    peopleAffectedYearly: "वार्षिक रूप से प्रभावित लोग",
    redFlagsEncountered: "🚩 आपके सामने आए लाल झंडे:",
    unrealisticReturns: "अवास्तविक रिटर्न (7 दिनों में 300%)",
    timePressure: "समय का दबाव और तात्कालिकता की रणनीति",
    fakeTestimonials: "नकली गवाही और सामाजिक प्रमाण",
    processingFeesForWithdrawals: "निकासी के लिए प्रसंस्करण शुल्क",
    unverifiedPlatform: "अत्यापित प्लेटफॉर्म क्रेडेंशियल",
    noRegulatoryCompliance: "कोई नियामक अनुपालन जानकारी नहीं",
    achievementUnlocked: "🏆 उपलब्धि अनलॉक!",
    investmentFraudAwareness: "निवेश धोखाधड़ी जागरूकता - स्तर 1",
    howToProtectYourself: "🛡️ अपनी सुरक्षा कैसे करें:",
    neverInvestBasedOnSocialMedia: "सोशल मीडिया पोस्ट के आधार पर कभी निवेश न करें",
    researchPlatformCompliance: "प्लेटफॉर्म के नियामक अनुपालन की जांच करें",
    beWaryOfGuaranteedReturns: "गारंटीशुदा उच्च रिटर्न से सावधान रहें",
    neverPayUpfrontFees: "निकासी के लिए कभी भी अग्रिम शुल्क न दें",
    verifyCompanyRegistration: "कंपनी पंजीकरण विवरण सत्यापित करें",
    consultFinancialAdvisors: "निवेश से पहले वित्तीय सलाहकारों से सलाह लें",
  },
  pa: {
    title: "ਨਿਵੇਸ਼ ਧੋਖਾਧੜੀ ਸਿਮੂਲੇਸ਼ਨ",
    subtitle: "ਸੁਰੱਖਿਤ ਤਰੀਕੇ ਨਾਲ ਘੁਟਾਲਿਆਂ ਤੋਂ ਆਪਣੀ ਸੁਰੱਖਿਆ ਕਰਨਾ ਸਿੱਖੋ",
    startSimulation: "ਸਿੱਖਣਾ ਸ਼ੁਰੂ ਕਰੋ",
    playAudio: "🔊 ਸੁਣੋ",
    next: "ਅਗਲਾ",
    continue: "ਜਾਰੀ ਰੱਖੋ",
    suspicious: "🚨 ਇਹ ਸ਼ੱਕੀ ਲੱਗਦਾ ਹੈ",
    joinNow: "💰 ਹੁਣੇ ਜੁੜੋ - 300% ਰਿਟਰਨ ਪਾਓ!",
    invest: "💸 ਹੁਣੇ ਨਿਵੇਸ਼ ਕਰੋ",
    withdraw: "💰 ਮੁਨਾਫਾ ਕੱਢੋ",
    payFee: "💳 ਪ੍ਰੋਸੈਸਿੰਗ ਫੀਸ ਭੁਗਤਾਨ ਕਰੋ",
    scamRevealed: "🚨 ਘੁਟਾਲਾ ਬੇਨਕਾਬ!",
    tryAgain: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    shareResults: "ਨਤੀਜੇ ਸਾਂਝੇ ਕਰੋ",
    yourScore: "ਤੁਹਾਡਾ ਜਾਗਰੂਕਤਾ ਸਕੋਰ",
    viewDashboard: "📊 ਡੈਸ਼ਬੋਰਡ ਦੇਖੋ",
    moreInfo: "ℹ️ ਹੋਰ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ",
    refuseFee: "🚫 ਇਹ ਘੁਟਾਲਾ ਹੈ!",
    seeScore: "ਆਪਣਾ ਸਕੋਰ ਦੇਖੋ",
    investmentConfirmed: "✅ ਨਿਵੇਸ਼ ਦੀ ਪੁਸ਼ਟੀ!",
    readyToWithdraw: "💰 ਕੱਢਣ ਲਈ ਤਿਆਰ?",
    processingFeeRequired: "⚠️ ਪ੍ਰੋਸੈਸਿੰਗ ਫੀਸ ਲੋੜੀਂਦੀ",
    timeRemaining: "⏰ ਬਾਕੀ ਸਮਾਂ",
    totalBalance: "💰 ਕੁੱਲ ਬੈਲੇਂਸ",
    currentProfit: "📈 ਮੌਜੂਦਾ ਮੁਨਾਫਾ",
    quickStart: "⚡ ਤੇਜ਼ ਸ਼ੁਰੂਆਤ ਨਿਵੇਸ਼",
    guaranteed: "✅ 7 ਦਿਨਾਂ ਵਿੱਚ ਗਾਰੰਟੀਸ਼ੁਦਾ",
    availableForWithdrawal: "💰 ਕੱਢਣ ਲਈ ਉਪਲਬਧ",
    customerSupport: "💬 ਗਾਹਕ ਸਹਾਇਤਾ",
    onlineNow: "🟢 ਹੁਣ ਔਨਲਾਈਨ",
    websiteDisappeared: "💥 ਵੈੱਬਸਾਈਟ ਗਾਇਬ ਹੋ ਗਈ!",
    simulationComplete: "🎉 ਸਿਮੂਲੇਸ਼ਨ ਪੂਰਾ!",
    performanceDescription: "ਨਿਵੇਸ਼ ਧੋਖਾਧੜੀ ਦੀ ਰਣਨੀਤੀ ਦੇ ਵਿਰੁੱਧ ਤੁਹਾਡਾ ਪ੍ਰਦਰਸ਼ਨ",
    excellentDetector: "🏆 ਸ਼ਾਨਦਾਰ - ਘੁਟਾਲਾ ਡਿਟੈਕਟਰ!",
    goodStayAlert: "👍 ਚੰਗਾ - ਸੁਚੇਤ ਰਹੋ",
    needsImprovement: "⚠️ ਸੁਧਾਰ ਦੀ ਲੋੜ",
    correctlyIdentified: "ਤੁਸੀਂ ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਪਛਾਣਿਆ",
    outOf: "ਵਿੱਚੋਂ",
    redFlagsText: "ਲਾਲ ਝੰਡੇ",
    shareMessage: "ਮੈਂ ਹੁਣੇ ਹੀ ਇੱਕ ਨਿਵੇਸ਼ ਧੋਖਾਧੜੀ ਸਿਮੂਲੇਸ਼ਨ ਪੂਰਾ ਕੀਤਾ ਹੈ ਅਤੇ ਘੁਟਾਲਿਆਂ ਤੋਂ ਆਪਣੀ ਸੁਰੱਖਿਆ ਕਰਨਾ ਸਿੱਖਿਆ ਹੈ! 🛡️",
    withdrawalAmount: "💰 ਕੱਢਣ ਦੀ ਰਕਮ",
    processingFee: "💳 ਪ੍ਰੋਸੈਸਿੰਗ ਫੀਸ",
    youllReceive: "✅ ਤੁਹਾਨੂੰ ਮਿਲੇਗਾ",
    chooseLanguage: "🌍 ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
    whatYoullLearn: "🎯 ਤੁਸੀਂ ਕੀ ਸਿੱਖੋਗੇ",
    safeEnvironment: "ਸੁਰੱਖਿਤ ਮਾਹੌਲ",
    noRealMoney: "ਕੋਈ ਅਸਲ ਪੈਸਾ ਜੋਖਮ ਵਿੱਚ ਨਹੀਂ",
    realScenarios: "ਅਸਲ ਦ੍ਰਿਸ਼",
    basedOnActualCases: "ਅਸਲ ਧੋਖਾਧੜੀ ਦੇ ਮਾਮਲਿਆਂ 'ਤੇ ਆਧਾਰਿਤ",
    getCertified: "ਪ੍ਰਮਾਣਿਤ ਹੋਵੋ",
    earnAwarenessBadge: "ਆਪਣਾ ਜਾਗਰੂਕਤਾ ਬੈਜ ਕਮਾਓ",
    lostAnnually: "ਸਾਲਾਨਾ ਨੁਕਸਾਨ",
    peopleAffected: "ਪ੍ਰਭਾਵਿਤ ਲੋਕ",
    successRate: "ਸਫਲਤਾ ਦਰ",
    progress: "ਤਰੱਕੀ",
    step: "ਕਦਮ",
    of: "ਦਾ",
    complete: "ਪੂਰਾ",
    mostPopular: "ਸਭ ਤੋਂ ਪ੍ਰਸਿੱਧ",
    profit: "ਮੁਨਾਫਾ",
    investmentSummary: "📊 ਨਿਵੇਸ਼ ਸਾਰ",
    investment: "💰 ਨਿਵੇਸ਼",
    expectedReturns: "📈 ਉਮੀਦ ਕੀਤੇ ਰਿਟਰਨ",
    roi: "🎯 ROI",
    duration: "⏰ ਮਿਆਦ",
    status: "🟢 ਸਥਿਤੀ",
    active: "ਸਰਗਰਮ",
    days: "ਦਿਨ",
    whatHappensNext: "🚀 ਅੱਗੇ ਕੀ ਹੁੰਦਾ ਹੈ:",
    aiAlgorithmStarts: "AI ਐਲਗੋਰਿਦਮ ਤੁਰੰਤ ਵਪਾਰ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ",
    realTimeProfitUpdates: "ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ ਰੀਅਲ-ਟਾਈਮ ਮੁਨਾਫਾ ਅਪਡੇਟ",
    withdrawProfitsAnytime: "24 ਘੰਟੇ ਬਾਅਦ ਕਿਸੇ ਵੀ ਸਮੇਂ ਮੁਨਾਫਾ ਕੱਢੋ",
    getNotifications: "ਹਰ ਵਪਾਰ ਲਈ ਸੂਚਨਾਵਾਂ ਪ੍ਰਾਪਤ ਕਰੋ",
    myTradingDashboard: "💰 ਮੇਰਾ ਵਪਾਰ ਡੈਸ਼ਬੋਰਡ",
    realTimeAiResults: "ਰੀਅਲ-ਟਾਈਮ AI ਨਤੀਜੇ",
    liveTrading: "ਲਾਈਵ ਵਪਾਰ",
    liveAiTrading: "🤖 ਲਾਈਵ AI ਵਪਾਰ",
    bankGradeSecurity: "ਬੈਂਕ-ਗ੍ਰੇਡ ਸੁਰੱਖਿਆ",
    instantProcessing: "ਤੁਰੰਤ ਪ੍ਰਕਿਰਿਆ",
    guaranteed100: "100% ਗਾਰੰਟੀਸ਼ੁਦਾ",
    withdrawalBreakdown: "💰 ਕੱਢਣ ਦਾ ਵਿਸਥਾਰ",
    serviceCharge: "ਸੇਵਾ ਸ਼ੁਲਕ",
    sessionExpiresIn: "ਸੈਸ਼ਨ ਖਤਮ ਹੁੰਦਾ ਹੈ:",
    websiteNotFound: "404 - ਵੈੱਬਸਾਈਟ ਨਹੀਂ ਮਿਲੀ",
    domainNoLongerExists: 'ਡੋਮੇਨ "quickreturns.com" ਹੁਣ ਮੌਜੂਦ ਨਹੀਂ ਹੈ',
    howScamsWork:
      "ਇਹੀ ਤਾਂ ਨਿਵੇਸ਼ ਘੁਟਾਲੇ ਦਾ ਕੰਮ ਕਰਨ ਦਾ ਤਰੀਕਾ ਹੈ। ਠੱਗ ਤੁਹਾਡੇ ਪੈਸੇ ਨਾਲ ਗਾਇਬ ਹੋ ਗਏ ਹਨ, ਬਿਲਕੁਲ ਉਸੇ ਤਰ੍ਹਾਂ ਜਿਵੇਂ ਉਹ ਹਰ ਦਿਨ ਹਜ਼ਾਰਾਂ ਲੋਕਾਂ ਨਾਲ ਕਰਦੇ ਹਨ।",
    lostAnnuallyInIndia: "ਭਾਰਤ ਵਿੱਚ ਸਾਲਾਨਾ ਨੁਕਸਾਨ",
    peopleAffectedYearly: "ਸਾਲਾਨਾ ਪ੍ਰਭਾਵਿਤ ਲੋਕ",
    redFlagsEncountered: "🚩 ਤੁਹਾਡੇ ਸਾਹਮਣੇ ਆਏ ਲਾਲ ਝੰਡੇ:",
    unrealisticReturns: "ਗੈਰ-ਵਾਜਬ ਰਿਟਰਨ (7 ਦਿਨਾਂ ਵਿੱਚ 300%)",
    timePressure: "ਸਮੇਂ ਦਾ ਦਬਾਅ ਅਤੇ ਤਾਤਕਾਲਿਕਤਾ ਦੀ ਰਣਨੀਤੀ",
    fakeTestimonials: "ਨਕਲੀ ਗਵਾਹੀਆਂ ਅਤੇ ਸਮਾਜਿਕ ਪ੍ਰਮਾਣ",
    processingFeesForWithdrawals: "ਕੱਢਣ ਲਈ ਪ੍ਰਕਿਰਿਆ ਫੀਸ",
    unverifiedPlatform: "ਗੈਰ-ਤਸਦੀਕਸ਼ੁਦਾ ਪਲੇਟਫਾਰਮ ਪ੍ਰਮਾਣ ਪੱਤਰ",
    noRegulatoryCompliance: "ਕੋਈ ਨਿਯਮਕ ਪਾਲਣਾ ਜਾਣਕਾਰੀ ਨਹੀਂ",
    achievementUnlocked: "🏆 ਪ੍ਰਾਪਤੀ ਅਨਲਾਕ!",
    investmentFraudAwareness: "ਨਿਵੇਸ਼ ਧੋਖਾਧੜੀ ਜਾਗਰੂਕਤਾ - ਪੱਧਰ 1",
    howToProtectYourself: "🛡️ ਆਪਣੀ ਸੁਰੱਖਿਆ ਕਿਵੇਂ ਕਰੋ:",
    neverInvestBasedOnSocialMedia: "ਸੋਸ਼ਲ ਮੀਡੀਆ ਪੋਸਟਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਕਦੇ ਨਿਵੇਸ਼ ਨਾ ਕਰੋ",
    researchPlatformCompliance: "ਪਲੇਟਫਾਰਮ ਦੀ ਨਿਯਮਕ ਪਾਲਣਾ ਦੀ ਖੋਜ ਕਰੋ",
    beWaryOfGuaranteedReturns: "ਗਾਰੰਟੀਸ਼ੁਦਾ ਉੱਚ ਰਿਟਰਨ ਤੋਂ ਸਾਵਧਾਨ ਰਹੋ",
    neverPayUpfrontFees: "ਕੱਢਣ ਲਈ ਕਦੇ ਵੀ ਪਹਿਲਾਂ ਤੋਂ ਫੀਸ ਨਾ ਦਿਓ",
    verifyCompanyRegistration: "ਕੰਪਨੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਵੇਰਵਿਆਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
    consultFinancialAdvisors: "ਨਿਵੇਸ਼ ਤੋਂ ਪਹਿਲਾਂ ਵਿੱਤੀ ਸਲਾਹਕਾਰਾਂ ਨਾਲ ਸਲਾਹ ਕਰੋ",
  },
}

// Safe translation function
const getTranslation = (key, language = "en") => {
  try {
    if (translations[language] && translations[language][key]) {
      return translations[language][key]
    }
    if (translations["en"] && translations["en"][key]) {
      return translations["en"][key]
    }
    return key
  } catch (error) {
    console.warn(`Translation error for key: ${key}, language: ${language}`, error)
    return key
  }
}

// Simple Icon Component
const Icon = ({ name, size = 24, color = COLORS.text, style = {} }) => {
  const iconMap = {
    shield: "🛡️",
    chart: "📊",
    trending: "📈",
    wallet: "💰",
    play: "▶️",
    check: "✅",
    warning: "⚠️",
    error: "❌",
    rocket: "🚀",
    eye: "👁️",
    trophy: "🏆",
    star: "⭐",
    heart: "❤️",
    comment: "💭",
    share: "📤",
    verified: "✅",
    timer: "⏰",
    live: "🔴",
    robot: "🤖",
    bell: "🔔",
    flash: "⚡",
    lock: "🔒",
    boom: "💥",
    party: "🎉",
    crown: "👑",
    medal: "🏅",
    target: "🎯",
    flag: "🚩",
    refresh: "🔄",
    arrow: "➡️",
    info: "ℹ️",
    block: "🚫",
    payment: "💳",
    dashboard: "📊",
  }

  return (
    <Text style={[{ fontSize: size, color, textAlign: "center", lineHeight: size * 1.2 }, style]}>
      {iconMap[name] || "•"}
    </Text>
  )
}

// Responsive Button Component
const SimpleButton = ({
  title,
  onPress,
  style = {},
  variant = "primary",
  size = "medium",
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button]

    if (fullWidth) baseStyle.push(styles.buttonFullWidth)
    if (disabled) baseStyle.push(styles.buttonDisabled)

    switch (size) {
      case "small":
        baseStyle.push(styles.buttonSmall)
        break
      case "large":
        baseStyle.push(styles.buttonLarge)
        break
      default:
        baseStyle.push(styles.buttonMedium)
    }

    switch (variant) {
      case "secondary":
        baseStyle.push(styles.buttonSecondary)
        break
      case "warning":
        baseStyle.push(styles.buttonWarning)
        break
      case "error":
        baseStyle.push(styles.buttonError)
        break
      default:
        baseStyle.push(styles.buttonPrimary)
    }

    return baseStyle
  }

  const getTextColor = () => {
    if (disabled) return COLORS.textMuted
    if (variant === "secondary") return COLORS.lightGreen
    return COLORS.white
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[...getButtonStyle(), style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <Icon name="refresh" size={size === "large" ? 20 : 16} color={getTextColor()} />
        ) : (
          icon && (
            <Icon name={icon} size={size === "large" ? 20 : 16} color={getTextColor()} style={{ marginRight: 8 }} />
          )
        )}
        <Text style={[styles.buttonText, { color: getTextColor(), fontSize: size === "large" ? 16 : 14 }]}>
          {loading ? "Loading..." : title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

// Progress Indicator
const ProgressIndicator = ({ currentStep, totalSteps = 8 }) => {
  const progress = (currentStep / (totalSteps - 1)) * 100

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>🎯 {getTranslation("progress")}</Text>
        <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {getTranslation("step")} {currentStep + 1} {getTranslation("of")} {totalSteps} • {Math.round(progress)}%{" "}
        {getTranslation("complete")}
      </Text>
    </View>
  )
}

// Main App Component
function InvestmentFraudSimulation() {
  const [currentStep, setCurrentStep] = useState(STEPS.INTRO)
  const [userChoices, setUserChoices] = useState([])
  const [investmentAmount, setInvestmentAmount] = useState(0)
  const [fakeBalance, setFakeBalance] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300)
  const [withdrawalTimeLeft, setWithdrawalTimeLeft] = useState(1800)
  const [showWarning, setShowWarning] = useState(false)
  const [userAwareness, setUserAwareness] = useState(0)
  const [language, setLanguage] = useState("en")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationText, setNotificationText] = useState("")

  // Use the existing AudioContext
  const { playAudio, stopAudio, isPlaying, setCurrentLanguage } = useAudio()

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current
  const balanceGrowAnim = useRef(new Animated.Value(1)).current
  const notificationAnim = useRef(new Animated.Value(-100)).current

  // Safe translation function
  const t = (key) => getTranslation(key, language)

  // Update audio language when language changes
  useEffect(() => {
    if (setCurrentLanguage) {
      setCurrentLanguage(language)
    }
  }, [language, setCurrentLanguage])

  // Pulse animation
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    )
    pulseAnimation.start()
    return () => pulseAnimation.stop()
  }, [])

  // Timer effects
  useEffect(() => {
    if (currentStep === STEPS.SOCIAL_PROOF && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, currentStep])

  useEffect(() => {
    if (currentStep === STEPS.WITHDRAWAL_TRAP && withdrawalTimeLeft > 0) {
      const timer = setTimeout(() => setWithdrawalTimeLeft(withdrawalTimeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [withdrawalTimeLeft, currentStep])

  // Fake balance animation
  useEffect(() => {
    if (currentStep === STEPS.FAKE_RETURNS && investmentAmount > 0) {
      const interval = setInterval(() => {
        setFakeBalance((prev) => {
          const increase = Math.random() * 1000 + 500
          const newBalance = prev + increase

          showProfitNotification(`+₹${Math.floor(increase).toLocaleString()} profit!`)

          Animated.sequence([
            Animated.timing(balanceGrowAnim, {
              toValue: 1.1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(balanceGrowAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start()

          return newBalance
        })
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [currentStep, investmentAmount])

  const showProfitNotification = (text) => {
    setNotificationText(text)
    setShowNotification(true)

    Animated.sequence([
      Animated.timing(notificationAnim, {
        toValue: 50,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(notificationAnim, {
        toValue: -100,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowNotification(false)
    })
  }

  const handleChoice = (choice, awarenessPoints = 0) => {
    setUserChoices([...userChoices, choice])
    setUserAwareness((prev) => prev + awarenessPoints)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const shareResults = async () => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync("", {
          mimeType: "text/plain",
          dialogTitle: t("shareResults"),
        })
      } else {
        await Clipboard.setStringAsync(t("shareMessage"))
        Alert.alert("Success", "Results copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const renderIntroStep = () => (
    <View style={styles.stepContainer}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient colors={[COLORS.lightGreen, COLORS.lightGreenLight]} style={styles.heroGradient}>
            <Animated.View style={[styles.heroIcon, { transform: [{ scale: pulseAnim }] }]}>
              <Icon name="shield" size={isTablet ? 100 : 80} color={COLORS.white} />
            </Animated.View>
            <Text style={styles.heroTitle}>{t("title")}</Text>
            <Text style={styles.heroSubtitle}>{t("subtitle")}</Text>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>₹50,000 Cr</Text>
                <Text style={styles.statLabel}>{t("lostAnnually")}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>2.5 Lakh</Text>
                <Text style={styles.statLabel}>{t("peopleAffected")}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>95%</Text>
                <Text style={styles.statLabel}>{t("successRate")}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Language Selection */}
        <View style={styles.languageSection}>
          <Text style={styles.sectionTitle}>{t("chooseLanguage")}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageScroll}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.value}
                style={[styles.languageButton, language === lang.value && styles.languageButtonActive]}
                onPress={() => setLanguage(lang.value)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[styles.languageText, language === lang.value && styles.languageTextActive]}>
                  {lang.nativeName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>{t("whatYoullLearn")}</Text>
          {[
            { icon: "shield", title: t("safeEnvironment"), desc: t("noRealMoney") },
            { icon: "eye", title: t("realScenarios"), desc: t("basedOnActualCases") },
            { icon: "trophy", title: t("getCertified"), desc: t("earnAwarenessBadge") },
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Icon name={feature.icon} size={24} color={COLORS.white} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <SimpleButton
            title={t("playAudio")}
            onPress={() => playAudio(0, language)}
            variant="secondary"
            icon="play"
            size="large"
            fullWidth
            loading={isPlaying}
          />
          <SimpleButton
            title={t("startSimulation")}
            onPress={() => {
              setCurrentStep(STEPS.SOCIAL_PROOF)
              playAudio(1, language)
            }}
            variant="primary"
            icon="rocket"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  )

  const renderSocialProofStep = () => (
    <View style={styles.stepContainer}>
      <ProgressIndicator currentStep={currentStep} />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Social Media Post */}
        <View style={styles.socialCard}>
          {/* Post Header */}
          <View style={styles.postHeader}>
            <View style={styles.profileSection}>
              <View style={styles.profilePicture}>
                <Text style={styles.profileInitials}>QR</Text>
              </View>
              <View style={styles.profileInfo}>
                <View style={styles.profileNameRow}>
                  <Text style={styles.profileName}>quickreturns_official</Text>
                  <Icon name="verified" size={16} color={COLORS.lightGreen} />
                </View>
                <Text style={styles.profileLocation}>Mumbai, India • Sponsored</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>

          {/* Post Image */}
          <View style={styles.postImageContainer}>
            <LinearGradient colors={[COLORS.lightGreen, COLORS.lightGreenLight]} style={styles.postImage}>
              <Icon name="chart" size={60} color={COLORS.white} />
              <Text style={styles.postImageText}>💰 LIVE TRADING RESULTS 💰</Text>
            </LinearGradient>
          </View>

          {/* Post Content */}
          <View style={styles.postContent}>
            <Text style={styles.likesText}>
              <Text style={styles.boldText}>2,847 likes</Text>
            </Text>
            <Text style={styles.postCaption}>
              <Text style={styles.boldText}>quickreturns_official</Text> 🚀 BREAKING: Our AI just hit another milestone!
              Members seeing incredible returns in DAYS! 💰{"\n\n"}✅ Sarah: ₹2,50,000 profit in 3 days!
              {"\n"}✅ Rajesh: ₹1,80,000 in first week!
              {"\n"}✅ Priya: ₹3,20,000 in 5 days!
            </Text>
          </View>

          {/* Urgency Timer */}
          <Animated.View style={[styles.urgencyTimer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.urgencyContent}>
              <Icon name="timer" size={20} color={COLORS.error} />
              <Text style={styles.urgencyText}>
                🔥 LIMITED TIME: Only {Math.floor(Math.random() * 15) + 5} spots left!
              </Text>
              <Text style={styles.urgencyTime}>{formatTime(timeLeft)}</Text>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <View style={styles.postActions}>
            <SimpleButton
              title={t("playAudio")}
              onPress={() => playAudio(1, language)}
              variant="secondary"
              size="medium"
              fullWidth
              loading={isPlaying}
              icon="play"
            />
            <SimpleButton
              title={t("joinNow")}
              onPress={() => {
                handleChoice("joined_group", -1)
                setCurrentStep(STEPS.FAKE_PLATFORM)
                playAudio(2, language)
              }}
              variant="primary"
              icon="rocket"
              size="large"
              fullWidth
            />
            <SimpleButton
              title={t("suspicious")}
              onPress={() => {
                handleChoice("suspicious", 2)
                setShowWarning(true)
              }}
              variant="warning"
              icon="warning"
              size="medium"
              fullWidth
            />
          </View>

          {/* Warning Message */}
          {showWarning && (
            <View style={styles.warningMessage}>
              <Icon name="check" size={24} color={COLORS.lightGreen} />
              <Text style={styles.warningText}>
                🎯 Excellent instinct! You spotted the red flags: unrealistic returns, time pressure, and fake
                testimonials.
              </Text>
              <SimpleButton
                title={t("continue")}
                onPress={() => {
                  setCurrentStep(STEPS.FAKE_PLATFORM)
                  setShowWarning(false)
                  playAudio(2, language)
                }}
                variant="primary"
                icon="arrow"
                size="medium"
                fullWidth
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )

  const renderFakePlatformStep = () => (
    <View style={styles.stepContainer}>
      <ProgressIndicator currentStep={currentStep} />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Trading Platform */}
        <View style={styles.tradingPlatform}>
          {/* Platform Header */}
          <View style={styles.platformHeader}>
            <View style={styles.platformTitleSection}>
              <Icon name="trending" size={32} color={COLORS.lightGreen} />
              <View style={styles.platformTitleInfo}>
                <Text style={styles.platformTitle}>QuickReturns Pro</Text>
                <Text style={styles.platformSubtitle}>AI Trading Platform</Text>
                <View style={styles.platformRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon key={star} name="star" size={12} color={COLORS.lightGreen} />
                  ))}
                  <Text style={styles.ratingText}>4.9 (2.3k reviews)</Text>
                </View>
              </View>
            </View>
            <Animated.View style={[styles.liveIndicator, { opacity: pulseAnim }]}>
              <Icon name="live" size={8} color={COLORS.error} />
              <Text style={styles.liveText}>LIVE</Text>
            </Animated.View>
          </View>

          {/* Investment Packages */}
          <View style={styles.investmentSection}>
            <Text style={styles.investmentTitle}>🚀 {t("quickStart")}</Text>
            <View style={styles.roiBanner}>
              <Text style={styles.roiBannerText}>300% ROI {t("guaranteed")}</Text>
            </View>

            {[
              { amount: "₹5,000", returns: "₹15,000", popular: false, roi: "200%" },
              { amount: "₹10,000", returns: "₹30,000", popular: true, roi: "300%" },
              { amount: "₹25,000", returns: "₹75,000", popular: false, roi: "300%" },
            ].map((pkg, index) => (
              <View key={index} style={[styles.investmentPackage, pkg.popular && styles.popularPackage]}>
                {pkg.popular && (
                  <View style={styles.popularBadge}>
                    <Icon name="crown" size={12} color={COLORS.white} />
                    <Text style={styles.popularBadgeText}>{t("mostPopular")}</Text>
                  </View>
                )}
                <View style={styles.packageContent}>
                  <View style={styles.packageLeft}>
                    <Text style={styles.packageAmount}>{pkg.amount}</Text>
                    <Text style={styles.packageReturns}>→ {pkg.returns}</Text>
                    <Text style={styles.packageProfit}>
                      {t("profit")}: ₹
                      {(
                        Number.parseInt(pkg.returns.replace(/[₹,]/g, "")) -
                        Number.parseInt(pkg.amount.replace(/[₹,]/g, ""))
                      ).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.packageRight}>
                    <View style={styles.roiBadge}>
                      <Text style={styles.roiText}>{pkg.roi}</Text>
                    </View>
                    <SimpleButton
                      title={t("invest")}
                      onPress={() => {
                        setInvestmentAmount(Number.parseInt(pkg.amount.replace(/[₹,]/g, "")))
                        handleChoice(`invested_${pkg.amount}`, pkg.popular ? -2 : -1)
                        setCurrentStep(STEPS.INVESTMENT)
                        playAudio(3, language)
                      }}
                      variant={pkg.popular ? "primary" : "secondary"}
                      size="small"
                      icon="wallet"
                    />
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.platformActions}>
              <SimpleButton
                title={t("playAudio")}
                onPress={() => playAudio(2, language)}
                variant="secondary"
                size="medium"
                fullWidth
                loading={isPlaying}
                icon="play"
              />
              <TouchableOpacity
                onPress={() => {
                  handleChoice("declined_investment", 3)
                  setShowWarning(true)
                }}
                style={styles.moreInfoButton}
              >
                <Icon name="info" size={16} color={COLORS.lightGreen} />
                <Text style={styles.moreInfoText}>{t("moreInfo")}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Warning Message */}
          {showWarning && (
            <View style={styles.warningMessage}>
              <Icon name="check" size={24} color={COLORS.lightGreen} />
              <Text style={styles.warningText}>
                🎯 Smart move! Asking for more information is always wise. Real platforms provide detailed
                documentation.
              </Text>
              <SimpleButton
                title={t("continue")}
                onPress={() => {
                  setCurrentStep(STEPS.INVESTMENT)
                  setShowWarning(false)
                  playAudio(3, language)
                }}
                variant="primary"
                icon="arrow"
                size="medium"
                fullWidth
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )

  const renderInvestmentStep = () => (
    <View style={styles.stepContainer}>
      <ProgressIndicator currentStep={currentStep} />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Investment Confirmation */}
        <View style={styles.confirmationContainer}>
          <Animated.View style={[styles.successAnimation, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.successIcon}>
              <Icon name="check" size={60} color={COLORS.lightGreen} />
            </View>
          </Animated.View>

          <Text style={styles.confirmationTitle}>{t("investmentConfirmed")}</Text>
          <Text style={styles.confirmationSubtitle}>
            Your ₹{investmentAmount.toLocaleString()} investment is now active!
          </Text>

          {/* Investment Summary */}
          <View style={styles.investmentSummary}>
            <Text style={styles.summaryTitle}>{t("investmentSummary")}</Text>
            {[
              { label: t("investment"), value: `₹${investmentAmount.toLocaleString()}`, color: COLORS.text },
              {
                label: t("expectedReturns"),
                value: `₹${(investmentAmount * 3).toLocaleString()}`,
                color: COLORS.lightGreen,
              },
              { label: t("roi"), value: "300%", color: COLORS.lightGreen },
              { label: t("duration"), value: `7 ${t("days")}`, color: COLORS.text },
              { label: t("status"), value: t("active"), color: COLORS.lightGreen },
            ].map((item, index) => (
              <View key={index} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{item.label}</Text>
                <Text style={[styles.summaryValue, { color: item.color }]}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* What Happens Next */}
          <View style={styles.nextStepsContainer}>
            <Text style={styles.nextStepsTitle}>{t("whatHappensNext")}</Text>
            {[
              { icon: "robot", text: t("aiAlgorithmStarts") },
              { icon: "chart", text: t("realTimeProfitUpdates") },
              { icon: "wallet", text: t("withdrawProfitsAnytime") },
              { icon: "bell", text: t("getNotifications") },
            ].map((step, index) => (
              <View key={index} style={styles.nextStepItem}>
                <View style={styles.nextStepIcon}>
                  <Icon name={step.icon} size={16} color={COLORS.white} />
                </View>
                <Text style={styles.nextStepText}>{step.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.confirmationActions}>
            <SimpleButton
              title={t("playAudio")}
              onPress={() => playAudio(3, language)}
              variant="secondary"
              size="medium"
              fullWidth
              loading={isPlaying}
              icon="play"
            />
            <SimpleButton
              title={t("viewDashboard")}
              onPress={() => {
                setFakeBalance(investmentAmount)
                setCurrentStep(STEPS.FAKE_RETURNS)
                playAudio(4, language)
              }}
              variant="primary"
              icon="dashboard"
              size="large"
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )

  const renderFakeReturnsStep = () => (
    <View style={styles.stepContainer}>
      <ProgressIndicator currentStep={currentStep} />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Trading Dashboard */}
        <View style={styles.tradingDashboard}>
          {/* Dashboard Header */}
          <View style={styles.dashboardHeader}>
            <View style={styles.dashboardTitleSection}>
              <Text style={styles.dashboardTitle}>{t("myTradingDashboard")}</Text>
              <Text style={styles.dashboardSubtitle}>{t("realTimeAiResults")}</Text>
              <Animated.View style={[styles.liveIndicator, { opacity: pulseAnim }]}>
                <Icon name="live" size={8} color={COLORS.error} />
                <Text style={styles.liveText}>{t("liveTrading")}</Text>
              </Animated.View>
            </View>
            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>{t("totalBalance")}</Text>
              <Animated.Text style={[styles.balanceAmount, { transform: [{ scale: balanceGrowAnim }] }]}>
                ₹{Math.floor(fakeBalance).toLocaleString()}
              </Animated.Text>
              <Text style={styles.balanceProfit}>
                +₹{Math.floor(fakeBalance - investmentAmount).toLocaleString()}(
                {Math.floor(((fakeBalance - investmentAmount) / investmentAmount) * 100)}%)
              </Text>
            </View>
          </View>

          {/* Live Trading Activity */}
          <View style={styles.tradingActivity}>
            <Text style={styles.activityTitle}>{t("liveAiTrading")}</Text>
            {[
              { pair: "BTC/USD", action: "BUY", profit: "+₹2,450", time: "2m ago", success: true },
              { pair: "ETH/USD", action: "SELL", profit: "+₹1,890", time: "5m ago", success: true },
              { pair: "ADA/USD", action: "BUY", profit: "+₹3,200", time: "8m ago", success: true },
            ].map((trade, index) => (
              <View key={index} style={styles.tradeItem}>
                <View style={styles.tradeLeft}>
                  <Text style={styles.tradePair}>{trade.pair}</Text>
                  <Text style={styles.tradeTime}>{trade.time}</Text>
                </View>
                <View style={styles.tradeCenter}>
                  <View
                    style={[
                      styles.tradeAction,
                      { backgroundColor: trade.action === "BUY" ? COLORS.lightGreen : COLORS.lightGreenLight },
                    ]}
                  >
                    <Text style={styles.tradeActionText}>{trade.action}</Text>
                  </View>
                </View>
                <View style={styles.tradeRight}>
                  <Text style={styles.tradeProfit}>{trade.profit}</Text>
                  <Icon name="check" size={12} color={COLORS.lightGreen} />
                </View>
              </View>
            ))}
          </View>

          {/* Withdrawal Section */}
          <View style={styles.withdrawalSection}>
            <View style={styles.withdrawalHeader}>
              <Icon name="wallet" size={32} color={COLORS.lightGreen} />
              <Text style={styles.withdrawalTitle}>{t("readyToWithdraw")}</Text>
            </View>

            <Animated.Text style={[styles.withdrawalAmount, { transform: [{ scale: balanceGrowAnim }] }]}>
              ₹{Math.floor(fakeBalance - investmentAmount).toLocaleString()}
            </Animated.Text>

            <Text style={styles.withdrawalSubtext}>{t("availableForWithdrawal")}</Text>

            {/* Security Features */}
            <View style={styles.securityFeatures}>
              {[
                { icon: "shield", text: t("bankGradeSecurity") },
                { icon: "flash", text: t("instantProcessing") },
                { icon: "lock", text: t("guaranteed100") },
              ].map((feature, index) => (
                <View key={index} style={styles.securityFeature}>
                  <Icon name={feature.icon} size={14} color={COLORS.lightGreen} />
                  <Text style={styles.securityText}>{feature.text}</Text>
                </View>
              ))}
            </View>

            <View style={styles.withdrawalActions}>
              <SimpleButton
                title={t("playAudio")}
                onPress={() => playAudio(4, language)}
                variant="secondary"
                size="medium"
                fullWidth
                loading={isPlaying}
                icon="play"
              />
              <SimpleButton
                title={t("withdraw")}
                onPress={() => {
                  handleChoice("attempted_withdrawal", -1)
                  setCurrentStep(STEPS.WITHDRAWAL_TRAP)
                  playAudio(5, language)
                }}
                variant="primary"
                icon="wallet"
                size="large"
                fullWidth
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Profit Notification */}
      {showNotification && (
        <Animated.View style={[styles.profitNotification, { transform: [{ translateY: notificationAnim }] }]}>
          <View style={styles.notificationContent}>
            <Icon name="trending" size={20} color={COLORS.lightGreen} />
            <Text style={styles.notificationText}>{notificationText}</Text>
          </View>
        </Animated.View>
      )}
    </View>
  )

  const renderWithdrawalTrapStep = () => (
    <View style={styles.stepContainer}>
      <ProgressIndicator currentStep={currentStep} />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Customer Support Chat */}
        <View style={styles.supportChat}>
          <View style={styles.supportHeader}>
            <View style={styles.supportProfile}>
              <View style={styles.supportAvatar}>
                <Text style={styles.supportAvatarText}>CS</Text>
              </View>
              <View style={styles.supportInfo}>
                <Text style={styles.supportName}>{t("customerSupport")}</Text>
                <View style={styles.supportStatus}>
                  <Animated.View style={[styles.onlineDot, { opacity: pulseAnim }]} />
                  <Text style={styles.supportStatusText}>{t("onlineNow")}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Chat Messages */}
          <View style={styles.chatMessages}>
            <View style={styles.supportMessage}>
              <Text style={styles.supportMessageText}>
                Hello! I see you're trying to withdraw ₹{Math.floor(fakeBalance - investmentAmount).toLocaleString()}.
                Due to new RBI regulations, we need a small processing fee to complete your withdrawal.
              </Text>
              <Text style={styles.messageTime}>Just now</Text>
            </View>
          </View>

          {/* Fee Payment Request */}
          <View style={styles.feeRequest}>
            <View style={styles.feeHeader}>
              <Icon name="warning" size={24} color={COLORS.error} />
              <Text style={styles.feeTitle}>{t("processingFeeRequired")}</Text>
            </View>

            {/* Fee Breakdown */}
            <View style={styles.feeBreakdown}>
              <Text style={styles.breakdownTitle}>{t("withdrawalBreakdown")}</Text>
              {[
                {
                  label: t("withdrawalAmount"),
                  value: `₹${Math.floor(fakeBalance - investmentAmount).toLocaleString()}`,
                  color: COLORS.text,
                },
                { label: t("processingFee"), value: "₹2,999", color: COLORS.error },
                { label: t("serviceCharge"), value: "₹500", color: COLORS.error },
              ].map((item, index) => (
                <View key={index} style={styles.feeRow}>
                  <Text style={styles.feeLabel}>{item.label}</Text>
                  <Text style={[styles.feeValue, { color: item.color }]}>{item.value}</Text>
                </View>
              ))}

              <View style={styles.feeSeparator} />

              <View style={styles.feeRow}>
                <Text style={styles.feeTotalLabel}>{t("youllReceive")}</Text>
                <Text style={styles.feeTotalValue}>
                  ₹{Math.floor(fakeBalance - investmentAmount - 3499).toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Urgency Timer */}
            <View style={styles.urgencySection}>
              <View style={styles.urgencyBanner}>
                <Icon name="timer" size={16} color={COLORS.error} />
                <Text style={styles.urgencyText}>
                  {t("sessionExpiresIn")} {formatTime(withdrawalTimeLeft)}
                </Text>
              </View>
            </View>

            <View style={styles.feeActions}>
              <SimpleButton
                title={t("playAudio")}
                onPress={() => playAudio(5, language)}
                variant="secondary"
                size="medium"
                fullWidth
                loading={isPlaying}
                icon="play"
              />
              <SimpleButton
                title={`${t("payFee")} (₹3,499)`}
                onPress={() => {
                  handleChoice("paid_processing_fee", -3)
                  setCurrentStep(STEPS.SCAM_REVEALED)
                  playAudio(6, language)
                }}
                variant="error"
                icon="payment"
                size="large"
                fullWidth
              />
              <SimpleButton
                title={t("refuseFee")}
                onPress={() => {
                  handleChoice("refused_fee", 3)
                  setCurrentStep(STEPS.SCAM_REVEALED)
                  playAudio(6, language)
                }}
                variant="warning"
                icon="block"
                size="medium"
                fullWidth
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )

  const renderScamRevealedStep = () => (
    <View style={styles.stepContainer}>
      <ProgressIndicator currentStep={currentStep} />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Scam Revelation */}
        <View style={styles.scamRevelation}>
          <Animated.View style={[styles.scamIcon, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.scamIconContainer}>
              <Icon name="boom" size={80} color={COLORS.error} />
            </View>
          </Animated.View>

          <Text style={styles.scamTitle}>{t("scamRevealed")}</Text>
          <Text style={styles.scamSubtitle}>{t("websiteDisappeared")}</Text>

          {/* Broken Website Effect */}
          <View style={styles.brokenWebsite}>
            <Text style={styles.brokenText}>{t("websiteNotFound")}</Text>
            <Text style={styles.brokenSubtext}>{t("domainNoLongerExists")}</Text>
          </View>

          <Text style={styles.scamDescription}>{t("howScamsWork")}</Text>

          {/* Scam Statistics */}
          <View style={styles.scamStats}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>₹50,000 Cr</Text>
              <Text style={styles.statLabel}>{t("lostAnnuallyInIndia")}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2.5 Lakh</Text>
              <Text style={styles.statLabel}>{t("peopleAffectedYearly")}</Text>
            </View>
          </View>

          {/* Red Flags Revealed */}
          <View style={styles.redFlagsSection}>
            <Text style={styles.redFlagsTitle}>{t("redFlagsEncountered")}</Text>
            {[
              t("unrealisticReturns"),
              t("timePressure"),
              t("fakeTestimonials"),
              t("processingFeesForWithdrawals"),
              t("unverifiedPlatform"),
              t("noRegulatoryCompliance"),
            ].map((flag, index) => (
              <View key={index} style={styles.redFlagItem}>
                <Icon name="flag" size={16} color={COLORS.error} />
                <Text style={styles.redFlagText}>{flag}</Text>
              </View>
            ))}
          </View>

          <SimpleButton
            title={t("seeScore")}
            onPress={() => {
              setCurrentStep(STEPS.RESULTS)
              playAudio(7, language)
            }}
            variant="primary"
            icon="trophy"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  )

  const renderResultsStep = () => {
    const maxScore = 10
    const scorePercentage = (userAwareness / maxScore) * 100
    const getScoreColor = () => {
      if (scorePercentage >= 80) return COLORS.lightGreen
      if (scorePercentage >= 60) return COLORS.warning
      return COLORS.error
    }
    const getScoreLabel = () => {
      if (scorePercentage >= 80) return t("excellentDetector")
      if (scorePercentage >= 60) return t("goodStayAlert")
      return t("needsImprovement")
    }
    const getBadgeIcon = () => {
      if (scorePercentage >= 80) return "crown"
      if (scorePercentage >= 60) return "medal"
      return "target"
    }

    return (
      <View style={styles.stepContainer}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Results Header */}
          <View style={styles.resultsHeader}>
            <LinearGradient colors={[COLORS.lightGreen, COLORS.lightGreenLight]} style={styles.resultsGradient}>
              <Icon name="party" size={60} color={COLORS.white} />
              <Text style={styles.resultsTitle}>{t("simulationComplete")}</Text>
              <Text style={styles.resultsSubtitle}>{t("performanceDescription")}</Text>
            </LinearGradient>
          </View>

          {/* Score Display */}
          <View style={styles.scoreDisplay}>
            <Text style={styles.scoreTitle}>{t("yourScore")}</Text>

            <Animated.View style={[styles.scoreCircle, { transform: [{ scale: pulseAnim }] }]}>
              <View style={[styles.scoreGradient, { backgroundColor: getScoreColor() }]}>
                <Text style={styles.scoreValue}>{userAwareness}</Text>
                <Text style={styles.scoreMaxValue}>/{maxScore}</Text>
              </View>
            </Animated.View>

            <Text style={[styles.scoreLabel, { color: getScoreColor() }]}>{getScoreLabel()}</Text>

            {/* Progress Bar */}
            <View style={styles.scoreProgress}>
              <View style={styles.scoreProgressTrack}>
                <View
                  style={[styles.scoreProgressFill, { width: `${scorePercentage}%`, backgroundColor: getScoreColor() }]}
                />
              </View>
              <Text style={styles.scorePercentage}>{Math.round(scorePercentage)}%</Text>
            </View>

            <Text style={styles.scoreDescription}>
              {t("correctlyIdentified")} {userAwareness} {t("outOf")} {maxScore} {t("redFlagsText")}
            </Text>
          </View>

          {/* Achievement Badge */}
          <View style={styles.achievementBadge}>
            <View style={[styles.badgeGradient, { backgroundColor: getScoreColor() }]}>
              <Icon name={getBadgeIcon()} size={40} color={COLORS.white} />
              <Text style={styles.badgeTitle}>{t("achievementUnlocked")}</Text>
              <Text style={styles.badgeSubtitle}>{t("investmentFraudAwareness")}</Text>
            </View>
          </View>

          {/* Protection Tips */}
          <View style={styles.protectionTips}>
            <Text style={styles.tipsTitle}>{t("howToProtectYourself")}</Text>
            {[
              t("neverInvestBasedOnSocialMedia"),
              t("researchPlatformCompliance"),
              t("beWaryOfGuaranteedReturns"),
              t("neverPayUpfrontFees"),
              t("verifyCompanyRegistration"),
              t("consultFinancialAdvisors"),
            ].map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Icon name="shield" size={16} color={COLORS.lightGreen} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.resultsActions}>
            <SimpleButton
              title={t("tryAgain")}
              onPress={() => {
                // Reset simulation
                setCurrentStep(STEPS.INTRO)
                setUserChoices([])
                setInvestmentAmount(0)
                setFakeBalance(0)
                setUserAwareness(0)
                setShowWarning(false)
                setTimeLeft(300)
                setWithdrawalTimeLeft(1800)
              }}
              variant="warning"
              icon="refresh"
              size="large"
              fullWidth
            />
            <SimpleButton
              title={t("shareResults")}
              onPress={shareResults}
              variant="primary"
              icon="share"
              size="large"
              fullWidth
            />
          </View>
        </ScrollView>
      </View>
    )
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.INTRO:
        return renderIntroStep()
      case STEPS.SOCIAL_PROOF:
        return renderSocialProofStep()
      case STEPS.FAKE_PLATFORM:
        return renderFakePlatformStep()
      case STEPS.INVESTMENT:
        return renderInvestmentStep()
      case STEPS.FAKE_RETURNS:
        return renderFakeReturnsStep()
      case STEPS.WITHDRAWAL_TRAP:
        return renderWithdrawalTrapStep()
      case STEPS.SCAM_REVEALED:
        return renderScamRevealedStep()
      case STEPS.RESULTS:
        return renderResultsStep()
      default:
        return renderIntroStep()
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.lightGreen} />
      {renderCurrentStep()}
    </View>
  )
}

// Export the main component
export default InvestmentFraudSimulation

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  stepContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: isTablet ? 32 : isSmall ? 16 : 20,
    paddingBottom: 40,
  },

  // Button Styles
  button: {
    borderRadius: 12,
    marginVertical: 6,
    overflow: "hidden",
    elevation: 3,
    shadowColor: COLORS.overlay,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonPrimary: {
    backgroundColor: COLORS.lightGreen,
  },
  buttonSecondary: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.lightGreen,
  },
  buttonWarning: {
    backgroundColor: COLORS.warning,
  },
  buttonError: {
    backgroundColor: COLORS.error,
  },
  buttonSmall: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonMedium: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  buttonLarge: {
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonFullWidth: {
    width: "100%",
  },

  // Progress Indicator Styles
  progressContainer: {
    paddingHorizontal: isTablet ? 32 : 20,
    paddingVertical: 20,
    backgroundColor: COLORS.lightGreen,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "800",
    color: COLORS.white,
  },
  progressPercentage: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "800",
    color: COLORS.white,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  progressText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    textAlign: "center",
  },

  // Hero Section Styles
  heroSection: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: COLORS.overlay,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  heroGradient: {
    padding: isTablet ? 50 : 40,
    alignItems: "center",
  },
  heroIcon: {
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: isTablet ? 32 : isSmall ? 24 : 28,
    fontWeight: "900",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: isTablet ? 18 : isSmall ? 14 : 16,
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    lineHeight: isTablet ? 26 : 22,
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "800",
    color: COLORS.white,
  },
  statLabel: {
    fontSize: isTablet ? 12 : 10,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
    textAlign: "center",
  },

  // Language Section Styles
  languageSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 16,
    textAlign: "center",
  },
  languageScroll: {
    paddingHorizontal: 10,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.overlay,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  languageButtonActive: {
    backgroundColor: COLORS.lightGreen,
    borderColor: COLORS.lightGreen,
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 10,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  languageTextActive: {
    color: COLORS.white,
  },

  // Features Section Styles
  featuresSection: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS.overlay,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.lightGreen,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: isTablet ? 14 : 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },

  // Action Section Styles
  actionSection: {
    gap: 12,
  },

  // Social Card Styles
  socialCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: COLORS.overlay,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Post Header Styles
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.offWhite,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profilePicture: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.lightGreen,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileInitials: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  profileName: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: "800",
    color: COLORS.text,
    marginRight: 6,
  },
  profileLocation: {
    fontSize: isTablet ? 12 : 11,
    color: COLORS.textLight,
  },
  followButton: {
    backgroundColor: COLORS.lightGreen,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.white,
  },

  // Post Image Styles
  postImageContainer: {
    height: isTablet ? 350 : 280,
    overflow: "hidden",
  },
  postImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postImageText: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: "800",
    color: COLORS.white,
    marginTop: 16,
    textAlign: "center",
  },

  // Post Content Styles
  postContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  likesText: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "700",
  },
  postCaption: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 8,
  },

  // Urgency Timer Styles
  urgencyTimer: {
    margin: 16,
    backgroundColor: COLORS.skinLight,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  urgencyContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  urgencyText: {
    flex: 1,
    fontSize: isTablet ? 14 : 13,
    fontWeight: "800",
    color: COLORS.error,
    marginHorizontal: 12,
  },
  urgencyTime: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: "800",
    color: COLORS.error,
  },

  // Post Actions Styles
  postActions: {
    padding: 16,
    gap: 10,
  },

  // Warning Message Styles
  warningMessage: {
    margin: 16,
    backgroundColor: COLORS.skinLight,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.lightGreen,
  },
  warningText: {
    fontSize: isTablet ? 15 : 14,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 20,
    marginVertical: 16,
  },

  // Trading Platform Styles
  tradingPlatform: {
    marginBottom: 20,
  },
  platformHeader: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: COLORS.overlay,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  platformTitleSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  platformTitleInfo: {
    marginLeft: 16,
    flex: 1,
  },
  platformTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  platformSubtitle: {
    fontSize: isTablet ? 14 : 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  platformRating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  liveText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.white,
    marginLeft: 6,
  },

  // Investment Section Styles
  investmentSection: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: COLORS.overlay,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  investmentTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 16,
  },
  roiBanner: {
    backgroundColor: COLORS.lightGreen,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  roiBannerText: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "800",
    color: COLORS.white,
  },

  // Investment Package Styles
  investmentPackage: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.offWhite,
    position: "relative",
  },
  popularPackage: {
    backgroundColor: COLORS.skinLight,
    borderColor: COLORS.lightGreen,
    borderWidth: 3,
  },
  popularBadge: {
    position: "absolute",
    top: -1,
    right: -1,
    backgroundColor: COLORS.lightGreen,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  popularBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.white,
    marginLeft: 4,
  },
  packageContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  packageLeft: {
    flex: 1,
  },
  packageAmount: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  packageReturns: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: "700",
    color: COLORS.lightGreen,
    marginTop: 4,
  },
  packageProfit: {
    fontSize: isTablet ? 13 : 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  packageRight: {
    alignItems: "flex-end",
  },
  roiBadge: {
    backgroundColor: COLORS.lightGreen,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  roiText: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: "800",
    color: COLORS.white,
  },

  // Platform Actions Styles
  platformActions: {
    marginTop: 20,
    gap: 10,
  },
  moreInfoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: COLORS.offWhite,
    borderRadius: 12,
  },
  moreInfoText: {
    fontSize: isTablet ? 15 : 14,
    color: COLORS.lightGreen,
    fontWeight: "700",
    marginLeft: 8,
  },

  // Confirmation Container Styles
  confirmationContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    elevation: 6,
    shadowColor: COLORS.overlay,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  successAnimation: {
    marginBottom: 20,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.skinLight,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmationTitle: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 12,
  },
  confirmationSubtitle: {
    fontSize: isTablet ? 16 : 14,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 30,
  },

  // Investment Summary Styles
  investmentSummary: {
    width: "100%",
    backgroundColor: COLORS.offWhite,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  summaryTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.overlayLight,
  },
  summaryLabel: {
    fontSize: isTablet ? 14 : 13,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: "800",
  },

  // Next Steps Styles
  nextStepsContainer: {
    width: "100%",
    marginBottom: 30,
  },
  nextStepsTitle: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 16,
  },
  nextStepItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.offWhite,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  nextStepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGreen,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  nextStepText: {
    flex: 1,
    fontSize: isTablet ? 14 : 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  confirmationActions: {
    width: "100%",
    gap: 12,
  },

  // Trading Dashboard Styles
  tradingDashboard: {
    marginBottom: 20,
  },
  dashboardHeader: {
    backgroundColor: COLORS.lightGreen,
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dashboardTitleSection: {
    flex: 1,
  },
  dashboardTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: "800",
    color: COLORS.white,
  },
  dashboardSubtitle: {
    fontSize: isTablet ? 14 : 13,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
  },
  balanceSection: {
    alignItems: "flex-end",
  },
  balanceLabel: {
    fontSize: isTablet ? 13 : 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  balanceAmount: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: "800",
    color: COLORS.white,
  },
  balanceProfit: {
    fontSize: isTablet ? 13 : 12,
    color: COLORS.white,
    fontWeight: "700",
    marginTop: 4,
  },

  // Trading Activity Styles
  tradingActivity: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: COLORS.overlay,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 16,
  },
  tradeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.offWhite,
  },
  tradeLeft: {
    flex: 1,
  },
  tradePair: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: "800",
    color: COLORS.text,
  },
  tradeTime: {
    fontSize: isTablet ? 12 : 11,
    color: COLORS.textLight,
    marginTop: 4,
  },
  tradeCenter: {
    marginHorizontal: 16,
  },
  tradeAction: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  tradeActionText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.white,
  },
  tradeRight: {
    alignItems: "flex-end",
  },
  tradeProfit: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: "800",
    color: COLORS.lightGreen,
  },

  // Withdrawal Section Styles
  withdrawalSection: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    elevation: 4,
    shadowColor: COLORS.overlay,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  withdrawalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  withdrawalTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: "800",
    color: COLORS.lightGreen,
    textAlign: "center",
    marginTop: 12,
  },
  withdrawalAmount: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: "800",
    color: COLORS.lightGreen,
    textAlign: "center",
    marginBottom: 12,
  },
  withdrawalSubtext: {
    fontSize: isTablet ? 15 : 14,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 25,
  },
  securityFeatures: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 25,
  },
  securityFeature: {
    alignItems: "center",
  },
  securityText: {
    fontSize: isTablet ? 11 : 10,
    color: COLORS.textLight,
    marginTop: 6,
    textAlign: "center",
    fontWeight: "600",
  },
  withdrawalActions: {
    width: "100%",
    gap: 12,
  },

  // Profit Notification Styles
  profitNotification: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: COLORS.lightGreen,
    borderRadius: 12,
    overflow: "hidden",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  notificationText: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: "800",
    color: COLORS.white,
    marginLeft: 12,
  },

  // Support Chat Styles
  supportChat: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 4,
    shadowColor: COLORS.overlay,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  supportHeader: {
    backgroundColor: COLORS.lightGreen,
    padding: 20,
  },
  supportProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  supportAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  supportAvatarText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.lightGreen,
  },
  supportInfo: {
    flex: 1,
  },
  supportName: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: "800",
    color: COLORS.white,
  },
  supportStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginRight: 8,
  },
  supportStatusText: {
    fontSize: isTablet ? 13 : 12,
    color: "rgba(255, 255, 255, 0.9)",
  },

  // Chat Messages Styles
  chatMessages: {
    padding: 20,
  },
  supportMessage: {
    backgroundColor: COLORS.offWhite,
    padding: 16,
    borderRadius: 12,
    borderBottomLeftRadius: 4,
  },
  supportMessageText: {
    fontSize: isTablet ? 15 : 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 8,
  },

  // Fee Request Styles
  feeRequest: {
    margin: 20,
    backgroundColor: COLORS.skinLight,
    borderRadius: 15,
    padding: 25,
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  feeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  feeTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "800",
    color: COLORS.error,
    marginLeft: 12,
  },
  feeBreakdown: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  breakdownTitle: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 16,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  feeLabel: {
    fontSize: isTablet ? 14 : 13,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  feeValue: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: "800",
  },
  feeSeparator: {
    height: 2,
    backgroundColor: COLORS.offWhite,
    marginVertical: 12,
  },
  feeTotalLabel: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: "800",
    color: COLORS.text,
  },
  feeTotalValue: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: "800",
    color: COLORS.lightGreen,
  },
  urgencySection: {
    marginBottom: 20,
  },
  urgencyBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.error,
    padding: 12,
    borderRadius: 8,
  },
  urgencyText: {
    fontSize: isTablet ? 13 : 12,
    fontWeight: "800",
    color: COLORS.white,
    marginLeft: 8,
  },
  feeActions: {
    gap: 12,
  },

  // Scam Revelation Styles
  scamRevelation: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    elevation: 6,
    shadowColor: COLORS.overlay,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  scamIcon: {
    marginBottom: 20,
  },
  scamIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.skinLight,
    justifyContent: "center",
    alignItems: "center",
  },
  scamTitle: {
    fontSize: isTablet ? 32 : 26,
    fontWeight: "800",
    color: COLORS.error,
    textAlign: "center",
    marginBottom: 12,
  },
  scamSubtitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "700",
    color: COLORS.error,
    textAlign: "center",
    marginBottom: 20,
  },
  brokenWebsite: {
    backgroundColor: COLORS.text,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    width: "100%",
  },
  brokenText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: "800",
    color: COLORS.white,
    textAlign: "center",
  },
  brokenSubtext: {
    fontSize: isTablet ? 13 : 12,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 8,
  },
  scamDescription: {
    fontSize: isTablet ? 16 : 15,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: isTablet ? 24 : 22,
    marginBottom: 30,
  },
  scamStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: COLORS.offWhite,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  statNumber: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "800",
    color: COLORS.error,
  },
  statLabel: {
    fontSize: isTablet ? 11 : 10,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 4,
  },
  redFlagsSection: {
    width: "100%",
    marginBottom: 30,
  },
  redFlagsTitle: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 16,
  },
  redFlagItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.skinLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  redFlagText: {
    fontSize: isTablet ? 13 : 12,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },

  // Results Styles
  resultsHeader: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: "hidden",
  },
  resultsGradient: {
    padding: 40,
    alignItems: "center",
  },
  resultsTitle: {
    fontSize: isTablet ? 32 : 26,
    fontWeight: "800",
    color: COLORS.white,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  resultsSubtitle: {
    fontSize: isTablet ? 16 : 15,
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    lineHeight: isTablet ? 24 : 22,
  },

  // Score Display Styles
  scoreDisplay: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginBottom: 30,
    elevation: 4,
    shadowColor: COLORS.overlay,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 25,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 25,
    overflow: "hidden",
  },
  scoreGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  scoreValue: {
    fontSize: isTablet ? 40 : 36,
    fontWeight: "800",
    color: COLORS.white,
  },
  scoreMaxValue: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
  },
  scoreLabel: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },
  scoreProgress: {
    width: "100%",
    marginBottom: 20,
  },
  scoreProgressTrack: {
    height: 10,
    backgroundColor: COLORS.offWhite,
    borderRadius: 5,
    overflow: "hidden",
  },
  scoreProgressFill: {
    height: "100%",
    borderRadius: 5,
  },
  scorePercentage: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: "800",
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 8,
  },
  scoreDescription: {
    fontSize: isTablet ? 15 : 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 20,
  },

  // Achievement Badge Styles
  achievementBadge: {
    marginBottom: 30,
    borderRadius: 15,
    overflow: "hidden",
  },
  badgeGradient: {
    padding: 25,
    alignItems: "center",
  },
  badgeTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: "800",
    color: COLORS.white,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  badgeSubtitle: {
    fontSize: isTablet ? 14 : 13,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },

  // Protection Tips Styles
  protectionTips: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 25,
    marginBottom: 30,
    elevation: 3,
    shadowColor: COLORS.overlay,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipsTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 20,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.skinLight,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  tipText: {
    fontSize: isTablet ? 14 : 13,
    color: COLORS.text,
    lineHeight: 18,
    marginLeft: 12,
    flex: 1,
  },

  // Results Actions Styles
  resultsActions: {
    gap: 12,
  },
})
