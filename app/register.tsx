import { Text } from "@/components/ui/Text"
import React, { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft } from 'lucide-react-native';
import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Image } from "expo-image";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Link, useRouter } from "expo-router";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useKeyboardVisibility } from "@/lib/useKeyboard";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

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
                        <View className="flex flex-col gap-2">
                            <View className="gap-2">
                                <Text>Your Name</Text>
                                <Input placeholder="Enter your full name" />
                            </View>
                            <View className="gap-2">
                                <Text>Mobile Number</Text>
                                <Input placeholder="Enter your mobile number" />
                            </View>
                            <View className="py-0.5" />
                            <View className="gap-2">
                                <Text>Password</Text>
                                <Input placeholder="Enter your password" />
                            </View>
                            <View className="py-0.5" />
                            <Button>Register</Button>
                            <View className="py-0.5" />
                            <Text className="mx-auto text-center self-center items-center">
                                Already have and account? <Link href="/login" className="text-primary">Login</Link>
                            </Text>
                        </View>
                    </View>
                </View>

            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}


