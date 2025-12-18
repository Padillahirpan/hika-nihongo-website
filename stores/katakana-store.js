import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { checkUnlockConditions } from '../util/unlock-logic';

const PASS_THRESHOLD = 80;

export const useKatakanaStore = create(
  persist(
    (set, get) => ({
      // State
      katakanaData: [],
      isHydrated: false,

      // Actions
      setKatakanaData: (data) => {
        set({ katakanaData: data });
      },

      // Initialize the store with initial data
      initializeKatakanaData: (initialValue) => {
        const currentState = get();

        // Prevent re-initialization if already has data
        if (currentState.katakanaData.length > 0) {
          return;
        }

        // Set initial data directly
        set({ katakanaData: initialValue });
      },

      // Update a single kana item
      updateKanaItem: (index, updatedItem) => {
        const currentState = get();
        const updatedData = [...currentState.katakanaData];
        updatedData[index] = updatedItem;

        // Check unlock conditions after update
        const { data, changed } = checkUnlockConditions(updatedData);

        set({ katakanaData: data });

        if (changed) {
          console.log('New katakana content unlocked!');
        }
      },

      // Update kana item by character
      updateKanaByCharacter: (character, updates) => {
        const currentState = get();
        const updatedData = currentState.katakanaData.map(item =>
          item.character === character ? { ...item, ...updates } : item
        );

        // Check unlock conditions after update
        const { data, changed } = checkUnlockConditions(updatedData);

        set({ katakanaData: data });

        if (changed) {
          console.log('New katakana content unlocked!');
        }
      },

      // Get progress information
      getProgress: () => {
        const { katakanaData } = get();
        if (!Array.isArray(katakanaData) || katakanaData.length === 0) {
          return { masteredKana: 0, totalKana: 0 };
        }

        const filtered = katakanaData.filter((item) => item && item.character !== '-');
        const masteredKana = filtered.filter((item) => Number(item.points) >= PASS_THRESHOLD).length;
        const totalKana = filtered.length;

        return { masteredKana, totalKana };
      },

      // Reset all progress
      resetProgress: () => {
        const currentState = get();
        const resetData = currentState.katakanaData.map(item => ({
          ...item,
          points: 0,
          unlocked: item.row === 'a' // Only unlock the first row
        }));

        set({ katakanaData: resetData });
      },

      // Get kana by category
      getKanaByCategory: (category) => {
        const { katakanaData } = get();
        return katakanaData.filter(item => item.category === category);
      },

      // Get kana by row
      getKanaByRow: (row) => {
        const { katakanaData } = get();
        return katakanaData.filter(item => item.row === row);
      }
    }),
    {
      name: 'katakana-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        console.log('Katakana store hydrated');
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);

// Selector hooks for better performance
export const useKatakanaData = () => useKatakanaStore((state) => state.katakanaData);
export const useKatakanaIsHydrated = () => useKatakanaStore((state) => state.isHydrated);
export const useKatakanaProgress = () => useKatakanaStore((state) => state.getProgress());
export const useKatakanaActions = () => useKatakanaStore((state) => ({
  setKatakanaData: state.setKatakanaData,
  initializeKatakanaData: state.initializeKatakanaData,
  updateKanaItem: state.updateKanaItem,
  updateKanaByCharacter: state.updateKanaByCharacter,
  resetProgress: state.resetProgress
}));