import {useEffect} from "react";
import {Stack} from "expo-router";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/trpc";
import {useSession} from "@/hooks/useSession";

export default function RootLayout() {
  const hydrate = useSession((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}/>
    </QueryClientProvider>
  );
}
