import React from 'react';
import {Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {X} from "lucide-react-native";
import {budgetStyles as bstyle} from "@/constants/budgetStyles";
import {dashboardStyles as dstyle} from "@/constants/dashboardStyles";
import {useSession} from "@/hooks/useSession";

function AccountSettings() {
    const user = useSession((state) => state.user);
    const session = useSession((state) => state.session);

    return (
        <SafeAreaView style={bstyle.screen} edges={["top", "bottom"]}>
            <View style={bstyle.modalCloseRow}>
                <Pressable onPress={() => router.back()} hitSlop={8}>
                    <X size={22} color="#1C1C1E" />
                </Pressable>
            </View>

            <View style={bstyle.header}>
                <Text style={bstyle.headerTitle}>Account settings</Text>
            </View>

            <View style={{height: 20}} />

            <View style={bstyle.accountRow}>
                <Text style={bstyle.accountLabel}>Name</Text>
                <Text style={bstyle.accountValue}>{user?.name ?? "—"}</Text>
            </View>

            <View style={bstyle.accountRow}>
                <Text style={bstyle.accountLabel}>Email</Text>
                <Text style={bstyle.accountValue}>{session?.user.email ?? "—"}</Text>
            </View>

            <Text style={[dstyle.emptyText, {marginHorizontal: 20}]}>More settings coming soon.</Text>
        </SafeAreaView>
    );
}

export default AccountSettings;
