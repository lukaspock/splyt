import React, {useMemo, useState} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View} from "react-native";
import {router} from "expo-router";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {runOnJS} from "react-native-reanimated";
import {EllipsisVertical} from "lucide-react-native";
import {budgetStyles as bstyle} from "@/constants/budgetStyles";
import {dashboardStyles as dstyle} from "@/constants/dashboardStyles";
import {useSession} from "@/hooks/useSession";
import {useBudgetCategories} from "@/hooks/useBudget";
import {useExpensesForMonth} from "@/hooks/useExpenses";
import {sumByCategory} from "@/lib/dashboard";
import {addMonths} from "@/lib/date";
import AllowanceDonutChart from "@/components/AllowanceDonutChart";
import DashboardMenu from "@/components/DashboardMenu";
import type {OnboardingGoal} from "@/types/database";

const SWIPE_THRESHOLD = 60;
const MONTH_LABEL_FORMAT: Intl.DateTimeFormatOptions = {month: "long", year: "numeric"};

const GOAL_SUBTITLES: Record<OnboardingGoal, string> = {
    housing: "Let's keep your rent and living costs in check.",
    debt: "Let's get your debt under control.",
    saving: "Let's set money aside every month.",
    overview: "Here's where your money goes.",
};

function DashboardScreen() {

    const user = useSession((state) => state.user);
    const signOut = useSession((state) => state.signOut);
    const categoriesQuery = useBudgetCategories();

    const [monthOffset, setMonthOffset] = useState(0);
    const referenceDate = useMemo(() => addMonths(new Date(), monthOffset), [monthOffset]);
    const expensesQuery = useExpensesForMonth(referenceDate);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const categories = categoriesQuery.data ?? [];
    const expenseCategories = categories.filter((category) => category.type === "expense");

    const expenses = expensesQuery.data ?? [];
    const spentByCategory = sumByCategory(expenses);

    function goToPreviousMonth() {
        setMonthOffset((offset) => offset - 1);
    }

    function goToNextMonth() {
        setMonthOffset((offset) => Math.min(offset + 1, 0));
    }

    const monthSwipe = Gesture.Pan().onEnd((event) => {
        if (event.translationX <= -SWIPE_THRESHOLD) {
            runOnJS(goToPreviousMonth)();
        } else if (event.translationX >= SWIPE_THRESHOLD) {
            runOnJS(goToNextMonth)();
        }
    });

    const subtitle = user?.goal ? GOAL_SUBTITLES[user.goal] : "Here's your monthly budget.";
    const isLoading = categoriesQuery.isLoading || expensesQuery.isLoading;

    return (
        <KeyboardAvoidingView
            style={bstyle.screen}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView style={bstyle.scroll} contentContainerStyle={bstyle.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={bstyle.headerRow}>
                    <View style={bstyle.header}>
                        <Text style={bstyle.headerTitle}>Hi {user?.name ?? "there"} 👋</Text>
                        <Text style={bstyle.headerSubtitle}>{subtitle}</Text>
                    </View>
                    <Pressable style={bstyle.menuButton} onPress={() => setIsMenuOpen(true)} hitSlop={8}>
                        <EllipsisVertical size={22} color="#1C1C1E" />
                    </Pressable>
                </View>

                {isLoading ? (
                    <ActivityIndicator />
                ) : (
                    <>
                        <GestureDetector gesture={monthSwipe}>
                            <View style={{gap: 12}}>
                                <Text style={[dstyle.dayNavLabel, {textAlign: "center"}]}>{referenceDate.toLocaleDateString("en-GB", MONTH_LABEL_FORMAT)}</Text>
                                <AllowanceDonutChart expenseCategories={expenseCategories} spentByCategory={spentByCategory} />
                            </View>
                        </GestureDetector>

                        <Pressable style={dstyle.logButton} onPress={() => router.push('/log-expense')}>
                            <Text style={dstyle.logButtonText}>Log expenses</Text>
                        </Pressable>
                    </>
                )}
            </ScrollView>

            <DashboardMenu
                visible={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onSignOut={() => {
                    setIsMenuOpen(false);
                    signOut().then(() => router.replace('/login'));
                }}
                onAccountSettings={() => {
                    setIsMenuOpen(false);
                    router.push('/account-settings');
                }}
            />
        </KeyboardAvoidingView>
    );
}

export default DashboardScreen;
