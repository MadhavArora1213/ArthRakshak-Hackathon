import React, { useState, useRef, useEffect, useCallback, memo } from 'react';

// Optimized Chatbot Component - Web-based only (no React Native components)
const Chatbot = memo(({ isQRScanning = false, isVisible = true }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🙏 नमस्ते! मैं आपका स्मार्ट वित्तीय सहायक हूँ। आप मुझसे बचत, निवेश, बीमा और वित्तीय योजना के बारे में पूछ सकते हैं। आज आप कैसे मदद चाहते हैं?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [isListening, setIsListening] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [newMessageAnimation, setNewMessageAnimation] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const languages = {
    hindi: { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
    english: { code: 'en-US', name: 'English', flag: '🇺🇸' },
    punjabi: { code: 'pa-IN', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  };

  const botResponses = {
    hindi: {
      greeting: "🙏 नमस्ते! मैं आपका स्मार्ट वित्तीय सहायक हूँ। आप मुझसे बचत, निवेश, बीमा और वित्तीय योजना के बारे में पूछ सकते हैं। आज आप कैसे मदद चाहते हैं?",
      savings: "💰 बचत के लिए स्मार्ट सुझाव:\n\n💳 50-30-20 नियम: 50% जरूरत, 30% इच्छा, 20% बचत\n🏦 Fixed Deposit में 6.5-7% सालाना रिटर्न\n💵 Emergency Fund: 6 महीने का खर्च अलग रखें\n📱 Digital payments का उपयोग करें, रिवार्ड पॉइंट्स मिलते हैं\n🎯 SIP के जरिए हर महीने छोटी राशि निवेश करें\n\nकोई विशेष बचत योजना के बारे में जानना चाहते हैं?",
      investment: "📈 निवेश की स्मार्ट रणनीति:\n\n🔄 SIP से शुरुआत करें - कम से कम ₹500/महीना\n📊 Equity: 12-15% लंबे समय में रिटर्न\n�️ Diversify करें: 60% Equity, 30% Debt, 10% Gold\n💎 Top Mutual Funds: HDFC Top 100, ICICI Bluechip\n⏰ जल्दी शुरू करें, compounding का फायदा उठाएं\n🎯 5 साल से कम निवेश न करें\n\nआपका मासिक निवेश बजट क्या है?",
      insurance: "🛡️ बीमा की पूरी गाइड:\n\n💼 Term Life Insurance: 10-15 गुना सालाना आय का cover\n🏥 Health Insurance: कम से कम ₹5 लाख का cover\n🚗 Vehicle Insurance: Third party अनिवार्य, comprehensive बेहतर\n🏠 Home Insurance: घर की सुरक्षा के लिए जरूरी\n👨‍👩‍👧‍👦 Family Floater: पूरे परिवार के लिए एक पॉलिसी\n💡 Term insurance सबसे सस्ता और बेहतर विकल्प\n\nकौन सा बीमा आपको चाहिए?",
      loan: "� लोन की स्मार्ट जानकारी:\n\n🏠 Home Loan: 6.5-8.5% ब्याज दर, 20 साल तक\n� Car Loan: 7-12% ब्याज दर, 7 साल तक\n🎓 Education Loan: 7-15% ब्याज दर, government schemes उपलब्ध\n💳 Personal Loan: 10-20% ब्याज दर (सबसे महंगा)\n📊 EMI का 40% से ज्यादा income का नहीं होना चाहिए\n🔍 Different banks से rates compare करें\n\nकिस तरह का लोन चाहिए?",
      default: "� मैं आपकी मदद करने के लिए यहाँ हूँ!\n\n💡 आप मुझसे पूछ सकते हैं:\n• 💰 बचत और निवेश की रणनीति\n• 🛡️ बीमा और सुरक्षा योजनाएं\n• 🏦 लोन और EMI की जानकारी\n• 📊 Credit Score सुधारने के तरीके\n• 💸 Tax Saving के तरीके\n• � Emergency Fund planning\n• 👴 Retirement planning\n\n🎯 आपका कोई specific सवाल है?"
    },
    english: {
      greeting: "👋 Hello! I'm your smart financial assistant. You can ask me about savings, investments, insurance, and financial planning. How can I help you today?",
      savings: "💰 Smart savings strategies:\n\n💳 50-30-20 rule: 50% needs, 30% wants, 20% savings\n🏦 Fixed Deposits: 6.5-7% annual returns\n💵 Emergency Fund: 6 months expenses separate\n📱 Use digital payments for reward points\n🎯 Start SIP with small monthly amounts\n\nWhich specific savings plan interests you?",
      investment: "📈 Smart investment strategy:\n\n🔄 Start with SIP - minimum ₹500/month\n📊 Equity: 12-15% long-term returns\n�️ Diversify: 60% Equity, 30% Debt, 10% Gold\n💎 Top Mutual Funds: HDFC Top 100, ICICI Bluechip\n⏰ Start early, benefit from compounding\n🎯 Don't invest for less than 5 years\n\nWhat's your monthly investment budget?",
      insurance: "🛡️ Complete insurance guide:\n\n💼 Term Life Insurance: 10-15x annual income cover\n🏥 Health Insurance: minimum ₹5 lakh cover\n🚗 Vehicle Insurance: Third party mandatory, comprehensive better\n🏠 Home Insurance: essential for property protection\n👨‍👩‍👧‍👦 Family Floater: one policy for entire family\n💡 Term insurance is cheapest and best option\n\nWhich insurance do you need?",
      loan: "� Smart loan information:\n\n🏠 Home Loan: 6.5-8.5% interest rate, up to 20 years\n🚗 Car Loan: 7-12% interest rate, up to 7 years\n🎓 Education Loan: 7-15% interest rate, government schemes available\n💳 Personal Loan: 10-20% interest rate (most expensive)\n📊 EMI shouldn't exceed 40% of income\n🔍 Compare rates from different banks\n\nWhat type of loan do you need?",
      default: "� I'm here to help you!\n\n💡 You can ask me about:\n• 💰 Savings and investment strategies\n• 🛡️ Insurance and security plans\n• � Loan and EMI information\n• � Ways to improve Credit Score\n• 💸 Tax saving methods\n• 🚨 Emergency fund planning\n• 👴 Retirement planning\n\n🎯 Do you have any specific question?"
    },
    punjabi: {
      greeting: "🙏 ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਸਮਾਰਟ ਵਿੱਤੀ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੈਨੂੰ ਬਚਤ, ਨਿਵੇਸ਼, ਬੀਮਾ ਅਤੇ ਵਿੱਤੀ ਯੋਜਨਾ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ। ਅੱਜ ਕਿਵੇਂ ਮਦਦ ਕਰਾਂ?",
      savings: "💰 ਬਚਤ ਲਈ ਸਮਾਰਟ ਸੁਝਾਅ:\n\n💳 50-30-20 ਨਿਯਮ: 50% ਲੋੜ, 30% ਇੱਛਾ, 20% ਬਚਤ\n🏦 Fixed Deposit ਵਿੱਚ 6.5-7% ਸਾਲਾਨਾ ਰਿਟਰਨ\n💵 Emergency Fund: 6 ਮਹੀਨੇ ਦਾ ਖਰਚ ਅਲੱਗ ਰੱਖੋ\n📱 Digital payments ਵਰਤੋ, ਰਿਵਾਰਡ ਪੁਆਇੰਟ ਮਿਲਦੇ ਹਨ\n🎯 SIP ਰਾਹੀਂ ਹਰ ਮਹੀਨੇ ਛੋਟੀ ਰਕਮ ਨਿਵੇਸ਼ ਕਰੋ\n\nਕਿਹੜੀ ਖਾਸ ਬਚਤ ਯੋਜਨਾ ਬਾਰੇ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
      investment: "📈 ਨਿਵੇਸ਼ ਦੀ ਸਮਾਰਟ ਰਣਨੀਤੀ:\n\n🔄 SIP ਨਾਲ ਸ਼ੁਰੂਆਤ - ਘੱਟੋ ਘੱਟ ₹500/ਮਹੀਨਾ\n📊 Equity: 12-15% ਲੰਬੇ ਸਮੇਂ ਵਿੱਚ ਰਿਟਰਨ\n�️ Diversify ਕਰੋ: 60% Equity, 30% Debt, 10% Gold\n💎 ਟਾਪ Mutual Funds: HDFC Top 100, ICICI Bluechip\n⏰ ਜਲਦੀ ਸ਼ੁਰੂ ਕਰੋ, compounding ਦਾ ਫਾਇਦਾ ਉਠਾਓ\n🎯 5 ਸਾਲ ਤੋਂ ਘੱਟ ਨਿਵੇਸ਼ ਨਾ ਕਰੋ\n\nਤੁਹਾਡਾ ਮਾਸਿਕ ਨਿਵੇਸ਼ ਬਜਟ ਕੀ ਹੈ?",
      insurance: "🛡️ ਬੀਮੇ ਦੀ ਪੂਰੀ ਗਾਇਡ:\n\n💼 Term Life Insurance: 10-15 ਗੁਣਾ ਸਾਲਾਨਾ ਆਮਦਨ ਦਾ cover\n🏥 Health Insurance: ਘੱਟੋ ਘੱਟ ₹5 ਲੱਖ ਦਾ cover\n🚗 Vehicle Insurance: Third party ਲਾਜ਼ਮੀ, comprehensive ਬਿਹਤਰ\n🏠 Home Insurance: ਘਰ ਦੀ ਸੁਰੱਖਿਆ ਲਈ ਜ਼ਰੂਰੀ\n👨‍👩‍👧‍👦 Family Floater: ਪੂਰੇ ਪਰਿਵਾਰ ਲਈ ਇੱਕ ਪਾਲਿਸੀ\n💡 Term insurance ਸਭ ਤੋਂ ਸਸਤਾ ਅਤੇ ਬਿਹਤਰ ਵਿਕਲਪ\n\nਕਿਹੜਾ ਬੀਮਾ ਤੁਹਾਨੂੰ ਚਾਹੀਦਾ ਹੈ?",
      loan: "� ਲੋਨ ਦੀ ਸਮਾਰਟ ਜਾਣਕਾਰੀ:\n\n🏠 Home Loan: 6.5-8.5% ਵਿਆਜ ਦਰ, 20 ਸਾਲ ਤੱਕ\n� Car Loan: 7-12% ਵਿਆਜ ਦਰ, 7 ਸਾਲ ਤੱਕ\n🎓 Education Loan: 7-15% ਵਿਆਜ ਦਰ, government schemes ਉਪਲਬਧ\n💳 Personal Loan: 10-20% ਵਿਆਜ ਦਰ (ਸਭ ਤੋਂ ਮਹਿੰਗਾ)\n📊 EMI ਤੁਹਾਡੀ income ਦੇ 40% ਤੋਂ ਵੱਧ ਨਹੀਂ ਹੋਣਾ ਚਾਹੀਦਾ\n🔍 ਵੱਖ-ਵੱਖ banks ਤੋਂ rates compare ਕਰੋ\n\nਕਿਸ ਕਿਸਮ ਦਾ ਲੋਨ ਚਾਹੀਦਾ ਹੈ?",
      default: "� ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ!\n\n💡 ਤੁਸੀਂ ਮੈਨੂੰ ਪੁੱਛ ਸਕਦੇ ਹੋ:\n• 💰 ਬਚਤ ਅਤੇ ਨਿਵੇਸ਼ ਰਣਨੀਤੀਆਂ\n• 🛡️ ਬੀਮਾ ਅਤੇ ਸੁਰੱਖਿਆ ਯੋਜਨਾਵਾਂ\n• � ਲੋਨ ਅਤੇ EMI ਜਾਣਕਾਰੀ\n• � Credit Score ਸੁਧਾਰਨ ਦੇ ਤਰੀਕੇ\n• 💸 Tax saving ਦੇ ਤਰੀਕੇ\n• 🚨 Emergency fund planning\n• 👴 Retirement planning\n\n🎯 ਤੁਹਾਡਾ ਕੋਈ ਖਾਸ ਸਵਾਲ ਹੈ?"
    }
  };

  // Auto-close chat when QR scanning starts
  useEffect(() => {
    if (isQRScanning && isChatOpen) {
      setIsChatOpen(false);
    }
  }, [isQRScanning]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = languages[selectedLanguage].code;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [selectedLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = useCallback((userMessage) => {
    const message = userMessage.toLowerCase();
    const responses = botResponses[selectedLanguage];
    
    // Enhanced comprehensive keyword matching with more financial topics
    if (message.includes('बचत') || message.includes('saving') || message.includes('ਬਚਤ') || 
        message.includes('save') || message.includes('पैसे बचाना') || message.includes('money save') ||
        message.includes('emergency fund') || message.includes('fd') || message.includes('fixed deposit') ||
        message.includes('ppf') || message.includes('deposit') || message.includes('बचाना')) {
      return responses.savings;
    } else if (message.includes('निवेश') || message.includes('investment') || message.includes('ਨਿਵੇਸ਼') ||
               message.includes('invest') || message.includes('sip') || message.includes('mutual fund') ||
               message.includes('equity') || message.includes('share') || message.includes('stock') ||
               message.includes('elss') || message.includes('portfolio') || message.includes('returns') ||
               message.includes('dividend') || message.includes('capital gain')) {
      return responses.investment;
    } else if (message.includes('बीमा') || message.includes('insurance') || message.includes('ਬੀਮਾ') ||
               message.includes('health') || message.includes('life') || message.includes('term') ||
               message.includes('policy') || message.includes('coverage') || message.includes('medical') ||
               message.includes('vehicle') || message.includes('car insurance') || message.includes('cover') ||
               message.includes('premium') || message.includes('claim')) {
      return responses.insurance;
    } else if (message.includes('लोन') || message.includes('loan') || message.includes('ਲੋਨ') ||
               message.includes('home loan') || message.includes('personal loan') || message.includes('education loan') ||
               message.includes('car loan') || message.includes('emi') || message.includes('credit') ||
               message.includes('mortgage') || message.includes('finance') || message.includes('interest rate') ||
               message.includes('collateral') || message.includes('guarantee')) {
      return responses.loan;
    } else if (message.includes('credit score') || message.includes('cibil') || message.includes('क्रेडिट स्कोर') ||
               message.includes('credit report') || message.includes('credit history') || message.includes('rating') ||
               message.includes('creditworthiness') || message.includes('score check')) {
      return responses.creditScore || responses.default;
    } else if (message.includes('tax') || message.includes('टैक्स') || message.includes('income tax') ||
               message.includes('80c') || message.includes('deduction') || message.includes('tax saving') ||
               message.includes('tax return') || message.includes('tds') || message.includes('income tax return')) {
      return responses.tax || responses.default;
    } else if (message.includes('emergency') || message.includes('इमरजेंसी') || message.includes('crisis') ||
               message.includes('urgent money') || message.includes('emergency fund') || message.includes('contingency')) {
      return responses.emergency || responses.default;
    } else if (message.includes('retirement') || message.includes('रिटायरमेंट') || message.includes('pension') ||
               message.includes('60 years') || message.includes('old age') || message.includes('senior citizen') ||
               message.includes('post retirement') || message.includes('nps')) {
      return responses.retirement || responses.default;
    } else if (message.includes('digital banking') || message.includes('online banking') || message.includes('mobile banking') ||
               message.includes('upi') || message.includes('netbanking') || message.includes('digital payment') ||
               message.includes('wallet') || message.includes('paytm') || message.includes('phonepe') ||
               message.includes('google pay') || message.includes('भीम') || message.includes('qr code')) {
      return `💳 Digital Banking Tips:\n\n📱 UPI apps: Google Pay, PhonePe, Paytm\n🔒 Always use secure networks\n💰 Check transaction limits\n🎁 Collect reward points\n📊 Track expenses digitally\n🚫 Never share OTP or PIN\n\nकौन सा digital payment method use करते हैं?`;
    } else if (message.includes('नमस्ते') || message.includes('hello') || message.includes('ਸਤ ਸ੍ਰੀ ਅਕਾਲ') ||
               message.includes('hi') || message.includes('hey') || message.includes('namaste') ||
               message.includes('good morning') || message.includes('good evening') || message.includes('help') ||
               message.includes('start') || message.includes('शुरू')) {
      return responses.greeting;
    } else {
      return responses.default;
    }
  }, [selectedLanguage]);

  const handleSendMessage = useCallback(() => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const currentInput = inputMessage; // Store input before clearing
    setMessages(prev => [...prev, userMessage]);
    setNewMessageAnimation(userMessage.id);
    setInputMessage(''); // Clear input immediately
    setIsTyping(true);

    // Optimized bot response with reduced delay
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: generateBotResponse(currentInput), // Use stored input
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setNewMessageAnimation(botMessage.id);
      setIsTyping(false);
    }, 1200); // Reduced from 1500ms for faster response

    // Clear animation after delay
    setTimeout(() => {
      setNewMessageAnimation(null);
    }, 2500); // Reduced from 3000ms
  }, [inputMessage, generateBotResponse]);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = languages[selectedLanguage].code;
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Only show chatbot if visible prop is true and not QR scanning */}
      {isVisible && !isQRScanning && (
        <>
          {/* Enhanced Floating Chat Button with Particle Effects */}
          {!isChatOpen && (
            <div 
              className="fixed bottom-6 right-6 z-50 cursor-pointer transform hover:scale-110 transition-all duration-500"
              onClick={() => setIsChatOpen(true)}
            >
              {/* Multiple Ripple Effects */}
              <div className="absolute inset-0 rounded-full bg-green-300 animate-ping opacity-20"></div>
              <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30 animation-delay-300"></div>
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20 animation-delay-600"></div>
              
              {/* Rotating Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-spin opacity-50"></div>
              
              {/* Main Button with Enhanced Gradients */}
              <div className="relative bg-gradient-to-br from-green-300 via-green-500 to-green-700 w-20 h-20 rounded-full shadow-2xl flex items-center justify-center animate-bounce hover:shadow-green-500/60 hover:shadow-3xl transition-all duration-500 border-4 border-white/20">
                {/* Glass Effect Overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-white/10 to-transparent"></div>
                
                {/* Inner Glow */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-400/50 to-transparent animate-pulse"></div>
                
                {/* Chat Icon with Animation */}
                <svg className="w-10 h-10 text-white animate-pulse z-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Enhanced Notification Badge */}
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl animate-bounce border-2 border-white">
                <div className="absolute inset-0 rounded-full bg-yellow-300 animate-ping opacity-40"></div>
                <div className="relative w-3 h-3 bg-white rounded-full animate-pulse shadow-inner"></div>
              </div>
              
              {/* Floating Particles */}
              <div className="absolute -top-4 -left-4 w-2 h-2 bg-green-300 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute -bottom-2 -right-6 w-1 h-1 bg-yellow-400 rounded-full animate-bounce opacity-80" style={{animationDelay: '1s'}}></div>
              <div className="absolute -top-6 right-2 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce opacity-70" style={{animationDelay: '1.5s'}}></div>
            </div>
          )}

      {/* Ultra Enhanced Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[650px] bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl border-2 border-gray-200/50 flex flex-col overflow-hidden animate-slideInFromBottom transform transition-all duration-600 hover:shadow-4xl backdrop-blur-sm">
          {/* Premium Gradient Header with Advanced Effects */}
          <div className="relative bg-gradient-to-br from-green-300 via-green-500 via-green-600 to-green-800 p-5 text-white overflow-hidden">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 opacity-15">
              <div className="absolute w-40 h-40 bg-white rounded-full -top-20 -right-20 animate-spin-slow"></div>
              <div className="absolute w-32 h-32 bg-yellow-300 rounded-full -bottom-16 -left-16 animate-bounce"></div>
              <div className="absolute w-24 h-24 bg-white rounded-full top-4 left-4 animate-pulse"></div>
              <div className="absolute w-16 h-16 bg-yellow-200 rounded-full bottom-4 right-8 animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
            
            {/* Floating Geometric Shapes */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute w-8 h-8 bg-white rotate-45 top-8 right-12 animate-spin"></div>
              <div className="absolute w-6 h-6 bg-yellow-300 rotate-12 bottom-8 left-16 animate-bounce"></div>
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-25 rounded-full flex items-center justify-center animate-pulse backdrop-blur-md border border-white/20 shadow-lg">
                  <svg className="w-7 h-7 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="animate-fadeInRight">
                  <h3 className="font-bold text-xl animate-pulse drop-shadow-lg">ArthRakshak Assistant</h3>
                  <p className="text-green-100 text-sm animate-fadeIn drop-shadow-md">🚀 आपका स्मार्ट वित्तीय सहायक</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-25 rounded-full p-3 transition-all duration-400 transform hover:scale-110 hover:rotate-90 backdrop-blur-sm border border-white/20 shadow-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Premium Language Selector */}
            <div className="relative flex space-x-2 mt-4 animate-fadeInUp">
              {Object.entries(languages).map(([key, lang], index) => (
                <button
                  key={key}
                  onClick={() => setSelectedLanguage(key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-400 transform hover:scale-110 animate-fadeInUp backdrop-blur-md border shadow-lg ${
                    selectedLanguage === key 
                      ? 'bg-white text-green-700 shadow-xl scale-110 border-white/50' 
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30 border-white/20'
                  }`}
                  style={{animationDelay: `${index * 150}ms`}}
                >
                  <span className="animate-bounce inline-block text-lg">{lang.flag}</span> 
                  <span className="ml-1">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ultra Premium Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-br from-gray-50 via-white to-gray-50 custom-scrollbar relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute w-full h-full bg-gradient-to-br from-green-100 to-transparent"></div>
            </div>
            
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp relative`}
                style={{animationDelay: `${index * 150}ms`}}
              >
                <div
                  className={`max-w-xs px-5 py-4 rounded-3xl shadow-xl transition-all duration-400 transform hover:scale-105 relative overflow-hidden ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white rounded-br-lg animate-slideInRight hover:shadow-green-500/40 border border-green-300/50'
                      : 'bg-gradient-to-br from-white via-gray-50 to-white text-gray-800 rounded-bl-lg border-2 border-gray-200/50 animate-slideInLeft hover:shadow-2xl'
                  } ${newMessageAnimation === message.id ? 'animate-bounceIn' : ''}`}
                >
                  {/* Message Glow Effect */}
                  <div className={`absolute inset-0 rounded-3xl opacity-20 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-tr from-white/30 to-transparent' 
                      : 'bg-gradient-to-br from-green-100/50 to-transparent'
                  }`}></div>
                  
                  <p className="text-sm leading-relaxed relative z-10 font-medium">{message.text}</p>
                  <p className={`text-xs mt-3 relative z-10 font-semibold ${
                    message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Enhanced Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-gradient-to-br from-white via-gray-50 to-white text-gray-800 rounded-3xl rounded-bl-lg border-2 border-gray-200/50 px-5 py-4 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-100/30 to-transparent opacity-50"></div>
                  <div className="flex space-x-2 relative z-10">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce shadow-lg"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input Container with Glowing Effects */}
          <div className="p-4 bg-gradient-to-r from-white to-gray-50 border-t border-gray-200 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    selectedLanguage === 'hindi' ? 'अपना संदेश लिखें...' :
                    selectedLanguage === 'english' ? 'Type your message...' :
                    'ਆਪਣਾ ਸੰਦੇਸ਼ ਲਿਖੋ...'
                  }
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white shadow-inner hover:shadow-lg placeholder-gray-400"
                />
                
                {/* Enhanced Voice Input Button */}
                <button
                  onClick={handleVoiceInput}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50' 
                      : 'text-gray-400 hover:text-green-500 hover:bg-green-50 hover:scale-110'
                  }`}
                >
                  <svg className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Enhanced Send Button with Rotation Animation */}
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === ''}
                className={`p-3 rounded-xl transition-all duration-300 transform ${
                  inputMessage.trim() === ''
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white hover:from-green-500 hover:to-green-700 shadow-lg hover:shadow-green-500/50 hover:scale-110 active:scale-95'
                }`}
              >
                <svg className={`w-5 h-5 transition-transform duration-300 ${inputMessage.trim() !== '' ? 'hover:rotate-45' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>

            {/* Enhanced Voice Status with Pulsing Animation */}
            {isListening && (
              <div className="mt-3 flex items-center justify-center space-x-2 text-red-500 animate-fadeIn">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm font-medium animate-pulse">
                  {selectedLanguage === 'hindi' ? 'सुन रहा हूँ...' :
                   selectedLanguage === 'english' ? 'Listening...' :
                   'ਸੁਣ ਰਿਹਾ ਹਾਂ...'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
        </>
      )}

      {/* Custom CSS Styles for Enhanced Animations */}
      <style jsx>{`
        @keyframes slideInFromBottom {
          from {
            transform: translateY(100%) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInRight {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-slideInFromBottom {
          animation: slideInFromBottom 0.5s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.5s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.4s ease-out;
        }

        .animate-bounceIn {
          animation: bounceIn 0.6s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #22c55e, #16a34a);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #16a34a, #15803d);
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .shadow-4xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.35);
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        /* Particle Effects */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Glass Morphism Effect */
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Enhanced Glow Effects */
        .glow-green {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
        }

        .glow-yellow {
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
        }

        /* Premium Scroll Bar for Mobile */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #22c55e #f1f1f1;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
          border-radius: 12px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #22c55e, #16a34a, #15803d);
          border-radius: 12px;
          border: 2px solid transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #16a34a, #15803d, #166534);
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }

        /* Status Bar Safe Area */
        @supports (padding-top: env(safe-area-inset-top)) {
          .status-bar-safe {
            padding-top: env(safe-area-inset-top);
          }
        }

        /* Enhanced Mobile Responsiveness */
        @media (max-width: 640px) {
          .chatbot-container {
            width: calc(100vw - 24px);
            height: calc(100vh - 100px);
            bottom: 12px;
            right: 12px;
          }
        }

        /* Advanced Particle System */
        @keyframes particle-float {
          0% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.7;
          }
          33% { 
            transform: translateY(-15px) translateX(10px) rotate(120deg);
            opacity: 1;
          }
          66% { 
            transform: translateY(-8px) translateX(-8px) rotate(240deg);
            opacity: 0.8;
          }
          100% { 
            transform: translateY(0px) translateX(0px) rotate(360deg);
            opacity: 0.7;
          }
        }

        .animate-particle-float {
          animation: particle-float 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
});

// Performance optimization: Add display name for debugging
Chatbot.displayName = 'Chatbot';

export default Chatbot;