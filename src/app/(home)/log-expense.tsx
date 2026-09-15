import React, {useState} from 'react';
import {Alert, Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {ChevronLeft} from "lucide-react-native";
import {budgetStyles as bstyle} from "@/constants/budgetStyles";
import {useBudgetCategories} from "@/hooks/useBudget";
import {useAddExpense, useDeleteExpense, useExpensesForMonth} from "@/hooks/useExpenses";
import {sumByDay, computeHotstreak} from "@/lib/dashboard";
import {getMonthRange, toISODate} from "@/lib/date";
import {shouldCelebrateToday, markCelebratedToday} from "@/lib/streakCelebration";
import AddExpenseForm from "@/components/AddExpenseForm";
import StreakCelebration from "@/components/StreakCelebration";

function LogExpense() {
    const categoriesQuery = useBudgetCategories();
    const expensesQuery = useExpensesForMonth();
    const addExpense = useAddExpense();
    const deleteExpense = useDeleteExpense();

    const [celebration, setCelebration] = useState<{streak: number} | null>(null);

    const categories = categoriesQuery.data ?? [];
    const expenseCategories = categories.filter((category) => category.type === "expense");
    const totalExpensesCents = expenseCategories.reduce((sum, category) => sum + category.amount_cents, 0);

    const expenses = expensesQuery.data ?? [];
    const dailyTotals = sumByDay(expenses);
    const {daysInMonth} = getMonthRange();
    const dailyBudgetCents = Math.round(totalExpensesCents / daysInMonth);

    return (
        <SafeAreaView style={bstyle.screen} edges={["top", "bottom"]}>
            <View style={{flexDirection: "row", alignItems: "center", padding: 16, gap: 12}}>
                <Pressable onPress={() => router.back()} hitSlop={8}>
                    <ChevronLeft size={22} color="#1C1C1E" />
                </Pressable>
                <Text style={{fontSize: 16, fontWeight: "700"}}>Log an expense</Text>
            </View>

            <View style={{flex: 1, justifyContent: "center", paddingHorizontal: 20}}>
                <AddExpenseForm
                    expenseCategories={expenseCategories}
                    recentExpenses={expenses}
                    isSubmitting={addExpense.isPending}
                    onAddExpense={(categoryId, amountCents, spentAt, note) => {
                        const todayIso = toISODate(new Date());
                        const isFirstOfDay = spentAt === todayIso && (dailyTotals[todayIso] ?? 0) === 0;
                        const canCelebrate = isFirstOfDay && shouldCelebrateToday(todayIso);

                        addExpense.mutate(
                            {categoryId, amountCents, spentAt, note},
                            {
                                onSuccess: () => {
                                    if (canCelebrate) {
                                        markCelebratedToday(todayIso);
                                        const newDailyTotals = {...dailyTotals, [todayIso]: (dailyTotals[todayIso] ?? 0) + amountCents};
                                        const newStreak = computeHotstreak(newDailyTotals, dailyBudgetCents);
                                        setCelebration({streak: newStreak});
                                    } else {
                                        router.back();
                                    }
                                },
                                onError: (error) => Alert.alert("Couldn't log expense", error.message),
                            },
                        );
                    }}
                    onDeleteExpense={(id) => deleteExpense.mutate(id)}
                />
            </View>

            {celebration && (
                <StreakCelebration
                    streak={celebration.streak}
                    onDismiss={() => {
                        setCelebration(null);
                        router.back();
                    }}
                />
            )}
        </SafeAreaView>
    );
}

export default LogExpense;
