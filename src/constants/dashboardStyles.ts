import {StyleSheet} from "react-native";

export const dashboardStyles = StyleSheet.create({
    card: {
        backgroundColor: "#F2F2F7",
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    emptyText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        paddingVertical: 12,
    },
    fieldError: {
        color: "#D93025",
        fontSize: 12,
        marginTop: -4,
    },

    // Donut chart
    donutRow: {
        alignSelf: "center",
        width: 200,
        height: 200,
        alignItems: "center",
        justifyContent: "center",
    },
    donutCenter: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    donutPercent: {
        fontSize: 30,
        fontWeight: "800",
        color: "#1C1C1E",
    },
    donutPercentOver: {
        color: "#D93025",
    },
    donutSubtext: {
        fontSize: 12,
        color: "#8E8E93",
        marginTop: 2,
    },
    donutTotals: {
        textAlign: "center",
        fontSize: 14,
        fontWeight: "600",
        color: "#1C1C1E",
    },
    legend: {
        gap: 8,
        marginTop: 4,
    },
    legendRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendIcon: {
        fontSize: 14,
    },
    legendName: {
        flex: 1,
        fontSize: 14,
        color: "#1C1C1E",
    },
    legendAmount: {
        fontSize: 13,
        color: "#666",
    },

    // Hotstreak calendar
    streakHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    streakEmoji: {
        fontSize: 20,
    },
    streakText: {
        fontSize: 16,
        fontWeight: "700",
    },
    weekdayRow: {
        flexDirection: "row",
    },
    weekdayLabel: {
        flex: 1,
        textAlign: "center",
        fontSize: 11,
        color: "#8E8E93",
        fontWeight: "600",
    },
    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    dayCell: {
        width: `${100 / 7}%`,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
    },
    dayGood: {
        backgroundColor: "#D2F2DE",
        borderRadius: 999,
    },
    dayOver: {
        backgroundColor: "#FBD9D6",
        borderRadius: 999,
    },
    dayToday: {
        borderWidth: 2,
        borderColor: "#208AEF",
        borderRadius: 999,
    },
    dayNumber: {
        fontSize: 13,
        color: "#1C1C1E",
    },
    dayNumberOnColor: {
        fontWeight: "700",
    },

    // Add expense form
    chipRow: {
        gap: 8,
        paddingVertical: 2,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#FFFFFF",
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 12,
        maxWidth: 160,
    },
    chipSelected: {
        backgroundColor: "#2C2C2E",
    },
    chipIcon: {
        fontSize: 15,
    },
    chipText: {
        fontSize: 13,
        color: "#1C1C1E",
        fontWeight: "600",
    },
    chipTextSelected: {
        color: "#FFFFFF",
    },
    expenseFormRow: {
        flexDirection: "row",
        gap: 10,
    },
    expenseAmountWrapper: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    amountPrefix: {
        fontSize: 15,
        color: "#8E8E93",
    },
    expenseAmountInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: "#1C1C1E",
        paddingVertical: 10,
        paddingLeft: 4,
    },
    dayToggle: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        overflow: "hidden",
    },
    dayToggleOption: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        justifyContent: "center",
    },
    dayToggleOptionSelected: {
        backgroundColor: "#2C2C2E",
    },
    dayToggleText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#1C1C1E",
    },
    dayToggleTextSelected: {
        color: "#FFFFFF",
    },
    logButton: {
        backgroundColor: "#208AEF",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
    },
    logButtonDisabled: {
        backgroundColor: "#B9DDF9",
    },
    logButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
    recentList: {
        gap: 2,
        marginTop: 4,
    },
    recentRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 8,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#D1D1D9",
    },
    rowIcon: {
        fontSize: 16,
        width: 22,
        textAlign: "center",
    },
    recentName: {
        flex: 1,
        fontSize: 13,
        color: "#1C1C1E",
    },
    recentDate: {
        fontSize: 12,
        color: "#8E8E93",
    },
    recentAmount: {
        fontSize: 13,
        fontWeight: "600",
        color: "#1C1C1E",
    },
});
