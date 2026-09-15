import React from 'react';
import {Text, View} from "react-native";
import Svg, {Circle, G} from "react-native-svg";
import {dashboardStyles as dstyle} from "@/constants/dashboardStyles";
import {formatCentsAsDisplay} from "@/lib/currency";
import type {BudgetCategory} from "@/types/database";

type Props = {
    expenseCategories: BudgetCategory[];
    spentByCategory: Record<string, number>;
};

const PALETTE = ["#208AEF", "#34C759", "#FF9500", "#AF52DE", "#FF3B30", "#5AC8FA", "#FFCC00", "#5856D6", "#FF2D55", "#8E8E93"];
const SIZE = 200;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function AllowanceDonutChart({expenseCategories, spentByCategory}: Props) {

    const totalPlannedCents = expenseCategories.reduce((sum, category) => sum + category.amount_cents, 0);
    const totalSpentCents = expenseCategories.reduce((sum, category) => sum + (spentByCategory[category.id] ?? 0), 0);

    if (totalPlannedCents === 0) {
        return (
            <View style={dstyle.card}>
                <Text style={dstyle.cardTitle}>Spending</Text>
                <Text style={dstyle.emptyText}>Set your allowances below to see your spending breakdown here.</Text>
            </View>
        );
    }

    const denominator = Math.max(totalPlannedCents, totalSpentCents);
    let cumulative = 0;
    const segments = expenseCategories
        .map((category, index) => ({category, color: PALETTE[index % PALETTE.length], spent: spentByCategory[category.id] ?? 0}))
        .filter((segment) => segment.spent > 0)
        .map((segment) => {
            const length = (segment.spent / denominator) * CIRCUMFERENCE;
            const offset = cumulative;
            cumulative += length;
            return {...segment, length, offset};
        });

    const isOverBudget = totalSpentCents > totalPlannedCents;
    const percent = Math.round((totalSpentCents / totalPlannedCents) * 100);

    return (
        <View style={dstyle.card}>
            <Text style={dstyle.cardTitle}>Spending</Text>

            <View style={dstyle.donutRow}>
                <Svg width={SIZE} height={SIZE}>
                    <G transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
                        <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke="#E5E5EA" strokeWidth={STROKE} fill="transparent" />
                        {segments.map((segment) => (
                            <Circle
                                key={segment.category.id}
                                cx={SIZE / 2}
                                cy={SIZE / 2}
                                r={RADIUS}
                                stroke={segment.color}
                                strokeWidth={STROKE}
                                strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
                                strokeDashoffset={-segment.offset}
                                strokeLinecap="butt"
                                fill="transparent"
                            />
                        ))}
                    </G>
                </Svg>
                <View style={dstyle.donutCenter} pointerEvents="none">
                    <Text style={[dstyle.donutPercent, isOverBudget && dstyle.donutPercentOver]}>{percent}%</Text>
                    <Text style={dstyle.donutSubtext}>of allowance</Text>
                </View>
            </View>

            <Text style={dstyle.donutTotals}>
                {formatCentsAsDisplay(totalSpentCents)} spent of {formatCentsAsDisplay(totalPlannedCents)}
            </Text>

            <View style={dstyle.legend}>
                {expenseCategories.map((category, index) => (
                    <View key={category.id} style={dstyle.legendRow}>
                        <View style={[dstyle.legendDot, {backgroundColor: PALETTE[index % PALETTE.length]}]} />
                        <Text style={dstyle.legendIcon}>{category.icon}</Text>
                        <Text style={dstyle.legendName} numberOfLines={1}>{category.name}</Text>
                        <Text style={dstyle.legendAmount}>
                            {formatCentsAsDisplay(spentByCategory[category.id] ?? 0)} / {formatCentsAsDisplay(category.amount_cents)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

export default AllowanceDonutChart;
