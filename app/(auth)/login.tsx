import { Link, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react"

import { Image } from "expo-image";
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"
import Toast from "react-native-toast-message";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Text } from "@/components/ui/Text"
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

import { ArrowLeft, Eye, EyeClosed } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient'

import * as yup from "yup"
import { Formik } from "formik";
import { useKeyboardVisibility } from "@/lib/useKeyboard";
import { useAuth } from "@/lib/auth";

const loginSchema = yup.object().shape({
    phone_number: yup.string()
        .trim()
        .matches(
            /^\+255\d{9}$/,
            "Your mobile number should start with +255 followed by 9 other digits."
        )
        .min(13, "Invalid phone number.")
        .max(13, "Invalid phone number.")
        .required("Please enter your mobile number."),
    password: yup.string()
        .trim()
        .min(8, "Password should be at least 8 characters long.")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        )
        .required('Please enter your password')
})

export default function login() {
    const [remember, setRemember] = useState(false)
    const [showPassword, setShowPassword] = useState(true)

    const phoneNumberInputRef = useRef<TextInput>(null)
    const passwordInputRef = useRef<TextInput>(null)

    const { login, isLoading } = useAuth()

    const router = useRouter()

    const keyboard = useKeyboardVisibility()
    const scale = useSharedValue(1)

    const img = {
        uri: require("@/assets/images/illustrations/login.svg")
    }

    const showKeyboard = () => {
        if (keyboard) {
            scale.value = withSpring(0.8)
        } else if (!keyboard) {
            scale.value = withSpring(1)
        }
    }

    useEffect(() => {
        showKeyboard()
    }, [keyboard])

    return (
        <SafeAreaView className="px-[20%] py-2 relative flex-1 w-full justify-center">
            <Button className="bg-primary w-10 h-10 rounded-full p-2 items-center justify-center"
                android_ripple={{
                    color: "#ffffff"
                }}
                onPress={() => router.back()}
            >
                <ArrowLeft size={24} color="#fff" className="self-center" />
            </Button>
            <KeyboardAwareScrollView
                enableOnAndroid={false}
                enableAutomaticScroll={true}
                extraScrollHeight={200} // Adjust this value as needed
                showsVerticalScrollIndicator={false}
                keyboardOpeningTime={0}
                keyboardShouldPersistTaps="handled"
                contentContainerClassName="w-full relative flex-1 w-full justify-center mb-20"
            >
                <View
                    className={keyboard ? "mt-[10%]" : "mt-[12.5%]"}

                >
                    <Animated.View
                        style={{
                            transform: [{
                                scale: scale
                            }]
                        }}
                    >
                        <Image
                            source={img.uri}
                            style={styles.img}
                            contentFit="cover"
                        />
                    </Animated.View>

                    <View className={keyboard ? "mt-4" : "mt-16"}>
                        <Text className="text-4xl font-bold text-center text-primary" style={{ color: "#2B4B80" }}>Login</Text>
                        <View className="py-4" />
                        <Formik
                            validationSchema={loginSchema}
                            initialValues={{
                                phone_number: "",
                                password: ""
                            }}
                            onSubmit={(values) => {
                                login(values.phone_number, values.password)
                            }}
                        >
                            {({ handleChange, handleSubmit, errors, isValid, values }) => (
                                <>
                                    <View className="flex flex-col gap-2">
                                        <View className="gap-2">
                                            <Text className={errors.phone_number ? "text-destructive" : ""}>
                                                {errors.phone_number ? errors.phone_number : "Mobile Number"}
                                            </Text>
                                            <Input
                                                placeholder="Enter your mobile number"
                                                onChangeText={handleChange('phone_number')}
                                                ref={phoneNumberInputRef}
                                                value={values.phone_number}
                                                returnKeyType="next"
                                                inputMode="tel"
                                                onSubmitEditing={() => passwordInputRef?.current?.focus()}
                                                className={
                                                    errors.phone_number ?
                                                        "bg-destructive/10 border-destructive border-2 text-destructive p-3"
                                                        : "text-black border-0"
                                                }
                                                placeholderClassName={errors.phone_number ? "text-destructive" : ""}
                                            />
                                        </View>
                                        <View className="py-0.5" />
                                        <View className="gap-2 relative">
                                            <Text className={errors.password ? "text-destructive" : "text-black"}>
                                                {errors.password ? errors.password : "Password"}
                                            </Text>
                                            <View className="relative">
                                                <Input
                                                    ref={passwordInputRef}
                                                    placeholder="Enter your password"
                                                    onChangeText={handleChange('password')}
                                                    value={values.password}
                                                    secureTextEntry={showPassword}
                                                    className={errors.password ? "bg-destructive/10 border-destructive border-2 text-destructive p-3" : "text-black border-0"}
                                                />
                                                <TouchableOpacity
                                                    className="absolute right-[1.5%] top-[22.5%]"
                                                    onPress={() => setShowPassword(!showPassword)}
                                                >
                                                    {
                                                        showPassword ? <Eye color="#3a4a5a" /> : <EyeClosed color="#3a4a5a" />
                                                    }

                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View className="py-0.5" />
                                        <View style={styles.options}>
                                            <View
                                                style={styles.rememberCheckbox}
                                                className="gap-2"
                                            >
                                                <Checkbox
                                                    checked={remember}
                                                    onCheckedChange={() => setRemember(!remember)}
                                                />
                                                <Text>Remember me</Text>
                                            </View>

                                            {/* <Link href="/forgot-password" className="text-primary">Forgot Password?</Link> */}

                                        </View>
                                        <View className="py-0.5" />
                                        <Button
                                            onPress={handleSubmit}
                                            disabled={isLoading || !isValid}
                                            className={`${(isLoading || !isValid) ? "opacity-75" : ""}`}
                                        >
                                            {isLoading ? "Loading..." : "Login"}
                                            {isLoading && <ActivityIndicator size="small" color="#ffffff" style={{ marginTop: 20, paddingHorizontal: 8 }} />}
                                        </Button>
                                        <View className="py-0.5" />
                                        <Text className="mx-auto text-center self-center items-center">
                                            Don't have an account? <Link href="/register" className="text-primary">Register</Link>
                                        </Text>
                                    </View>
                                </>
                            )}
                        </Formik>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    img: {
        width: 213 * 1.25,
        height: 131 * 1.25,
        justifyContent: "center",
        alignSelf: "center",
    },
    options: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "99%"
    },
    rememberCheckbox: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row"
    }
})