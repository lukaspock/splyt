import React, {useState} from 'react';
import {Pressable, Text, TextInput, View} from "react-native";
import {Trash2} from "lucide-react-native";
import {budgetStyles as bstyle} from "@/constants/budgetStyles";
import {formatCentsAsInputValue, parseEuroInputToCents} from "@/lib/currency";
import type {BudgetCategory} from "@/types/database";

type Props = {
    category: BudgetCategory;
    isLast: boolean;
    onAmountChange: (amountCents: number) => void;
    onDelete: () => void;
};

function BudgetCategoryRow({category, isLast, onAmountChange, onDelete}: Props) {

    const [text, setText] = useState(formatCentsAsInputValue(category.amount_cents));

    return (
        <View style={[bstyle.row, isLast && bstyle.rowLast]}>
            <Text style={bstyle.rowIcon}>{category.icon}</Text>
            <Text style={bstyle.rowName} numberOfLines={1}>{category.name}</Text>

            <View style={bstyle.amountWrapper}>
                <Text style={bstyle.amountPrefix}>€</Text>
                <TextInput
                    style={bstyle.amountInput}
                    keyboardType="decimal-pad"
                    value={text}
                    onChangeText={setText}
                    onBlur={() => onAmountChange(parseEuroInputToCents(text))}
                    selectTextOnFocus
                />
            </View>

            <Pressable onPress={onDelete} hitSlop={8} style={bstyle.deleteButton}>
                <Trash2 size={16} color="#8E8E93" />
            </Pressable>
        </View>
    );
}

export default BudgetCategoryRow;
