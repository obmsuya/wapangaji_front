import React from "react";
import { Redirect, Tabs, Stack } from "expo-router";

import { useAuth } from "../../lib/auth";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Settings } from "lucide-react-native";

export default function UserLayout() {
    const { isAuthenticated, isLoading } = useAuth()
    const { top } = useSafeAreaInsets()

    if (!isAuthenticated) {
        return <Redirect href={"/(auth)/"} />
    }

    return <Stack screenOptions={{ headerShown: false }} />
}