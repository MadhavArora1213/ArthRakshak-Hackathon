import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const iconMap = {
  error: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png',
  recovery: 'https://cdn-icons-png.flaticon.com/512/5460/5460873.png',
  tip: 'https://cdn-icons-png.flaticon.com/512/2989/2989898.png',
  warning: 'https://cdn-icons-png.flaticon.com/512/747/747589.png',
  success: 'https://cdn-icons-png.flaticon.com/512/148/148767.png',
};

/**
 * Feedback panel component to display action feedback, tips, or recommendations
 * 
 * @param {Object} props Component props
 * @param {string} props.title The title text
 * @param {string} props.description The description text
 * @param {string} props.iconType Type of icon to display (error, recovery, tip, warning, success)
 * @param {Object} props.style Additional style for the container
 */
const FeedbackPanel = ({ title, description, iconType = 'tip', style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Image 
          source={{ uri: iconMap[iconType] || iconMap.tip }} 
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1e3a8a',
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default FeedbackPanel;