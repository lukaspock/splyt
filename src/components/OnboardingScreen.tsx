import React, {useState} from 'react';
import {Pressable, Text, TextInput, View} from "react-native";
import {router} from "expo-router";
import {defaultStyles as style} from "@/constants/defaultStyles";
import {onboardingStyles as ostyle} from "@/constants/onboardingStyles";
import {useOnboarding} from "@/hooks/useOnboarding";
import type {OnboardingGoal} from "@/types/database";

const GOALS: { value: OnboardingGoal; label: string; description: string; icon: string }[] = [
    {value: "housing", label: "Renting & housing", description: "Plan rent and living costs", icon: "🏠"},
    {value: "debt", label: "Paying off debt", description: "Get loans and debt under control", icon: "💳"},
    {value: "saving", label: "Building savings", description: "Set money aside every month", icon: "💰"},
    {value: "overview", label: "Just an overview", description: "See where your money goes", icon: "🔍"},
];

function OnboardingScreen() {

    const [step, setStep] = useState<0 | 1>(0);
    const name = useOnboarding((state) => state.name);
    const goal = useOnboarding((state) => state.goal);
    const setName = useOnboarding((state) => state.setName);
    const setGoal = useOnboarding((state) => state.setGoal);
    const [nameDraft, setNameDraft] = useState(name);

    return (
        <>
            <View style={ostyle.progress}>
                <View style={[ostyle.progressDot, ostyle.progressDotActive]} />
                <View style={[ostyle.progressDot, step === 1 && ostyle.progressDotActive]} />
            </View>

            <View style={style.container}>
            {step === 0 ? (
                <>
                    <Text style={style.title}>What's your name?</Text>
                    <Text style={style.subtitle}>So we know what to call you 👋</Text>

                    <TextInput
                        style={[style.input, ostyle.nameInput]}
                        placeholder="Your Name"
                        placeholderTextColor="#8E8E93"
                        value={nameDraft}
                        onChangeText={setNameDraft}
                        autoFocus
                        onSubmitEditing={goToGoalStep}
                    />

                    <Pressable
                        disabled={!nameDraft.trim()}
                        style={({ pressed }) => [
                            style.button,
                            !nameDraft.trim() && style.buttonDisabled,
                            pressed && !!nameDraft.trim() && style.buttonPressed,
                        ]}
                        onPress={goToGoalStep}
                    >
                        <Text style={style.buttonText}>Continue</Text>
                    </Pressable>

                    <Pressable onPress={() => router.back()}>
                        <Text style={style.linkText}>Already have an account? Log in</Text>
                    </Pressable>
                </>
            ) : (
                <>
                    <Text style={style.title}>What do you want to use SPLYT for?</Text>
                    <Text style={style.subtitle}>We'll tailor your budget to match 🎯</Text>

                    <View style={ostyle.optionList}>
                        {GOALS.map((option) => (
                            <Pressable
                                key={option.value}
                                style={[ostyle.optionCard, goal === option.value && ostyle.optionCardSelected]}
                                onPress={() => setGoal(option.value)}
                            >
                                <Text style={ostyle.optionIcon}>{option.icon}</Text>
                                <View style={ostyle.optionText}>
                                    <Text style={ostyle.optionLabel}>{option.label}</Text>
                                    <Text style={ostyle.optionDescription}>{option.description}</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>

                    <Pressable
                        disabled={!goal}
                        style={({ pressed }) => [
                            style.button,
                            !goal && style.buttonDisabled,
                            pressed && !!goal && style.buttonPressed,
                        ]}
                        onPress={() => router.push('/signup')}
                    >
                        <Text style={style.buttonText}>Continue</Text>
                    </Pressable>

                    <Pressable onPress={() => setStep(0)}>
                        <Text style={style.linkText}>Back</Text>
                    </Pressable>
                </>
            )}
            </View>
        </>
    );

    function goToGoalStep() {
        const trimmed = nameDraft.trim();
        if (!trimmed) return;
        setName(trimmed);
        setStep(1);
    }
}

export default OnboardingScreen;
