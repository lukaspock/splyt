import { StyleSheet } from "react-native";

export const budgetStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
    gap: 24,
  },
  header: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  overviewCard: {
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overviewLabel: {
    fontSize: 14,
    color: "#666",
  },
  overviewValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  overviewValuePositive: {
    color: "#1E8E3E",
  },
  overviewValueNegative: {
    color: "#D93025",
  },
  overviewDivider: {
    height: 1,
    backgroundColor: "#D1D1D9",
    marginVertical: 2,
  },
  overviewTotalLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  overviewTotalValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  sectionTotal: {
    fontSize: 14,
    color: "#666",
  },
  card: {
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D1D1D9",
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowIcon: {
    fontSize: 20,
    width: 26,
    textAlign: "center",
  },
  rowName: {
    flex: 1,
    fontSize: 15,
    color: "#1C1C1E",
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  amountPrefix: {
    fontSize: 15,
    color: "#8E8E93",
  },
  amountInput: {
    minWidth: 56,
    textAlign: "right",
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    paddingVertical: 8,
    paddingLeft: 2,
  },
  deleteButton: {
    padding: 4,
  },
  deleteAction: {
    flex: 1,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  addRowText: {
    fontSize: 15,
    color: "#208AEF",
    fontWeight: "600",
  },
  addCategoryForm: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  addCategoryInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  addCategoryIconInput: {
    width: 44,
    textAlign: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  addCategoryConfirm: {
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addCategoryConfirmText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  signOutButton: {
    alignSelf: "center",
    marginTop: 8,
  },
  signOutText: {
    fontSize: 14,
    color: "#D93025",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  menuButton: {
    padding: 4,
  },
  menuBackdrop: {
    flex: 1,
  },
  menuCard: {
    position: "absolute",
    top: 56,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 6,
    minWidth: 200,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 6,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuRowText: {
    fontSize: 15,
    color: "#1C1C1E",
  },
  modalCloseRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
  },
  appTabBarWrapper: {
    position: "absolute",
    alignSelf: "center",
  },
  appTabBar: {
    flexDirection: "row",
    borderRadius: 32,
    overflow: "hidden",
    padding: 8,
    gap: 8,
  },
  appTabItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  appTabItemActive: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  plannerTabBarInline: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  plannerTabBar: {
    flexDirection: "row",
    borderRadius: 30,
    overflow: "hidden",
    padding: 6,
    gap: 4,
  },
  plannerTabItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  plannerTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  plannerTabTextActive: {
    color: "#208AEF",
  },
  accountRow: {
    paddingHorizontal: 20,
    gap: 4,
    marginBottom: 16,
  },
  accountLabel: {
    fontSize: 13,
    color: "#8E8E93",
  },
  accountValue: {
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "600",
  },
});
