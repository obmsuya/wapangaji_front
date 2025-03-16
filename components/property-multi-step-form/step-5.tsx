import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { UnitDetails } from "../new-property/unit-details";
import { usePropertyStore } from "@/lib/zustand";

interface props {
    step: number;
    nextStep: (step: number) => void;
    prevStep: (step: number) => void;
}

const StepFive: React.FunctionComponent<props> = ({ step, nextStep, prevStep }) => {
    const { units, floorPlans } = usePropertyStore();

    const handleNext = () => {
        // Check if at least one unit has details
        if (units.length === 0) {
            alert('Please add details for at least one unit before proceeding');
            return;
        }

        nextStep(step);
    };

    return (
        <View className="flex-1 gap-4">
            <Text variant="huge" className="text-center mt-8">Unit Details</Text>

            <UnitDetails
                onNext={handleNext}
                onBack={() => prevStep(step)}
            />
        </View>
    );
};

export default StepFive;

const styles = StyleSheet.create({});