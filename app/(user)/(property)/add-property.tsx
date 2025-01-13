import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";

export default function AddProperty() {
    return (
        <SafeAreaView className="flex-1 p-8">
            <Text className="text-center text-2xl font-semibold">Add Property</Text>
        </SafeAreaView>
    )
}