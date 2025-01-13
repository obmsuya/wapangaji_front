import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, View } from "react-native"
import { Text } from "@/components/ui/Text";
import { Eye, User2Icon, CircleHelp, CircleDollarSign, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function settings() {
    const router = useRouter();

    return (
        <SafeAreaView className="p-4 relative">
            <Text className="text-5xl font-bold m-4">Settings</Text>

            <View>
                <Pressable onPress={() => router.push("/settings/account")} className="flex-row p-2 justify-between items-center gap-4">
                    <View className="flex-row items-center gap-4">
                        <View className="bg-primary w-10 h-10 items-center justify-center rounded-full">
                            <User2Icon color="#ffffff" size={16} />
                        </View>
                        <Text className="text-xl">Account</Text>
                    </View>
                    <View>
                        <ChevronRight color="#2B4B80" size={24} />
                    </View>
                </Pressable>
                <Pressable onPress={() => router.push("/settings/preference")} className="flex-row p-2 justify-between items-center gap-4">
                    <View className="flex-row items-center gap-4">
                        <View className="bg-primary w-10 h-10 items-center justify-center rounded-full">
                            <Eye color="#ffffff" size={16} />
                        </View>
                        <Text className="text-xl">Preference</Text>
                    </View>
                    <View>
                        <ChevronRight color="#2B4B80" size={24} />
                    </View>
                </Pressable>
                <Pressable onPress={() => router.push("/settings/subscription")} className="flex-row p-2 justify-between items-center gap-4">
                    <View className="flex-row items-center gap-4">
                        <View className="bg-primary w-10 h-10 items-center justify-center rounded-full">
                            <CircleDollarSign color="#ffffff" size={16} />
                        </View>
                        <Text className="text-xl">Subscription</Text>
                    </View>
                    <View>
                        <ChevronRight color="#2B4B80" size={24} />
                    </View>
                </Pressable>
                <Pressable onPress={() => router.push("/settings/faq")} className="flex-row p-2 justify-between items-center gap-4">
                    <View className="flex-row items-center gap-4">
                        <View className="bg-primary w-10 h-10 items-center justify-center rounded-full">
                            <CircleHelp color="#ffffff" size={16} />
                        </View>
                        <Text className="text-xl">Faq</Text>
                    </View>
                    <View>
                        <ChevronRight color="#2B4B80" size={24} />
                    </View>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}