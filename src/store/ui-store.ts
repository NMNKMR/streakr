import { create } from "zustand";

type UIStore = {
  activeModal: "delete-confirm" | "emoji-picker" | null;
  setActiveModal: (modal: UIStore["activeModal"]) => void;
  habitFormDirty: boolean;
  setHabitFormDirty: (dirty: boolean) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
  habitFormDirty: false,
  setHabitFormDirty: (dirty) => set({ habitFormDirty: dirty }),
}));
