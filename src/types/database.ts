export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      budget_categories: {
        Row: {
          amount_cents: number;
          created_at: string;
          icon: string;
          id: string;
          is_default: boolean;
          name: string;
          sort_order: number;
          type: string;
          user_id: string;
        };
        Insert: {
          amount_cents?: number;
          created_at?: string;
          icon?: string;
          id?: string;
          is_default?: boolean;
          name: string;
          sort_order?: number;
          type: string;
          user_id: string;
        };
        Update: {
          amount_cents?: number;
          created_at?: string;
          icon?: string;
          id?: string;
          is_default?: boolean;
          name?: string;
          sort_order?: number;
          type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      expenses: {
        Row: {
          amount_cents: number;
          category_id: string;
          created_at: string;
          id: string;
          spent_at: string;
          user_id: string;
        };
        Insert: {
          amount_cents: number;
          category_id: string;
          created_at?: string;
          id?: string;
          spent_at?: string;
          user_id: string;
        };
        Update: {
          amount_cents?: number;
          category_id?: string;
          created_at?: string;
          id?: string;
          spent_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "budget_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          goal: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          goal?: string | null;
          id: string;
          name: string;
        };
        Update: {
          created_at?: string;
          goal?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

// Narrower literal unions used throughout the app; the underlying columns
// are plain `text`, so the generated Database type above uses `string`.
export type BudgetCategoryType = "income" | "expense";
export type OnboardingGoal = "housing" | "debt" | "saving" | "overview";

type BudgetCategoryRow = Database["public"]["Tables"]["budget_categories"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type BudgetCategory = Omit<BudgetCategoryRow, "type"> & { type: BudgetCategoryType };
export type Profile = Omit<ProfileRow, "goal"> & { goal: OnboardingGoal | null };
export type Expense = Database["public"]["Tables"]["expenses"]["Row"];
