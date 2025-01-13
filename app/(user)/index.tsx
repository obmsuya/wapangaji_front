import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, Tabs } from 'expo-router'
import { Bell, Home, HousePlus } from 'lucide-react-native'
import Stack from 'expo-router'
import { Button } from '@/components/ui/Button'

export default function index() {
  return (
    <SafeAreaView className='p-4 relative'>
      <View className="flex-row justify-between items-center">
        <View></View>
        <View className="items-center gap-4 self-end relative">
          <Bell color='#2B4B80' size={24} />
          <View className="absolute -top-2 -right-2 bg-destructive w-4 h-4 rounded-full items-center justify-center">
            <Text className="text-xs text-white">1</Text>
          </View>
        </View>
      </View>

      <Link href="/add-property" asChild>
        <HousePlus color="#ffffff" size={24} />
      </Link>
    </SafeAreaView>
  )
}