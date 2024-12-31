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

export default function login() {
    const [remember, setRemember] = useState(false)
    const router = useRouter()

    const img = {
        uri: require("@/assets/images/illustrations/login.svg")
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

            <View className="mt-20">
                <Image
                    source={img.uri}
                    style={{
                        width: 213,
                        height: 131,
                        justifyContent: "center",
                        alignSelf: "center"
                    }}
                    contentFit="cover"
                />

                <View className="mt-20">
                    <Text className="text-4xl font-bold text-center text-primary" style={{ color: "#2B4B80" }}>Login</Text>
                    <View className="py-4" />
                    <View className="flex flex-col gap-2">
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
                        <View
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "99%"
                            }}
                        >
                            <View
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "row"
                                }}
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
                        <Button>Login</Button>
                    </View>
                </View>
            </View>

        </SafeAreaView>
    )
}


