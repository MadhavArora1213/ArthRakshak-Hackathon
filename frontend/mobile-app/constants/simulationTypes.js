/**
 * Types of fraud simulations
 */

export const SIMULATION_TYPES = {
  PHISHING: 'PHISHING',
  PAYMENT_SCAM: 'PAYMENT_SCAM',
  OTP_FRAUD: 'OTP_FRAUD',
  FAKE_APP: 'FAKE_APP',
  SKIMMING: 'SKIMMING',
  VISHING: 'VISHING',
};

/**
 * Types of screens in the simulation flow
 */
export const SCREEN_TYPES = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  WEBSITE: 'WEBSITE',
  CALL: 'CALL',
  APP_STORE: 'APP_STORE',
  PAYMENT: 'PAYMENT',
  POPUP: 'POPUP',
};

/**
 * Types of user actions
 */
export const ACTION_TYPES = {
  CLICK: 'CLICK',
  INPUT: 'INPUT',
  IGNORE: 'IGNORE',
  DOWNLOAD: 'DOWNLOAD',
  CALL: 'CALL',
};

/**
 * Risk levels
 */
export const RISK_LEVELS = {
  SAFE: {
    id: 'SAFE',
    label: 'Safe',
    color: '#4CAF50',
    range: [0, 30],
  },
  RISKY: {
    id: 'RISKY',
    label: 'Risky',
    color: '#FFC107',
    range: [31, 60],
  },
  CRITICAL: {
    id: 'CRITICAL',
    label: 'Critical',
    color: '#F44336',
    range: [61, 100],
  },
};