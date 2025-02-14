import React, { useState, useCallback, useMemo, useRef } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import TenantDropdownMenu from "../dropdown-menu";
import { Pressable, Modal, StyleSheet } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { X } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ReportCard = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const snapPoints = useMemo(() => ['50%', '75%', '100%'], []);

    // ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleDismissModalPress = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-row gap-2 justify-between items-center border-b border-gray-300 pb-4">
            <View>
                <Text className="text-xl text-gray-500">30 Aug 2024</Text>
            </View>
            <View>
                <Text className="text-xl">Tsh 150,000.00</Text>
            </View>

            {/* <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View className="flex-1 justify-center items-center bg-black/30 p-8">
                    <View className="bg-white w-full rounded-xl p-4 relative max-w-96">
                        <Pressable className="self-end mb-4" onPress={() => setModalVisible(false)}>
                            <X color="#000" size={16} />
                        </Pressable>


                        <View className="gap-4">
                            <View className="gap-1 flex flex-col">
                                <Text className="text-center font-bold" variant="large">Delete Tenant?</Text>
                                <Text className="text-center">Are you sure you want to delete this tenant?</Text>
                            </View>

                            <View className="gap-2 mt-2">
                                <Button
                                    className="w-full gap-4 flex-row items-center justify-center"
                                    variant="destructive"
                                >
                                    Delete
                                </Button>
                                <Button
                                    className="w-full"
                                    variant="ghost"
                                    onPress={() => setModalVisible(false)}
                                >
                                    Cancel
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}
                onDismiss={handleDismissModalPress}
                enableDynamicSizing={true}
                enablePanDownToClose={true}
                enableHandlePanningGesture={true}
                enableDismissOnClose={true}
            >
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.contentContainer}
                    keyboardShouldPersistTaps="always"
                    enableOnAndroid={true}
                    enableAutomaticScroll={true}
                    enableResetScrollToCoords={true}
                >
                    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                        <View className="w-full px-4">
                            <Text variant="large" className="text-center mt-6">Edit Tenant</Text>
                            <View className="w-full h-px bg-gray-200 mt-4" />
                        </View>

                        <View className="gap-4 w-full px-4 mt-8">
                            <View className="gap-2 flex flex-row items-center justify-between">
                                <Input placeholder="Tenant Name" className="w-[48%]" />
                                <Input placeholder="Tenant Phone number" className="w-[48%]" />
                            </View>
                            <Input placeholder="Tenant Email" />
                            <Input placeholder="Tenant Address" />
                        </View>

                        <View className="w-full px-4">
                            <Button className="w-full">Save</Button>
                        </View>
                    </BottomSheetScrollView>
                </KeyboardAwareScrollView>
            </BottomSheetModal> */}
        </Animated.View >
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 100,
        gap: 16,
        zIndex: 1000,
    },
});

export default ReportCard;