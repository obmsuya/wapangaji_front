import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react"

import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Text } from "@/components/ui/Text"
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

import { ArrowLeft } from 'lucide-react-native';

import * as yup from "yup"
import { Formik } from "formik";
import { useKeyboardVisibility } from "@/lib/useKeyboard";

const loginSchema = yup.object().shape({
    phoneNumber: yup.string()
        .trim()
        .matches(
            /^(07|06)\d{8}$/,
            "Your mobile number should start with 07 or 06 followed by 8 other digits."
        )
        .min(10, "Mobile number should contain 10 digits.")
        .max(10, "Mobile number should contain 10 digits.")
        .required("Please enter your mobile number."),
    password: yup.string()
        .trim()
        .min(4, "Password should be at least 4 characters long.")
        .required('Please enter your password')
})

export default function login() {
    const [remember, setRemember] = useState(false)
    const router = useRouter()

    const keyboard = useKeyboardVisibility()
    const scale = useSharedValue(1)

    const img = {
        uri: require("@/assets/images/illustrations/login.svg")
    }

    useEffect(() => {
        if (keyboard) {
            scale.value = withSpring(0.8)
        } else if (!keyboard) {
            scale.value = withSpring(1)
        }
    }, [keyboard])

    return (
        <SafeAreaView className="px-4 py-2 relative">
            <KeyboardAwareScrollView
                enableOnAndroid={false}
                enableAutomaticScroll={true}
                extraScrollHeight={200} // Adjust this value as needed
                showsVerticalScrollIndicator={false}
                keyboardOpeningTime={0}
                keyboardShouldPersistTaps="handled"
            >
                <Button className="bg-primary w-12 h-12 rounded-full p-2 items-center justify-center"
                    android_ripple={{
                        color: "#ffffff"
                    }}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color="#fff" className="self-items" />
                </Button>

                <View
                    className={keyboard ? "mt-0" : "mt-20"}

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

                    <View className={keyboard ? "mt-4" : "mt-20"}>
                        <Text className="text-4xl font-bold text-center text-primary" style={{ color: "#2B4B80" }}>Login</Text>
                        <View className="py-4" />
                        <Formik
                            validationSchema={loginSchema}
                            initialValues={{
                                phoneNumber: "",
                                password: ""
                            }}
                            onSubmit={(values) => {
                                console.log(
                                    values.phoneNumber,
                                    values.password
                                );
                            }}
                        >
                            {({ handleChange, handleSubmit, setFieldValue, errors, isValid, values }) => (
                                <>
                                    <View className="flex flex-col gap-2">
                                        <View className="gap-2">
                                            <Text className={errors.phoneNumber ? "text-destructive" : ""}>
                                                {errors.phoneNumber ? errors.phoneNumber : "Mobile Number"}
                                            </Text>
                                            <Input
                                                placeholder="Enter your mobile number"
                                                onChangeText={handleChange('phoneNumber')}
                                                value={values.phoneNumber}
                                                className={
                                                    errors.phoneNumber ?
                                                        "bg-destructive/10 border-destructive border-2 text-destructive p-3"
                                                        : ""
                                                }
                                                placeholderClassName={errors.phoneNumber ? "text-destructive" : ""}
                                            />
                                        </View>
                                        <View className="py-0.5" />
                                        <View className="gap-2">
                                            <Text className={errors.password ? "text-destructive" : ""}>
                                                {errors.password ? errors.password : "Password"}
                                            </Text>
                                            <Input
                                                placeholder="Enter your password"
                                                onChangeText={handleChange('password')}
                                                value={values.password}
                                                className={
                                                    errors.password ?
                                                        "bg-destructive/10 border-destructive border-2 text-destructive p-3"
                                                        : ""
                                                }
                                            />
                                        </View>
                                        <View className="py-0.5" />
                                        <View
                                            style={styles.options}
                                        >
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

                                            <Link href="/" className="text-primary">Forgot Password?</Link>

                                        </View>
                                        <View className="py-0.5" />
                                        <Button
                                            onPress={handleSubmit}
                                            disabled={!isValid}
                                            className={!isValid ? "opacity-75" : ""}
                                        >
                                            Create Account
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
        width: 213,
        height: 131,
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