import { create } from "zustand";
import type { OnboardingGoal } from "@/types/database";

type OnboardingState = {
  name: string;
  goal: OnboardingGoal | null;
  selectedCategories: string[];
  setName: (name: string) => void;
  setGoal: (goal: OnboardingGoal) => void;
  setSelectedCategories: (names: string[]) => void;
  toggleCategory: (name: string) => void;
  reset: () => void;
};

export const useOnboarding = create<OnboardingState>((set) => ({
  name: "",
  goal: null,
  selectedCategories: [],
  setName: (name) => set({ name }),
  setGoal: (goal) => set({ goal }),
  setSelectedCategories: (names) => set({ selectedCategories: names }),
  toggleCategory: (name) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(name)
        ? state.selectedCategories.filter((n) => n !== name)
        : [...state.selectedCategories, name],
    })),
  reset: () => set({ name: "", goal: null, selectedCategories: [] }),
}));
