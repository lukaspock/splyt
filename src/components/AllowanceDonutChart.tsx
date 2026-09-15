import React from 'react';
import {Pressable, Text, View} from "react-native";
import Svg, {Circle, G} from "react-native-svg";
import {router} from "expo-router";
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
// Round linecaps extend each dash by ~STROKE/2 on both ends, so the visible
// gap must exceed STROKE before any empty space actually shows through.
const SEGMENT_GAP = STROKE * 1.2;
const OVER_BUDGET_COLOR = "#D93025";

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

    let cumulative = 0;
    const segments = expenseCategories.map((category, index) => {
        const color = PALETTE[index % PALETTE.length];
        const spent = spentByCategory[category.id] ?? 0;
        const shareLength = (category.amount_cents / totalPlannedCents) * CIRCUMFERENCE;
        const isOver = category.amount_cents > 0 && spent > category.amount_cents;
        const withinBudgetLength = category.amount_cents > 0 ? Math.min(spent / category.amount_cents, 1) * shareLength : 0;
        const overageLength = isOver ? ((spent - category.amount_cents) / category.amount_cents) * shareLength : 0;
        const offset = cumulative;
        cumulative += shareLength;

        const gappedShareLength = Math.max(shareLength - SEGMENT_GAP, 0);
        const gappedOffset = offset + SEGMENT_GAP / 2;
        const gappedWithinBudgetLength = Math.min(withinBudgetLength, gappedShareLength);

        return {
            category,
            color,
            offset: gappedOffset,
            shareLength: gappedShareLength,
            filledLength: gappedWithinBudgetLength,
            overageLength,
            isOver,
        };
    });

    const isOverBudget = totalSpentCents > totalPlannedCents;
    const percent = Math.round((totalSpentCents / totalPlannedCents) * 100);

    return (
        <Pressable style={dstyle.card} onPress={() => router.push('/spending')}>
            <Text style={dstyle.cardTitle}>Spending</Text>

            <View style={dstyle.donutRow}>
                <Svg width={SIZE} height={SIZE}>
                    <G transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
                        {segments.map((segment) => (
                            <React.Fragment key={segment.category.id}>
                                {segment.shareLength > 0 && (
                                    <Circle
                                        cx={SIZE / 2}
                                        cy={SIZE / 2}
                                        r={RADIUS}
                                        stroke={segment.color}
                                        strokeOpacity={0.25}
                                        strokeWidth={STROKE}
                                        strokeDasharray={`${segment.shareLength} ${CIRCUMFERENCE - segment.shareLength}`}
                                        strokeDashoffset={-segment.offset}
                                        strokeLinecap="round"
                                        fill="transparent"
                                    />
                                )}
                                {segment.filledLength > 0 && (
                                    <Circle
                                        cx={SIZE / 2}
                                        cy={SIZE / 2}
                                        r={RADIUS}
                                        stroke={segment.color}
                                        strokeWidth={STROKE}
                                        strokeDasharray={`${segment.filledLength} ${CIRCUMFERENCE - segment.filledLength}`}
                                        strokeDashoffset={-segment.offset}
                                        strokeLinecap="round"
                                        fill="transparent"
                                    />
                                )}
                                {segment.overageLength > 0 && (
                                    <Circle
                                        cx={SIZE / 2}
                                        cy={SIZE / 2}
                                        r={RADIUS}
                                        stroke={OVER_BUDGET_COLOR}
                                        strokeWidth={STROKE}
                                        strokeDasharray={`${segment.overageLength} ${CIRCUMFERENCE - segment.overageLength}`}
                                        strokeDashoffset={-(segment.offset + segment.shareLength)}
                                        strokeLinecap="round"
                                        fill="transparent"
                                    />
                                )}
                            </React.Fragment>
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
                {segments.map((segment) => (
                    <View key={segment.category.id} style={dstyle.legendRow}>
                        <View style={[dstyle.legendDot, {backgroundColor: segment.isOver ? OVER_BUDGET_COLOR : segment.color}]} />
                        <Text style={dstyle.legendIcon}>{segment.category.icon}</Text>
                        <Text style={dstyle.legendName} numberOfLines={1}>{segment.category.name}</Text>
                        <Text style={[dstyle.legendAmount, segment.isOver && dstyle.donutPercentOver]}>
                            {formatCentsAsDisplay(spentByCategory[segment.category.id] ?? 0)} / {formatCentsAsDisplay(segment.category.amount_cents)}
                        </Text>
                    </View>
                ))}
            </View>
        </Pressable>
    );
}

export default AllowanceDonutChart;
