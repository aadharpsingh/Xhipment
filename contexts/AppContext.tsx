import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Story {
  id: string;
  headline: string;
  summary: string;
  whyMatters: string;
  whatsNew: string;
  source: string;
  timestamp: string;
  readTime: string;
  isRead: boolean;
  isSaved: boolean;
}

export interface ClaritySettings {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  calmMode: boolean;
  readAloud: boolean;
  reducedMotion: boolean;
}

export interface EditionSettings {
  morningEdition: boolean;
  middayEdition: boolean;
  eveningEdition: boolean;
  criticalUpdates: boolean;
}

interface AppState {
  stories: Story[];
  currentStoryIndex: number;
  editionStarted: boolean;
  editionCompleted: boolean;
  savedStories: Story[];
  claritySettings: ClaritySettings;
  editionSettings: EditionSettings;
}

type AppAction = 
  | { type: 'START_EDITION' }
  | { type: 'NEXT_STORY' }
  | { type: 'COMPLETE_EDITION' }
  | { type: 'RESET_EDITION' }
  | { type: 'TOGGLE_SAVE'; storyId: string }
  | { type: 'MUTE_TOPIC'; storyId: string }
  | { type: 'UPDATE_CLARITY_SETTINGS'; settings: Partial<ClaritySettings> }
  | { type: 'UPDATE_EDITION_SETTINGS'; settings: Partial<EditionSettings> };

const defaultStories: Story[] = [
  {
    id: '1',
    headline: 'Markets steady as rates hold',
    summary: 'Central bankers kept rates unchanged. Analysts expect slower inflation over the next quarter.',
    whyMatters: 'Signals stability for borrowing and hiring.',
    whatsNew: "Guidance shifted from 'uncertain' to 'cautiously improving'.",
    source: 'Source A',
    timestamp: '2h ago',
    readTime: '30-45s',
    isRead: false,
    isSaved: false,
  },
  {
    id: '2',
    headline: 'City unveils transit upgrades',
    summary: 'Officials outlined phased improvements to reduce delays and expand coverage.',
    whyMatters: 'Could shorten commutes and improve reliability.',
    whatsNew: 'Funding approved for the first set of lines.',
    source: 'Source B',
    timestamp: '3h ago',
    readTime: '45s',
    isRead: false,
    isSaved: false,
  },
  {
    id: '3',
    headline: 'Health agency updates guidance',
    summary: 'New recommendations focus on prevention and early screening.',
    whyMatters: 'Aims to reduce severe cases and costs.',
    whatsNew: 'Screening interval adjusted by six months.',
    source: 'Source C',
    timestamp: '4h ago',
    readTime: '30s',
    isRead: false,
    isSaved: false,
  },
  {
    id: '4',
    headline: 'Renewables hit new milestone',
    summary: 'Wind and solar provided a larger share of power this quarter.',
    whyMatters: 'May lower long-term energy costs and emissions.',
    whatsNew: 'Grid operators added storage capacity.',
    source: 'Source D',
    timestamp: '5h ago',
    readTime: '45s',
    isRead: false,
    isSaved: false,
  },
  {
    id: '5',
    headline: 'Education results show gains',
    summary: 'Test scores improved modestly in math and reading.',
    whyMatters: 'Suggests recovery efforts are working.',
    whatsNew: 'Largest gains in early grades.',
    source: 'Source E',
    timestamp: '6h ago',
    readTime: '30-45s',
    isRead: false,
    isSaved: false,
  },
  {
    id: '6',
    headline: 'Consumer prices ease slightly',
    summary: 'Monthly price growth slowed compared with last month.',
    whyMatters: 'Relief for household budgets.',
    whatsNew: 'Core categories fell for the first time this year.',
    source: 'Source F',
    timestamp: '7h ago',
    readTime: '45s',
    isRead: false,
    isSaved: false,
  },
];

const initialState: AppState = {
  stories: defaultStories,
  currentStoryIndex: 0,
  editionStarted: false,
  editionCompleted: false,
  savedStories: [],
  claritySettings: {
    fontSize: 'medium',
    highContrast: false,
    calmMode: false,
    readAloud: false,
    reducedMotion: false,
  },
  editionSettings: {
    morningEdition: true,
    middayEdition: true,
    eveningEdition: true,
    criticalUpdates: true,
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_EDITION':
      return {
        ...state,
        editionStarted: true,
        currentStoryIndex: 0,
        editionCompleted: false,
      };
    
    case 'NEXT_STORY':
      const nextIndex = state.currentStoryIndex + 1;
      const updatedStories = state.stories.map((story, index) =>
        index === state.currentStoryIndex ? { ...story, isRead: true } : story
      );
      return {
        ...state,
        stories: updatedStories,
        currentStoryIndex: nextIndex,
        editionCompleted: nextIndex >= state.stories.length,
      };
    
    case 'COMPLETE_EDITION':
      return {
        ...state,
        editionCompleted: true,
      };
    
    case 'RESET_EDITION':
      return {
        ...state,
        editionStarted: false,
        editionCompleted: false,
        currentStoryIndex: 0,
        stories: state.stories.map(story => ({ ...story, isRead: false })),
      };
    
    case 'TOGGLE_SAVE':
      const storyToToggle = state.stories.find(s => s.id === action.storyId);
      if (!storyToToggle) return state;
      
      const updatedStoriesToggle = state.stories.map(story =>
        story.id === action.storyId ? { ...story, isSaved: !story.isSaved } : story
      );
      
      const savedStories = storyToToggle.isSaved
        ? state.savedStories.filter(s => s.id !== action.storyId)
        : [...state.savedStories, { ...storyToToggle, isSaved: true }];
      
      return {
        ...state,
        stories: updatedStoriesToggle,
        savedStories,
      };
    
    case 'MUTE_TOPIC':
      const filteredStories = state.stories.filter(s => s.id !== action.storyId);
      return {
        ...state,
        stories: filteredStories,
      };
    
    case 'UPDATE_CLARITY_SETTINGS':
      return {
        ...state,
        claritySettings: { ...state.claritySettings, ...action.settings },
      };
    
    case 'UPDATE_EDITION_SETTINGS':
      return {
        ...state,
        editionSettings: { ...state.editionSettings, ...action.settings },
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}