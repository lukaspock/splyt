import React from 'react';
import {Modal, Pressable, Text, View} from "react-native";
import {LogOut, Settings} from "lucide-react-native";
import {budgetStyles as bstyle} from "@/constants/budgetStyles";

type Props = {
    visible: boolean;
    onClose: () => void;
    onSignOut: () => void;
    onAccountSettings: () => void;
};

function DashboardMenu({visible, onClose, onSignOut, onAccountSettings}: Props) {
    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable style={bstyle.menuBackdrop} onPress={onClose}>
                <View style={bstyle.menuCard}>
                    <Pressable style={bstyle.menuRow} onPress={onAccountSettings}>
                        <Settings size={18} color="#1C1C1E" />
                        <Text style={bstyle.menuRowText}>Account settings</Text>
                    </Pressable>
                    <Pressable style={bstyle.menuRow} onPress={onSignOut}>
                        <LogOut size={18} color="#D93025" />
                        <Text style={[bstyle.menuRowText, bstyle.signOutText]}>Sign out</Text>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    );
}

export default DashboardMenu;
