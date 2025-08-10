import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClaritySettings } from '@/contexts/AppContext';

interface ProgressRingProps {
  progress: number;
  total: number;
  size?: number;
  claritySettings: ClaritySettings;
}

export default function ProgressRing({
  progress,
  total,
  size = 80,
  claritySettings,
}: ProgressRingProps) {
  const percentage = total > 0 ? (progress / total) * 100 : 0;
  const circumference = 2 * Math.PI * (size / 2 - 8);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const dynamicStyles = createDynamicStyles(claritySettings, size);
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.ring, dynamicStyles.ring]}>
        <View style={[styles.progressRing, dynamicStyles.progressRing, {
          width: size - 8,
          height: size - 8,
        }]} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.progressText, dynamicStyles.progressText]}>
          {progress}/{total}
        </Text>
        <Text style={[styles.label, dynamicStyles.label]}>
          read
        </Text>
      </View>
    </View>
  );
}

const createDynamicStyles = (claritySettings: ClaritySettings, size: number) => {
  const fontMultiplier = claritySettings.fontSize === 'large' ? 1.2 : 
                        claritySettings.fontSize === 'small' ? 0.9 : 1;
  const ringColor = claritySettings.calmMode ? '#FF8A80' : '#FF3B30';
  const textColor = claritySettings.highContrast ? '#000000' : '#111111';
  
  return StyleSheet.create({
    ring: {
      borderColor: claritySettings.highContrast ? '#CCCCCC' : '#F6F7F9',
    },
    progressRing: {
      borderColor: ringColor,
    },
    progressText: {
      fontSize: Math.round(16 * fontMultiplier),
      color: textColor,
    },
    label: {
      fontSize: Math.round(12 * fontMultiplier),
      color: claritySettings.highContrast ? '#333333' : '#6B7280',
    },
  });
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderWidth: 4,
    borderColor: '#F6F7F9',
    borderRadius: 1000,
  },
  progressRing: {
    borderWidth: 4,
    borderColor: '#FF3B30',
    borderRadius: 1000,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  textContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});