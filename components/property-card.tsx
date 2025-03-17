import React from "react";

import { Pressable, View, Modal } from "react-native"
import { Image } from "expo-image"

import { Text } from "./ui/Text";
import { Button } from "./ui/Button";
import { Trash2, X } from "lucide-react-native";
import { useRouter } from "expo-router";
import BackButton from "./back-button";

interface Props {
    id: string;
    name?: string;
    location?: string;
    type?: string;
    image?: string;
    total_floors?: number;
    rooms?: number;
    tenants?: number;
}

const PropertyCard: React.FC<Props> = ({
    id,
    name = "Sinza Apartment",
    type = "Apartment",
    rooms = 7,
    tenants = 2,
    image
}) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const router = useRouter();

    const img = {
        uri: image || require("@/assets/images/example-home.jpg")
    }

    return (
        <View
            key={id}
            className="flex-row items-center bg-white rounded-xl w-full border justify-between"
        >
            <Pressable
                style={{
                    flexDirection: "row",
                    gap: 16,
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onPress={() => router.navigate({
                    pathname: '(user)/(property)/[id]',
                    params: { id: id },
                })}
            >
                <Image
                    style={{
                        backgroundColor: "#c7c7c7",
                        height: 80,
                        width: 80,
                        marginTop: 8,
                        marginBottom: 8,
                        borderRadius: 16
                    }}
                    source={img.uri}
                    contentFit="cover"
                />
                <View>
                    <Text className="text-lg font-semibold text-primary">{type}</Text>
                    <Text className="text-xl max-w-60 line-clamp-1">{name}</Text>

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        marginTop: 8,
                        gap: 48,
                    }}>
                        <Text className="text-sm text-primary">Rooms: {rooms}</Text>
                        <Text className="text-sm text-primary">Tenants: {tenants}</Text>
                    </View>
                </View>
            </Pressable>

            <Pressable
                className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center"
                onPress={() => setModalVisible(true)}
            >
                <Trash2
                    color="#fff"
                    size={16}
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center"
                    }}
                />
            </Pressable>

            <Modal
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
                                <Text className="text-center font-bold" variant="large">Delete Property</Text>
                                <Text className="text-center">Are you sure you want to delete this property</Text>
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
            <View>
            </View>
        </View>
    )
}

export default PropertyCard