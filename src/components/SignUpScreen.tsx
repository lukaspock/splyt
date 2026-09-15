import React, {useEffect, useRef, useState} from 'react';
import {defaultStyles as style} from "@/constants/defaultStyles";
import {ActivityIndicator, Alert, Pressable, Text, TextInput, View} from "react-native";
import {Eye, EyeOff, MailCheck} from "lucide-react-native";
import {useMutation} from "@tanstack/react-query";
import {useSession} from "@/hooks/useSession";
import {useOnboarding} from "@/hooks/useOnboarding";
import {router} from "expo-router";
import {Controller, useForm} from "react-hook-form";
import {friendlyAuthError} from "@/lib/authErrors";

function SignUpScreen() {

    const signUp = useSession((state) => state.signUp);
    const name = useOnboarding((state) => state.name);
    const goal = useOnboarding((state) => state.goal);
    const resetOnboarding = useOnboarding((state) => state.reset);

    useEffect(() => {
        if (!name) router.replace('/onboarding');
    }, [name]);

    const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState<string | null>(null);

    const signUpMutation = useMutation({
        mutationFn: ({email, password}: {email: string, password: string}) =>
            signUp(name, email, password, goal),
    });

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { email: "", password: "" },
        mode: "onChange",
    });

    const [hidePassword, setHidePassword] = useState(true);
    const passwordInputRef = useRef<TextInput>(null);

    if (pendingConfirmationEmail) {
        return (
            <View style={style.container}>
                <MailCheck size={48} color="#208AEF" />
                <Text style={style.title}>Check your inbox</Text>
                <Text style={style.subtitle}>
                    We sent a confirmation link to{"\n"}
                    <Text style={{fontWeight: "600"}}>{pendingConfirmationEmail}</Text>.
                    {"\n"}Tap it, then come back and log in.
                </Text>

                <Pressable
                    style={style.button}
                    onPress={() => { resetOnboarding(); router.replace('/login'); }}
                >
                    <Text style={style.buttonText}>Back to login</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <>
            <View style={style.container}>
                <Text style={style.title}>Hi {name} 👋</Text>
                <Text style={style.subtitle}>Last step — set your login</Text>
            </View>

            <View>
                <Text style={style.label}>Email</Text>
                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: "Enter an email",
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Enter a valid email",
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={style.input}
                            placeholder="My Email"
                            placeholderTextColor="#8E8E93"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType="next"
                            submitBehavior="submit"
                            onSubmitEditing={() => passwordInputRef.current?.focus()}
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />
                {errors.email && <Text style={style.errorText}>{errors.email.message}</Text>}

                <Text style={style.label}>Password</Text>
                <Controller
                    control={control}
                    name="password"
                    rules={{
                        required: "Enter a password",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                        },
                    }}
                    render={({ field: { onChange, value, ref } }) => (
                        <View style={style.inputWrapper}>
                            <TextInput
                                ref={(el) => { ref(el); passwordInputRef.current = el; }}
                                style={[style.input, style.inputWithIcon]}
                                placeholder="My Password"
                                placeholderTextColor="#8E8E93"
                                autoCapitalize="none"
                                secureTextEntry={hidePassword}
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit(proceedToSignUp)}
                                value={value}
                                onChangeText={onChange}
                            />
                            <Pressable
                                style={style.inputIconButton}
                                onPress={() => setHidePassword((prev) => !prev)}
                                hitSlop={8}
                            >
                                {hidePassword ? (
                                    <EyeOff size={20} color="#8E8E93" />
                                ) : (
                                    <Eye size={20} color="#8E8E93" />
                                )}
                            </Pressable>
                        </View>
                    )}
                />
                {errors.password && <Text style={style.errorText}>{errors.password.message}</Text>}
            </View>

            <View style={style.container}>
                <Pressable
                    disabled={signUpMutation.isPending}
                    style={({ pressed }) => [
                        style.button,
                        signUpMutation.isPending && style.buttonDisabled,
                        pressed && !signUpMutation.isPending && style.buttonPressed,
                    ]}
                    onPress={handleSubmit(proceedToSignUp)}
                >
                    {signUpMutation.isPending ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={style.buttonText}>Sign Up</Text>
                    )}
                </Pressable>
            </View>

            <Pressable onPress={() => { resetOnboarding(); router.replace('/login'); }}>
                <Text style={style.linkText}>Already have an account? Log in</Text>
            </Pressable>
        </>
    );

    function proceedToSignUp(data: {email: string, password: string}){
        signUpMutation.mutate(data, {
            onSuccess: (session) => {
                if (session) {
                    resetOnboarding();
                    router.replace('/home');
                } else {
                    setPendingConfirmationEmail(data.email);
                }
            },
            onError: (error) => {
                Alert.alert("Sign up failed", friendlyAuthError(error.message));
            },
        });
    }
}

export default SignUpScreen;
