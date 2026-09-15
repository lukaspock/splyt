import React, {useState} from 'react';
import {Pressable, Text, TextInput, View} from "react-native";
import {Plus} from "lucide-react-native";
import {budgetStyles as bstyle} from "@/constants/budgetStyles";
import {formatCentsAsDisplay} from "@/lib/currency";
import BudgetCategoryRow from "@/components/BudgetCategoryRow";
import type {BudgetCategory} from "@/types/database";

type Props = {
    title: string;
    categories: BudgetCategory[];
    totalCents: number;
    isAdding: boolean;
    onAmountChange: (id: string, amountCents: number) => void;
    onDelete: (id: string) => void;
    onAddCategory: (name: string, icon?: string) => void;
};

function BudgetSection({title, categories, totalCents, isAdding, onAmountChange, onDelete, onAddCategory}: Props) {

    const [isAddingOpen, setIsAddingOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryIcon, setNewCategoryIcon] = useState("");

    return (
        <View style={bstyle.section}>
            <View style={bstyle.sectionHeader}>
                <Text style={bstyle.sectionTitle}>{title}</Text>
                <Text style={bstyle.sectionTotal}>{formatCentsAsDisplay(totalCents)}</Text>
            </View>

            <View style={bstyle.card}>
                {categories.map((category, index) => (
                    <BudgetCategoryRow
                        key={category.id}
                        category={category}
                        isLast={index === categories.length - 1 && !isAddingOpen}
                        onAmountChange={(amountCents) => onAmountChange(category.id, amountCents)}
                        onDelete={() => onDelete(category.id)}
                    />
                ))}

                {isAddingOpen ? (
                    <View style={bstyle.addCategoryForm}>
                        <TextInput
                            style={bstyle.addCategoryIconInput}
                            placeholder="💰"
                            placeholderTextColor="#8E8E93"
                            value={newCategoryIcon}
                            onChangeText={setNewCategoryIcon}
                            maxLength={2}
                        />
                        <TextInput
                            style={bstyle.addCategoryInput}
                            placeholder="Category name"
                            placeholderTextColor="#8E8E93"
                            value={newCategoryName}
                            onChangeText={setNewCategoryName}
                            autoFocus
                            onSubmitEditing={confirmAdd}
                        />
                        <Pressable style={bstyle.addCategoryConfirm} onPress={confirmAdd} disabled={isAdding}>
                            <Text style={bstyle.addCategoryConfirmText}>Add</Text>
                        </Pressable>
                    </View>
                ) : (
                    <Pressable style={bstyle.addRow} onPress={() => setIsAddingOpen(true)}>
                        <Plus size={16} color="#208AEF" />
                        <Text style={bstyle.addRowText}>Add category</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );

    function confirmAdd() {
        const name = newCategoryName.trim();
        if (!name) return;
        onAddCategory(name, newCategoryIcon.trim() || undefined);
        setNewCategoryName("");
        setNewCategoryIcon("");
        setIsAddingOpen(false);
    }
}

export default BudgetSection;
