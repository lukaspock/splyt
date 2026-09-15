import React from 'react';
import {Pressable} from "react-native";
import type {PressableProps, StyleProp, ViewStyle} from "react-native";
import {Tabs, TabList, TabTrigger, TabSlot} from "expo-router/ui";
import {GlassView} from "expo-glass-effect";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {House, Wallet} from "lucide-react-native";
import {budgetStyles as bstyle} from "@/constants/budgetStyles";

type AppTabButtonProps = PressableProps & {
    isFocused?: boolean;
    icon: typeof House;
    style?: StyleProp<ViewStyle>;
};

function AppTabButton({isFocused, icon: Icon, style, ...props}: AppTabButtonProps) {
    return (
        <Pressable style={[bstyle.appTabItem, style]} {...props}>
            {isFocused ? (
                <GlassView glassEffectStyle="clear" tintColor="#208AEF" isInteractive style={bstyle.appTabItemActive}>
                    <Icon size={20} color="#FFFFFF" />
                </GlassView>
            ) : (
                <Icon size={22} color="#1C1C1E" />
            )}
        </Pressable>
    );
}

export default function TabsLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs>
            <TabSlot />

            <TabList asChild style={[bstyle.appTabBarWrapper, {bottom: insets.bottom + 12}]}>
                <GlassView glassEffectStyle="regular" isInteractive style={bstyle.appTabBar}>
                    <TabTrigger name="home" href="/home" asChild>
                        <AppTabButton icon={House} />
                    </TabTrigger>
                    <TabTrigger name="budget" href="/budget" asChild>
                        <AppTabButton icon={Wallet} />
                    </TabTrigger>
                </GlassView>
            </TabList>
        </Tabs>
    );
}
