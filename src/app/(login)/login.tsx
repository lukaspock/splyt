import React from 'react';
import {Pressable, Text, TextInput, View} from "react-native";
import {defaultStyles as style} from "@/constants/defaultStyles";
import {router} from "expo-router";
import {Controller, useForm} from "react-hook-form";
import { Alert } from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Eye, EyeOff} from "lucide-react-native";

Login.propTypes = {

};

function proceedToLogin(){
    // FUTURE API CALL

    router.navigate('/home');
}

function Login() {

    const { control, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: { email: "" , password: ""},
        mode: "onChange",
    });

    const [hidePassword, setHidePassword] = React.useState(true);

    return (
        <SafeAreaView style={ style.container}>
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
                    disabled={!isValid}
                    style={({ pressed }) => [
                        style.button,
                        !isValid && style.buttonDisabled,
                        pressed && isValid && style.buttonPressed,
                    ]}
                    onPress={handleSubmit(proceedToLogin)}
                >
                    <Text style={style.buttonText}>Login</Text>
                </Pressable>
            </View>



        </SafeAreaView>
    );
}

export default Login;
