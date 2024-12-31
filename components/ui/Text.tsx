import { cn } from "@/lib/utils";
import React from "react";
import { Text as RNText, type TextProps } from "react-native";

export const Text: React.FunctionComponent<TextProps> = ({
    className,
    ...props
}) => {
    return (
        <RNText
            className={cn("text-foreground flex items-center", className)}
            style={{fontFamily: "Inter"}}
            {...props}
        />
    )
} 