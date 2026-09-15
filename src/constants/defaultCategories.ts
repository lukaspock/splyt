export type DefaultCategoryDef = { name: string; icon: string; type: "income" | "expense" };

// Keep in sync with handle_new_user() in
// supabase/migrations/20260915190934_seed_selected_categories.sql — this
// mirrors the seed list so onboarding can preview it before signup.
export const DEFAULT_CATEGORIES: DefaultCategoryDef[] = [
  { name: "Gehalt", icon: "💼", type: "income" },
  { name: "Miete & Wohnen", icon: "🏠", type: "expense" },
  { name: "Lebensmittel", icon: "🛒", type: "expense" },
  { name: "Transport", icon: "🚗", type: "expense" },
  { name: "Freizeit & Hobbys", icon: "🎉", type: "expense" },
  { name: "Abos", icon: "📱", type: "expense" },
  { name: "Versicherungen", icon: "🛡️", type: "expense" },
  { name: "Sparen", icon: "💰", type: "expense" },
  { name: "Sonstiges", icon: "📦", type: "expense" },
];

export const GOAL_BONUS_CATEGORY: DefaultCategoryDef = { name: "Schulden abbauen", icon: "💳", type: "expense" };
