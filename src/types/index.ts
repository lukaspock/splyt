export type SplitType = "equal" | "percentage" | "custom";

export interface Group {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string | null;
  display_name: string;
  joined_at: string;
}

export interface Expense {
  id: string;
  group_id: string;
  description: string;
  amount: number;
  paid_by: string;
  created_by: string;
  split_type: SplitType;
  created_at: string;
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  group_member_id: string;
  amount: number;
}
