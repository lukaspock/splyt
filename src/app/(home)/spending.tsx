import React, {useMemo, useState} from 'react';
import {Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {runOnJS} from "react-native-reanimated";
import {ChevronLeft, ChevronRight} from "lucide-react-native";
import {budgetStyles as bstyle} from "@/constants/budgetStyles";
import {dashboardStyles as dstyle} from "@/constants/dashboardStyles";
import {useBudgetCategories} from "@/hooks/useBudget";
import {useExpensesForMonth} from "@/hooks/useExpenses";
import {addMonths} from "@/lib/date";
import {formatCentsAsDisplay} from "@/lib/currency";

const SWIPE_THRESHOLD = 60;
const MONTH_LABEL_FORMAT: Intl.DateTimeFormatOptions = {month: "long", year: "numeric"};
const TODAY_LABEL_FORMAT: Intl.DateTimeFormatOptions = {weekday: "short", day: "numeric", month: "short"};

function Spending() {
    const [monthOffset, setMonthOffset] = useState(0);
    const referenceDate = useMemo(() => addMonths(new Date(), monthOffset), [monthOffset]);
    const categoriesQuery = useBudgetCategories();
    const expensesQuery = useExpensesForMonth(referenceDate);

    const categories = categoriesQuery.data ?? [];
    const categoryById = new Map(categories.map((category) => [category.id, category]));
    const expenses = expensesQuery.data ?? [];
    const totalCents = expenses.reduce((sum, expense) => sum + expense.amount_cents, 0);

    const isCurrentMonth = monthOffset === 0;

    function goToPreviousMonth() {
        setMonthOffset((offset) => offset - 1);
    }

    function goToNextMonth() {
        setMonthOffset((offset) => Math.min(offset + 1, 0));
    }

    const panGesture = Gesture.Pan().onEnd((event) => {
        if (event.translationX <= -SWIPE_THRESHOLD) {
            runOnJS(goToPreviousMonth)();
        } else if (event.translationX >= SWIPE_THRESHOLD) {
            runOnJS(goToNextMonth)();
        }
    });

    return (
        <SafeAreaView style={bstyle.screen} edges={["top", "bottom"]}>
            <View style={{flexDirection: "row", alignItems: "center", padding: 16, gap: 12}}>
                <Pressable onPress={() => router.back()} hitSlop={8}>
                    <ChevronLeft size={22} color="#1C1C1E" />
                </Pressable>
                <Text style={{fontSize: 16, fontWeight: "700"}}>Spending</Text>
                <Text style={[bstyle.headerSubtitle, {marginLeft: "auto"}]}>{new Date().toLocaleDateString("en-GB", TODAY_LABEL_FORMAT)}</Text>
            </View>

            <GestureDetector gesture={panGesture}>
                <View style={{flex: 1, paddingHorizontal: 20}}>
                    <View style={dstyle.dayNavRow}>
                        <Pressable onPress={goToPreviousMonth} hitSlop={8} style={dstyle.dayNavButton}>
                            <ChevronLeft size={20} color="#1C1C1E" />
                        </Pressable>
                        <Text style={dstyle.dayNavLabel}>{referenceDate.toLocaleDateString("en-GB", MONTH_LABEL_FORMAT)}</Text>
                        <Pressable
                            onPress={goToNextMonth}
                            hitSlop={8}
                            disabled={isCurrentMonth}
                            style={[dstyle.dayNavButton, isCurrentMonth && dstyle.dayNavButtonDisabled]}
                        >
                            <ChevronRight size={20} color="#1C1C1E" />
                        </Pressable>
                    </View>

                    {expenses.length === 0 ? (
                        <Text style={dstyle.emptyText}>No expenses logged this month.</Text>
                    ) : (
                        <View style={dstyle.recentList}>
                            {expenses.map((expense) => {
                                const category = categoryById.get(expense.category_id);
                                return (
                                    <View key={expense.id} style={dstyle.recentRow}>
                                        <Text style={dstyle.rowIcon}>{category?.icon ?? "💸"}</Text>
                                        <View style={{flex: 1}}>
                                            <Text style={dstyle.recentName} numberOfLines={1}>{category?.name ?? "Deleted category"}</Text>
                                            {!!expense.note && <Text style={dstyle.recentNote} numberOfLines={1}>{expense.note}</Text>}
                                        </View>
                                        <Text style={dstyle.recentDate}>{expense.spent_at}</Text>
                                        <Text style={dstyle.recentAmount}>{formatCentsAsDisplay(expense.amount_cents)}</Text>
                                    </View>
                                );
                            })}
                            <View style={[dstyle.recentRow, {borderTopWidth: 0, marginTop: 8}]}>
                                <Text style={[dstyle.recentName, {fontWeight: "700"}]}>Total</Text>
                                <Text style={[dstyle.recentAmount, {fontWeight: "700"}]}>{formatCentsAsDisplay(totalCents)}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </GestureDetector>
        </SafeAreaView>
    );
}

export default Spending;
