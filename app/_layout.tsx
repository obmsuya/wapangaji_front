import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "@/lib/auth"

import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';

import { PortalHost } from '@rn-primitives/portal';

// Import your global CSS file
import "@/global.css";
import Toast from "react-native-toast-message";
import toastConfig from "@/lib/toastConfig";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
    const [loaded, error] = useFonts({
        "Inter": require('../assets/fonts/Inter.ttf')
    })

    React.useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <AuthProvider>
            <SafeAreaProvider>
                <View
                    className="flex-1"
                    style={{
                        backgroundColor: "#fff",
                    }}
                >
                    <Slot />
                    <StatusBar style="auto" />
                    <Toast config={toastConfig} />
                </View>
                <PortalHost />
            </SafeAreaProvider>
        </AuthProvider>
    )
}