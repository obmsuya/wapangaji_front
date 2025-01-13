import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, TextInputProps>(
    ({ className, placeholderClassName, ...props }, ref) => {
        const [focusBg, setFocusBg] = React.useState("")
        const [blurBg, setBlurBg] = React.useState("")


        return (
            <TextInput
                ref={ref}
                onFocus={() => setFocusBg("bg-secondary")}
                onBlur={() => setBlurBg("bg-secondary")}
                className={cn(
                    `first-letter:h-10 native:h-12 rounded-2xl bg-[#f2f2f2] text-base lg:text-sm native:text-lg native:leading-[1.25] file:border-0 file:bg-transparent file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                    `,
                    props.editable === false && 'opacity-50 web:cursor-not-allowed',
                    className
                )}
                placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
                style={{paddingHorizontal: 12}}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';

export { Input };