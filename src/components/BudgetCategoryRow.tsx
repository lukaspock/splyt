import React, {useRef, useState} from 'react';
import {Alert, Pressable, Text, TextInput, View} from "react-native";
import {Swipeable} from "react-native-gesture-handler";
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
    const swipeableRef = useRef<Swipeable>(null);

    function confirmDelete() {
        Alert.alert(
            "Delete category?",
            `Are you sure you want to delete category ${category.name}?`,
            [
                {text: "Cancel", style: "cancel", onPress: () => swipeableRef.current?.close()},
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        onDelete();
                        swipeableRef.current?.close();
                    },
                },
            ],
        );
    }

    return (
        <Swipeable
            ref={swipeableRef}
            overshootRight={false}
            renderRightActions={() => (
                <Pressable style={bstyle.deleteAction} onPress={confirmDelete}>
                    <Trash2 size={18} color="#FFFFFF" />
                </Pressable>
            )}
        >
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
            </View>
        </Swipeable>
    );
}

export default BudgetCategoryRow;
