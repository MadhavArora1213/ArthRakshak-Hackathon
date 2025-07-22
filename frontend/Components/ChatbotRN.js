import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import SafeStatusBar from './SafeStatusBar';

const { width, height } = Dimensions.get('window');

const ChatbotRN = ({ isQRScanning = false, isVisible = true }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "नमस्ते! मैं आपका वित्तीय सहायक हूँ। आप मुझसे बचत, निवेश और वित्तीय सलाह के बारे में पूछ सकते हैं।",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const scrollViewRef = useRef(null);

  const languages = {
    hindi: { name: 'हिंदी', flag: '🇮🇳' },
    english: { name: 'English', flag: '🇺🇸' },
    punjabi: { name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  };

  const botResponses = {
    hindi: {
      greeting: "नमस्ते! मैं आपका वित्तीय सहायक हूँ। आप मुझसे बचत, निवेश और वित्तीय सलाह के बारे में पूछ सकते हैं।",
      savings: "बचत के लिए आप 50/30/20 नियम का पालन कर सकते हैं - 50% आवश्यक खर्च, 30% वैकल्पिक खर्च, और 20% बचत।",
      investment: "निवेश की शुरुआत SIP से करें। म्यूचुअल फंड और FD एक अच्छा विकल्प है।",
      default: "माफ करें, मुझे समझ नहीं आया। कृपया अपना प्रश्न दोबारा पूछें।"
    },
    english: {
      greeting: "Hello! I'm your financial assistant. You can ask me about savings, investments, and financial advice.",
      savings: "For savings, follow the 50/30/20 rule - 50% needs, 30% wants, and 20% savings.",
      investment: "Start investing with SIP. Mutual funds and FDs are good options for beginners.",
      default: "Sorry, I didn't understand that. Please ask your question again."
    },
    punjabi: {
      greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਵਿੱਤੀ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੈਨੂੰ ਬਚਤ, ਨਿਵੇਸ਼ ਅਤੇ ਵਿੱਤੀ ਸਲਾਹ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।",
      savings: "ਬਚਤ ਲਈ 50/30/20 ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਕਰੋ - 50% ਲੋੜੀਂਦੇ ਖਰਚੇ, 30% ਵਿਕਲਪਿਕ ਖਰਚੇ, ਅਤੇ 20% ਬਚਤ।",
      investment: "SIP ਨਾਲ ਨਿਵੇਸ਼ ਦੀ ਸ਼ੁਰੂਆਤ ਕਰੋ। ਮਿਉਚੁਅਲ ਫੰਡ ਅਤੇ FD ਚੰਗੇ ਵਿਕਲਪ ਹਨ।",
      default: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਸਵਾਲ ਦੁਬਾਰਾ ਪੁੱਛੋ।"
    }
  };

  useEffect(() => {
    // Auto-close chat when QR scanning starts
    if (isQRScanning && isChatOpen) {
      setIsChatOpen(false);
    }
  }, [isQRScanning]);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    const responses = botResponses[selectedLanguage];
    
    if (message.includes('बचत') || message.includes('saving') || message.includes('ਬਚਤ')) {
      return responses.savings;
    } else if (message.includes('निवेश') || message.includes('investment') || message.includes('ਨਿਵੇਸ਼')) {
      return responses.investment;
    } else if (message.includes('नमस्ते') || message.includes('hello') || message.includes('ਸਤ ਸ੍ਰੀ ਅਕਾਲ')) {
      return responses.greeting;
    } else {
      return responses.default;
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleVoiceInput = () => {
    Alert.alert(
      'Voice Input', 
      'Voice recognition will be implemented here',
      [{ text: 'OK' }]
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!isVisible || isQRScanning) {
    return null;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeStatusBar style="light" backgroundColor="#22c55e" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>🤖</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>ArthRakshak Assistant</Text>
              <Text style={styles.headerSubtitle}>आपका वित्तीय सहायक</Text>
            </View>
          </View>
        </View>

        {/* Language Selector */}
        <View style={styles.languageContainer}>
          {Object.entries(languages).map(([key, lang]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setSelectedLanguage(key)}
              style={[
                styles.languageButton,
                selectedLanguage === key && styles.languageButtonActive
              ]}
            >
              <Text style={[
                styles.languageButtonText,
                selectedLanguage === key && styles.languageButtonTextActive
              ]}>
                {lang.flag} {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Messages Container */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userMessage : styles.botMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                message.sender === 'user' ? styles.userMessageText : styles.botMessageText
              ]}>
                {message.text}
              </Text>
              <Text style={[
                styles.messageTime,
                message.sender === 'user' ? styles.userMessageTime : styles.botMessageTime
              ]}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Container */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <View style={styles.textInputContainer}>
            <TextInput
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder={
                selectedLanguage === 'hindi' ? 'अपना संदेश लिखें...' :
                selectedLanguage === 'english' ? 'Type your message...' :
                'ਆਪਣਾ ਸੰਦੇਸ਼ ਲਿਖੋ...'
              }
              style={styles.textInput}
              multiline
              maxHeight={100}
              onSubmitEditing={handleSendMessage}
            />
            
            {/* Voice Input Button */}
            <TouchableOpacity
              onPress={handleVoiceInput}
              style={styles.voiceButton}
            >
              <Text style={styles.voiceButtonText}>🎤</Text>
            </TouchableOpacity>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={inputMessage.trim() === ''}
            style={[
              styles.sendButton,
              inputMessage.trim() === '' && styles.sendButtonDisabled
            ]}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#22c55e',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  languageContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  languageButtonActive: {
    backgroundColor: 'white',
  },
  languageButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  languageButtonTextActive: {
    color: '#22c55e',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#22c55e',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#374151',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  botMessageTime: {
    color: '#9ca3af',
  },
  inputContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    maxHeight: 100,
  },
  voiceButton: {
    marginLeft: 8,
    padding: 4,
  },
  voiceButtonText: {
    fontSize: 20,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#22c55e',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatbotRN;
