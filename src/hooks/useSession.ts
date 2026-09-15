import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { OnboardingGoal, Profile } from "@/types/database";

type SessionState = {
  session: Session | null;
  user: Profile | null;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
    goal: OnboardingGoal | null,
    selectedCategories: string[],
  ) => Promise<Session | null>;
  signOut: () => Promise<void>;
};

const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return data as Profile | null;
};

export const useSession = create<SessionState>((set) => ({
  session: null,
  user: null,
  isLoading: true,

  hydrate: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session ? await fetchProfile(session.user.id) : null;
    set({ session, user, isLoading: false });

    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      const newUser = newSession ? await fetchProfile(newSession.user.id) : null;
      set({ session: newSession, user: newUser, isLoading: false });
    });
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const user = await fetchProfile(data.session.user.id);
    set({ session: data.session, user, isLoading: false });
  },

  signUp: async (name, email, password, goal, selectedCategories) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, goal, selected_categories: selectedCategories } },
    });
    if (error) throw error;
    if (data.session) {
      const user = await fetchProfile(data.session.user.id);
      set({ session: data.session, user, isLoading: false });
    }
    return data.session;
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },
}));
