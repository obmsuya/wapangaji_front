import React from "react";
import { Redirect, Tabs } from "expo-router";

import { useAuth } from "../../lib/auth";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Settings } from "lucide-react-native";

export default function UserLayout() {
    const { isAuthenticated, isLoading } = useAuth()
    const { top } = useSafeAreaInsets()

    if (!isAuthenticated) {
        return <Redirect href={"/(auth)/"} />
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => (<Home color={color} />)
                }}
            />
            <Tabs.Screen
                name="(settings)"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => (<Settings color={color} />)
                }}
            />
        </Tabs>
    )
}