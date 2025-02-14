import { cn } from "@/lib/utils";
import * as React from "react";
import { Text as RNText, type TextProps } from "react-native";
import Animated from "react-native-reanimated";

const TextClassContext = React.createContext<string | undefined>(undefined);

const textVariants = {
  small: "text-sm",
  medium: "text-base",
  large: "text-2xl",
  huge: "text-4xl",
};

interface Props extends TextProps {
    className?: string;
    variant?: "small" | "medium" | "large" | "huge";
    asChild?: boolean;
}

export const Text = React.forwardRef<any, Props>(({
  className,
  variant = "medium",
  asChild = false,
  ...props
}, ref) => {
  const textClass = React.useContext(TextClassContext);
  const variantClassName = textVariants[variant as keyof typeof textVariants];

  return (
    <RNText
      ref={ref}
      className={cn(
        "text-foreground flex items-center web:select-text", 
        variantClassName, 
        textClass,
        className
      )}
      style={{ fontFamily: "Inter" }}
      {...props}
    />
  );
});

Text.displayName = 'Text';

export { TextClassContext };
