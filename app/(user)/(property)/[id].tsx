import React, { useState } from 'react'

import { View, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from "expo-image"


import BackButton from '@/components/back-button'
import { Text } from '@/components/ui/Text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import TenantCard from '@/components/tenants/tenant-list-card'
import ReportCard from '@/components/reports/report-list-card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";


import DropDownPicker from 'react-native-dropdown-picker';
import { CalendarDays } from 'lucide-react-native';

const PropertyDetails = () => {
    const [open, setOpen] = useState(false);
    const [pickerValue, setPickerValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'John Salehe', value: 'John Salehe' }
    ]);

    const { id } = useLocalSearchParams()
    const [value, setValue] = React.useState('properties');

    const img = {
        uri: require("@/assets/images/example-home.jpg")
    }

    return (
        <SafeAreaView className='p-4 flex-1'>
            <View className='flex-1 gap-2'>
                <BackButton />
                <View className='' />
                <Image
                    className='border rounded-2xl h-64'
                    style={{
                        backgroundColor: "#c7c7c7",
                        height: 256,
                        borderRadius: 16
                    }}
                    source={img.uri}
                    contentFit='cover'
                />
                <View className='my-2' />
                <View className='flex justify-between flex-row'>
                    <Text className='text-2xl'><Text className='font-bold'>02</Text> Rooms</Text>
                    <Text className='text-2xl'><Text className='font-bold'>03</Text> Tenants</Text>
                </View>
                <View className='my-2' />
                <View className=''>
                    <Tabs
                        value={value}
                        onValueChange={setValue}
                        className=''
                    >
                        <TabsList className='flex-row w-full'>
                            <TabsTrigger value='properties' className='flex-1'>
                                <Text className={value === "properties" ? "text-white" : "text-gray-700"}>Properties</Text>
                            </TabsTrigger>
                            <TabsTrigger value='tenants' className='flex-1'>
                                <Text className={value === "tenants" ? "text-white" : "text-gray-700"}>Tenants</Text>
                            </TabsTrigger>
                            <TabsTrigger value='reports' className='flex-1'>
                                <Text className={value === "reports" ? "text-white" : "text-gray-700"}>Reports</Text>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value='properties'>
                            <Text>Property Layout will appear here.</Text>
                        </TabsContent>
            
                        <TabsContent value='tenants'>
                            <View className='my-4'></View>
                            <View className='flex-col gap-6'>
                                <TenantCard />
                                <TenantCard />
                                <TenantCard />
                            </View>
                        </TabsContent>
                        <TabsContent value='reports'>
                            <View className='my-2'></View>
                            <View className='flex flex-row justify-between w-full items-center gap-[30%]'>
                                <DropDownPicker
                                    placeholder='Select Tenant'
                                    open={open}
                                    value={pickerValue}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setPickerValue}
                                    containerStyle={{
                                        width: '45%'
                                    }}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#2B4B80',
                                        borderRadius: 10,
                                    }}
                                />
                                <View className='w-1/2 flex-row items-center gap-2 self-center'>
                                    <CalendarDays size={20} color='#2B4B80' />
                                    <Text variant="medium">Aug - Jan</Text>
                                </View>
                            </View>
                            <View className='my-6'></View>
                            <View className='flex-col gap-6'>
                                <ReportCard />
                                <ReportCard />
                                <ReportCard />
                            </View>
                        </TabsContent>
                    </Tabs>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default PropertyDetails