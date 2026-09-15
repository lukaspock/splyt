import { StyleSheet } from "react-native";

export const onboardingStyles = StyleSheet.create({
  progress: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D1D9",
  },
  progressDotActive: {
    backgroundColor: "#208AEF",
  },
  nameInput: {
    marginTop: 20,
  },
  optionList: {
    gap: 10,
    marginTop: 20,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F2F2F7",
    borderRadius: 14,
    padding: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionCardSelected: {
    borderColor: "#208AEF",
    backgroundColor: "#E8F3FE",
  },
  optionIcon: {
    fontSize: 24,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  optionDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  categoryList: {
    gap: 4,
    marginTop: 20,
    marginBottom: 24,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D1D1D9",
  },
  categoryIcon: {
    fontSize: 20,
    width: 26,
    textAlign: "center",
  },
  categoryName: {
    flex: 1,
    fontSize: 15,
    color: "#1C1C1E",
  },
});
