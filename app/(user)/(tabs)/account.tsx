import React, { useEffect, useRef, useState } from "react"

import { Image } from "expo-image";
import { TextInput, TouchableOpacity, View } from "react-native";
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
import { useAuth, type User } from "@/lib/auth";
import api from "@/lib/api"

import { ActivityIndicator } from "react-native";

const accountSchema = yup.object().shape({
    full_name: yup.string().required("Please enter your full name"),
    phone_number: yup.string()
        .trim()
        .matches(
            /^\+255\d{9}$/,
            "Your mobile number should start with +255 followed by 9 other digits."
        )
        .min(13, "Invalid phone number.")
        .max(13, "Invalid phone number.")
        .required("Please enter your mobile number."),
})

export default function register() {
    const router = useRouter()
    const { isLoading, logout, user, access } = useAuth()

    const phoneNumberInputRef = useRef<TextInput>(null)
    const passwordInputRef = useRef<TextInput>(null)

    const keyboard = useKeyboardVisibility()
    const scale = useSharedValue(1)

    const img = {
        uri: require("@/assets/images/illustrations/account.svg")
    }

    useEffect(() => {
        if (keyboard) {
            scale.value = withSpring(0.8)
        } else if (!keyboard) {
            scale.value = withSpring(1)
        }

        console.log(access)

    }, [keyboard])

    return (
        <SafeAreaView className="px-[20%] py-2 relative bg-white flex-1 justify-center items-center">
            <KeyboardAwareScrollView
                enableOnAndroid={false}
                enableAutomaticScroll={true}
                extraScrollHeight={200} // Adjust this value as needed
                showsVerticalScrollIndicator={false}
                keyboardOpeningTime={0}
                keyboardShouldPersistTaps="handled"
                contentContainerClassName="justify-center items-center flex-1"
            >

                <View className={keyboard ? "mt-0" : "mt-[12.5%]"}>
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
                                width: 179,
                                height: 179,
                                justifyContent: "center",
                                alignSelf: "center"
                            }}
                            contentFit="cover"
                        />
                    </Animated.View>

                    <View className="w-full">
                        <View className="gap-2 mt-4">
                            <Text className="text-center text-3xl">{user?.full_name}</Text>
                            <Text className="text-center text-xl">{user?.phone_number}</Text>
                        </View>

                        <View className="mt-8 gap-2">
                            <Button
                                variant="outline"
                                onPress={() => router.navigate("(user)/(account)/reset-password")}
                            >
                                Reset Password
                            </Button>
                            <Button
                                className={`${isLoading ? "opacity-75" : ""} border-destructive`}
                                variant="outline"
                                textClassName="text-destructive"
                                onPress={logout}
                            >
                                Logout
                            </Button>
                        </View>
                    </View>
                </View>

            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

