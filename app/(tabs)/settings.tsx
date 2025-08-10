import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Bell, MapPin, Palette, Info, Crown } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function SettingsScreen() {
  const { state, dispatch } = useApp();

  const handleToggleEditionSetting = (setting: keyof typeof state.editionSettings) => {
    dispatch({
      type: 'UPDATE_EDITION_SETTINGS',
      settings: { [setting]: !state.editionSettings[setting] },
    });
  };

  const handleToggleClaritySetting = (setting: keyof typeof state.claritySettings) => {
    const value = typeof state.claritySettings[setting] === 'boolean' 
      ? !state.claritySettings[setting]
      : state.claritySettings[setting];
    
    dispatch({
      type: 'UPDATE_CLARITY_SETTINGS',
      settings: { [setting]: value },
    });
  };

  const dynamicStyles = createDynamicStyles(state.claritySettings);

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, dynamicStyles.header]}>
          <Text style={[styles.title, dynamicStyles.title]}>Settings</Text>
        </View>

        {/* Edition Schedule */}
        <View style={[styles.section, dynamicStyles.section]}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color="#FF3B30" strokeWidth={2} />
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
              Edition Schedule
            </Text>
          </View>
          <Text style={[styles.sectionSubtitle, dynamicStyles.sectionSubtitle]}>
            Choose when to receive your curated news digests
          </Text>
          
          <View style={styles.settingsGroup}>
            <SettingToggle
              label="Morning Edition"
              description="Start your day informed (7:00 AM)"
              value={state.editionSettings.morningEdition}
              onToggle={() => handleToggleEditionSetting('morningEdition')}
              claritySettings={state.claritySettings}
            />
            
            <SettingToggle
              label="Midday What's New"
              description="Key updates during your day (12:00 PM)"
              value={state.editionSettings.middayEdition}
              onToggle={() => handleToggleEditionSetting('middayEdition')}
              claritySettings={state.claritySettings}
            />
            
            <SettingToggle
              label="Evening Wrap"
              description="End of day summary (6:00 PM)"
              value={state.editionSettings.eveningEdition}
              onToggle={() => handleToggleEditionSetting('eveningEdition')}
              claritySettings={state.claritySettings}
            />
            
            <SettingToggle
              label="Critical Updates"
              description="Only if materially changed (max 1/day)"
              value={state.editionSettings.criticalUpdates}
              onToggle={() => handleToggleEditionSetting('criticalUpdates')}
              claritySettings={state.claritySettings}
            />
          </View>
        </View>

        {/* Regions & Topics */}
        <View style={[styles.section, dynamicStyles.section]}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#2563EB" strokeWidth={2} />
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
              Regions & Topics
            </Text>
          </View>
          
          <Pressable style={[styles.settingRow, dynamicStyles.settingRow]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>
                Location
              </Text>
              <Text style={[styles.settingValue, dynamicStyles.settingValue]}>
                United States
              </Text>
            </View>
            <Text style={[styles.arrow, dynamicStyles.arrow]}>›</Text>
          </Pressable>
          
          <Pressable style={[styles.settingRow, dynamicStyles.settingRow]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>
                Interests
              </Text>
              <Text style={[styles.settingValue, dynamicStyles.settingValue]}>
                Technology, Health, Business
              </Text>
            </View>
            <Text style={[styles.arrow, dynamicStyles.arrow]}>›</Text>
          </Pressable>
        </View>

        {/* Clarity Controls */}
        <View style={[styles.section, dynamicStyles.section]}>
          <View style={styles.sectionHeader}>
            <Palette size={20} color="#10B981" strokeWidth={2} />
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
              Clarity Controls
            </Text>
          </View>
          
          <View style={styles.settingsGroup}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>
                  Font Size
                </Text>
                <Text style={[styles.settingValue, dynamicStyles.settingValue]}>
                  {state.claritySettings.fontSize.charAt(0).toUpperCase() + 
                   state.claritySettings.fontSize.slice(1)}
                </Text>
              </View>
            </View>
            
            <SettingToggle
              label="High Contrast"
              description="Increases text and background contrast"
              value={state.claritySettings.highContrast}
              onToggle={() => handleToggleClaritySetting('highContrast')}
              claritySettings={state.claritySettings}
            />
            
            <SettingToggle
              label="Calm Mode"
              description="Reduces visual intensity and colors"
              value={state.claritySettings.calmMode}
              onToggle={() => handleToggleClaritySetting('calmMode')}
              claritySettings={state.claritySettings}
            />
            
            <SettingToggle
              label="Read Aloud (TTS)"
              description="Text-to-speech for articles"
              value={state.claritySettings.readAloud}
              onToggle={() => handleToggleClaritySetting('readAloud')}
              claritySettings={state.claritySettings}
            />
            
            <SettingToggle
              label="Reduced Motion"
              description="Minimizes animations and transitions"
              value={state.claritySettings.reducedMotion}
              onToggle={() => handleToggleClaritySetting('reducedMotion')}
              claritySettings={state.claritySettings}
            />
          </View>
        </View>

        {/* Subscription */}
        <View style={[styles.section, dynamicStyles.section]}>
          <View style={styles.sectionHeader}>
            <Crown size={20} color="#F59E0B" strokeWidth={2} />
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
              Subscription
            </Text>
          </View>
          
          <View style={[styles.subscriptionCard, dynamicStyles.subscriptionCard]}>
            <Text style={[styles.subscriptionStatus, dynamicStyles.subscriptionStatus]}>
              Premium — Active
            </Text>
            <Text style={[styles.subscriptionDetails, dynamicStyles.subscriptionDetails]}>
              Unlimited editions, priority support
            </Text>
          </View>
        </View>

        {/* About */}
        <View style={[styles.section, dynamicStyles.section]}>
          <View style={styles.sectionHeader}>
            <Info size={20} color="#6B7280" strokeWidth={2} />
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
              About
            </Text>
          </View>
          
          <Pressable style={[styles.settingRow, dynamicStyles.settingRow]}>
            <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>
              About Responsible Summaries
            </Text>
            <Text style={[styles.arrow, dynamicStyles.arrow]}>›</Text>
          </Pressable>
          
          <Text style={[styles.aboutText, dynamicStyles.aboutText]}>
            We provide original neutral summaries with links to sources. 
            Images may be placeholders to respect copyright.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface SettingToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onToggle: () => void;
  claritySettings: any;
}

function SettingToggle({ label, description, value, onToggle, claritySettings }: SettingToggleProps) {
  const dynamicStyles = createDynamicStyles(claritySettings);

  return (
    <View style={[styles.settingRow, dynamicStyles.settingRow]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.settingDescription, dynamicStyles.settingDescription]}>
            {description}
          </Text>
        )}
      </View>
      <Pressable
        style={[
          styles.toggle,
          value && styles.toggleActive,
          dynamicStyles.toggle,
          value && dynamicStyles.toggleActive,
        ]}
        onPress={onToggle}
      >
        <View style={[
          styles.toggleThumb,
          value && styles.toggleThumbActive,
          dynamicStyles.toggleThumb,
        ]} />
      </Pressable>
    </View>
  );
}

const createDynamicStyles = (claritySettings: any) => {
  const fontMultiplier = claritySettings.fontSize === 'large' ? 1.2 : 
                        claritySettings.fontSize === 'small' ? 0.9 : 1;
  const textColor = claritySettings.highContrast ? '#000000' : '#111111';
  const secondaryTextColor = claritySettings.highContrast ? '#333333' : '#6B7280';
  const backgroundColor = claritySettings.highContrast ? '#FFFFFF' : '#FFFFFF';
  const cardColor = claritySettings.calmMode ? '#F8F9FA' : '#F6F7F9';
  const primaryColor = claritySettings.calmMode ? '#FF8A80' : '#FF3B30';

  return StyleSheet.create({
    container: { backgroundColor },
    header: { backgroundColor },
    title: {
      fontSize: Math.round(28 * fontMultiplier),
      color: textColor,
    },
    section: { backgroundColor },
    sectionTitle: {
      fontSize: Math.round(16 * fontMultiplier),
      color: textColor,
    },
    sectionSubtitle: {
      fontSize: Math.round(14 * fontMultiplier),
      color: secondaryTextColor,
    },
    settingRow: {
      backgroundColor: claritySettings.highContrast ? '#FFFFFF' : 'transparent',
    },
    settingLabel: {
      fontSize: Math.round(16 * fontMultiplier),
      color: textColor,
    },
    settingDescription: {
      fontSize: Math.round(12 * fontMultiplier),
      color: secondaryTextColor,
    },
    settingValue: {
      fontSize: Math.round(14 * fontMultiplier),
      color: secondaryTextColor,
    },
    arrow: {
      fontSize: Math.round(18 * fontMultiplier),
      color: secondaryTextColor,
    },
    toggle: {
      backgroundColor: claritySettings.highContrast ? '#CCCCCC' : '#E5E7EB',
    },
    toggleActive: {
      backgroundColor: primaryColor,
    },
    toggleThumb: {
      backgroundColor: '#FFFFFF',
    },
    subscriptionCard: {
      backgroundColor: cardColor,
    },
    subscriptionStatus: {
      fontSize: Math.round(16 * fontMultiplier),
      color: textColor,
    },
    subscriptionDetails: {
      fontSize: Math.round(14 * fontMultiplier),
      color: secondaryTextColor,
    },
    aboutText: {
      fontSize: Math.round(12 * fontMultiplier),
      color: secondaryTextColor,
    },
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  settingsGroup: {
    gap: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F7F9',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111111',
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  arrow: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '300',
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
  subscriptionCard: {
    backgroundColor: '#F6F7F9',
    padding: 16,
    borderRadius: 12,
  },
  subscriptionStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 4,
  },
  subscriptionDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  aboutText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginTop: 12,
  },
});