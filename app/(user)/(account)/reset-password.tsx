import { ActivityIndicator, TextInput, View, TouchableOpacity } from "react-native"
import { Image } from "expo-image";
import { Text } from "@/components/ui/Text"
import React, { useEffect, useRef, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import BackButton from "@/components/back-button"
import { Button } from "@/components/ui/Button";

import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Eye, EyeClosed } from "lucide-react-native"

import * as yup from "yup"
import { Formik } from "formik";
import { useKeyboardVisibility } from "@/lib/useKeyboard";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth";
import { router } from "expo-router";

const accountSchema = yup.object().shape({
    phone_number: yup.string()
        .trim()
        .matches(
            /^\+255\d{9}$/,
            "Your mobile number should start with +255 followed by 9 other digits."
        )
        .min(13, "Invalid phone number.")
        .max(13, "Invalid phone number.")
        .required("Please enter your mobile number."),
    new_password: yup.string().required("Please enter your new password"),
    confirm_password: yup.string()
        .required("Please confirm your new password.")
        .oneOf([yup.ref('new_password')], 'Passwords must match'),
})

export default function resetPassword() {
    const [showPassword, setShowPassword] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const keyboard = useKeyboardVisibility()
    const scale = useSharedValue(1)

    const { isLoading, resetPassword } = useAuth()

    const phoneNumberInputRef = useRef<TextInput>(null)
    const passwordInputRef = useRef<TextInput>(null)
    const confirmPasswordInputRef = useRef<TextInput>(null)

    const img = {
        uri: require("@/assets/images/illustrations/reset-password.svg")
    }

    useEffect(() => {
        if (keyboard) {
            scale.value = withSpring(0.8)
        } else if (!keyboard) {
            scale.value = withSpring(1)
        }
    }, [keyboard])

    return (
        <SafeAreaView
            className="px-[20%] py-2 relative bg-white flex-1"
        >
            <BackButton />
            <KeyboardAwareScrollView
                enableAutomaticScroll={true}
                // extraScrollHeight={100} // Adjust this value as needed
                showsVerticalScrollIndicator={false}
                keyboardOpeningTime={0}
                keyboardShouldPersistTaps="handled"
                contentContainerClassName="justify-center items-center flex-1"
            >

                <Animated.View
                    style={{
                        transform: [{
                            scale: scale
                        }]
                    }}
                >
                    <Image
                        source={img.uri}
                        style={{
                            width: 120,
                            height: 220,
                            justifyContent: "center",
                            alignSelf: "center"
                        }}
                        contentFit="cover"
                    />
                </Animated.View>

                <Text
                    variant="huge"
                    className="text-center mt-[4%] mb-4"
                >
                    Reset Password
                </Text>


                <View className={`w-full mb-8`}>
                    <Formik
                        validationSchema={accountSchema}
                        initialValues={{
                            phone_number: "",
                            confirm_password: "",
                            new_password: "",
                        }}
                        onSubmit={values => {
                            resetPassword(values.phone_number, values.confirm_password, values.new_password)
                        }}
                    >
                        {({ handleChange, handleSubmit, errors, isValid, values }) => (
                            <>

                                <View className="flex flex-col gap-2">
                                    <View className="gap-2">
                                        <Text className={errors.phone_number ? "text-destructive" : ""}>
                                            {errors.phone_number ? errors.phone_number : "Mobile Number"}
                                        </Text>
                                        <Input
                                            placeholder="Enter your mobile number"
                                            onChangeText={handleChange('phone_number')}
                                            ref={phoneNumberInputRef}
                                            value={values.phone_number}
                                            returnKeyType="next"
                                            inputMode="tel"
                                            onSubmitEditing={() => passwordInputRef?.current?.focus()}
                                            className={
                                                errors.phone_number ?
                                                    "bg-destructive/10 border-destructive border-2 text-destructive p-3"
                                                    : "text-black border-0"
                                            }
                                            placeholderClassName={errors.phone_number ? "text-destructive" : ""}
                                        />
                                    </View>
                                    <View className="gap-2">
                                        <Text className={errors.new_password ? "text-destructive" : ""}>
                                            {errors.new_password ? errors.new_password : "Your new password"}
                                        </Text>
                                        <View className="relative">
                                            <Input
                                                placeholder="Enter your new password"
                                                onChangeText={handleChange("new_password")}
                                                value={values.new_password}
                                                returnKeyType="next"
                                                className={errors.new_password ? "bg-destructive/10 border-destructive border-2 text-destructive" : ""}
                                                onSubmitEditing={() => phoneNumberInputRef.current?.focus()}
                                                placeholderClassName={errors.new_password ? "text-destructive" : ""}
                                                secureTextEntry={!showPassword}
                                                autoCorrect={false}
                                                autoComplete="password"
                                                autoCapitalize="none"
                                            />
                                            <TouchableOpacity
                                                className="absolute right-[1.5%] top-[22.5%]"
                                                onPress={() => setShowPassword(!showPassword)}
                                            >
                                                {
                                                    !showPassword ? <Eye color="#3a4a5a" /> : <EyeClosed color="#3a4a5a" />
                                                }

                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View className="gap-2">
                                        <Text className={errors.confirm_password ? "text-destructive" : ""}>
                                            {errors.confirm_password ? errors.confirm_password : "Your confirm password"}
                                        </Text>
                                        <View className="relative">
                                            <Input
                                                placeholder="Confirm your new password"
                                                onChangeText={handleChange("confirm_password")}
                                                ref={phoneNumberInputRef}
                                                value={values.confirm_password}
                                                secureTextEntry={!showPassword2}
                                                autoCorrect={false}
                                                autoComplete="password"
                                                autoCapitalize="none"
                                                className={
                                                    errors.confirm_password ?
                                                        "bg-destructive/10 border-destructive border-2 text-destructive p-3"
                                                        : "text-black border-0"
                                                }
                                                placeholderClassName={errors.confirm_password ? "text-destructive" : ""}
                                            />
                                            <TouchableOpacity
                                                className="absolute right-[1.5%] top-[22.5%]"
                                                onPress={() => setShowPassword2(!showPassword2)}
                                            >
                                                {
                                                    !showPassword2 ? <Eye color="#3a4a5a" /> : <EyeClosed color="#3a4a5a" />
                                                }

                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View className="py-2" />
                                    <Button
                                        onPress={handleSubmit}
                                        disabled={isLoading || !isValid}
                                        className={`${(isLoading || !isValid) ? "opacity-75" : ""}`}
                                    >
                                        {isLoading ? "Loading..." : "Save Changes"}
                                        {isLoading && <ActivityIndicator size="small" color="#ffffff" style={{ marginTop: 20, paddingHorizontal: 8 }} />}
                                    </Button>
                                    <View className="py-0.5" />
                                </View>
                            </>
                        )}
                    </Formik>
                </View>


            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}