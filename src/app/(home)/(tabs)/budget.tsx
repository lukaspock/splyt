import React, {useState} from 'react';
import {Pressable, ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {GlassView} from "expo-glass-effect";
import {ShoppingCart, Wallet} from "lucide-react-native";
import {budgetStyles as bstyle} from "@/constants/budgetStyles";
import {
    useAddBudgetCategory,
    useBudgetCategories,
    useDeleteBudgetCategory,
    useUpdateBudgetAmount,
} from "@/hooks/useBudget";
import BudgetOverview from "@/components/BudgetOverview";
import BudgetSection from "@/components/BudgetSection";

function Budget() {
    const categoriesQuery = useBudgetCategories();
    const addCategory = useAddBudgetCategory();
    const updateAmount = useUpdateBudgetAmount();
    const deleteCategory = useDeleteBudgetCategory();

    const [plannerTab, setPlannerTab] = useState<"income" | "expenses">("income");

    const categories = categoriesQuery.data ?? [];
    const incomeCategories = categories.filter((category) => category.type === "income");
    const expenseCategories = categories.filter((category) => category.type === "expense");
    const totalIncomeCents = incomeCategories.reduce((sum, category) => sum + category.amount_cents, 0);
    const totalExpensesCents = expenseCategories.reduce((sum, category) => sum + category.amount_cents, 0);

    return (
        <SafeAreaView style={bstyle.screen} edges={["top", "bottom"]}>
            <View style={bstyle.header}>
                <Text style={bstyle.headerTitle}>Budget & Allowances</Text>
            </View>

            <View style={bstyle.plannerTabBarInline}>
                <GlassView glassEffectStyle="regular" style={bstyle.plannerTabBar}>
                    <Pressable style={bstyle.plannerTabItem} onPress={() => setPlannerTab("income")}>
                        <Wallet size={20} color={plannerTab === "income" ? "#208AEF" : "#1C1C1E"} />
                        <Text style={[bstyle.plannerTabText, plannerTab === "income" && bstyle.plannerTabTextActive]}>Income</Text>
                    </Pressable>
                    <Pressable style={bstyle.plannerTabItem} onPress={() => setPlannerTab("expenses")}>
                        <ShoppingCart size={20} color={plannerTab === "expenses" ? "#208AEF" : "#1C1C1E"} />
                        <Text style={[bstyle.plannerTabText, plannerTab === "expenses" && bstyle.plannerTabTextActive]}>Expenses</Text>
                    </Pressable>
                </GlassView>
            </View>

            <ScrollView contentContainerStyle={bstyle.scrollContent}>
                <BudgetOverview totalIncomeCents={totalIncomeCents} totalExpensesCents={totalExpensesCents} />

                {plannerTab === "income" ? (
                    <BudgetSection
                        title="Income"
                        categories={incomeCategories}
                        totalCents={totalIncomeCents}
                        isAdding={addCategory.isPending}
                        onAmountChange={(id, amountCents) => updateAmount.mutate({id, amountCents})}
                        onDelete={(id) => deleteCategory.mutate(id)}
                        onAddCategory={(name, icon) => addCategory.mutate({name, type: "income", icon})}
                    />
                ) : (
                    <BudgetSection
                        title="Expenses"
                        categories={expenseCategories}
                        totalCents={totalExpensesCents}
                        isAdding={addCategory.isPending}
                        onAmountChange={(id, amountCents) => updateAmount.mutate({id, amountCents})}
                        onDelete={(id) => deleteCategory.mutate(id)}
                        onAddCategory={(name, icon) => addCategory.mutate({name, type: "expense", icon})}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default Budget;
