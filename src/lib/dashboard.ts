import {toISODate} from "@/lib/date";
import type {Expense} from "@/types/database";

export function sumByCategory(expenses: Expense[]): Record<string, number> {
    const totals: Record<string, number> = {};
    for (const expense of expenses) {
        totals[expense.category_id] = (totals[expense.category_id] ?? 0) + expense.amount_cents;
    }
    return totals;
}

export function sumByDay(expenses: Expense[]): Record<string, number> {
    const totals: Record<string, number> = {};
    for (const expense of expenses) {
        totals[expense.spent_at] = (totals[expense.spent_at] ?? 0) + expense.amount_cents;
    }
    return totals;
}

const MAX_STREAK_LOOKBACK_DAYS = 60;

// Counts consecutive days up to and including today where total spending
// stayed within the prorated daily allowance. A day with no logged
// expenses counts as a win — not logging anything is, correctly, not
// overspending.
export function computeHotstreak(
    dailyTotals: Record<string, number>,
    dailyBudgetCents: number,
    referenceDate: Date = new Date(),
): number {
    if (dailyBudgetCents <= 0) return 0;

    let streak = 0;
    const cursor = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

    for (let i = 0; i < MAX_STREAK_LOOKBACK_DAYS; i++) {
        const spent = dailyTotals[toISODate(cursor)] ?? 0;
        if (spent > dailyBudgetCents) break;
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
}
