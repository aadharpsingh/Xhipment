import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { FileSliders as Sliders } from 'lucide-react-native';
import { useApp, Story } from '@/contexts/AppContext';
import StoryCard from '@/components/StoryCard';
import ProgressRing from '@/components/ProgressRing';
import ClarityControlsSheet from '@/components/ClarityControlsSheet';

export default function EditionScreen() {
  const { state, dispatch } = useApp();
  const [showClarityControls, setShowClarityControls] = useState(false);
  const [showMoreContext, setShowMoreContext] = useState<Story | null>(null);

  const getEditionTitle = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Your Morning Edition';
    if (hour < 17) return 'Your Midday Edition';
    return 'Your Evening Edition';
  };

  const getReadCount = () => {
    return state.stories.filter(story => story.isRead).length;
  };

  const categories = [
    'Today', 'Local', 'World', 'Business', 'Science/Health', 'Culture/Sports'
  ];

  const handleStartEdition = () => {
    dispatch({ type: 'START_EDITION' });
  };

  const handleNextStory = () => {
    if (state.currentStoryIndex < state.stories.length - 1) {
      dispatch({ type: 'NEXT_STORY' });
    } else {
      dispatch({ type: 'COMPLETE_EDITION' });
    }
  };

  const handleReadOriginal = (story: Story) => {
    Alert.alert('Opening Source', 'This would open the original article in a webview.');
    handleNextStory();
  };

  const handleToggleSave = (storyId: string) => {
    dispatch({ type: 'TOGGLE_SAVE', storyId });
  };

  const handleMuteTopic = (storyId: string) => {
    dispatch({ type: 'MUTE_TOPIC', storyId });
    if (state.editionStarted) {
      handleNextStory();
    }
  };

  const handleMoreContext = (story: Story) => {
    setShowMoreContext(story);
  };

  const handleFinish = () => {
    dispatch({ type: 'COMPLETE_EDITION' });
  };

  const handleSetNextCheckin = () => {
    Alert.alert('Schedule Set', 'Your next edition is scheduled for tomorrow morning.');
  };

  const handleExploreMore = () => {
    // This would navigate to explore tab - for now just show alert
    Alert.alert('Navigate', 'This would switch to the Explore tab.');
  };

  const handleBrowseAll = () => {
    Alert.alert('Navigate', 'This would open Browse All News.');
  };

  const handleResetEdition = () => {
    dispatch({ type: 'RESET_EDITION' });
  };

  const dynamicStyles = createDynamicStyles(state.claritySettings);

  // Completion Screen
  if (state.editionCompleted) {
    return (
      <SafeAreaView style={[styles.container, dynamicStyles.container]}>
        <View style={styles.completionContainer}>
          <View style={styles.completionContent}>
            <View style={styles.completionBadge}>
              <Text style={styles.completionCheckmark}>✓</Text>
            </View>
            <Text style={[styles.completionTitle, dynamicStyles.completionTitle]}>
              You're all caught up
            </Text>
            <Text style={[styles.completionSubtitle, dynamicStyles.completionSubtitle]}>
              You've finished your {getEditionTitle().toLowerCase()}.
            </Text>
            
            <View style={styles.completionActions}>
              <Pressable
                style={[styles.primaryButton, dynamicStyles.primaryButton]}
                onPress={handleSetNextCheckin}
              >
                <Text style={[styles.primaryButtonText, dynamicStyles.primaryButtonText]}>
                  Set next check-in
                </Text>
              </Pressable>
              
              <Pressable
                style={[styles.secondaryButton, dynamicStyles.secondaryButton]}
                onPress={handleExploreMore}
              >
                <Text style={[styles.secondaryButtonText, dynamicStyles.secondaryButtonText]}>
                  Explore more topics
                </Text>
              </Pressable>
              
              <Pressable
                style={[styles.secondaryButton, dynamicStyles.secondaryButton]}
                onPress={handleBrowseAll}
              >
                <Text style={[styles.secondaryButtonText, dynamicStyles.secondaryButtonText]}>
                  Browse All News
                </Text>
              </Pressable>
              
              <Pressable
                style={[styles.textButton]}
                onPress={handleResetEdition}
              >
                <Text style={[styles.textButtonText, dynamicStyles.textButtonText]}>
                  Start new edition
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Reading View - Single Story
  if (state.editionStarted && state.currentStoryIndex < state.stories.length) {
    const currentStory = state.stories[state.currentStoryIndex];
    
    return (
      <SafeAreaView style={[styles.container, dynamicStyles.container]}>
        {/* Progress Header */}
        <View style={[styles.readingHeader, dynamicStyles.readingHeader]}>
          <ProgressRing
            progress={getReadCount()}
            total={state.stories.length}
            size={60}
            claritySettings={state.claritySettings}
          />
          <Pressable
            style={styles.clarityButton}
            onPress={() => setShowClarityControls(true)}
          >
            <Sliders size={24} color="#6B7280" strokeWidth={2} />
          </Pressable>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <StoryCard
            story={currentStory}
            onReadOriginal={handleReadOriginal}
            onToggleSave={handleToggleSave}
            onMuteTopic={handleMuteTopic}
            onMoreContext={handleMoreContext}
            claritySettings={state.claritySettings}
          />
          
          <View style={styles.readingActions}>
            <Pressable
              style={[styles.finishButton, dynamicStyles.finishButton]}
              onPress={handleFinish}
            >
              <Text style={[styles.finishButtonText, dynamicStyles.finishButtonText]}>
                Finish edition
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <ClarityControlsSheet
          isVisible={showClarityControls}
          onClose={() => setShowClarityControls(false)}
          settings={state.claritySettings}
          onUpdateSettings={(settings) => dispatch({ type: 'UPDATE_CLARITY_SETTINGS', settings })}
        />

        {/* More Context Modal */}
        {showMoreContext && (
          <View style={styles.contextOverlay}>
            <View style={[styles.contextModal, dynamicStyles.contextModal]}>
              <View style={styles.contextHeader}>
                <Text style={[styles.contextTitle, dynamicStyles.contextTitle]}>
                  More Context
                </Text>
                <Pressable
                  style={styles.contextCloseButton}
                  onPress={() => setShowMoreContext(null)}
                >
                  <Text style={styles.contextCloseText}>✕</Text>
                </Pressable>
              </View>
              
              <ScrollView style={styles.contextContent}>
                <View style={styles.statusSection}>
                  <Text style={[styles.statusLabel, dynamicStyles.statusLabel]}>
                    Status: Stable
                  </Text>
                </View>
                
                <View style={styles.factsSection}>
                  <Text style={[styles.factsTitle, dynamicStyles.factsTitle]}>
                    Key Facts
                  </Text>
                  <Text style={[styles.factText, dynamicStyles.factText]}>
                    • Context item relating to the story
                  </Text>
                  <Text style={[styles.factText, dynamicStyles.factText]}>
                    • Additional background information
                  </Text>
                  <Text style={[styles.factText, dynamicStyles.factText]}>
                    • Related developments to be aware of
                  </Text>
                </View>
                
                <View style={styles.perspectiveSection}>
                  <Text style={[styles.perspectiveTitle, dynamicStyles.perspectiveTitle]}>
                    Perspective
                  </Text>
                  <View style={styles.perspectiveChips}>
                    <View style={[styles.perspectiveChip, dynamicStyles.perspectiveChip]}>
                      <Text style={[styles.perspectiveChipText, dynamicStyles.perspectiveChipText]}>
                        Reporting
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.sourcesSection}>
                  <Text style={[styles.sourcesTitle, dynamicStyles.sourcesTitle]}>
                    Sources
                  </Text>
                  <View style={styles.sourceChips}>
                    <Pressable style={[styles.sourceChip, dynamicStyles.sourceChip]}>
                      <Text style={[styles.sourceChipText, dynamicStyles.sourceChipText]}>
                        Source A
                      </Text>
                    </Pressable>
                    <Pressable style={[styles.sourceChip, dynamicStyles.sourceChip]}>
                      <Text style={[styles.sourceChipText, dynamicStyles.sourceChipText]}>
                        Source B
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // Main Edition Screen
  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={[styles.header, dynamicStyles.header]}>
          <Text style={[styles.editionTitle, dynamicStyles.editionTitle]}>
            {getEditionTitle()}
          </Text>
          <Pressable
            style={styles.clarityButton}
            onPress={() => setShowClarityControls(true)}
          >
            <Sliders size={24} color="#6B7280" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          style={styles.categoriesScrollView}
        >
          {categories.map((category, index) => (
            <View
              key={index}
              style={[
                styles.categoryChip,
                index === 0 && styles.categoryChipActive,
                dynamicStyles.categoryChip,
                index === 0 && dynamicStyles.categoryChipActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  index === 0 && styles.categoryChipTextActive,
                  dynamicStyles.categoryChipText,
                  index === 0 && dynamicStyles.categoryChipTextActive,
                ]}
              >
                {category}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Progress and CTA */}
        <View style={styles.progressSection}>
          <ProgressRing
            progress={getReadCount()}
            total={state.stories.length}
            size={120}
            claritySettings={state.claritySettings}
          />
          
          <Pressable
            style={[styles.startButton, dynamicStyles.startButton]}
            onPress={handleStartEdition}
          >
            <Text style={[styles.startButtonText, dynamicStyles.startButtonText]}>
              Start Edition
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <ClarityControlsSheet
        isVisible={showClarityControls}
        onClose={() => setShowClarityControls(false)}
        settings={state.claritySettings}
        onUpdateSettings={(settings) => dispatch({ type: 'UPDATE_CLARITY_SETTINGS', settings })}
      />
    </SafeAreaView>
  );
}

const createDynamicStyles = (claritySettings: any) => {
  const fontMultiplier = claritySettings.fontSize === 'large' ? 1.2 : 
                        claritySettings.fontSize === 'small' ? 0.9 : 1;
  const primaryColor = claritySettings.calmMode ? '#FF8A80' : '#FF3B30';
  const textColor = claritySettings.highContrast ? '#000000' : '#111111';
  const backgroundColor = claritySettings.highContrast ? '#FFFFFF' : '#FFFFFF';
  const cardBackground = claritySettings.highContrast ? '#FFFFFF' : '#FFFFFF';

  return StyleSheet.create({
    container: {
      backgroundColor,
    },
    header: {
      backgroundColor,
    },
    editionTitle: {
      fontSize: Math.round(28 * fontMultiplier),
      color: textColor,
    },
    categoryChip: {
      backgroundColor: claritySettings.calmMode ? '#F8F9FA' : '#F6F7F9',
    },
    categoryChipActive: {
      backgroundColor: claritySettings.calmMode ? '#FFE8E6' : '#FFF1F0',
    },
    categoryChipText: {
      fontSize: Math.round(14 * fontMultiplier),
      color: claritySettings.highContrast ? '#333333' : '#6B7280',
    },
    categoryChipTextActive: {
      color: primaryColor,
    },
    startButton: {
      backgroundColor: primaryColor,
    },
    startButtonText: {
      fontSize: Math.round(16 * fontMultiplier),
    },
    readingHeader: {
      backgroundColor,
    },
    primaryButton: {
      backgroundColor: primaryColor,
    },
    primaryButtonText: {
      fontSize: Math.round(16 * fontMultiplier),
    },
    secondaryButton: {
      backgroundColor: claritySettings.calmMode ? '#F8F9FA' : '#F6F7F9',
    },
    secondaryButtonText: {
      fontSize: Math.round(16 * fontMultiplier),
      color: textColor,
    },
    finishButton: {
      backgroundColor: claritySettings.calmMode ? '#F8F9FA' : '#F6F7F9',
    },
    finishButtonText: {
      fontSize: Math.round(14 * fontMultiplier),
      color: textColor,
    },
    completionTitle: {
      fontSize: Math.round(32 * fontMultiplier),
      color: textColor,
    },
    completionSubtitle: {
      fontSize: Math.round(16 * fontMultiplier),
      color: claritySettings.highContrast ? '#333333' : '#6B7280',
    },
    contextModal: {
      backgroundColor: cardBackground,
    },
    contextTitle: {
      fontSize: Math.round(20 * fontMultiplier),
      color: textColor,
    },
    statusLabel: {
      fontSize: Math.round(14 * fontMultiplier),
      color: claritySettings.highContrast ? '#333333' : '#6B7280',
    },
    factsTitle: {
      fontSize: Math.round(16 * fontMultiplier),
      color: textColor,
    },
    factText: {
      fontSize: Math.round(14 * fontMultiplier),
      color: textColor,
    },
    perspectiveTitle: {
      fontSize: Math.round(16 * fontMultiplier),
      color: textColor,
    },
    perspectiveChip: {
      backgroundColor: claritySettings.calmMode ? '#F0F8FF' : '#EFF6FF',
    },
    perspectiveChipText: {
      fontSize: Math.round(12 * fontMultiplier),
      color: '#2563EB',
    },
    sourcesTitle: {
      fontSize: Math.round(16 * fontMultiplier),
      color: textColor,
    },
    sourceChip: {
      backgroundColor: claritySettings.calmMode ? '#F8F9FA' : '#F6F7F9',
    },
    sourceChipText: {
      fontSize: Math.round(12 * fontMultiplier),
      color: claritySettings.highContrast ? '#333333' : '#6B7280',
    },
    textButtonText: {
      fontSize: Math.round(14 * fontMultiplier),
      color: claritySettings.highContrast ? '#333333' : '#6B7280',
    },
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  editionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
  },
  clarityButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#F6F7F9',
  },
  categoriesScrollView: {
    paddingLeft: 16,
  },
  categoriesContainer: {
    paddingRight: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F6F7F9',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: '#FFF1F0',
    borderColor: '#FF3B30',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryChipTextActive: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 32,
  },
  startButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    minWidth: 200,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F6F7F9',
  },
  readingActions: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  finishButton: {
    backgroundColor: '#F6F7F9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  finishButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111111',
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  completionContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  completionBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  completionCheckmark: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 12,
  },
  completionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  completionActions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#F6F7F9',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111111',
  },
  textButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  textButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  contextOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  contextModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  contextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F7F9',
  },
  contextTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111111',
  },
  contextCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contextCloseText: {
    fontSize: 18,
    color: '#6B7280',
  },
  contextContent: {
    padding: 20,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  factsSection: {
    marginBottom: 20,
  },
  factsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 12,
  },
  factText: {
    fontSize: 14,
    color: '#111111',
    lineHeight: 20,
    marginBottom: 4,
  },
  perspectiveSection: {
    marginBottom: 20,
  },
  perspectiveTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 12,
  },
  perspectiveChips: {
    flexDirection: 'row',
    gap: 8,
  },
  perspectiveChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  perspectiveChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563EB',
  },
  sourcesSection: {
    marginBottom: 20,
  },
  sourcesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 12,
  },
  sourceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sourceChip: {
    backgroundColor: '#F6F7F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sourceChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
});