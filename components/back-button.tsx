import React from "react";
import { Button } from "./ui/Button";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

export default function BackButton() {
    return (
        <Button className="bg-primary w-10 h-10 rounded-full p-2 items-center justify-center"
            android_ripple={{
                color: "#ffffff",
            }}
            style={{
                alignItems: "center",
                justifyContent: "center",
            }}
            onPress={() => router.back()}
        >
            <ArrowLeft size={16} color="#fff" style={{alignSelf: "center", justifyContent: "center", alignItems: "center"}} />
        </Button>
    );
}