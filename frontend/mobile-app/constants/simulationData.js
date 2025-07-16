import { SIMULATION_TYPES, SCREEN_TYPES, ACTION_TYPES } from './simulationTypes';

/**
 * Fraud simulation data with multiple scenarios
 */
export const SIMULATIONS = [
  {
    id: 'credit_card_fraud_simulation',
    title: 'Credit Card Fraud Simulation',
    description: 'Experience how real credit card fraud happens and learn how to prevent it',
    difficulty: 'Beginner',
    durationMinutes: 5,
    icon: 'card',
    steps: [
      // Step 1: Phishing Email
      {
        id: 'phishing_email',
        type: SIMULATION_TYPES.PHISHING,
        screenType: SCREEN_TYPES.EMAIL,
        title: 'Urgent: Action Required on Your SBI Card',
        content: {
          from: 'security.alerts@sbi-secure-banking.com',
          to: 'customer@email.com',
          subject: 'URGENT: Your SBI Card will be blocked in 24 hours',
          body: 'Dear Valued Customer,\n\nOur system has detected unusual activity on your SBI Credit Card. To prevent unauthorized transactions, your card will be blocked in 24 hours.\n\nTo verify your identity and keep your card active, please click the link below:\n\nVerify Now\n\nIgnoring this message will result in your card being temporarily blocked.\n\nSincerely,\nSBI Security Team',
          date: 'Today, 10:30 AM',
          urgencyLabel: 'URGENT: Action Required within 24 hours',
        },
        audioFile: require('../assets/simulations/audio/urgent_bank_alert.mp3'),
        countdownSeconds: 30,
        actions: [
          {
            id: 'verify_now',
            type: ACTION_TYPES.CLICK,
            label: 'Verify Now',
            isRisky: true,
            riskPoints: 20,
            leadsTo: 'fake_payment_site',
          },
          {
            id: 'ignore_email',
            type: ACTION_TYPES.IGNORE,
            label: 'Ignore Email',
            isRisky: false,
            riskPoints: 0,
            leadsTo: 'safe_result',
          },
        ],
        redFlags: [
          { id: 1, text: 'Suspicious sender email address (not ending with sbi.co.in)' },
          { id: 2, text: 'Urgent language creating panic' },
          { id: 3, text: 'Generic greeting rather than your actual name' },
          { id: 4, text: 'Grammatical errors in a supposed official communication' },
        ],
      },
      
      // Step 2: Fake Payment Gateway
      {
        id: 'fake_payment_site',
        type: SIMULATION_TYPES.PAYMENT_SCAM,
        screenType: SCREEN_TYPES.WEBSITE,
        title: 'SBI Card - Verification Portal',
        content: {
          url: 'https://sbi-card-verifyportal.secur3.com',
          logo: require('../assets/simulations/images/fake_bank_logo.png'),
          headline: 'Card Verification Portal',
          instruction: 'Please verify your card details to prevent suspension',
          fields: [
            { id: 'card_number', label: 'Card Number', placeholder: 'XXXX XXXX XXXX XXXX', type: 'number', maxLength: 16 },
            { id: 'expiry', label: 'Expiry Date', placeholder: 'MM/YY', type: 'text', maxLength: 5 },
            { id: 'cvv', label: 'CVV Code', placeholder: 'XXX', type: 'number', maxLength: 3 },
            { id: 'name', label: 'Name on Card', placeholder: 'As shown on card', type: 'text' },
          ],
          submitButton: 'Verify Card',
          urgencyText: 'System automatically verifies in: 02:00',
          securityHint: 'Your connection to this site is not secure',
        },
        audioFile: require('../assets/simulations/audio/fake_payment.mp3'),
        countdownSeconds: 120,
        actions: [
          {
            id: 'submit_card_details',
            type: ACTION_TYPES.INPUT,
            label: 'Submit Details',
            isRisky: true,
            riskPoints: 30,
            leadsTo: 'otp_sharing',
          },
          {
            id: 'close_website',
            type: ACTION_TYPES.IGNORE,
            label: 'Close Website',
            isRisky: false,
            riskPoints: 0,
            leadsTo: 'semi_safe_result',
          },
        ],
        redFlags: [
          { id: 1, text: 'Suspicious URL (not sbi.co.in)' },
          { id: 2, text: 'No HTTPS padlock in the browser' },
          { id: 3, text: 'Countdown timer creating urgency' },
          { id: 4, text: 'Asking for full card details including CVV' },
        ],
      },
      
      // Step 3: OTP Sharing
      {
        id: 'otp_sharing',
        type: SIMULATION_TYPES.OTP_FRAUD,
        screenType: SCREEN_TYPES.CALL,
        title: 'Incoming Call: SBI Fraud Department',
        content: {
          callerID: '+91 11 2256 XXXX',
          callDuration: '00:47',
          transcription: 'Hello, this is Rahul Kumar from SBI Fraud Prevention Department. We have detected suspicious transactions on your card. We\'ve sent you an OTP to verify your identity. Please share the OTP to block these transactions immediately.',
          otpMessage: 'Your SBI OTP is 485173. Do not share this with anyone including bank officials.',
          inputLabel: 'Enter OTP to confirm identity:',
        },
        audioFile: require('../assets/simulations/audio/otp.mp3'),
        countdownSeconds: 60,
        actions: [
          {
            id: 'share_otp',
            type: ACTION_TYPES.INPUT,
            label: 'Share OTP',
            isRisky: true,
            riskPoints: 50,
            leadsTo: 'fraud_result',
          },
          {
            id: 'refuse_otp',
            type: ACTION_TYPES.IGNORE,
            label: 'Refuse to Share OTP',
            isRisky: false,
            riskPoints: 0,
            leadsTo: 'safe_after_mistakes',
          },
        ],
        redFlags: [
          { id: 1, text: 'Bank officials will never ask for OTP' },
          { id: 2, text: 'Creating fear about unauthorized transactions' },
          { id: 3, text: 'Pressure to act quickly' },
          { id: 4, text: 'The OTP message itself warns not to share with anyone' },
        ],
      },
      
      // Safe Result (if avoided all fraud attempts)
      {
        id: 'safe_result',
        type: 'RESULT',
        outcome: {
          title: 'Great Job!',
          description: 'You recognized the signs of fraud and avoided becoming a victim.',
          score: 0,
          riskLevel: 'SAFE',
        },
      },
      
      // Semi-Safe Result (if clicked link but didn't share details)
      {
        id: 'semi_safe_result',
        type: 'RESULT',
        outcome: {
          title: 'Good Awareness',
          description: 'You clicked a suspicious link but stopped before sharing sensitive information.',
          score: 20,
          riskLevel: 'SAFE',
        },
      },
      
      // Safe After Mistakes (clicked link, shared card details, but refused OTP)
      {
        id: 'safe_after_mistakes',
        type: 'RESULT',
        outcome: {
          title: 'Close Call',
          description: 'You shared some information but protected your OTP. Still at significant risk.',
          score: 50,
          riskLevel: 'RISKY',
        },
      },
      
      // Full Fraud Result (fell for everything)
      {
        id: 'fraud_result',
        type: 'RESULT',
        outcome: {
          title: 'High Risk',
          description: 'You\'ve fallen victim to multiple fraud tactics. Immediate action needed.',
          score: 100,
          riskLevel: 'CRITICAL',
        },
      },
    ],
  },
  // Add more simulation scenarios here
];

/**
 * Get a simulation by ID
 */
export const getSimulationById = (id) => {
  return SIMULATIONS.find(sim => sim.id === id);
};