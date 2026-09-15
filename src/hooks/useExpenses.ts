import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {supabase} from "@/lib/supabase";
import {useSession} from "@/hooks/useSession";
import {getMonthRange, toISODate} from "@/lib/date";
import type {Expense} from "@/types/database";

const expensesKey = (userId: string | undefined, monthKey: string) => ["expenses", userId, monthKey];

export function useExpensesForMonth(referenceDate: Date = new Date()) {
    const userId = useSession((state) => state.session?.user.id);
    const {start, end} = getMonthRange(referenceDate);
    const monthKey = toISODate(start).slice(0, 7);
    const startIso = toISODate(start);
    const endIso = toISODate(end);

    return useQuery({
        queryKey: expensesKey(userId, monthKey),
        enabled: !!userId,
        queryFn: async () => {
            const {data, error} = await supabase
                .from("expenses")
                .select("*")
                .gte("spent_at", startIso)
                .lte("spent_at", endIso)
                .order("spent_at", {ascending: false})
                .order("created_at", {ascending: false});
            if (error) throw error;
            return data as Expense[];
        },
    });
}

export function useAddExpense() {
    const queryClient = useQueryClient();
    const userId = useSession((state) => state.session?.user.id);

    return useMutation({
        mutationFn: async ({categoryId, amountCents, spentAt}: {categoryId: string; amountCents: number; spentAt: string}) => {
            if (!userId) throw new Error("Not signed in");
            const {data, error} = await supabase
                .from("expenses")
                .insert({user_id: userId, category_id: categoryId, amount_cents: amountCents, spent_at: spentAt})
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["expenses", userId]}),
    });
}

export function useDeleteExpense() {
    const queryClient = useQueryClient();
    const userId = useSession((state) => state.session?.user.id);

    return useMutation({
        mutationFn: async (id: string) => {
            const {error} = await supabase.from("expenses").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["expenses", userId]}),
    });
}
