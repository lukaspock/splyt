import { Stack } from "expo-router";

export default function HomeLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="log-expense" />
            <Stack.Screen name="spending" />
            <Stack.Screen name="account-settings" options={{ presentation: "modal" }} />
        </Stack>
    );
}
