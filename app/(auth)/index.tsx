import React from "react";
import { useRouter } from "expo-router";

import { View, StyleSheet } from "react-native"
import { Image, ImageBackground } from "expo-image";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { StatusBar } from "expo-status-bar";

export default function Welcome() {
    const router = useRouter()
    const img = {
        uri: require("@/assets/images/register-bg.png")
    }

    return (
        <View className="flex-1">
            <ImageBackground
                source={img.uri}
                style={styles.image}
            >
                <View className="px-6">
                    <Text className="text-white text-4xl font-bold">Manage All Your Tenants{"\n"}at once</Text>
                    <View style={{ paddingVertical: 16 }} />

                    <View className="flex flex-col gap-2">
                        <Button
                            onPress={() => router.navigate('/login')}
                        >
                            Login
                        </Button>
                        <Button
                            onPress={() => router.navigate('/register')}
                        >
                            Create Account
                        </Button>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 96
    },
})