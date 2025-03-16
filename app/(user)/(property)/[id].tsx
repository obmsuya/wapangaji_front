import React, { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import Svg, { Rect } from "react-native-svg";
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Animated, { useSharedValue } from "react-native-reanimated";
import DropDownPicker from "react-native-dropdown-picker";
import TenantCard from "@/components/tenants/tenant-list-card";
import { CalendarDays } from "lucide-react-native";
import ReportCard from "@/components/reports/report-list-card";

export default function PropertyDetailScreen() {
    const { id } = useLocalSearchParams();
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedUnit, setSelectedUnit] = useState<any>(null);
    const [currentFloor, setCurrentFloor] = useState(1);
    const [tabs, setTabs] = useState("rooms");

    const [open, setOpen] = useState(false);
    const [pickerValue, setPickerValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'John Salehe', value: 'John Salehe' }
    ]);


    // Bottom sheet references and configuration
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = React.useMemo(() => ['50%', '75%'], []);
    const animatedIndex = useSharedValue(0);
    const animatedPosition = useSharedValue(0);

    useEffect(() => {
        loadPropertyDetails();
    }, [id]);

    const loadPropertyDetails = async () => {
        setLoading(true);
        try {
            // In a real app, you would fetch from API using the ID
            // For now, we'll load from AsyncStorage
            const propertyDataString = await AsyncStorage.getItem('propertyData');

            if (propertyDataString) {
                const propertyData = JSON.parse(propertyDataString);
                console.log("Property data structure:", propertyData);

                // Check if propertyData has a property field or if it's directly at the root
                const propertyDetails = propertyData.property || propertyData;

                setProperty({
                    id: id,
                    name: propertyDetails.name,
                    location: propertyDetails.location,
                    type: propertyDetails.type,
                    image: propertyDetails.image,
                    total_floors: propertyDetails.total_floors,
                    floors: propertyData.floors || []
                });
            } else {
                setProperty(null);
                Alert.alert('Error', 'Property not found');
            }
        } catch (error) {
            console.error('Error loading property details:', error);
            Alert.alert('Error', 'Failed to load property details');
        } finally {
            setLoading(false);
        }
    };

    const handleUnitPress = (unit: any) => {
        setSelectedUnit(unit);
        bottomSheetModalRef.current?.present();
    };

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                animatedIndex={animatedIndex}
                animatedPosition={animatedPosition}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    const handleFloorChange = (floorNumber: number) => {
        if (property?.floors && property.floors.some((floor: any) => floor.floor_number === floorNumber)) {
            setCurrentFloor(floorNumber);
        }
    };

    // Render floor plan based on layout data
    const renderFloorPlan = () => {
        if (!property?.floors || property.floors.length === 0) {
            return (
                <View style={styles.errorContainer}>
                    <Text>No floor plans available</Text>
                </View>
            );
        }

        const currentFloorData = property.floors.find((floor: any) => floor.floor_number === currentFloor);
        if (!currentFloorData) {
            return (
                <View style={styles.errorContainer}>
                    <Text>Floor {currentFloor} not found</Text>
                </View>
            );
        }

        console.log("Current floor data:", currentFloorData);

        let layoutData;
        try {
            // Check if layout_data is already an object or needs parsing
            layoutData = typeof currentFloorData.layout_data === 'string'
                ? JSON.parse(currentFloorData.layout_data)
                : currentFloorData.layout_data;

            console.log("Parsed layout data:", layoutData);

            if (!layoutData || !layoutData.units || !Array.isArray(layoutData.units)) {
                throw new Error("Invalid layout data structure");
            }
        } catch (e) {
            console.error('Error parsing layout data:', e);
            return (
                <View style={styles.errorContainer}>
                    <Text>Error loading floor plan</Text>
                </View>
            );
        }

        const CELL_SIZE = 40;
        const GRID_SIZE = 8;

        return (
            <View style={styles.floorPlanContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className=""
                >
                    {property.floors.map((floor: any) => (
                        <TouchableOpacity
                            key={floor.floor_number}
                            style={[
                                styles.floorButton,
                                currentFloor === floor.floor_number && styles.activeFloorButton
                            ]}
                            onPress={() => handleFloorChange(floor.floor_number)}
                        >
                            <Text style={currentFloor === floor.floor_number ? styles.activeFloorText : {}}>
                                Floor {floor.floor_number}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Svg width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE} style={styles.floorPlanSvg}>
                    {layoutData.units.map((unit: any) => {
                        // Find the unit details
                        const unitDetails = currentFloorData.units?.find(
                            (u: any) => u.svg_id === unit.unitId.toString()
                        );

                        return (
                            <Rect
                                key={unit.unitId}
                                x={unit.position.x}
                                y={unit.position.y}
                                width={unit.dimensions.width}
                                height={unit.dimensions.height}
                                fill={unitDetails ? getUnitStatusColor(unitDetails.status) : "#cccccc"}
                                stroke="#000000"
                                strokeWidth={1}
                                onPress={() => unitDetails && handleUnitPress(unitDetails)}
                            />
                        );
                    })}
                </Svg>
            </View>
        );
    };

    const getUnitStatusColor = (status: string) => {
        switch (status) {
            case 'available': return '#4CAF50'; // Green
            case 'occupied': return '#F44336'; // Red
            case 'maintenance': return '#FFC107'; // Yellow
            case 'reserved': return '#2196F3'; // Blue
            default: return '#cccccc'; // Gray
        }
    };

    // Render tabs for Overview and Rooms
    // Replace the renderTabs function with this implementation using your custom Tabs
    const renderTabs = () => {
        return (
            <Tabs value={tabs} onValueChange={setTabs} className="w-full px-6">
                <TabsList className="w-full flex-row">
                    <TabsTrigger value="rooms">
                        <Text>Rooms</Text>
                    </TabsTrigger>
                    <TabsTrigger value="tenants">
                        <Text>Tenants</Text>
                    </TabsTrigger>
                    <TabsTrigger value="reports">
                        <Text>Reports</Text>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="rooms">
                    <ScrollView className="">
                        {renderFloorPlan()}
                    </ScrollView>
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
        );
    };

    if (loading || !property) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading property details...</Text>
            </View>
        );
    }

    return (
        <>
            <View style={styles.container}>
                {property.image ? (
                    <Image
                        source={{ uri: property.image }}
                        style={styles.propertyImage}
                        contentFit="cover"
                    />
                ) : (
                    <View style={[styles.propertyImage, styles.placeholderImage]}>
                        <Text>No Image</Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text variant="huge" className="font-semibold">
                        {property?.name || "No Name"}
                    </Text>
                    <View className="my-2" />
                    <Text variant="large">{property?.location || "No Location"}</Text>
                    <Text variant="large">{property?.type || "Unknown"} • {property?.total_floors || 0} floors</Text>
                </View>

                <View style={styles.tabsContainer}>
                    {renderTabs()}
                </View>

                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}
                    backdropComponent={renderBackdrop}
                    enablePanDownToClose={true}
                >
                    <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
                        {selectedUnit ? (
                            <>
                                <Text variant="large" style={styles.unitTitle}>{selectedUnit.unit_name}</Text>
                                <View style={styles.unitDetailRow}>
                                    <Text style={styles.detailLabel}>Block:</Text>
                                    <Text>{selectedUnit.block}</Text>
                                </View>
                                <View style={styles.unitDetailRow}>
                                    <Text style={styles.detailLabel}>Floor:</Text>
                                    <Text>{selectedUnit.floor_number}</Text>
                                </View>
                                <View style={styles.unitDetailRow}>
                                    <Text style={styles.detailLabel}>Area:</Text>
                                    <Text>{selectedUnit.area_sqm} sqm</Text>
                                </View>
                                <View style={styles.unitDetailRow}>
                                    <Text style={styles.detailLabel}>Bedrooms:</Text>
                                    <Text>{selectedUnit.bedrooms}</Text>
                                </View>
                                <View style={styles.unitDetailRow}>
                                    <Text style={styles.detailLabel}>Status:</Text>
                                    <Text style={{ color: getUnitStatusColor(selectedUnit.status) }}>
                                        {selectedUnit.status.charAt(0).toUpperCase() + selectedUnit.status.slice(1)}
                                    </Text>
                                </View>
                                <View style={styles.unitDetailRow}>
                                    <Text style={styles.detailLabel}>Rent:</Text>
                                    <Text>${selectedUnit.rent_amount} ({selectedUnit.payment_freq})</Text>
                                </View>

                                <Text variant="large" style={styles.sectionTitle}>Utilities</Text>
                                <View style={styles.utilitiesContainer}>
                                    <View style={styles.utilityItem}>
                                        <Text>Electricity: {selectedUnit.utilities.electricity ? '✓' : '✗'}</Text>
                                    </View>
                                    <View style={styles.utilityItem}>
                                        <Text>Water: {selectedUnit.utilities.water ? '✓' : '✗'}</Text>
                                    </View>
                                    <View style={styles.utilityItem}>
                                        <Text>WiFi: {selectedUnit.utilities.wifi ? '✓' : '✗'}</Text>
                                    </View>
                                </View>

                                {selectedUnit.meter_number && (
                                    <View style={styles.unitDetailRow}>
                                        <Text style={styles.detailLabel}>Meter Number:</Text>
                                        <Text>{selectedUnit.meter_number}</Text>
                                    </View>
                                )}

                                <View style={styles.unitDetailRow}>
                                    <Text style={styles.detailLabel}>Utilities in Rent:</Text>
                                    <Text>{selectedUnit.utility_in_rent ? 'Yes' : 'No'}</Text>
                                </View>

                                <View style={styles.unitDetailRow}>
                                    <Text style={styles.detailLabel}>Cost Allocation:</Text>
                                    <Text>{selectedUnit.cost_allocation.charAt(0).toUpperCase() + selectedUnit.cost_allocation.slice(1)}</Text>
                                </View>

                                {selectedUnit.notes && (
                                    <>
                                        <Text variant="large" style={styles.sectionTitle}>Notes</Text>
                                        <Text style={styles.notes}>{selectedUnit.notes}</Text>
                                    </>
                                )}

                                <View style={styles.buttonContainer}>
                                    <Button>Manage Unit</Button>
                                </View>
                            </>
                        ) : (
                            <Text>No unit selected</Text>
                        )}
                    </BottomSheetScrollView>
                </BottomSheetModal>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    propertyImage: {
        width: '100%',
        height: 256,
    },
    placeholderImage: {
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        padding: 16,
        marginBottom: 8,
    },
    tabsContainer: {
        flex: 1,
    },
    tabContent: {
        flex: 1,
    },
    card: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    buttonContainer: {
        padding: 16,
        gap: 12,
    },
    floorPlanContainer: {
        alignItems: 'center',
    },
    floorSelector: {
        flexDirection: 'row',
        marginBottom: 16,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    floorButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 8,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
    },
    activeFloorButton: {
        backgroundColor: '#2B4B80',
    },
    activeFloorText: {
        color: 'white',
    },
    floorPlanSvg: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    errorContainer: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomSheetContent: {
        padding: 16,
    },
    unitTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    unitDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    detailLabel: {
        fontWeight: '500',
        color: '#666',
    },
    sectionTitle: {
        marginTop: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    utilitiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 16,
    },
    utilityItem: {
        marginRight: 16,
        marginBottom: 8,
    },
    notes: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
});
