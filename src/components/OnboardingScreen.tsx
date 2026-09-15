import React, {useEffect, useMemo, useState} from 'react';
import {Pressable, ScrollView, Switch, Text, TextInput, View} from "react-native";
import {router} from "expo-router";
import {defaultStyles as style} from "@/constants/defaultStyles";
import {onboardingStyles as ostyle} from "@/constants/onboardingStyles";
import {useOnboarding} from "@/hooks/useOnboarding";
import {DEFAULT_CATEGORIES, GOAL_BONUS_CATEGORY} from "@/constants/defaultCategories";
import type {OnboardingGoal} from "@/types/database";

const GOALS: { value: OnboardingGoal; label: string; description: string; icon: string }[] = [
    {value: "housing", label: "Renting & housing", description: "Plan rent and living costs", icon: "🏠"},
    {value: "debt", label: "Paying off debt", description: "Get loans and debt under control", icon: "💳"},
    {value: "saving", label: "Building savings", description: "Set money aside every month", icon: "💰"},
    {value: "overview", label: "Just an overview", description: "See where your money goes", icon: "🔍"},
];

function OnboardingScreen() {

    const [step, setStep] = useState<0 | 1 | 2>(0);
    const name = useOnboarding((state) => state.name);
    const goal = useOnboarding((state) => state.goal);
    const selectedCategories = useOnboarding((state) => state.selectedCategories);
    const setName = useOnboarding((state) => state.setName);
    const setGoal = useOnboarding((state) => state.setGoal);
    const setSelectedCategories = useOnboarding((state) => state.setSelectedCategories);
    const toggleCategory = useOnboarding((state) => state.toggleCategory);
    const [nameDraft, setNameDraft] = useState(name);

    const categories = useMemo(
        () => (goal === "debt" ? [...DEFAULT_CATEGORIES, GOAL_BONUS_CATEGORY] : DEFAULT_CATEGORIES),
        [goal],
    );

    useEffect(() => {
        if (step === 2 && selectedCategories.length === 0) {
            setSelectedCategories(categories.map((category) => category.name));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, categories]);

    return (
        <>
            <View style={ostyle.progress}>
                <View style={[ostyle.progressDot, ostyle.progressDotActive]} />
                <View style={[ostyle.progressDot, step >= 1 && ostyle.progressDotActive]} />
                <View style={[ostyle.progressDot, step === 2 && ostyle.progressDotActive]} />
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
            ) : step === 1 ? (
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
                        onPress={() => setStep(2)}
                    >
                        <Text style={style.buttonText}>Continue</Text>
                    </Pressable>

                    <Pressable onPress={() => setStep(0)}>
                        <Text style={style.linkText}>Back</Text>
                    </Pressable>
                </>
            ) : (
                <>
                    <Text style={style.title}>What do you want to track?</Text>
                    <Text style={style.subtitle}>Turn off anything you don't need — you can always add more later ✅</Text>

                    <ScrollView style={ostyle.categoryList} showsVerticalScrollIndicator={false}>
                        {categories.map((category) => (
                            <View key={category.name} style={ostyle.categoryRow}>
                                <Text style={ostyle.categoryIcon}>{category.icon}</Text>
                                <Text style={ostyle.categoryName}>{category.name}</Text>
                                <Switch
                                    value={selectedCategories.includes(category.name)}
                                    onValueChange={() => toggleCategory(category.name)}
                                />
                            </View>
                        ))}
                    </ScrollView>

                    <Pressable
                        disabled={selectedCategories.length === 0}
                        style={({ pressed }) => [
                            style.button,
                            selectedCategories.length === 0 && style.buttonDisabled,
                            pressed && selectedCategories.length > 0 && style.buttonPressed,
                        ]}
                        onPress={() => router.push('/signup')}
                    >
                        <Text style={style.buttonText}>Continue</Text>
                    </Pressable>

                    <Pressable onPress={() => setStep(1)}>
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
