import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import StoryCard from '@/components/StoryCard';

export default function ExploreScreen() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Latest');

  const categories = [
    'Local', 'World', 'Business', 'Science/Health', 'Culture/Sports'
  ];

  const filters = ['Latest', 'Saved', 'Local-first'];

  const handleReadOriginal = (story: any) => {
    // Would open webview
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

  const filteredStories = state.stories.filter(story => {
    if (activeFilter === 'Saved') {
      return story.isSaved;
    }
    return true;
  });

  const dynamicStyles = createDynamicStyles(state.claritySettings);

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, dynamicStyles.header]}>
          <Text style={[styles.title, dynamicStyles.title]}>Browse All News</Text>
          
          <View style={[styles.searchContainer, dynamicStyles.searchContainer]}>
            <Search size={20} color="#6B7280" strokeWidth={2} />
            <TextInput
              style={[styles.searchInput, dynamicStyles.searchInput]}
              placeholder="Search topics, sources..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <Pressable
                key={index}
                style={[styles.categoryCard, dynamicStyles.categoryCard]}
              >
                <Text style={[styles.categoryCardText, dynamicStyles.categoryCardText]}>
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {filters.map((filter, index) => (
              <Pressable
                key={index}
                style={[
                  styles.filterChip,
                  activeFilter === filter && styles.filterChipActive,
                  dynamicStyles.filterChip,
                  activeFilter === filter && dynamicStyles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    activeFilter === filter && styles.filterChipTextActive,
                    dynamicStyles.filterChipText,
                    activeFilter === filter && dynamicStyles.filterChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Stories List */}
        <View style={styles.storiesSection}>
          {filteredStories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, dynamicStyles.emptyStateText]}>
                {activeFilter === 'Saved' ? 'No saved stories yet' : 'No stories found'}
              </Text>
              <Text style={[styles.emptyStateSubtext, dynamicStyles.emptyStateSubtext]}>
                {activeFilter === 'Saved' 
                  ? 'Save stories from your Edition to read them later' 
                  : 'Try adjusting your search or filters'}
              </Text>
            </View>
          ) : (
            <>
              {filteredStories.map((story) => (
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
              
              <Pressable style={[styles.loadMoreButton, dynamicStyles.loadMoreButton]}>
                <Text style={[styles.loadMoreText, dynamicStyles.loadMoreText]}>
                  Load more
                </Text>
              </Pressable>
            </>
          )}
        </View>
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
  const cardColor = claritySettings.calmMode ? '#F8F9FA' : '#F6F7F9';

  return StyleSheet.create({
    container: { backgroundColor },
    header: { backgroundColor },
    title: {
      fontSize: Math.round(28 * fontMultiplier),
      color: textColor,
    },
    searchContainer: {
      backgroundColor: cardColor,
    },
    searchInput: {
      fontSize: Math.round(16 * fontMultiplier),
      color: textColor,
    },
    sectionTitle: {
      fontSize: Math.round(18 * fontMultiplier),
      color: textColor,
    },
    categoryCard: {
      backgroundColor: cardColor,
    },
    categoryCardText: {
      fontSize: Math.round(16 * fontMultiplier),
      color: textColor,
    },
    filterChip: {
      backgroundColor: cardColor,
    },
    filterChipActive: {
      backgroundColor: claritySettings.calmMode ? '#FFE8E6' : '#FFF1F0',
    },
    filterChipText: {
      fontSize: Math.round(14 * fontMultiplier),
      color: secondaryTextColor,
    },
    filterChipTextActive: {
      color: claritySettings.calmMode ? '#FF8A80' : '#FF3B30',
    },
    emptyStateText: {
      fontSize: Math.round(18 * fontMultiplier),
      color: textColor,
    },
    emptyStateSubtext: {
      fontSize: Math.round(14 * fontMultiplier),
      color: secondaryTextColor,
    },
    loadMoreButton: {
      backgroundColor: cardColor,
    },
    loadMoreText: {
      fontSize: Math.round(16 * fontMultiplier),
      color: textColor,
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
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111111',
  },
  categoriesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#F6F7F9',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: '45%',
    alignItems: 'center',
  },
  categoryCardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111111',
  },
  filtersSection: {
    paddingLeft: 16,
    marginBottom: 8,
  },
  filtersContainer: {
    paddingRight: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F6F7F9',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#FFF1F0',
    borderColor: '#FF3B30',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  storiesSection: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
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
  loadMoreButton: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#F6F7F9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111111',
  },
});