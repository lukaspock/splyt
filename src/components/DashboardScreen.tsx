import React from 'react';
import {ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View} from "react-native";
import {router} from "expo-router";
import {budgetStyles as bstyle} from "@/constants/budgetStyles";
import {useSession} from "@/hooks/useSession";
import {
    useAddBudgetCategory,
    useBudgetCategories,
    useDeleteBudgetCategory,
    useUpdateBudgetAmount,
} from "@/hooks/useBudget";
import {useAddExpense, useDeleteExpense, useExpensesForMonth} from "@/hooks/useExpenses";
import {sumByCategory, sumByDay, computeHotstreak} from "@/lib/dashboard";
import {getMonthRange} from "@/lib/date";
import BudgetOverview from "@/components/BudgetOverview";
import BudgetSection from "@/components/BudgetSection";
import AllowanceDonutChart from "@/components/AllowanceDonutChart";
import HotstreakCalendar from "@/components/HotstreakCalendar";
import AddExpenseForm from "@/components/AddExpenseForm";
import type {OnboardingGoal} from "@/types/database";

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
    const addCategory = useAddBudgetCategory();
    const updateAmount = useUpdateBudgetAmount();
    const deleteCategory = useDeleteBudgetCategory();

    const expensesQuery = useExpensesForMonth();
    const addExpense = useAddExpense();
    const deleteExpense = useDeleteExpense();

    const categories = categoriesQuery.data ?? [];
    const incomeCategories = categories.filter((category) => category.type === "income");
    const expenseCategories = categories.filter((category) => category.type === "expense");
    const totalIncomeCents = sumAmounts(incomeCategories);
    const totalExpensesCents = sumAmounts(expenseCategories);

    const expenses = expensesQuery.data ?? [];
    const spentByCategory = sumByCategory(expenses);
    const dailyTotals = sumByDay(expenses);
    const {daysInMonth} = getMonthRange();
    const dailyBudgetCents = Math.round(totalExpensesCents / daysInMonth);
    const streak = computeHotstreak(dailyTotals, dailyBudgetCents);

    const subtitle = user?.goal ? GOAL_SUBTITLES[user.goal] : "Here's your monthly budget.";
    const isLoading = categoriesQuery.isLoading || expensesQuery.isLoading;

    return (
        <KeyboardAvoidingView
            style={bstyle.screen}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView style={bstyle.scroll} contentContainerStyle={bstyle.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={bstyle.header}>
                    <Text style={bstyle.headerTitle}>Hi {user?.name ?? "there"} 👋</Text>
                    <Text style={bstyle.headerSubtitle}>{subtitle}</Text>
                </View>

                {isLoading ? (
                    <ActivityIndicator />
                ) : (
                    <>
                        <AllowanceDonutChart expenseCategories={expenseCategories} spentByCategory={spentByCategory} />

                        <HotstreakCalendar dailyTotals={dailyTotals} dailyBudgetCents={dailyBudgetCents} streak={streak} />

                        <AddExpenseForm
                            expenseCategories={expenseCategories}
                            recentExpenses={expenses}
                            isSubmitting={addExpense.isPending}
                            onAddExpense={(categoryId, amountCents, spentAt) =>
                                addExpense.mutate(
                                    {categoryId, amountCents, spentAt},
                                    {onError: (error) => Alert.alert("Couldn't log expense", error.message)},
                                )
                            }
                            onDeleteExpense={(id) => deleteExpense.mutate(id)}
                        />

                        <BudgetOverview totalIncomeCents={totalIncomeCents} totalExpensesCents={totalExpensesCents} />

                        <BudgetSection
                            title="Income"
                            categories={incomeCategories}
                            totalCents={totalIncomeCents}
                            isAdding={addCategory.isPending}
                            onAmountChange={(id, amountCents) => updateAmount.mutate({id, amountCents})}
                            onDelete={(id) => deleteCategory.mutate(id)}
                            onAddCategory={(name) => addCategory.mutate({name, type: "income"})}
                        />

                        <BudgetSection
                            title="Expenses"
                            categories={expenseCategories}
                            totalCents={totalExpensesCents}
                            isAdding={addCategory.isPending}
                            onAmountChange={(id, amountCents) => updateAmount.mutate({id, amountCents})}
                            onDelete={(id) => deleteCategory.mutate(id)}
                            onAddCategory={(name) => addCategory.mutate({name, type: "expense"})}
                        />
                    </>
                )}

                <Pressable style={bstyle.signOutButton} onPress={() => signOut().then(() => router.replace('/login'))}>
                    <Text style={bstyle.signOutText}>Sign out</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function sumAmounts(categories: {amount_cents: number}[]): number {
    return categories.reduce((sum, category) => sum + category.amount_cents, 0);
}

export default DashboardScreen;
