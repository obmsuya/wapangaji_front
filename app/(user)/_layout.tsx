import React from "react";
import { Redirect, Stack } from "expo-router";

import { useAuth } from "../../lib/auth";
import { View, Text } from "react-native";

export default function UserLayout() {
    const { session, isLoading } = useAuth()

    if (isLoading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }

    if (!session) {
        return <Redirect href={"/welcome"}  />
    }

    return <Stack />
}