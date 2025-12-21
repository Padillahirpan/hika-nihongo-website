import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

export const useKanaStrokeStore = create((set) => ({
  kanaStroke: '',
  setKana: (value) => set({ kanaStroke: value }),
  showStrokeModal: false,
  setShowStrokeModal: (isShow, newKana) => {
    set({ showStrokeModal: isShow });
    if (newKana) {
      set({ kanaStroke: newKana });
    } else {
      set({ kanaStroke: '' });
    }
  },
}));

export const useKanaStrokeData = () =>
  useKanaStrokeStore(
    useShallow((state) => ({
      kanaStroke: state.kanaStroke,
      showStrokeModal: state.showStrokeModal,
      setKana: state.setKana,
      setShowStrokeModal: state.setShowStrokeModal,
    })),
  );
