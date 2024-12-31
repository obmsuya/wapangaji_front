import { cn } from "@/lib/utils";
import React from "react";
import { Text as RNText, type TextProps } from "react-native";

const Text: React.FunctionComponent<TextProps> = ({
    className,
    ...props
}) => {
    return (
        <RNText
            className={cn("text-foreground", className)}
            style={{fontFamily: "Inter"}}
            {...props}
        />
    )
} 

export default Text