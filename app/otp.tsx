import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { Image } from "expo-image";
import { useKeyboardVisibility } from "@/lib/useKeyboard";
import { OtpInput } from "react-native-otp-entry";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function Otp() {
    const keyboard = useKeyboardVisibility()
    const router = useRouter()
    const { top } = useSafeAreaInsets()

    const scale = useSharedValue(1)

    const img = {
        uri: require("@/assets/images/illustrations/otp.svg")
    }

    useEffect(() => {
        if (keyboard) {
            scale.value = withSpring(0.8)
        } else if (!keyboard) {
            scale.value = withSpring(1)
        }
    }, [keyboard])


    return (
        <SafeAreaProvider>

            <SafeAreaView className="px-4 py-2 relative flex-1 border justify-center">
                <Button
                    className={`bg-primary w-12 h-12 rounded-full p-2 items-center justify-center  absolute left-4`}
                    style={{
                        top: top + 4
                    }}
                    android_ripple={{
                        color: "#ffffff"
                    }}
                    onPress={() => router.back()}
                >
                    <ArrowLeft size={24} color="#fff" className="self-items" />
                </Button>
                <Animated.View
                    style={{
                        transform: [{
                            scale: scale
                        }]
                    }}
                >
                    <Image
                        source={img.uri}
                        style={styles.img}
                        contentFit="cover"
                    />
                </Animated.View>
                <View className={keyboard ? "mt-4" : "mt-16"}>
                    <Text className="text-4xl font-bold mx-auto text-center"> Enter Verification Code </Text>
                    <Text className="text-center mx-auto">A verification code has been sent to you phone number</Text>
                    <View className="py-4" />
                    <View className="px-4">
                        <OtpInput
                            numberOfDigits={6}
                            focusColor="green"
                            autoFocus={false}
                            hideStick={true}
                            placeholder="******"
                            blurOnFilled={true}
                            disabled={false}
                            type="numeric"
                            secureTextEntry={false}
                            focusStickBlinkingDuration={500}
                            onFocus={() => console.log("Focused")}
                            onBlur={() => console.log("Blurred")}
                            onTextChange={(text) => console.log(text)}
                            onFilled={(text) => console.log(`OTP is ${text}`)}
                            textInputProps={{
                                accessibilityLabel: "One-Time Password",
                            }}
                            theme={{
                                pinCodeContainerStyle: styles.pinCodeContainer,
                                pinCodeTextStyle: styles.pinCodeText,
                                focusStickStyle: styles.focusStick,
                                focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                                placeholderTextStyle: styles.placeholderText,
                                filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                                disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
                            }}
                        />
                        <Button className="mt-4">Verify</Button>
                    </View>
                </View>
                <View className="py-4" />
                <View>
                    <Text className="text-center mx-auto">Haven't received a code? <Text className="text-primary font-medium">Press to resend code</Text></Text>
                </View>
                <View className={keyboard ? "mt-1" : "mt-20"} />

            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    img: {
        width: 220 - 16,
        height: 200 - 16,
        justifyContent: "center",
        alignSelf: "center",
    },

    pinCodeContainer: {},
    pinCodeText: {
        color: "#2B4B80"
    },
    focusStick: {},
    activePinCodeContainer: {
        borderWidth: 2,
        borderColor: "#2B4B80"
    },
    placeholderText: {},
    filledPinCodeContainer: {

    },
    disabledPinCodeContainer: {}
})