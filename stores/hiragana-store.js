import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { checkUnlockConditions } from '../util/unlock-logic';
import { getAllHiragana } from '../data/kana-data';
import { LEARNING } from '../constants';

export const useHiraganaStore = create(
  persist(
    (set, get) => ({
      // State
      hiraganaData: [], // Initialize with default data
      isHydrated: false,

      // Actions
      setHiraganaData: (data) => {
        set({ hiraganaData: data });
      },

      // Initialize the store with initial data and check unlock conditions
      initializeHiraganaData: () => {
        const currentState = get();

        // Prevent re-initialization if already has data
        if (currentState.hiraganaData.length > 0) {
          return;
        }

        const staticHiragana = getAllHiragana();
        // Set initial data directly
        set({ hiraganaData: staticHiragana });
      },

      // Update a single kana item
      updateKanaItem: (index, updatedItem) => {
        const currentState = get();
        const updatedData = [...currentState.hiraganaData];
        updatedData[index] = updatedItem;

        // Check unlock conditions after update
        const { data, changed } = checkUnlockConditions(updatedData);

        set({ hiraganaData: data });

        if (changed) {
          console.log('New content unlocked!');
        }
      },

      // Update kana item by character
      updateKanaByCharacter: (character, updates) => {
        const currentState = get();
        const updatedData = currentState.hiraganaData.map((item) =>
          item.character === character ? { ...item, ...updates } : item,
        );

        // Check unlock conditions after update
        const { data, changed } = checkUnlockConditions(updatedData);

        set({ hiraganaData: data });

        if (changed) {
          console.log('New content unlocked!');
        }
      },

      // Add or update kana items - adds new if not exists, updates if exists
      addOrUpdateKana: (newItems) => {
        const currentState = get();
        const existingData = currentState.hiraganaData;

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

        set({ hiraganaData: data });

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
        const resetData = currentState.hiraganaData.map((item) => ({
          ...item,
          points: 0,
          unlocked: item.row === 'a', // Only unlock the first row
        }));

        set({ hiraganaData: resetData });
      },

      // Get kana by category
      getKanaByCategory: (category) => {
        const { hiraganaData } = get();
        return hiraganaData.filter((item) => item.category === category);
      },

      // Get kana by row
      getKanaByRow: (row) => {
        const { hiraganaData } = get();
        return hiraganaData.filter((item) => item.row === row);
      },

      getUpdatedHiragana: () => {
        const { hiraganaData } = get();
        const staticHiragana = getAllHiragana();

        const updatekana = new Map(
          hiraganaData.map((item) => [item.character, item]),
        );

        const updatedData = staticHiragana.map((item) => {
          const existingItem = updatekana.get(item.character);
          if (existingItem) {
            return existingItem;
          }
          return item;
        });

        const { data, changed } = checkUnlockConditions(updatedData);

        console.log(`this is changed: ${changed}`);
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
          if (state.hiraganaData.length > 0) {
            const { data } = checkUnlockConditions(state.hiraganaData);
            state.hiraganaData = data;
          }
          state.isHydrated = true;
        }
      },
    },
  ),
);

// Selector hooks for better performance
export const useHiraganaData = () =>
  useHiraganaStore((state) => state.hiraganaData);
export const useIsHydrated = () =>
  useHiraganaStore((state) => state.isHydrated);
export const useHiraganaProgress = () =>
  useHiraganaStore((state) => state.getProgress());
export const useHiraganaActions = () =>
  useHiraganaStore((state) => ({
    setHiraganaData: state.setHiraganaData,
    initializeHiraganaData: state.initializeHiraganaData,
    updateKanaItem: state.updateKanaItem,
    updateKanaByCharacter: state.updateKanaByCharacter,
    addOrUpdateKana: state.addOrUpdateKana,
    resetProgress: state.resetProgress,
  }));

export const useGetUpdatedHiragana = () =>
  useHiraganaStore((state) => state.getUpdatedHiragana);

export const useUpdateKanaByCharacter = () =>
  useHiraganaStore((state) => state.updateKanaByCharacter);

export const useAddOrUpdateKana = () =>
  useHiraganaStore((state) => state.addOrUpdateKana);
