import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';
import { checkUnlockConditions } from '../util/unlock-logic';
import { getAllHiragana } from '../data/kana-data';
import { LEARNING } from '../constants';

export const useHiraganaStore = create(
  persist(
    (set, get) => ({
      // State
      hiraganaUnlocked: [], // Initialize with default data

      currentHiraganaData: [],
      isHydrated: false,

      // Update a single kana item
      updateKanaItem: (index, updatedItem) => {
        const currentState = get();
        const updatedData = [...currentState.currentHiraganaData];
        updatedData[index] = updatedItem;

        // Check unlock conditions after update
        const { data, changed } = checkUnlockConditions(updatedData);

        set({ hiraganaUnlocked: data });

        if (changed) {
          console.log('New content unlocked!');
        }
      },

      // Update kana item by character
      updateKanaByCharacter: (character, kana, updates) => {
        const currentState = get();
        const updatedData = currentState.currentHiraganaData.map((item) =>
          item.character === character ? { ...item, ...updates } : item,
        );

        currentState.updateUnlockedKana({ ...kana, ...updates });

        const { data, changed } = checkUnlockConditions(updatedData);

        set({ currentHiraganaData: data });

        if (changed) {
          console.log('New content unlocked!');
        }
      },

      updateUnlockedKana: (newItem) => {
        const currentState = get();
        let existingData = currentState.hiraganaUnlocked;

        const index = existingData.findIndex(
          (item) => item.character === newItem.character,
        );

        if (index !== -1) {
          existingData[index] = newItem;
        } else {
          existingData.push(newItem);
        }

        set({ hiraganaUnlocked: existingData });
      },

      // Add or update kana items - adds new if not exists, updates if exists
      addOrUpdateKana: (newItems) => {
        const currentState = get();
        const existingData = currentState.currentHiraganaData;

        // Combine existing items (that weren't updated) with processed items
        const updatedCharacters = new Set(
          newItems.map((item) => item.character),
        );
        const unchangedExisting = existingData.filter(
          (item) => !updatedCharacters.has(item.character),
        );

        const finalData = [...unchangedExisting, ...newItems];

        // Check unlock conditions after update
        const { data, changed } = checkUnlockConditions(finalData);

        set({ hiraganaUnlocked: data });

        if (changed) {
          console.log('New content unlocked!');
        }
      },

      // Get progress information
      getProgress: () => {
        const { hiraganaData } = get();
        if (!Array.isArray(hiraganaData) || hiraganaData.length === 0) {
          return { masteredKana: 0, totalKana: 0 };
        }

        const filtered = hiraganaData.filter(
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
        const resetData = currentState.currentHiraganaData.map((item) => ({
          ...item,
          points: 0,
          unlocked: item.row === 'a', // Only unlock the first row
        }));

        set({ hiraganaUnlocked: resetData });
      },

      // Get kana by category
      getKanaByCategory: (category) => {
        const { currentHiraganaData } = get();
        return currentHiraganaData.filter((item) => item.category === category);
      },

      // Get kana by row
      getKanaByRow: (row) => {
        const { currentHiraganaData } = get();
        return currentHiraganaData.filter((item) => item.row === row);
      },

      getUpdatedHiragana: () => {
        const { hiraganaUnlocked } = get();
        const staticHiragana = getAllHiragana();

        const updatekana = new Map(
          hiraganaUnlocked.map((item) => [item.character, item]),
        );

        const updatedData = staticHiragana.map((item) => {
          const existingItem = updatekana.get(item.character);
          if (existingItem) {
            return existingItem;
          }
          return item;
        });

        const { data, changed } = checkUnlockConditions(updatedData);

        set({ currentHiraganaData: data });

        return data;
      },
    }),
    {
      name: 'hiragana-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        console.log('Hiragana store hydrated');
        if (state) {
          // If we have stored data, use it and check unlock conditions
          if (state.hiraganaUnlocked.length > 0) {
            const { data } = checkUnlockConditions(state.hiraganaUnlocked);
            state.hiraganaUnlocked = data;
          }
          state.isHydrated = true;
        }
      },
      partialize: (state) => ({
        hiraganaUnlocked: state.hiraganaUnlocked,
      }),
    },
  ),
);

// Optimized selector hooks for better performance
export const useHiraganaData = () =>
  useHiraganaStore((state) => state.hiraganaUnlocked);

export const useIsHydrated = () =>
  useHiraganaStore((state) => state.isHydrated);

export const useHiraganaProgress = () =>
  useHiraganaStore((state) => state.getProgress());

// Combined optimized hooks to reduce re-renders
export const useHiraganaState = () =>
  useHiraganaStore(
    useShallow((state) => ({
      hiraganaUnlocked: state.hiraganaUnlocked,
      isHydrated: state.isHydrated,
    })),
  );

export const useHiraganaWithProgress = () =>
  useHiraganaStore(
    useShallow((state) => ({
      currentHiraganaData: state.currentHiraganaData,
      isHydrated: state.isHydrated,
      progress: state.getProgress,
      getUpdatedHiragana: state.getUpdatedHiragana,
    })),
  );

export const useHiraganaActions = () =>
  useHiraganaStore(
    useShallow((state) => ({
      setHiraganaData: state.setHiraganaData,
      initializeHiraganaData: state.initializeHiraganaData,
      updateKanaItem: state.updateKanaItem,
      updateKanaByCharacter: state.updateKanaByCharacter,
      addOrUpdateKana: state.addOrUpdateKana,
      resetProgress: state.resetProgress,
      getUpdatedHiragana: state.getUpdatedHiragana,
    })),
  );

export const useGetUpdatedHiragana = () =>
  useHiraganaStore((state) => state.getUpdatedHiragana);

export const useUpdateKanaByCharacter = () =>
  useHiraganaStore((state) => state.updateKanaByCharacter);

export const useAddOrUpdateKana = () =>
  useHiraganaStore((state) => state.addOrUpdateKana);
