import React from 'react';
import {Text, View} from "react-native";
import {budgetStyles as bstyle} from "@/constants/budgetStyles";
import {formatCentsAsDisplay} from "@/lib/currency";

type Props = {
    totalIncomeCents: number;
    totalExpensesCents: number;
};

function BudgetOverview({totalIncomeCents, totalExpensesCents}: Props) {

    const remainingCents = totalIncomeCents - totalExpensesCents;

    return (
        <View style={bstyle.overviewCard}>
            <View style={bstyle.overviewRow}>
                <Text style={bstyle.overviewLabel}>Planned income</Text>
                <Text style={bstyle.overviewValue}>{formatCentsAsDisplay(totalIncomeCents)}</Text>
            </View>

            <View style={bstyle.overviewRow}>
                <Text style={bstyle.overviewLabel}>Planned expenses</Text>
                <Text style={bstyle.overviewValue}>{formatCentsAsDisplay(totalExpensesCents)}</Text>
            </View>

            <View style={bstyle.overviewDivider} />

            <View style={bstyle.overviewRow}>
                <Text style={bstyle.overviewTotalLabel}>Left to plan</Text>
                <Text
                    style={[
                        bstyle.overviewTotalValue,
                        remainingCents >= 0 ? bstyle.overviewValuePositive : bstyle.overviewValueNegative,
                    ]}
                >
                    {formatCentsAsDisplay(remainingCents)}
                </Text>
            </View>
        </View>
    );
}

export default BudgetOverview;
