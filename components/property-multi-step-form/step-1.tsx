import React, { useState } from 'react'
import { StyleSheet, View, Pressable } from 'react-native'

import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { Image } from "expo-image"

import { Button } from '@/components/ui/Button'
import { Text } from "@/components/ui/Text"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { Check } from 'lucide-react-native'

interface props {
  step: number
  nextStep: (step: number) => void
}

const StepOne: React.FunctionComponent<props> = ({ step, nextStep }) => {
  const [propertyType, setPropertyType] = useState("Room")
  const img = {
    uri: require("@/assets/images/illustrations/property-type.png")
  }

  function onLabelPress(label: string) {
    return () => {
      setPropertyType(label);
    };
  }

  return (
    <View className="flex-1">
      <View className="mt-[24%]"></View>
      <Image
        source={img.uri}
        style={{
          width: 171,
          height: 107,
          justifyContent: "center",
          alignSelf: "center"
        }}
        contentFit="cover"
      />
      <View className="items-center justify-center mb-4">
        <Text variant="huge" className="text-center mt-8">Property Type</Text>
        <Text className="text-center mt-1">Select your  property's type</Text>
      </View>

      <RadioGroup value={propertyType} onValueChange={setPropertyType}>
        <View className="flex-col gap-2 mt-8">
          <View className="flex-row gap-2 items-center">
            <RadioItemCard value="Room" onLabelPress={onLabelPress('Room')} />
            <RadioItemCard value="Villa" onLabelPress={onLabelPress('Villa')} />
          </View>
          <View className="flex-row gap-2 items-center">
            <RadioItemCard value="Bungalow" onLabelPress={onLabelPress('Bungalow')} />
            <RadioItemCard value="Apartment" onLabelPress={onLabelPress('Apartment')} />
          </View>
        </View>
      </RadioGroup>

      <View className="flex-row mt-4 self-end">
        <Button
          onPress={() => nextStep(step)}
        >
          Next
        </Button>
      </View>
    </View>
  )
}

export default StepOne

function RadioItemCard({
  value,
  onLabelPress,
}: {
  value: string;
  onLabelPress: () => void;
}) {
  return (
    <Pressable onPress={onLabelPress} className='w-[49%]'>
      <View className="bg-primary/10 rounded-xl p-4 border-2 border-primary gap-4 relative w-full">
        <View className="flex flex-row items-center gap-4 w-full">
          <RadioGroupItem className="w-8 h-8" aria-labelledby={`label-for-${value}`} value={value} />
          <Text className="font-semibold text-xl text-primary">{value}</Text>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({})