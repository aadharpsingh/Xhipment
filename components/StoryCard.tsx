import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ExternalLink, Bookmark, VolumeX, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { Story, ClaritySettings } from '@/contexts/AppContext';

interface StoryCardProps {
  story: Story;
  onReadOriginal: (story: Story) => void;
  onToggleSave: (storyId: string) => void;
  onMuteTopic: (storyId: string) => void;
  onMoreContext: (story: Story) => void;
  claritySettings: ClaritySettings;
  showActions?: boolean;
}

export default function StoryCard({
  story,
  onReadOriginal,
  onToggleSave,
  onMuteTopic,
  onMoreContext,
  claritySettings,
  showActions = true,
}: StoryCardProps) {
  const getFontSizeMultiplier = () => {
    switch (claritySettings.fontSize) {
      case 'small': return 0.9;
      case 'large': return 1.2;
      default: return 1;
    }
  };

  const fontMultiplier = getFontSizeMultiplier();
  const dynamicStyles = createDynamicStyles(claritySettings, fontMultiplier);

  return (
    <View style={[styles.card, dynamicStyles.card]}>
      {!claritySettings.calmMode && (
        <View style={[styles.imagePlaceholder, dynamicStyles.imagePlaceholder]} />
      )}
      
      <View style={styles.content}>
        <Text style={[styles.headline, dynamicStyles.headline]} numberOfLines={2}>
          {story.headline}
        </Text>
        
        <Text style={[styles.summary, dynamicStyles.summary]} numberOfLines={3}>
          {story.summary}
        </Text>
        
        <View style={styles.insight}>
          <Text style={[styles.insightLabel, dynamicStyles.insightLabel]}>
            Why it matters:
          </Text>
          <Text style={[styles.insightText, dynamicStyles.insightText]}>
            {story.whyMatters}
          </Text>
        </View>
        
        <View style={styles.insight}>
          <Text style={[styles.insightLabel, dynamicStyles.insightLabel]}>
            What's new:
          </Text>
          <Text style={[styles.insightText, dynamicStyles.insightText]}>
            {story.whatsNew}
          </Text>
        </View>
        
        <View style={styles.metadata}>
          <View style={[styles.sourceChip, dynamicStyles.sourceChip]}>
            <Text style={[styles.sourceText, dynamicStyles.sourceText]}>
              {story.source}
            </Text>
          </View>
          <Text style={[styles.timestamp, dynamicStyles.timestamp]}>
            {story.timestamp} • {story.readTime}
          </Text>
        </View>
        
        {showActions && (
          <View style={styles.actions}>
            <Pressable
              style={[styles.primaryButton, dynamicStyles.primaryButton]}
              onPress={() => onReadOriginal(story)}
            >
              <ExternalLink size={16} color="#FFFFFF" strokeWidth={2} />
              <Text style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>
                Read original
              </Text>
            </Pressable>
            
            <View style={styles.secondaryActions}>
              <Pressable
                style={[styles.iconButton, dynamicStyles.iconButton]}
                onPress={() => onToggleSave(story.id)}
              >
                <Bookmark
                  size={20}
                  color={story.isSaved ? '#FF3B30' : '#6B7280'}
                  fill={story.isSaved ? '#FF3B30' : 'none'}
                  strokeWidth={2}
                />
              </Pressable>
              
              <Pressable
                style={[styles.iconButton, dynamicStyles.iconButton]}
                onPress={() => onMuteTopic(story.id)}
              >
                <VolumeX size={20} color="#6B7280" strokeWidth={2} />
              </Pressable>
              
              <Pressable
                style={[styles.iconButton, dynamicStyles.iconButton]}
                onPress={() => onMoreContext(story)}
              >
                <MoreHorizontal size={20} color="#6B7280" strokeWidth={2} />
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const createDynamicStyles = (claritySettings: ClaritySettings, fontMultiplier: number) => {
  const calmRed = claritySettings.calmMode ? '#FF8A80' : '#FF3B30';
  const textColor = claritySettings.highContrast ? '#000000' : '#111111';
  const secondaryTextColor = claritySettings.highContrast ? '#333333' : '#6B7280';
  const cardBackground = claritySettings.highContrast ? '#FFFFFF' : '#FFFFFF';
  const lineHeight = claritySettings.calmMode ? 1.8 : 1.6;

  return StyleSheet.create({
    card: {
      backgroundColor: cardBackground,
      shadowColor: claritySettings.highContrast ? '#000000' : '#000000',
      shadowOpacity: claritySettings.highContrast ? 0.2 : 0.08,
    },
    imagePlaceholder: {
      backgroundColor: claritySettings.calmMode ? '#F0F0F0' : '#E5E7EB',
    },
    headline: {
      fontSize: Math.round(20 * fontMultiplier),
      color: textColor,
      lineHeight: Math.round(28 * fontMultiplier * lineHeight),
    },
    summary: {
      fontSize: Math.round(15 * fontMultiplier),
      color: textColor,
      lineHeight: Math.round(22 * fontMultiplier * lineHeight),
    },
    insightLabel: {
      fontSize: Math.round(13 * fontMultiplier),
      color: secondaryTextColor,
    },
    insightText: {
      fontSize: Math.round(13 * fontMultiplier),
      color: textColor,
      lineHeight: Math.round(18 * fontMultiplier * lineHeight),
    },
    sourceChip: {
      backgroundColor: claritySettings.calmMode ? '#F8F9FA' : '#F6F7F9',
    },
    sourceText: {
      fontSize: Math.round(12 * fontMultiplier),
      color: secondaryTextColor,
    },
    timestamp: {
      fontSize: Math.round(12 * fontMultiplier),
      color: secondaryTextColor,
    },
    primaryButton: {
      backgroundColor: calmRed,
    },
    primaryButtonText: {
      fontSize: Math.round(14 * fontMultiplier),
    },
    iconButton: {
      backgroundColor: claritySettings.calmMode ? '#F8F9FA' : 'transparent',
    },
  });
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: '#E5E7EB',
  },
  content: {
    padding: 16,
  },
  headline: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111111',
    lineHeight: 28,
    marginBottom: 8,
  },
  summary: {
    fontSize: 15,
    color: '#111111',
    lineHeight: 22,
    marginBottom: 12,
  },
  insight: {
    marginBottom: 8,
  },
  insightLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
  },
  insightText: {
    fontSize: 13,
    color: '#111111',
    lineHeight: 18,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 16,
  },
  sourceChip: {
    backgroundColor: '#F6F7F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sourceText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});