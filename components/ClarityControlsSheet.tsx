import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { ClaritySettings } from '@/contexts/AppContext';

interface ClarityControlsSheetProps {
  isVisible: boolean;
  onClose: () => void;
  settings: ClaritySettings;
  onUpdateSettings: (settings: Partial<ClaritySettings>) => void;
}

export default function ClarityControlsSheet({
  isVisible,
  onClose,
  settings,
  onUpdateSettings,
}: ClarityControlsSheetProps) {
  if (!isVisible) return null;

  const fontSizes = [
    { key: 'small' as const, label: 'Small', size: 14 },
    { key: 'medium' as const, label: 'Medium', size: 16 },
    { key: 'large' as const, label: 'Large', size: 18 },
  ];

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Clarity Controls</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" strokeWidth={2} />
          </Pressable>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Font Size */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Font Size</Text>
            <View style={styles.fontSizeOptions}>
              {fontSizes.map((option) => (
                <Pressable
                  key={option.key}
                  style={[
                    styles.fontSizeOption,
                    settings.fontSize === option.key && styles.fontSizeOptionActive,
                  ]}
                  onPress={() => onUpdateSettings({ fontSize: option.key })}
                >
                  <Text style={[
                    styles.fontSizeLabel,
                    { fontSize: option.size },
                    settings.fontSize === option.key && styles.fontSizeOptionActiveText,
                  ]}>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.previewText}>
              This is how your text will appear
            </Text>
          </View>

          {/* Toggle Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visual Adjustments</Text>
            
            <View style={styles.toggleOption}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>High Contrast</Text>
                <Text style={styles.toggleDescription}>
                  Increases text and background contrast
                </Text>
              </View>
              <Pressable
                style={[
                  styles.toggle,
                  settings.highContrast && styles.toggleActive,
                ]}
                onPress={() => onUpdateSettings({ highContrast: !settings.highContrast })}
              >
                <View style={[
                  styles.toggleThumb,
                  settings.highContrast && styles.toggleThumbActive,
                ]} />
              </Pressable>
            </View>

            <View style={styles.toggleOption}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>Calm Mode</Text>
                <Text style={styles.toggleDescription}>
                  Reduces visual intensity and colors
                </Text>
              </View>
              <Pressable
                style={[
                  styles.toggle,
                  settings.calmMode && styles.toggleActive,
                ]}
                onPress={() => onUpdateSettings({ calmMode: !settings.calmMode })}
              >
                <View style={[
                  styles.toggleThumb,
                  settings.calmMode && styles.toggleThumbActive,
                ]} />
              </Pressable>
            </View>

            <View style={styles.toggleOption}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>Read Aloud (TTS)</Text>
                <Text style={styles.toggleDescription}>
                  Text-to-speech for articles
                </Text>
              </View>
              <Pressable
                style={[
                  styles.toggle,
                  settings.readAloud && styles.toggleActive,
                ]}
                onPress={() => onUpdateSettings({ readAloud: !settings.readAloud })}
              >
                <View style={[
                  styles.toggleThumb,
                  settings.readAloud && styles.toggleThumbActive,
                ]} />
              </Pressable>
            </View>

            <View style={styles.toggleOption}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>Reduced Motion</Text>
                <Text style={styles.toggleDescription}>
                  Minimizes animations and transitions
                </Text>
              </View>
              <Pressable
                style={[
                  styles.toggle,
                  settings.reducedMotion && styles.toggleActive,
                ]}
                onPress={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              >
                <View style={[
                  styles.toggleThumb,
                  settings.reducedMotion && styles.toggleThumbActive,
                ]} />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F7F9',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111111',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 16,
  },
  fontSizeOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  fontSizeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F6F7F9',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  fontSizeOptionActive: {
    backgroundColor: '#FFF1F0',
    borderColor: '#FF3B30',
  },
  fontSizeLabel: {
    fontWeight: '500',
    color: '#111111',
  },
  fontSizeOptionActiveText: {
    color: '#FF3B30',
  },
  previewText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F7F9',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111111',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#FF3B30',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});