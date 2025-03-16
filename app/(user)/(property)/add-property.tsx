import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import StepThree from "@/components/property-multi-step-form/step-3";
import StepFour from "@/components/property-multi-step-form/step-4";
import SlideTransition from "@/components/slide-transition"

import * as Progress from 'react-native-progress';
import Animated, { useSharedValue } from 'react-native-reanimated';
import BackButton from "@/components/back-button";
import PropertyMultiStepForm from "@/components/property-multi-step-form";

export default function AddProperty() {
    return (
        <SafeAreaView className="flex-1 px-8 py-4">
            <PropertyMultiStepForm />
        </SafeAreaView>
    )
}