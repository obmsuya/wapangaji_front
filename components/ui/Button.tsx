import { Pressable, PressableProps } from "react-native";
import { Text } from "./Text"
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends PressableProps {
    children?: React.ReactNode;
    onPress?: () => void;
    className?: string; // Add className to the props interface
    textClassName?: string; // Add className to the props interface
}

export const Button: React.FunctionComponent<ButtonProps> = ({
    children,
    onPress,
    className,
    textClassName,
    ...buttonActions
}) => {
    return (
        <Pressable
            className={cn("bg-primary px-6 py-3 rounded-2xl overflow-hidden items-center justify-center", className)}
            android_ripple={{
                color: "#919191",
                borderless: false,
                foreground: true
            }}
            {...buttonActions}
            onPress={onPress}
            style={{ alignItems: "center", gap: 8, overflow: "hidden" }}
        >
            <Text
                className={cn("text-white text-xl font-medium mx-auto text-center items-center gap-6", textClassName)}
            >
                {children}
            </Text>
        </Pressable>
    )
}