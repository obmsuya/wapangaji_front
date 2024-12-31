import { Text } from "@/components/ui/Text"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft } from 'lucide-react-native';
import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Image } from "expo-image";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Link, useRouter } from "expo-router";

export default function register() {
    const [remember, setRemember] = useState(false)
    const router = useRouter()

    const img = {
        uri: require("@/assets/images/illustrations/register-user.svg")
    }

    return (
        <SafeAreaView className="px-4 py-2 relative">
            <Button className="bg-primary w-12 h-12 rounded-full p-2 items-center justify-center"
                android_ripple={{
                    color: "#ffffff"
                }}
                onPress={() => router.back()}
            >
                <ArrowLeft size={24} color="#fff" className="self-items" />
            </Button>

            <View className="mt-16">
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

                <View className="mt-16">
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

        </SafeAreaView>
    )
}


