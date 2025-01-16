import { Pressable, PressableProps } from "react-native";
import { Text } from "./Text"
import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "rounded-2xl overflow-hidden items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary",
        outline: "border-2 border-primary bg-transparent",
        ghost: "bg-transparent hover:bg-accent",
        destructive: "bg-destructive",
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends PressableProps, VariantProps<typeof buttonVariants> {
    children?: React.ReactNode;
    onPress?: () => void;
    className?: string;
    textClassName?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Button: React.FunctionComponent<ButtonProps> = ({
    children,
    onPress,
    className,
    textClassName,
    variant,
    size,
    icon,
    iconPosition = 'left',
    ...buttonActions
}) => {
    const content = (
        <>
            {icon && iconPosition === 'left' && icon}
            {children && (
                <Text
                    className={cn(
                        "text-xl font-medium mx-auto text-center items-center",
                        variant === "outline" ? "text-primary" : "text-white",
                        variant === "ghost" ? "text-foreground" : "",
                        textClassName
                    )}
                >
                    {children}
                </Text>
            )}
            {icon && iconPosition === 'right' && icon}
        </>
    );

    return (
        <Pressable
            className={cn(
                buttonVariants({ variant, size, className }),
                "flex-row gap-2"
            )}
            android_ripple={{
                color: "#919191",
                borderless: false,
                foreground: true
            }}
            {...buttonActions}
            onPress={onPress}
            style={{ alignItems: "center", gap: 8, overflow: "hidden" }}
        >
            {content}
        </Pressable>
    )
}