import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import StoryCard from '@/components/StoryCard';

export default function SavedScreen() {
  const { state, dispatch } = useApp();

  const handleReadOriginal = (story: any) => {
    console.log('Opening:', story.headline);
  };

  const handleToggleSave = (storyId: string) => {
    dispatch({ type: 'TOGGLE_SAVE', storyId });
  };

  const handleMuteTopic = (storyId: string) => {
    dispatch({ type: 'MUTE_TOPIC', storyId });
  };

  const handleMoreContext = (story: any) => {
    console.log('More context for:', story.headline);
  };

  const dynamicStyles = createDynamicStyles(state.claritySettings);

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[styles.header, dynamicStyles.header]}>
        <Text style={[styles.title, dynamicStyles.title]}>Saved</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {state.savedStories.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, dynamicStyles.emptyIcon]}>
              <BookOpen size={48} color="#6B7280" strokeWidth={1.5} />
            </View>
            <Text style={[styles.emptyStateTitle, dynamicStyles.emptyStateTitle]}>
              Nothing saved yet
            </Text>
            <Text style={[styles.emptyStateSubtext, dynamicStyles.emptyStateSubtext]}>
              Save stories from your Edition or Browse to read them later
            </Text>
          </View>
        ) : (
          <View style={styles.storiesContainer}>
            {state.savedStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onReadOriginal={handleReadOriginal}
                onToggleSave={handleToggleSave}
                onMuteTopic={handleMuteTopic}
                onMoreContext={handleMoreContext}
                claritySettings={state.claritySettings}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createDynamicStyles = (claritySettings: any) => {
  const fontMultiplier = claritySettings.fontSize === 'large' ? 1.2 : 
                        claritySettings.fontSize === 'small' ? 0.9 : 1;
  const textColor = claritySettings.highContrast ? '#000000' : '#111111';
  const secondaryTextColor = claritySettings.highContrast ? '#333333' : '#6B7280';
  const backgroundColor = claritySettings.highContrast ? '#FFFFFF' : '#FFFFFF';

  return StyleSheet.create({
    container: { backgroundColor },
    header: { backgroundColor },
    title: {
      fontSize: Math.round(28 * fontMultiplier),
      color: textColor,
    },
    emptyIcon: {
      backgroundColor: claritySettings.calmMode ? '#F8F9FA' : '#F6F7F9',
    },
    emptyStateTitle: {
      fontSize: Math.round(20 * fontMultiplier),
      color: textColor,
    },
    emptyStateSubtext: {
      fontSize: Math.round(14 * fontMultiplier),
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
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F6F7F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  storiesContainer: {
    paddingBottom: 20,
  },
});