/**
 * Fraud risk scoring system for simulations
 */

// Predefined risk actions and their scores
export const RISK_ACTIONS = {
  CLICKED_PHISHING_LINK: {
    id: 'clicked_phishing_link',
    score: 20,
    message: 'Clicked on suspicious phishing link',
    advice: 'Always verify the sender before clicking links in emails or messages',
  },
  ENTERED_CARD_INFO: {
    id: 'entered_card_info',
    score: 30,
    message: 'Entered card information on unsecure site',
    advice: 'Only enter card details on secure websites (look for https:// and lock icon)',
  },
  SHARED_OTP: {
    id: 'shared_otp',
    score: 50,
    message: 'Shared OTP with unauthorized person',
    advice: 'Never share OTPs with anyone, even if they claim to be from your bank',
  },
  IGNORED_SECURITY_WARNING: {
    id: 'ignored_security_warning',
    score: 10,
    message: 'Ignored security warning',
    advice: 'Always take security warnings seriously',
  },
  DOWNLOADED_UNKNOWN_APP: {
    id: 'downloaded_unknown_app',
    score: 25,
    message: 'Downloaded unknown application',
    advice: 'Only download apps from official app stores',
  },
  USED_PUBLIC_WIFI: {
    id: 'used_public_wifi',
    score: 15,
    message: 'Used unsecured public WiFi for banking',
    advice: 'Avoid using public WiFi for sensitive transactions',
  },
};

/**
 * Calculate total risk score from recorded actions
 * @param {Array} actions - Array of action IDs
 * @returns {Object} - Score details
 */
export const calculateRiskScore = (actions = []) => {
  let totalScore = 0;
  const recordedActions = [];
  
  actions.forEach(actionId => {
    const action = RISK_ACTIONS[actionId];
    if (action) {
      totalScore += action.score;
      recordedActions.push(action);
    }
  });
  
  // Ensure score is between 0-100
  totalScore = Math.min(Math.max(totalScore, 0), 100);
  
  // Determine risk level
  let riskLevel = 'SAFE';
  let riskColor = '#4CAF50'; // Green
  
  if (totalScore > 60) {
    riskLevel = 'CRITICAL';
    riskColor = '#F44336'; // Red
  } else if (totalScore > 30) {
    riskLevel = 'RISKY';
    riskColor = '#FFC107'; // Yellow/Amber
  }
  
  return {
    score: totalScore,
    riskLevel,
    riskColor,
    actions: recordedActions,
  };
};

/**
 * Get recovery recommendations based on recorded actions
 * @param {Array} actions - Array of action IDs
 * @returns {Array} - Recovery recommendations
 */
export const getRecoveryRecommendations = (actions = []) => {
  const recommendations = [
    {
      id: 'block_card',
      title: 'Block Your Card Immediately',
      description: 'Call your banks 24/7 helpline to block your card',
      icon: 'card',
      priority: 'high',
    },
    {
      id: 'report_fraud',
      title: 'Report the Fraud',
      description: 'File a complaint at https://cybercrime.gov.in',
      icon: 'shield',
      priority: 'high',
    },
  ];
  
  if (actions.includes('RISK_ACTIONS.SHARED_OTP')) {
    recommendations.push({
      id: 'check_account',
      title: 'Check Your Account',
      description: 'Review recent transactions for unauthorized charges',
      icon: 'search',
      priority: 'high',
    });
  }
  
  if (actions.includes('RISK_ACTIONS.DOWNLOADED_UNKNOWN_APP')) {
    recommendations.push({
      id: 'scan_device',
      title: 'Scan Your Device',
      description: 'Run antivirus software to check for malware',
      icon: 'scan',
      priority: 'medium',
    });
  }
  
  return recommendations;
};

/**
 * Get prevention tips based on risk level
 * @param {string} riskLevel - Risk level (SAFE, RISKY, CRITICAL)
 * @returns {Array} - Prevention tips
 */
export const getPreventionTips = (riskLevel = 'SAFE') => {
  const commonTips = [
    {
      id: 'check_url',
      title: 'Check Website URLs',
      description: 'Always verify the website address before entering sensitive information',
      icon: 'globe',
    },
    {
      id: 'avoid_public_wifi',
      title: 'Avoid Public WiFi',
      description: 'Don\'t perform banking transactions on public networks',
      icon: 'wifi',
    },
    {
      id: 'never_share_otp',
      title: 'Never Share OTPs',
      description: 'Banks never ask for OTPs over phone or email',
      icon: 'key',
    },
    {
      id: 'virtual_cards',
      title: 'Use Virtual Cards',
      description: 'Use virtual or temporary cards for online shopping',
      icon: 'card',
    },
  ];
  
  if (riskLevel === 'CRITICAL') {
    commonTips.unshift({
      id: 'enable_alerts',
      title: 'Enable Transaction Alerts',
      description: 'Set up SMS/email notifications for all transactions',
      icon: 'notifications',
    });
  }
  
  return commonTips;
};