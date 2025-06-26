const colors = {
  // Primary Green - Success, Growth, Savings
  primaryGreen: {
    50: '#f0fdf4',   // Lightest green for subtle highlights
    100: '#dcfce7',  // Light green for success messages
    200: '#bbf7d0',  // Soft green for positive indicators
    300: '#86efac',  // Medium-light green for growth charts
    400: '#4ade80',  // Bright green for call-to-action buttons
    500: '#22c55e',  // Main brand green
    600: '#16a34a',  // Darker green for hover states
    700: '#15803d',  // Deep green for active states
    800: '#166534',  // Very dark green for text on light backgrounds
    900: '#14532d',  // Darkest green for emphasis
  },

  // Information Yellow - Tips, Learning, Warnings
  infoYellow: {
    50: '#fefce8',   // Subtle yellow background
    100: '#fef3c7',  // Light yellow for info cards
    200: '#fde68a',  // Soft yellow for learning badges
    300: '#fcd34d',  // Medium yellow for tips
    400: '#fbbf24',  // Bright yellow for notifications
    500: '#f59e0b',  // Main info yellow
    600: '#d97706',  // Darker yellow for important tips
    700: '#b45309',  // Deep yellow for emphasis
    800: '#92400e',  // Very dark yellow
    900: '#78350f',  // Darkest yellow
  },

  // Alert Red - Debt Warnings, Security Alerts
  alertRed: {
    50: '#fef2f2',   // Very subtle red background
    100: '#fee2e2',  // Light red for minor warnings
    200: '#fecaca',  // Soft red for alerts
    300: '#fca5a5',  // Medium red for notifications
    400: '#f87171',  // Bright red for warnings
    500: '#ef4444',  // Main alert red
    600: '#dc2626',  // Darker red for critical alerts
    700: '#b91c1c',  // Deep red for errors
    800: '#991b1b',  // Very dark red
    900: '#7f1d1d',  // Darkest red for critical emphasis
  },

  // Pure White - Clean Contrast, Text
  pureWhite: {
    50: '#ffffff',   // Pure white for highest contrast
    100: '#fafafa',  // Off-white for subtle backgrounds
    200: '#f5f5f5',  // Light gray-white for cards
    300: '#e5e5e5',  // Medium gray-white for borders
    400: '#d4d4d4',  // Darker gray-white for dividers
    500: '#a3a3a3',  // Medium gray for secondary text
    600: '#737373',  // Dark gray for muted text
    700: '#525252',  // Darker gray for disabled states
    800: '#404040',  // Very dark gray
    900: '#262626',  // Almost black gray
  },

  // Dark Mode Base - Primary Backgrounds
  bgDark: {
    50: '#18181b',   // Lightest dark (zinc-900)
    100: '#09090b',  // Pure black for deepest backgrounds
    200: '#27272a',  // Zinc-800 for elevated surfaces
    300: '#3f3f46',  // Zinc-700 for cards and modals
    400: '#52525b',  // Zinc-600 for interactive elements
    500: '#71717a',  // Zinc-500 for borders and dividers
    600: '#a1a1aa',  // Zinc-400 for muted text
    700: '#d4d4d8',  // Zinc-300 for secondary text
    800: '#e4e4e7',  // Zinc-200 for primary text on dark
    900: '#f4f4f5',  // Zinc-100 for highest contrast text
  },

  // Semantic Color Mappings for Easy Usage
  semantic: {
    // Success states
    success: '#22c55e',        // primaryGreen-500
    successMuted: '#dcfce7',   // primaryGreen-100
    successDark: '#15803d',    // primaryGreen-700

    // Warning states
    warning: '#f59e0b',        // infoYellow-500
    warningMuted: '#fef3c7',   // infoYellow-100
    warningDark: '#b45309',    // infoYellow-700

    // Error states
    error: '#ef4444',          // alertRed-500
    errorMuted: '#fee2e2',     // alertRed-100
    errorDark: '#b91c1c',      // alertRed-700

    // Background colors
    bgPrimary: '#09090b',      // bgDark-100 (main app background)
    bgSecondary: '#18181b',    // bgDark-50 (elevated surfaces)
    bgTertiary: '#27272a',     // bgDark-200 (cards, modals)

    // Text colors
    textPrimary: '#f4f4f5',    // bgDark-900 (main text on dark)
    textSecondary: '#e4e4e7',  // bgDark-800 (secondary text)
    textMuted: '#a1a1aa',      // bgDark-600 (muted text)
    textInverse: '#262626',    // pureWhite-900 (text on light backgrounds)

    // Border colors
    borderPrimary: '#3f3f46',  // bgDark-300
    borderSecondary: '#71717a', // bgDark-500
    borderMuted: '#52525b',    // bgDark-400
  },

  // Financial App Specific Colors
  financial: {
    // Investment growth
    bullish: '#22c55e',        // Green for positive returns
    bearish: '#ef4444',        // Red for negative returns
    neutral: '#71717a',        // Gray for no change

    // Account types
    savings: '#16a34a',        // Deep green for savings
    investment: '#4ade80',     // Bright green for investments
    debt: '#f87171',           // Light red for debt accounts
    credit: '#fbbf24',         // Yellow for credit accounts

    // Status indicators
    active: '#22c55e',         // Green for active status
    pending: '#f59e0b',        // Yellow for pending
    inactive: '#71717a',       // Gray for inactive
    expired: '#ef4444',        // Red for expired
  }
};

export default colors;

// Usage example in tailwind.config.js:
// import colors from './src/styles/themes/colors.js';
// 
// module.exports = {
//   theme: {
//     extend: {
//       colors: {
//         ...colors,
//       }
//     }
//   }
// }

// Usage in components:
// className="bg-bgDark-100 text-pureWhite-50"
// className="text-primaryGreen-500 border-primaryGreen-600"
// className="bg-semantic-bgPrimary text-semantic-textPrimary"