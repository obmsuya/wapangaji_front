import { cn } from "@/lib/utils";
import React from "react";
import { Text as RNText, type TextProps } from "react-native";
import Animated from "react-native-reanimated";


const textVariants = {
  small: "text-sm",
  medium: "text-base",
  large: "text-2xl",
  huge: "text-4xl",
};

interface Props extends TextProps {
    className?: string
    variant?: string
}

export const Text: React.FunctionComponent<Props> = ({
  className,
  variant = "medium",
  ...props
}) => {
  const variantClassName = textVariants[variant as keyof typeof textVariants];
  return (
    <RNText
      className={cn("text-foreground flex items-center", variantClassName, className)}
      style={{ fontFamily: "Inter" }}
      {...props}
    />
  );
};