import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import PropertySummary from "../new-property/property-summary";

interface props {
    step: number;
    prevStep: (step: number) => void;
}

const StepSix: React.FunctionComponent<props> = ({ step, prevStep }) => {
    return (
        <View className="flex-1 gap-4">
            <PropertySummary 
                onBack={() => prevStep(step)}
            />
        </View>
    );
};

export default StepSix;

const styles = StyleSheet.create({});