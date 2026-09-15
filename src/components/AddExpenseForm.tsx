import React, {useState} from 'react';
import {ActivityIndicator, Pressable, ScrollView, Text, TextInput, View} from "react-native";
import {Trash2} from "lucide-react-native";
import {dashboardStyles as dstyle} from "@/constants/dashboardStyles";
import {formatCentsAsDisplay, parseEuroInputToCents} from "@/lib/currency";
import {toISODate} from "@/lib/date";
import type {BudgetCategory, Expense} from "@/types/database";

type Props = {
    expenseCategories: BudgetCategory[];
    recentExpenses: Expense[];
    isSubmitting: boolean;
    onAddExpense: (categoryId: string, amountCents: number, spentAt: string, note: string) => void;
    onDeleteExpense: (id: string) => void;
};

function AddExpenseForm({expenseCategories, recentExpenses, isSubmitting, onAddExpense, onDeleteExpense}: Props) {

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(expenseCategories[0]?.id ?? null);
    const [amountText, setAmountText] = useState("");
    const [noteText, setNoteText] = useState("");
    const [amountError, setAmountError] = useState<string | null>(null);
    const [justLogged, setJustLogged] = useState(false);

    const categoryById = new Map(expenseCategories.map((category) => [category.id, category]));

    if (expenseCategories.length === 0) {
        return (
            <View style={dstyle.card}>
                <Text style={dstyle.cardTitle}>Log an expense</Text>
                <Text style={dstyle.emptyText}>Add an expense category below first.</Text>
            </View>
        );
    }

    return (
        <View style={dstyle.card}>
            <Text style={dstyle.cardTitle}>Log an expense</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={dstyle.chipRow}>
                {expenseCategories.map((category) => (
                    <Pressable
                        key={category.id}
                        style={[dstyle.chip, selectedCategoryId === category.id && dstyle.chipSelected]}
                        onPress={() => setSelectedCategoryId(category.id)}
                    >
                        <Text style={dstyle.chipIcon}>{category.icon}</Text>
                        <Text
                            style={[dstyle.chipText, selectedCategoryId === category.id && dstyle.chipTextSelected]}
                            numberOfLines={1}
                        >
                            {category.name}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            <View style={dstyle.expenseAmountWrapper}>
                <Text style={dstyle.amountPrefix}>€</Text>
                <TextInput
                    style={dstyle.expenseAmountInput}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#8E8E93"
                    value={amountText}
                    onChangeText={(text) => { setAmountText(text); setAmountError(null); }}
                />
            </View>
            {amountError && <Text style={dstyle.fieldError}>{amountError}</Text>}

            <TextInput
                style={dstyle.noteInput}
                placeholder="What was this for? (optional)"
                placeholderTextColor="#8E8E93"
                value={noteText}
                onChangeText={setNoteText}
            />

            <Pressable
                style={[dstyle.logButton, (!selectedCategoryId || isSubmitting) && dstyle.logButtonDisabled]}
                disabled={!selectedCategoryId || isSubmitting}
                onPress={submit}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={dstyle.logButtonText}>{justLogged ? "✓ Logged" : "Log expense"}</Text>
                )}
            </Pressable>

            {recentExpenses.length > 0 && (
                <View style={dstyle.recentList}>
                    {recentExpenses.slice(0, 6).map((expense) => {
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
                                <Pressable onPress={() => onDeleteExpense(expense.id)} hitSlop={8}>
                                    <Trash2 size={14} color="#8E8E93" />
                                </Pressable>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );

    function submit() {
        if (!selectedCategoryId) return;
        const amountCents = parseEuroInputToCents(amountText);
        if (amountCents <= 0) {
            setAmountError("Enter an amount greater than 0");
            return;
        }
        onAddExpense(selectedCategoryId, amountCents, toISODate(new Date()), noteText.trim());
        setAmountText("");
        setNoteText("");
        setAmountError(null);
        setJustLogged(true);
        setTimeout(() => setJustLogged(false), 1500);
    }
}

export default AddExpenseForm;
