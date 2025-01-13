import { Stack } from 'expo-router'
import React from 'react'

export default function AuthLayout() {
    return (
        <Stack
            initialRouteName='index'
            screenOptions={{
                headerShown: false
            }}
        />
    )
}