import React, { useState, useRef, useEffect } from "react"
import { StyleSheet, View, Pressable, TextInput } from "react-native"

import { Button } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { Input } from "@/components/ui/Input"
import { Image } from "expo-image"

import { Images } from "lucide-react-native"
import * as ImagePicker from 'expo-image-picker';

import { usePropertyStore } from "@/lib/zustand"

interface props {
    step: number
    nextStep: (step: number) => void
    prevStep: (step: number) => void
}

const StepOne: React.FunctionComponent<props> = ({ step, nextStep, prevStep }) => {
    const { propertyDetails, setPropertyDetails } = usePropertyStore();
    const [propertyName, setPropertyName] = useState(propertyDetails.name || "");
    const [propertyLocation, setPropertyLocation] = useState(propertyDetails.location || "");
    const [selectedImage, setSelectedImage] = useState<string | undefined>(propertyDetails.image || undefined);

    const propertyNameRef = useRef<TextInput>(null)
    const propertyLocationRef = useRef<TextInput>(null)

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.75,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        } else {
            alert('You did not select any image.');
        }
    };

    const handleNext = () => {
        if (!propertyName.trim()) {
            alert('Please enter a property name');
            return;
        }
        
        if (!propertyLocation.trim()) {
            alert('Please enter a property location');
            return;
        }
        
        setPropertyDetails({
            name: propertyName,
            location: propertyLocation,
            image: selectedImage || ""
        });
        
        nextStep(step);
    };

    return (
        <View className="flex-1 gap-4">
            <Text variant="huge" className="text-center mt-8">Create Property</Text>

            <View className="gap-4 mt-[12.5%]">
                <View className="gap-2">
                    <Text>Property Name</Text>
                    <Input
                        className="bg-gray-200"
                        placeholder="Enter your property's name"
                    />
                </View>
                <View className="gap-2">
                    <Text>Property Location</Text>
                    <Input
                        className="bg-gray-200"
                        placeholder="Enter your property's location"
                    />
                </View>
                <View className="gap-2">
                    <Text>Property Image</Text>
                    {
                        selectedImage ? (
                            <View className="h-64 rounded-2xl overflow-hidden relative">
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={{
                                        justifyContent: "center",
                                        alignSelf: "center",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                    contentFit="cover"
                                />
                                <Button
                                    className="items -center gap-2 bg-white absolute bottom-2 right-2"
                                    onPress={pickImageAsync}
                                    icon={<Images color="#2B4B80" size={16} />}
                                    variant="outline"
                                >
                                    <Text className="text-primary">Change Image</Text>
                                </Button>
                            </View>
                        ) : (
                            <Pressable className="border border-dashed rounded-3xl p-8 border-primary" onPress={pickImageAsync}>
                                <View className="flex-col items-center justify-center gap-4">
                                    <Images color="#2B4B80" size={64} />
                                    <Text>Press here to select an image</Text>
                                </View>
                            </Pressable>
                        )
                    }
                </View>
            </View>

            <View className="flex-row gap-2 self-end">
                <Button
                    onPress={() => prevStep(step)}
                >Previous</Button>
                <Button
                    onPress={() => nextStep(step)}
                >Next</Button>
            </View>
        </View>
    )
}

export default StepOne

const styles = StyleSheet.create({})