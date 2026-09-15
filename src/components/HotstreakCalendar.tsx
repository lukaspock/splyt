import React from 'react';
import {Text, View} from "react-native";
import {dashboardStyles as dstyle} from "@/constants/dashboardStyles";
import {getMonthRange, toISODate} from "@/lib/date";

type Props = {
    dailyTotals: Record<string, number>;
    dailyBudgetCents: number;
    streak: number;
};

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function HotstreakCalendar({dailyTotals, dailyBudgetCents, streak}: Props) {

    const today = new Date();
    const {start, daysInMonth} = getMonthRange(today);
    const todayIso = toISODate(today);
    const hasBudget = dailyBudgetCents > 0;

    // JS getDay() is 0=Sunday..6=Saturday; shift so the grid starts on Monday.
    const firstWeekdayOffset = (start.getDay() + 6) % 7;
    const cells: ({day: number; iso: string} | null)[] = [
        ...Array.from({length: firstWeekdayOffset}, () => null),
        ...Array.from({length: daysInMonth}, (_, i) => {
            const date = new Date(start.getFullYear(), start.getMonth(), i + 1);
            return {day: i + 1, iso: toISODate(date)};
        }),
    ];

    return (
        <View style={dstyle.card}>
            <View style={dstyle.streakHeader}>
                <Text style={dstyle.streakEmoji}>🔥</Text>
                <Text style={dstyle.streakText}>{streak} day{streak === 1 ? "" : "s"} on track</Text>
            </View>

            <View style={dstyle.weekdayRow}>
                {WEEKDAY_LABELS.map((label, index) => (
                    <Text key={index} style={dstyle.weekdayLabel}>{label}</Text>
                ))}
            </View>

            <View style={dstyle.calendarGrid}>
                {cells.map((cell, index) => {
                    if (!cell) return <View key={index} style={dstyle.dayCell} />;

                    const isFuture = cell.iso > todayIso;
                    const isToday = cell.iso === todayIso;
                    const spent = dailyTotals[cell.iso] ?? 0;
                    const isGood = hasBudget && spent <= dailyBudgetCents;
                    const isPastOrToday = !isFuture;

                    return (
                        <View
                            key={index}
                            style={[
                                dstyle.dayCell,
                                isPastOrToday && hasBudget && (isGood ? dstyle.dayGood : dstyle.dayOver),
                                isToday && dstyle.dayToday,
                            ]}
                        >
                            <Text style={[dstyle.dayNumber, isPastOrToday && hasBudget && dstyle.dayNumberOnColor]}>
                                {cell.day}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

export default HotstreakCalendar;
