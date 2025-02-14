import { Pressable, ScrollView, View } from "react-native"
import { Text } from "@/components/ui/Text"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { Bell, Delete, HousePlus, Trash2 } from "lucide-react-native"
import { useRouter } from "expo-router"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/Button"
import PropertyCard from "@/components/property-card"

import { FlashList } from "@shopify/flash-list";

export default function index() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 p-4"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 36 }}
    >
      <SafeAreaView>
        <View className="flex-row justify-between items-center">
          <View></View>
          <View className="items-center gap-4 self-end relative">
            <Bell color="#2B4B80" size={24} />
            <View className="absolute -top-1.5 -right-0.5 bg-destructive w-4 h-4 rounded-full items-center p-0.5 justify-center">
              <Text className="text-xs text-white">1</Text>
            </View>
          </View>
        </View>

        <Pressable
          className="my-[5%]"
          onPress={() => router.push("(user)/(property)/add-property")}
        >
          <View className="mt-4 w-16 h-16 p-4 rounded-full bg-primary items-center justify-center self-center">
            <HousePlus
              color="#ffffff"
              size={28}
            />
          </View>
          <Text className="text-center text-xl mt-4">App Property</Text>
        </Pressable>

        <View className="flex-1 pt-8">
          <View className="flex-1">
            {/* <Text className="text-center text-xl font-semibold">No Properties added yet</Text> */}
          </View>
        </View>

        {
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => <PropertyCard key={index} id={index} />)
        }
      </SafeAreaView>
    </ScrollView>
  )
}