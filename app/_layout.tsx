import React from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "@/lib/auth"

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';

// Import your global CSS file
import "@/global.css";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import toastConfig from "@/lib/toastConfig";

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
            <View className="flex-1">
                <StatusBar style="auto" />
                <Slot />
                <Toast config={toastConfig}/>
            </View>
        </AuthProvider>
    )
}

function useEffect(arg0: () => void, arg1: (boolean | Error | null)[]) {
    throw new Error("Function not implemented.");
}
