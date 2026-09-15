import { create } from "zustand";
import type { OnboardingGoal } from "@/types/database";

type OnboardingState = {
  name: string;
  goal: OnboardingGoal | null;
  setName: (name: string) => void;
  setGoal: (goal: OnboardingGoal) => void;
  reset: () => void;
};

export const useOnboarding = create<OnboardingState>((set) => ({
  name: "",
  goal: null,
  setName: (name) => set({ name }),
  setGoal: (goal) => set({ goal }),
  reset: () => set({ name: "", goal: null }),
}));
