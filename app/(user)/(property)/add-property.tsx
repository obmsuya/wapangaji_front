import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import StepOne from "@/components/property-multi-step-form/step-1";
import StepTwo from "@/components/property-multi-step-form/step-2";
import StepThree from "@/components/property-multi-step-form/step-3";
import StepFour from "@/components/property-multi-step-form/step-4";
import SlideTransition from "@/components/slide-transition"

import * as Progress from 'react-native-progress';
import Animated, { useSharedValue } from 'react-native-reanimated';
import BackButton from "@/components/back-button";

export default function AddProperty() {
    const [step, setStep] = React.useState(1)

    const handleStep = (step: number) => setStep(step)

    const renderStep = () => {
        switch (step) {
            case 1:
                return <StepOne step={step} nextStep={() => handleStep(2)} />
            case 2:
                return <StepTwo step={step} nextStep={() => handleStep(3)} prevStep={() => handleStep(step - 1)} />;
            case 3:
                return <StepThree step={step} nextStep={() => handleStep(4)} prevStep={() => handleStep(step - 1)} />;
            case 4:
                return <StepFour step={step} prevStep={() => handleStep(step - 1)} />;
            default:
                return null;
        }
    }

    return (
        <SafeAreaView className="flex-1 px-8 py-4">
            <View className="mb-4">
                <BackButton />
            </View>
            <View className="bg-gray-300 w-full p-1.5 rounded-3xl">
                <Progress.Bar progress={step * 0.25} width={null} color="#2B4B80" height={8} borderRadius={16} />
            </View>
            {renderStep()}
        </SafeAreaView>
    )
}