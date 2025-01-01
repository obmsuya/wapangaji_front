import React, { useEffect, useState } from "react"

import { Image } from "expo-image";
import { View } from "react-native";
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from "react-native-safe-area-context"
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Text } from "@/components/ui/Text"
import { Input } from "@/components/ui/Input";
import { Link, useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

import * as yup from "yup"
import { Formik } from "formik";
import { useKeyboardVisibility } from "@/lib/useKeyboard";

const registerSchema = yup.object().shape({
    name: yup.string().required("Please enter your full name"),
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

export default function register() {
    const router = useRouter()

    const keyboard = useKeyboardVisibility()
    const scale = useSharedValue(1)

    const img = {
        uri: require("@/assets/images/illustrations/register-user.svg")
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
            >

                <Button className="bg-primary w-12 h-12 rounded-full p-2 items-center justify-center"
                    android_ripple={{
                        color: "#ffffff"
                    }}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color="#fff" className="self-items" />
                </Button>

                <View className={keyboard ? "mt-0" : "mt-16"}>
                    <Animated.View
                        style={{
                            transform: [{
                                scale: scale
                            }]
                        }}
                    >
                        <Image
                            source={img.uri}
                            style={{
                                width: 92,
                                height: 164,
                                justifyContent: "center",
                                alignSelf: "center"
                            }}
                            contentFit="cover"
                        />
                    </Animated.View>

                    <View className={keyboard ? "mt-4" : "mt-12"}>
                        <Text className="text-4xl font-bold text-center text-primary" style={{ color: "#2B4B80" }}>
                            Create Account
                        </Text>
                        <View className="py-4" />

                        <Formik
                            validationSchema={registerSchema}
                            initialValues={{
                                name: "",
                                phoneNumber: "",
                                password: ""
                            }}
                            onSubmit={values => {
                                console.log(
                                    values.name,
                                    values.phoneNumber,
                                    values.password
                                );
                            }}
                        >
                            {({ handleChange, handleSubmit, errors, isValid, values }) => (
                                <>
                                    <View className="flex flex-col gap-2">
                                        <View className="gap-2">
                                            <Text className={errors.name ? "text-destructive" : ""}>
                                                {errors.name ? errors.name : "Your full name"}
                                            </Text>
                                            <Input
                                                placeholder="Enter your mobile number"
                                                onChangeText={handleChange('name')}
                                                value={values.name}
                                                className={
                                                    errors.name ?
                                                        "bg-destructive/10 border-destructive border-2 text-destructive p-3"
                                                        : ""
                                                }
                                                placeholderClassName={errors.name ? "text-destructive" : ""}
                                            />
                                        </View>
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
                                                        "bg-destructive/10 border-destructive border-2 text-destructive p-3" : ""
                                                }
                                            />
                                        </View>
                                        <View className="py-0.5" />
                                        <Button
                                            onPress={handleSubmit}
                                            disabled={!isValid}
                                            className={!isValid ? "opacity-75" : ""}
                                        >
                                            Login
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


