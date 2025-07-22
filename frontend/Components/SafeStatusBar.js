import React from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

/**
 * SafeStatusBar Component
 * Handles edge-to-edge StatusBar without backgroundColor warnings
 */
const SafeStatusBar = ({ style = 'auto', backgroundColor = 'transparent' }) => {
  return (
    <>
      <ExpoStatusBar style={style} />
      {Platform.OS === 'android' && backgroundColor !== 'transparent' && (
        <View 
          style={{
            height: StatusBar.currentHeight || 24,
            backgroundColor: backgroundColor,
          }}
        />
      )}
    </>
  );
};

export default SafeStatusBar;
