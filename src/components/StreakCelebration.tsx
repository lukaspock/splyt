import React, {useEffect} from 'react';
import {Modal, Pressable, Text, View} from "react-native";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {dashboardStyles as dstyle} from "@/constants/dashboardStyles";

type Props = {
    streak: number;
    onDismiss: () => void;
};

function StreakCelebration({streak, onDismiss}: Props) {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(1, {damping: 8, stiffness: 120});
        opacity.value = withSpring(1);
    }, []);

    const flameStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{scale: scale.value}],
    }));

    const subtitle = streak <= 1 ? "First day! Keep going 🔥" : "+1 day! Keep the streak alive.";

    return (
        <Modal transparent visible animationType="fade" onRequestClose={onDismiss}>
            <View style={dstyle.celebrationBackdrop}>
                <View style={dstyle.celebrationCard}>
                    <Animated.Text style={[dstyle.celebrationFlame, flameStyle]}>🔥</Animated.Text>
                    <Text style={dstyle.celebrationStreakText}>
                        {streak} day{streak === 1 ? "" : "s"} on track
                    </Text>
                    <Text style={dstyle.celebrationSubtext}>{subtitle}</Text>

                    <Pressable style={dstyle.celebrationDoneButton} onPress={onDismiss}>
                        <Text style={dstyle.celebrationDoneText}>Done</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

export default StreakCelebration;
