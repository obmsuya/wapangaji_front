import React, { useEffect } from "react";
import { Redirect, useRouter } from "expo-router";

import { View, StyleSheet } from "react-native"
import { Image, ImageBackground } from "expo-image";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useAuth } from "@/lib/auth";

export default function index() {
    const { isAuthenticated, accessToken } = useAuth()

    useEffect(() => {
        console.log(isAuthenticated);
        console.log(accessToken);
    }, [])

    if (!isAuthenticated) {
        return <Redirect href="(auth)" />
    }

    return <Redirect href="(user)" />
}