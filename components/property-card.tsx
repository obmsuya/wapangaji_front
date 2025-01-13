import React from "react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";

import { Pressable, View } from "react-native"
import { Text } from "./ui/Text";
import { Button } from "./ui/Button";
import { Trash2 } from "lucide-react-native";
import { useRouter } from "expo-router";

const PropertyCard = () => {
    const router = useRouter();

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                justifyContent: "space-between"
            }}
        >
            <Pressable
                style={{
                    flexDirection: "row",
                    gap: 16,
                    alignItems: "center"
                }}
            >
                <View
                    style={{
                        backgroundColor: "#c7c7c7",
                        height: 80,
                        width: 80,
                        marginTop: 8,
                        marginBottom: 8,
                        borderRadius: 16
                    }}
                />
                <View>
                    <Text className="text-lg font-semibold text-primary">Apartment</Text>
                    <Text className="text-xl max-w-60 line-clamp-1">Sinza Apartment Flat no. 01</Text>

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        marginTop: 8,
                        gap: 48,
                    }}>
                        <Text className="text-sm text-primary">Rooms: 7</Text>
                        <Text className="text-sm text-primary">Tenants: 2</Text>
                    </View>
                </View>
            </Pressable>
            <View>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-destructive rounded-full items-center justify-center p-4"
                            style={{
                                width: 40,
                                height: 40,
                                alignSelf: "flex-end"
                            }}
                        >
                            <Trash2 color="#ffffff" size={20} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-xl">Delete Property</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this property?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-row space-y-4 justify-end">
                            <DialogClose asChild>
                                <Button
                                    className="bg-transparent border border-accent-foreground"
                                    textClassName="text-accent-foreground"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button className="bg-destructive text-sm">
                                    Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </View>
        </View>
    )
}

export default PropertyCard