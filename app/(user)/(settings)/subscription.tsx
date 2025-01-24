import { View, Pressable } from "react-native"
import { Text } from "@/components/ui/Text"
import React, { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/back-button";
import { Check } from "lucide-react-native";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { Image } from "expo-image"
import { usePayment } from "@/lib/zustand";
import { useAuth } from "@/lib/auth"

export default function subscription() {
  const { getSubscriptions } = usePayment()
  const [value, setValue] = React.useState('Standard Plan');

  const img = {
    uri: require("@/assets/images/illustrations/subscription.svg")
  }

  function onLabelPress(label: string) {
    return () => {
      setValue(label);
    };
  }

  useEffect(() => {
    getSubscriptions()
  }, [])

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <BackButton />

      <View className="flex-1 items-center justify-center gap-4">
        <Image
          source={img.uri}
          style={{
            width: 360 / 2,
            height: 350 / 2,
            justifyContent: "center",
            alignSelf: "center"
          }}
          contentFit="cover"
        />
        <View>
          <Text variant="huge" className="mt-[4%] text-center">
            Subscriptions
          </Text>
          <Text className="text-center px-6 mt-2">
            Choose a plan that helps you manage your homes more {"\n"} easily and effeciently.
          </Text>
        </View>

        <View className="mt-[4%] flex flex-col gap-4 mb-[4%]">
          <RadioGroup value={value} onValueChange={setValue}>
            <RadioItemCard value="Standard Plan" onLabelPress={onLabelPress('Standard Plan')} />
            <RadioItemCard value="Premium Plan" onLabelPress={onLabelPress('Premium Plan')} />
          </RadioGroup>
        </View>

      </View>
    </SafeAreaView>
  )
}

function RadioItemCard({
  value,
  onLabelPress,
}: {
  value: string;
  onLabelPress: () => void;
}) {
  return (
    <Pressable onPress={onLabelPress}>
      <View className="bg-primary/10 rounded-xl p-4 border-2 border-primary gap-4 relative">
        <View className="flex flex-row items-center justify-between gap-4 w-full">
          <Text className="font-semibold text-xl text-primary">{value}</Text>
          <View>
            <RadioGroupItem className="w-8 h-8" aria-labelledby={`label-for-${value}`} value={value} />
          </View>
        </View>
        <Text className="font-semibold text-primary" variant="huge">Tsh 0</Text>

        <View className="flex gap-6 flex-row w-full flex-wrap">
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}
          >
            <View className="bg-primary w-6 h-6 items-center justify-center rounded-full">
              <Check color="#ffffff" size={12} />
            </View>
            <Text className="text-primary" variant="small">1000 credits</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}
          >
            <View className="bg-primary w-6 h-6 items-center justify-center rounded-full">
              <Check color="#ffffff" size={12} />
            </View>
            <Text className="text-primary" variant="small">1000 credits</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}