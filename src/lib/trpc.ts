import { createTRPCClient, httpLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { QueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import type { AppRouter } from "../../server/src/router";

export const queryClient = new QueryClient();

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: `${process.env.EXPO_PUBLIC_API_URL}/trpc`,
      headers: async () => {
        const token = await SecureStore.getItemAsync("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
