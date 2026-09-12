import React, {useEffect, useState} from 'react';
import  {defaultStyles as style } from "@/constants/defaultStyles";
import {ActivityIndicator, Pressable, Text, TextInput, View} from "react-native";
import {Eye, EyeOff} from "lucide-react-native";
import {trpc} from "@/lib/trpc";
import {useMutation} from "@tanstack/react-query";
import {useSession} from "@/hooks/useSession";
import {router} from "expo-router";
import {Controller, useForm} from "react-hook-form";
import { Alert } from "react-native";



function LoginScreen() {

    const loginMutation = useMutation(trpc.auth.login.mutationOptions());
    const signIn = useSession((state) => state.signIn);

    const { control, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: { email: "" , password: ""},
        mode: "onChange",
    });

    const [hidePassword, setHidePassword] = useState(true);


    return (
        <>
            <View style={style.container}>
                <Text style={style.title}>Welcome To SPLYT</Text>
                <Text style={style.subtitle}>The new way to split finances! 💸</Text>
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
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                />

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
                    render={({ field: { onChange, value } }) => (
                        <View style={style.inputWrapper}>
                            <TextInput
                                style={[style.input, style.inputWithIcon]}
                                placeholder="My Password"
                                placeholderTextColor="#8E8E93"
                                autoCapitalize="none"
                                secureTextEntry={hidePassword}
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

            </View>

            <View style={style.container}>
                <Pressable
                    disabled={!isValid || loginMutation.isPending}
                    style={({ pressed }) => [
                        style.button,
                        !isValid && style.buttonDisabled,
                        pressed && isValid && style.buttonPressed,
                    ]}
                    onPress={handleSubmit(proceedToLogin)}
                >
                    {loginMutation.isPending ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={style.buttonText}>Login</Text>
                    )}
                </Pressable>
            </View>
        </>
    );

    function proceedToLogin(data: {email: string, password: string}){

        loginMutation.mutate(data, {
            onSuccess: async ({ token }) => {
                await signIn(token);
                router.navigate('/home');
            },
            onError: (error) => {
                Alert.alert("Login failed", error.message);
            },
        });
    }
}

export default LoginScreen;