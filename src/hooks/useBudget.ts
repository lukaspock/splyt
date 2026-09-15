import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {supabase} from "@/lib/supabase";
import {useSession} from "@/hooks/useSession";
import type {BudgetCategory, BudgetCategoryType} from "@/types/database";

const budgetCategoriesKey = (userId: string | undefined) => ["budget_categories", userId];

export function useBudgetCategories() {
    const userId = useSession((state) => state.session?.user.id);

    return useQuery({
        queryKey: budgetCategoriesKey(userId),
        enabled: !!userId,
        queryFn: async () => {
            const {data, error} = await supabase
                .from("budget_categories")
                .select("*")
                .order("sort_order", {ascending: true})
                .order("created_at", {ascending: true});
            if (error) throw error;
            return data as BudgetCategory[];
        },
    });
}

export function useAddBudgetCategory() {
    const queryClient = useQueryClient();
    const userId = useSession((state) => state.session?.user.id);

    return useMutation({
        mutationFn: async ({name, type, icon}: { name: string; type: BudgetCategoryType; icon?: string }) => {
            if (!userId) throw new Error("Not signed in");
            const {data, error} = await supabase
                .from("budget_categories")
                .insert({user_id: userId, name, type, ...(icon ? {icon} : {})})
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: budgetCategoriesKey(userId)}),
    });
}

export function useUpdateBudgetAmount() {
    const queryClient = useQueryClient();
    const userId = useSession((state) => state.session?.user.id);

    return useMutation({
        mutationFn: async ({id, amountCents}: { id: string; amountCents: number }) => {
            const {error} = await supabase
                .from("budget_categories")
                .update({amount_cents: amountCents})
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: budgetCategoriesKey(userId)}),
    });
}

export function useDeleteBudgetCategory() {
    const queryClient = useQueryClient();
    const userId = useSession((state) => state.session?.user.id);

    return useMutation({
        mutationFn: async (id: string) => {
            const {error} = await supabase.from("budget_categories").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: budgetCategoriesKey(userId)}),
    });
}
