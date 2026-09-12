import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { SafeUser } from "../../server/src/types/User";
import { trpc, queryClient } from "@/lib/trpc";

type SessionState = {
  session: string | null;
  user: SafeUser | null;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useSession = create<SessionState>((set) => ({
  session: null,
  user: null,
  isLoading: true,

  hydrate: async () => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) {
      set({ session: null, user: null, isLoading: false });
      return;
    }

    try{
      const user = await queryClient.fetchQuery(trpc.users.getMe.queryOptions())

      set({ session: token, user, isLoading: false });
    }
    catch (error) {
      useSession.getState().signOut();
    }

  },

  signIn: async (token) => {
    await SecureStore.setItemAsync("token", token);
    const user = await queryClient.fetchQuery(trpc.users.getMe.queryOptions());
    set({ session: token, user });
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync("token");
    set({ session: null, user: null });
  },
}));
