import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

const FinancialTips = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [currentTips, setCurrentTips] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Financial tips data for different languages
  const tipsData = {
    English: [
      "Create a budget and stick to it. Track your income and expenses monthly.",
      "Build an emergency fund worth 6 months of expenses before investing.",
      "Start investing early to benefit from compound interest over time.",
      "Diversify your investment portfolio to minimize risks.",
      "Pay off high-interest debt before making new investments.",
      "Review your financial goals quarterly and adjust as needed.",
      "Use SIPs for disciplined investing in mutual funds.",
      "Keep your fixed deposits and savings in high-yield accounts.",
    ],
    Hindi: [
      "एक बजट बनाएं और उस पर टिके रहें। अपनी आय और खर्च को मासिक रूप से ट्रैक करें।",
      "निवेश करने से पहले 6 महीने के खर्च के बराबर आपातकालीन फंड बनाएं।",
      "समय के साथ चक्रवृद्धि ब्याज का लाभ उठाने के लिए जल्दी निवेश शुरू करें।",
      "जोखिम को कम करने के लिए अपने निवेश पोर्टफोलियो में विविधता लाएं।",
      "नए निवेश करने से पहले उच्च ब्याज वाले कर्ज का भुगतान करें।",
      "अपने वित्तीय लक्ष्यों की तिमाही समीक्षा करें और आवश्यकतानुसार समायोजन करें।",
      "म्यूचुअल फंड में अनुशासित निवेश के लिए SIP का उपयोग करें।",
      "अपने फिक्स्ड डिपॉजिट और बचत को उच्च-उपज खातों में रखें।",
    ],
    Punjabi: [
      "ਇੱਕ ਬਜਟ ਬਣਾਓ ਅਤੇ ਉਸ ਤੇ ਕਾਇਮ ਰਹੋ। ਆਪਣੀ ਆਮਦਨ ਅਤੇ ਖਰਚ ਨੂੰ ਮਹੀਨਾਵਾਰ ਟਰੈਕ ਕਰੋ।",
      "ਨਿਵੇਸ਼ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ 6 ਮਹੀਨੇ ਦੇ ਖਰਚ ਦੇ ਬਰਾਬਰ ਐਮਰਜੈਂਸੀ ਫੰਡ ਬਣਾਓ।",
      "ਸਮੇਂ ਦੇ ਨਾਲ ਚੱਕਰਵਰਧੀ ਵਿਆਜ ਦਾ ਲਾਭ ਉਠਾਉਣ ਲਈ ਜਲਦੀ ਨਿਵੇਸ਼ ਸ਼ੁਰੂ ਕਰੋ।",
      "ਜੋਖਮ ਘਟਾਉਣ ਲਈ ਆਪਣੇ ਨਿਵੇਸ਼ ਪੋਰਟਫੋਲੀਓ ਵਿੱਚ ਵਿਭਿੰਨਤਾ ਲਿਆਓ।",
      "ਨਵੇਂ ਨਿਵੇਸ਼ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਉੱਚ ਵਿਆਜ ਵਾਲੇ ਕਰਜ਼ੇ ਦਾ ਭੁਗਤਾਨ ਕਰੋ।",
      "ਆਪਣੇ ਵਿੱਤੀ ਟੀਚਿਆਂ ਦੀ ਤਿਮਾਹੀ ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਲੋੜ ਅਨੁਸਾਰ ਸਮਾਯੋਜਨ ਕਰੋ।",
      "ਮਿਉਚੁਅਲ ਫੰਡ ਵਿੱਚ ਅਨੁਸ਼ਾਸਿਤ ਨਿਵੇਸ਼ ਲਈ SIP ਦੀ ਵਰਤੋਂ ਕਰੋ।",
      "ਆਪਣੇ ਫਿਕਸਡ ਡਿਪਾਜ਼ਿਟ ਅਤੇ ਬੱਚਤ ਨੂੰ ਉੱਚ-ਪੈਦਾਵਾਰ ਖਾਤਿਆਂ ਵਿੱਚ ਰੱਖੋ।",
    ],
    Tamil: [
      "ஒரு பட்ஜெட் உருவாக்கி அதில் கடைபிடியுங்கள். உங்கள் வருமானம் மற்றும் செலவுகளை மாதந்தோறும் கண்காணியுங்கள்.",
      "முதலீடு செய்வதற்கு முன் 6 மாத செலவுகளுக்கு சமமான அவசரகால நிதியை உருவாக்குங்கள்.",
      "காலப்போக்கில் கூட்டு வட்டியின் நன்மையைப் பெற ஆரம்பத்திலேயே முதலீடு செய்யத் தொடங்குங்கள்.",
      "அபாயங்களைக் குறைக்க உங்கள் முதலீட்டு போர்ட்ஃபோலியோவை பல்வகைப்படுத்துங்கள்.",
      "புதிய முதலீடுகளைச் செய்வதற்கு முன் அதிக வட்டி கடனைச் செலுத்துங்கள்.",
      "உங்கள் நிதி இலக்குகளை காலாண்டுக்கு ஒருமுறை மதிப்பாய்வு செய்து தேவைக்கேற்ப சரிசெய்யுங்கள்.",
      "மியூச்சுவல் ஃபண்டுகளில் ஒழுக்கமான முதலீட்டுக்காக SIP களைப் பயன்படுத்துங்கள்.",
      "உங்கள் கால வைப்பு மற்றும் சேமிப்புகளை அதிக வருமானம் தரும் கணக்குகளில் வைத்திருங்கள்.",
    ],
    Telugu: [
      "బడ్జెట్ చేసి దానికి కట్టుబడి ఉండండి. మీ ఆదాయం మరియు ఖర్చులను నెలవారీగా ట్రాక్ చేయండి.",
      "పెట్టుబడి పెట్టడానికి ముందు 6 నెలల ఖర్చులకు సమానమైన అత్యవసర నిధిని నిర్మించండి.",
      "కాలక్రమేణా చక్రవృద్ధి వడ్డీ ప్రయోజనం పొందేందుకు ముందుగానే పెట్టుబడి మొదలు పెట్టండి.",
      "రిస్క్‌లను తగ్గించేందుకు మీ పెట్టుబడి పోర్ట్‌ఫోలియోను వైవిధ్యపరచండి.",
      "కొత్త పెట్టుబడులు చేసే ముందు అధిక వడ్డీ రుణాలను చెల్లించండి.",
      "మీ ఆర్థిక లక్ష్యాలను త్రైమాసికంగా సమీక్షించి అవసరానుసారం సర్దుబాటు చేయండి.",
      "మ్యూచువల్ ఫండ్‌లలో క్రమశిక్షణ పెట్టుబడికి SIPలను ఉపయోగించండి.",
      "మీ ఫిక్స్‌డ్ డిపాజిట్‌లు మరియు పొదుపులను అధిక-దిగుబడి ఖాతాలలో ఉంచండి.",
    ],
    Marathi: [
      "बजेट तयार करा आणि त्यावर स्थिर राहा. आपले उत्पन्न आणि खर्च मासिक ट्रॅक करा.",
      "गुंतवणूक करण्यापूर्वी 6 महिन्यांच्या खर्चाच्या बरोबरीचा आपत्कालीन निधी तयार करा.",
      "कालांतराने चक्रवाढ व्याजाचा फायदा घेण्यासाठी लवकर गुंतवणूक सुरू करा.",
      "जोखीम कमी करण्यासाठी आपल्या गुंतवणूक पोर्टफोलिओमध्ये विविधता आणा.",
      "नवीन गुंतवणूक करण्यापूर्वी उच्च व्याज कर्जाची परतफेड करा.",
      "आपल्या आर्थिक उद्दिष्टांचे तिमाही पुनरावलोकन करा आणि आवश्यकतेनुसार समायोजन करा.",
      "म्युच्यूअल फंडांमध्ये शिस्तबद्ध गुंतवणुकीसाठी SIP वापरा.",
      "आपले फिक्स्ड डिपॉझिट आणि बचती उच्च-उत्पन्न खात्यांमध्ये ठेवा.",
    ],
    Bengali: [
      "একটি বাজেট তৈরি করুন এবং তাতে লেগে থাকুন। আপনার আয় এবং ব্যয় মাসিক ট্র্যাক করুন।",
      "বিনিয়োগের আগে ৬ মাসের খরচের সমান জরুরি তহবিল তৈরি করুন।",
      "সময়ের সাথে চক্রবৃদ্ধি সুদের সুবিধা নিতে তাড়াতাড়ি বিনিয়োগ শুরু করুন।",
      "ঝুঁকি কমাতে আপনার বিনিয়োগ পোর্টফোলিওতে বৈচিত্র্য আনুন।",
      "নতুন বিনিয়োগ করার আগে উচ্চ সুদের ঋণ পরিশোধ করুন।",
      "আপনার আর্থিক লক্ষ্যগুলি ত্রৈমাসিক পর্যালোচনা করুন এবং প্রয়োজন অনুযায়ী সমন্বয় করুন।",
      "মিউচুয়াল ফান্ডে শৃঙ্খলাবদ্ধ বিনিয়োগের জন্য SIP ব্যবহার করুন।",
      "আপনার ফিক্সড ডিপোজিট এবং সঞ্চয় উচ্চ-ফলনশীল অ্যাকাউন্টে রাখুন।",
    ],
    Gujarati: [
      "બજેટ બનાવો અને તેના પર વળગી રહો. તમારી આવક અને ખર્ચને માસિક ટ્રેક કરો.",
      "રોકાણ કરતા પહેલા 6 મહિનાના ખર્ચ જેટલું કટોકટી ફંડ બનાવો.",
      "સમય સાથે ચક્રવૃદ્ધિ બ્યાજનો લાભ મેળવવા માટે વહેલું રોકાણ શરૂ કરો.",
      "જોખમ ઘટાડવા માટે તમારા રોકાણ પોર્ટફોલિયોમાં વિવિધતા લાવો.",
      "નવા રોકાણ કરતા પહેલા ઊંચા વ્યાજવાળા દેવાની ચૂકવણી કરો.",
      "તમારા નાણાકીય લક્ષ્યોની ત્રિમાસિક સમીક્ષા કરો અને જરૂરિયાત મુજબ વ્યવસ્થા કરો.",
      "મ્યુચ્યુઅલ ફંડમાં શિસ્તબદ્ધ રોકાણ માટે SIP નો ઉપયોગ કરો.",
      "તમારા ફિક્સ્ડ ડિપોઝિટ અને બચાવને ઊંચી-ઉપજ ખાતાઓમાં રાખો.",
    ],
    Kannada: [
      "ಬಜೆಟ್ ರಚಿಸಿ ಮತ್ತು ಅದಕ್ಕೆ ಅಂಟಿಕೊಳ್ಳಿ. ನಿಮ್ಮ ಆದಾಯ ಮತ್ತು ವೆಚ್ಚಗಳನ್ನು ಮಾಸಿಕ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
      "ಹೂಡಿಕೆ ಮಾಡುವ ಮೊದಲು 6 ತಿಂಗಳ ವೆಚ್ಚಕ್ಕೆ ಸಮಾನವಾದ ತುರ್ತು ನಿಧಿ ನಿರ್ಮಿಸಿ.",
      "ಕಾಲಾನಂತರದಲ್ಲಿ ಚಕ್ರವೃದ್ಧಿ ಬಡ್ಡಿಯ ಪ್ರಯೋಜನ ಪಡೆಯಲು ಮುಂಚೆಯೇ ಹೂಡಿಕೆ ಪ್ರಾರಂಭಿಸಿ.",
      "ಅಪಾಯಗಳನ್ನು ಕಡಿಮೆ ಮಾಡಲು ನಿಮ್ಮ ಹೂಡಿಕೆ ಪೋರ್ಟ್‌ಫೋಲಿಯೊವನ್ನು ವೈವಿಧ್ಯಗೊಳಿಸಿ.",
      "ಹೊಸ ಹೂಡಿಕೆಗಳನ್ನು ಮಾಡುವ ಮೊದಲು ಹೆಚ್ಚಿನ ಬಡ್ಡಿ ಸಾಲವನ್ನು ಪಾವತಿಸಿ.",
      "ನಿಮ್ಮ ಹಣಕಾಸಿನ ಗುರಿಗಳನ್ನು ತ್ರೈಮಾಸಿಕವಾಗಿ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಅಗತ್ಯ ಪ್ರಕಾರ ಸರಿಹೊಂದಿಸಿ.",
      "ಮ್ಯೂಚುಯಲ್ ಫಂಡ್‌ಗಳಲ್ಲಿ ಶಿಸ್ತಿನ ಹೂಡಿಕೆಗಾಗಿ SIP ಬಳಸಿ.",
      "ನಿಮ್ಮ ಫಿಕ್ಸ್‌ಡ್ ಡಿಪಾಸಿಟ್‌ಗಳು ಮತ್ತು ಉಳಿತಾಯವನ್ನು ಹೆಚ್ಚಿನ ಇಳುವರಿ ಖಾತೆಗಳಲ್ಲಿ ಇಡಿ.",
    ],
    Malayalam: [
      "ഒരു ബജറ്റ് സൃഷ്ടിച്ച് അതിൽ ഉറച്ചുനിൽക്കുക. നിങ്ങളുടെ വരുമാനവും ചെലവുകളും മാസികമായി ട്രാക്ക് ചെയ്യുക.",
      "നിക്ഷേപിക്കുന്നതിന് മുമ്പ് 6 മാസത്തെ ചെലവുകൾക്ക് തുല്യമായ അടിയന്തിര ഫണ്ട് നിർമ്മിക്കുക.",
      "കാലക്രമേണ കൂട്ടിച്ചേർത്ത പലിശയുടെ പ്രയോജനം നേടാൻ നേരത്തെ നിക്ഷേപം ആരംഭിക്കുക.",
      "അപകടസാധ്യതകൾ കുറയ്ക്കാൻ നിങ്ങളുടെ നിക്ഷേപ പോർട്ട്‌ഫോളിയോ വൈവിധ്യവത്കരിക്കുക.",
      "പുതിയ നിക്ഷേപങ്ങൾ നടത്തുന്നതിന് മുമ്പ് ഉയർന്ന പലിശ കടം അടയ്ക്കുക.",
      "നിങ്ങളുടെ സാമ്പത്തിക ലക്ഷ്യങ്ങൾ ത്രൈമാസികമായി അവലോകനം ചെയ്ത് ആവശ്യാനുസരണം ക്രമീകരിക്കുക.",
      "മ്യൂച്വൽ ഫണ്ടുകളിൽ അച്ചടക്കമുള്ള നിക്ഷേപത്തിനായി SIP ഉപയോഗിക്കുക.",
      "നിങ്ങളുടെ ഫിക്സഡ് ഡിപ്പോസിറ്റുകളും സേവിംഗുകളും ഉയർന്ന വരുമാനമുള്ള അക്കൗണ്ടുകളിൽ സൂക്ഷിക്കുക.",
    ],
  };

  const languages = [
    'English', 'Hindi', 'Punjabi', 'Tamil', 'Telugu', 
    'Marathi', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam'
  ];

  // Get all tips for the selected language
  const getAllTips = (language) => {
    return tipsData[language] || tipsData['English'];
  };

  // Initialize tips on component mount
  useEffect(() => {
    setCurrentTips(getAllTips(selectedLanguage));
  }, []);

  // Handle language change
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Update tips and fade in
      setCurrentTips(getAllTips(language)); // Show all tips
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Handle refresh tips
  const handleRefresh = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCurrentTips(getAllTips(selectedLanguage)); // Show all tips
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💰 Financial Tips</Text>
        <Text style={styles.headerSubtitle}>Smart money management starts here</Text>
      </View>

      {/* Language Selector */}
      <View style={styles.languageContainer}>
        <Text style={styles.languageLabel}>Select Language:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedLanguage}
            style={styles.picker}
            onValueChange={(itemValue) => handleLanguageChange(itemValue)}
            dropdownIconColor="#2E7D32"
          >
            {languages.map((language) => (
              <Picker.Item 
                key={language} 
                label={language} 
                value={language}
                style={styles.pickerItem}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Tips Container */}
      <ScrollView 
        style={styles.tipsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.tipsWrapper, { opacity: fadeAnim }]}>
          {currentTips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Text style={styles.tipIcon}>💡</Text>
                <Text style={styles.tipNumber}>Tip {index + 1}</Text>
              </View>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Floating Refresh Button */}
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={handleRefresh}
        activeOpacity={0.8}
      >
        <Text style={styles.refreshIcon}>🔄</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9', // Cream white background
  },
  header: {
    backgroundColor: '#2E7D32', // Superb green
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E8F5E8',
    textAlign: 'center',
    fontWeight: '300',
  },
  languageContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  picker: {
    height: 50,
    color: '#2E7D32',
  },
  pickerItem: {
    fontSize: 16,
    color: '#2E7D32',
  },
  tipsContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100, // Space for floating button
  },
  tipsWrapper: {
    gap: 15,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD54F', // Touch of yellow
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  tipNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#424242',
    fontWeight: '400',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2E7D32',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  refreshIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});

export default FinancialTips;