
import { StyleSheet } from "react-native";

export const defaultStyles = StyleSheet.create({
    container: {
        paddingTop: 5,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    text: {
        fontSize: 16,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#2C2C2E",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignSelf: "stretch",
    },
    buttonPressed: {
        backgroundColor: "#3A3A3C",
    },
    buttonDisabled: {
        backgroundColor: "#D1D1D9",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#666",
        marginBottom: 6,
        marginLeft: 2,
    },
    input: {
        backgroundColor: "#F2F2F7",
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        fontSize: 16,
        color: "#1C1C1E",
    },
    inputWrapper: {
        justifyContent: "center",
    },
    inputWithIcon: {
        paddingRight: 44,
    },
    inputIconButton: {
        position: "absolute",
        right: 14,
        top: 0,
        bottom: 12,
        justifyContent: "center",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 4,
    },
});