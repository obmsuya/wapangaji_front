import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import FloorPlanDetails from "../new-property/floor-plan";
import { usePropertyStore } from "@/lib/zustand";

interface props {
    step: number;
    nextStep: (step: number) => void;
    prevStep: (step: number) => void;
}

const StepFour: React.FunctionComponent<props> = ({ step, nextStep, prevStep }) => {
    const { floorPlans } = usePropertyStore();
    
    const handleNext = () => {
        // Validate that at least one floor has units
        if (Object.keys(floorPlans).length === 0) {
            alert('Please create at least one floor plan before proceeding');
            return;
        }
        
        nextStep(step);
    };

    return (
        <View className="flex-1 gap-4">
            <Text variant="huge" className="text-center mt-8">Floor Plan</Text>
            
            <FloorPlanDetails />
            
            <View className="flex-row gap-2 self-end">
                <Button
                    onPress={() => prevStep(step)}
                >Previous</Button>
                <Button
                    onPress={handleNext}
                >Next</Button>
            </View>
        </View>
    );
};

export default StepFour;

const styles = StyleSheet.create({});