import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import { checkUnlockConditions } from '../util/unlock-logic';
import { getAllKatakana } from '../data/katakana-data';
import { LEARNING } from '../constants';

export const useKatakanaStore = create(
  persist(
    (set, get) => ({
      // State
      katakanaUnlocked: [], // Initialize with default data
      currentKatakanaData: [],
      isHydrated: false,

      // Actions
      setKatakanaData: (data) => {
        set({ katakanaData: data });
      },

      // Initialize the store with initial data
      initializeKatakanaData: (initialValue) => {
        const currentState = get();

        // Prevent re-initialization if already has data
        if (currentState.currentKatakanaData.length > 0) {
          return;
        }

        // Set initial data directly
        set({ currentKatakanaData: initialValue });
      },

      // Update a single kana item
      updateKanaItem: (index, updatedItem) => {
        const currentState = get();
        const updatedData = [...currentState.currentKatakanaData];
        updatedData[index] = updatedItem;

        // Check unlock conditions after update
        const { data, changed } = checkUnlockConditions(updatedData);

        set({ katakanaUnlocked: data });

        if (changed) {
          console.log('New katakana content unlocked!');
        }
      },

      // Update kana item by character
      updateKanaByCharacter: (character, kana, updates) => {
        const currentState = get();
        const updatedData = currentState.currentKatakanaData.map((item) =>
          item.character === character ? { ...item, ...updates } : item,
        );

        currentState.updateUnlockedKana({ ...kana, ...updates });

        const { data, changed } = checkUnlockConditions(updatedData);

        set({ currentKatakanaData: data });

        if (changed) {
          console.log('New katakana content unlocked!');
        }
      },

      // Update unlocked kana by character
      updateUnlockedKana: (newItem) => {
        const currentState = get();
        let existingData = currentState.katakanaUnlocked;

        const index = existingData.findIndex(
          (item) => item.character === newItem.character,
        );

        if (index !== -1) {
          existingData[index] = newItem;
        } else {
          existingData.push(newItem);
        }

        set({ katakanaUnlocked: existingData });
      },

      // Add or update kana
      addOrUpdateKana: (kana) => {
        const currentState = get();
        const existingIndex = currentState.currentKatakanaData.findIndex(
          (item) => item.character === kana.character,
        );

        let updatedData;
        if (existingIndex >= 0) {
          updatedData = [...currentState.currentKatakanaData];
          updatedData[existingIndex] = kana;
        } else {
          updatedData = [...currentState.currentKatakanaData, kana];
        }

        set({ currentKatakanaData: updatedData });
      },

      // Get progress information
      getProgress: () => {
        const { currentKatakanaData } = get();
        let dataToCheck = currentKatakanaData;

        // If currentHiraganaData is empty, try to get updated data
        if (
          !Array.isArray(currentKatakanaData) ||
          currentKatakanaData.length === 0
        ) {
          dataToCheck = get().getUpdatedKatakana();
        }

        if (!Array.isArray(dataToCheck) || dataToCheck.length === 0) {
          return { masteredKana: 0, totalKana: 0 };
        }

        const filtered = dataToCheck.filter(
          (item) => item && item.character !== '-',
        );
        const masteredKana = filtered.filter(
          (item) => Number(item.points) >= LEARNING.PASS_THRESHOLD,
        ).length;
        const totalKana = filtered.length;
        return { masteredKana, totalKana };
      },

      // Reset all progress
      resetProgress: () => {
        const currentState = get();
        const resetData = currentState.currentKatakanaData.map((item) => ({
          ...item,
          points: 0,
          unlocked: item.row === 'a', // Only unlock the first row
        }));

        set({ currentKatakanaData: resetData });
      },

      // Get kana by category
      getKanaByCategory: (category) => {
        const { currentKatakanaData } = get();
        return currentKatakanaData.filter((item) => item.category === category);
      },

      // Get kana by row
      getKanaByRow: (row) => {
        const { currentKatakanaData } = get();
        return currentKatakanaData.filter((item) => item.row === row);
      },

      getUpdatedKatakana: () => {
        const { katakanaUnlocked } = get();
        const staticKatakana = getAllKatakana();

        const updatekana = new Map(
          katakanaUnlocked.map((item) => [item.character, item]),
        );

        const updatedData = staticKatakana.map((item) => {
          const existingItem = updatekana.get(item.character);
          if (existingItem) {
            return {
              ...existingItem,
              unlocked: true,
            };
          }

          return item;
        });

        set({ currentKatakanaData: updatedData });
        return updatedData;
      },
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
      partialize: (state) => ({
        katakanaUnlocked: state.katakanaUnlocked,
      }),
    },
  ),
);

// Selector hooks for better performance
export const useKatakanaData = () =>
  useKatakanaStore((state) => state.currentKatakanaData);
export const useKatakanaIsHydrated = () =>
  useKatakanaStore((state) => state.isHydrated);
export const useKatakanaProgress = () =>
  useKatakanaStore(useShallow((state) => state.getProgress));

export const useKatakanaState = () =>
  useKatakanaStore(
    useShallow((state) => ({
      katakanaUnlocked: state.katakanaUnlocked,
      isHydrated: state.isHydrated,
    })),
  );

export const useKatakanaWithProgress = () =>
  useKatakanaStore(
    useShallow((state) => ({
      currentKatakanaData: state.currentKatakanaData,
      isHydrated: state.isHydrated,
      progress: state.getProgress,
      getUpdatedKatakana: state.getUpdatedKatakana,
    })),
  );

export const useKatakanaActions = () =>
  useKatakanaStore(
    useShallow((state) => ({
      setKatakanaData: state.setKatakanaData,
      initializeKatakanaData: state.initializeKatakanaData,
      updateKanaItem: state.updateKanaItem,
      updateKanaByCharacter: state.updateKanaByCharacter,
      addOrUpdateKana: state.addOrUpdateKana,
      resetProgress: state.resetProgress,
      getUpdatedKatakana: state.getUpdatedKatakana,
    })),
  );

export const useGetUpdatedKatakana = () =>
  useKatakanaStore((state) => state.getUpdatedKatakana);

export const useUpdateKanaByCharacter = () =>
  useKatakanaStore((state) => state.updateKanaByCharacter);

export const useAddOrUpdateKana = () =>
  useKatakanaStore((state) => state.addOrUpdateKana);
