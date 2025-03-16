import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Picker } from '@react-native-picker/picker';
import { usePropertyStore } from "@/lib/zustand";

interface props {
    step: number;
    nextStep: (step: number) => void;
    prevStep: (step: number) => void;
}

const StepThree: React.FunctionComponent<props> = ({ step, nextStep, prevStep }) => {
    const { propertyDetails, setPropertyDetails } = usePropertyStore();
    const [propertyType, setPropertyType] = useState(propertyDetails.type || "Room");
    const [totalFloors, setTotalFloors] = useState(propertyDetails.totalFloors?.toString() || "1");

    const handleNext = () => {
        // Validate and save data
        if (!totalFloors || parseInt(totalFloors) < 1) {
            alert('Please enter a valid number of floors');
            return;
        }

        setPropertyDetails({
            type: propertyType,
            totalFloors: parseInt(totalFloors)
        });
        
        nextStep(step);
    };

    return (
        <View className="flex-1 gap-4">
            <Text variant="huge" className="text-center mt-8">Property Details</Text>

            <View className="gap-4 mt-[12.5%]">
                <View className="gap-2">
                    <Text>Property Type</Text>
                    <View className="border border-gray-300 rounded-md">
                        <Picker
                            selectedValue={propertyType}
                            onValueChange={(itemValue) => setPropertyType(itemValue)}
                        >
                            <Picker.Item label="Room" value="Room" />
                            <Picker.Item label="Apartment" value="Apartment" />
                            <Picker.Item label="House" value="House" />
                            <Picker.Item label="Commercial" value="Commercial" />
                            <Picker.Item label="Office" value="Office" />
                        </Picker>
                    </View>
                </View>
                
                <View className="gap-2">
                    <Text>Total Floors</Text>
                    <Input
                        className="bg-gray-200"
                        placeholder="Enter number of floors"
                        value={totalFloors}
                        onChangeText={setTotalFloors}
                        keyboardType="numeric"
                    />
                </View>
            </View>

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

export default StepThree;

const styles = StyleSheet.create({});