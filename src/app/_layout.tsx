import {useEffect} from "react";
import {Stack} from "expo-router";
import {QueryClientProvider} from "@tanstack/react-query";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {queryClient} from "@/lib/queryClient";
import {useSession} from "@/hooks/useSession";

export default function RootLayout() {
  const hydrate = useSession((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}/>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
