import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Unit, usePropertyStore } from "@/lib/zustand";

import Svg, { Rect } from "react-native-svg";
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { useSharedValue } from "react-native-reanimated"

import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "../ui/Text";
import { Input } from "../ui/Input";
import { Picker } from '@react-native-picker/picker';
import { Checkbox } from "../ui/Checkbox"
import { Button } from "../ui/Button";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from 'react-native-toast-message';

const GRID_SIZE = 8;
const CELL_SIZE = 40;

interface UnitDetailsProps {
    onNext: () => void;
    onBack: () => void;
}

const UnitValidationSchema = Yup.object().shape({
    block: Yup.string().required('Block name is required'),
    floor_number: Yup.number().required('Floor number is required'),
    unit_name: Yup.string().required('Unit name is required'),
    area_sqm: Yup.number().required('Area is required'),
    bedrooms: Yup.number().required('Number of bedrooms is required'),
    status: Yup.string().oneOf(['available', 'occupied', 'maintenance', 'reserved']).required('Status is required'),
    rent_amount: Yup.number().required('Rent amount is required'),
    payment_freq: Yup.string().oneOf(['monthly', 'quarterly', 'biannual', 'custom']).required('Payment frequency is required'),
    utilities: Yup.object().shape({
        electricity: Yup.boolean(),
        water: Yup.boolean(),
        wifi: Yup.boolean(),
    }),
    meter_number: Yup.string(),
    utility_in_rent: Yup.boolean(),
    cost_allocation: Yup.string().oneOf(['landlord', 'tenant']).required('Cost allocation is required'),
    notes: Yup.string(),
});

export const UnitDetails: React.FC<UnitDetailsProps> = ({ onNext, onBack }) => {
    const {
        floorPlans,
        currentFloor,
        selectedUnits,
        units,
        addUnitDetails,
        setSelectedUnitId,
        selectedUnitId,
        setModalVisible,
        setCurrentFloor
    } = usePropertyStore();

    const [localSelectedUnitId, setLocalSelectedUnitId] = useState<number>(0);
    const [selectedFloorNumber, setSelectedFloorNumber] = useState<number>(currentFloor);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['75%', '100%'], []);

    const animatedIndex = useSharedValue(0);
    const animatedPosition = useSharedValue(0);

    const x = (localSelectedUnitId % GRID_SIZE) * CELL_SIZE;
    const y = Math.floor(localSelectedUnitId / GRID_SIZE) * CELL_SIZE;

    // Get all available floor numbers
    const floorNumbers = useMemo(() => {
        return Object.keys(floorPlans).map(Number).sort((a, b) => a - b);
    }, [floorPlans]);

    // callbacks
    const handlePresentModalPress = useCallback((floorNumber: number, unitId: number) => {
        setSelectedFloorNumber(floorNumber);
        setLocalSelectedUnitId(unitId);
        setSelectedUnitId(unitId.toString());
        setModalVisible(true);
        bottomSheetModalRef.current?.present();
    }, []);

    const handleDismissModalPress = useCallback(() => {
        setModalVisible(false);
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const renderBackdrop = useCallback(
        () => (
            <BottomSheetBackdrop
                animatedIndex={animatedIndex}
                animatedPosition={animatedPosition}
                disappearsOnIndex={1}
                appearsOnIndex={2}
                opacity={0.5}
            />
        ),
        []
    );

    const handleSubmitUnit = async (values: Unit) => {
        try {
            const unitData: Unit = {
                ...values,
                floor_number: selectedFloorNumber, // Use the selected floor number
                svg_id: localSelectedUnitId.toString(),
                svg_geom: `${x},${y}`,
            };
            // Add to property store
            addUnitDetails(unitData);
            console.log('Unit Data:', unitData);
            handleDismissModalPress();
            
            // Show success toast
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Unit details saved successfully',
            });
        } catch (error) {
            console.error('Error saving unit:', error);
        }
    };

    // Find existing unit data for the selected unit
    const findExistingUnitData = (floorNumber: number, unitId: number): Unit | undefined => {
        return units.find(unit =>
            unit.svg_id === unitId.toString() &&
            unit.floor_number === floorNumber
        );
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>
                Unit Details for All Floors
            </Text>
            
            {/* Floor tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    {floorNumbers.map((floorNumber) => (
                        <TouchableOpacity
                            key={`floor-tab-${floorNumber}`}
                            style={{
                                backgroundColor: selectedFloorNumber === floorNumber ? '#2B4B80' : '#e0e0e0',
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 8,
                                marginRight: 8
                            }}
                            onPress={() => setSelectedFloorNumber(floorNumber)}
                        >
                            <Text style={{ 
                                color: selectedFloorNumber === floorNumber ? 'white' : 'black',
                                fontWeight: selectedFloorNumber === floorNumber ? 'bold' : 'normal'
                            }}>
                                Floor {floorNumber}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            
            {/* Display units for the selected floor */}
            {floorPlans[selectedFloorNumber] ? (
                <View style={{ alignItems: "center" }}>
                    <Text style={{ marginVertical: 10 }}>
                        Floor {selectedFloorNumber} - Units: {floorPlans[selectedFloorNumber].units.length}
                    </Text>

                    <Svg width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE}>
                        {floorPlans[selectedFloorNumber].units.map((unit) => {
                            const x = (unit.unitId % GRID_SIZE) * CELL_SIZE;
                            const y = Math.floor(unit.unitId / GRID_SIZE) * CELL_SIZE;

                            // Check if this unit has details filled
                            const hasDetails = units.some(u =>
                                u.svg_id === unit.unitId.toString() &&
                                u.floor_number === selectedFloorNumber
                            );

                            return (
                                <Rect
                                    key={unit.unitId}
                                    width={CELL_SIZE}
                                    height={CELL_SIZE}
                                    x={x}
                                    y={y}
                                    fill={hasDetails ? "green" : "orange"}
                                    stroke="black"
                                    strokeWidth={2}
                                    onPress={() => handlePresentModalPress(selectedFloorNumber, unit.unitId)}
                                />
                            );
                        })}
                    </Svg>
                </View>
            ) : (
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text>No floor plan available for Floor {selectedFloorNumber}</Text>
                </View>
            )}

            {/* Floor summary */}
            <View style={{ marginTop: 24, marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>Floor Summary</Text>
                
                {floorNumbers.map((floorNumber) => {
                    const floorPlan = floorPlans[floorNumber];
                    const floorUnitCount = floorPlan?.units.length || 0;
                    const detailedUnitsCount = units.filter(u => u.floor_number === floorNumber).length;
                    
                    return (
                        <View key={`summary-${floorNumber}`} style={{ 
                            flexDirection: 'row', 
                            justifyContent: 'space-between',
                            padding: 12,
                            backgroundColor: '#f5f5f5',
                            borderRadius: 8,
                            marginBottom: 8
                        }}>
                            <Text>Floor {floorNumber}</Text>
                            <Text>Units: {detailedUnitsCount}/{floorUnitCount}</Text>
                        </View>
                    );
                })}
            </View>

            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Button onPress={onBack}>Back</Button>
                <Button onPress={onNext}>Next</Button>
            </View>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}
                onDismiss={handleDismissModalPress}
                enableDynamicSizing={true}
                enablePanDownToClose={true}
                enableHandlePanningGesture={true}
                enableDismissOnClose={true}
                backdropComponent={renderBackdrop}
            >
                <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps="always"
                        enableOnAndroid={true}
                        enableAutomaticScroll={true}
                        enableResetScrollToCoords={true}
                        className="flex-1"
                    >
                        <Text variant="large" className="text-center my-2">
                            Unit Details for Floor {selectedFloorNumber}, Unit {localSelectedUnitId}
                        </Text>

                        <Formik
                            initialValues={findExistingUnitData(selectedFloorNumber, localSelectedUnitId) || {
                                block: '',
                                floor_number: selectedFloorNumber,
                                unit_name: '',
                                area_sqm: 0,
                                bedrooms: 0,
                                status: 'available',
                                rent_amount: 0,
                                payment_freq: 'monthly',
                                utilities: {
                                    electricity: false,
                                    water: false,
                                    wifi: false,
                                },
                                meter_number: '',
                                utility_in_rent: false,
                                cost_allocation: 'landlord',
                                notes: '',
                            }}
                            validationSchema={UnitValidationSchema}
                            onSubmit={handleSubmitUnit}
                            enableReinitialize
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                <View className="gap-4">
                                    <View className="w-full gap-2">
                                        <Text>Block Name</Text>
                                        <Input
                                            placeholder="Enter block name"
                                            onChangeText={handleChange('block')}
                                            onBlur={handleBlur('block')}
                                            value={values.block}
                                        />
                                        {errors.block && touched.block && (
                                            <Text className="text-red-500 text-sm">{errors.block}</Text>
                                        )}
                                    </View>

                                    <View className="flex flex-row gap-2">
                                        <View className="w-[48%] gap-2">
                                            <Text>Floor No.</Text>
                                            <Input
                                                placeholder="Floor number"
                                                onChangeText={handleChange('floor_number')}
                                                onBlur={handleBlur('floor_number')}
                                                value={`${values.floor_number}`}
                                                keyboardType="numeric"
                                            />
                                            {errors.floor_number && touched.floor_number && (
                                                <Text className="text-red-500 text-sm">{errors.floor_number}</Text>
                                            )}
                                        </View>
                                        <View className="w-[48%] gap-2">
                                            <Text>Unit Name</Text>
                                            <Input
                                                placeholder="Enter unit name"
                                                onChangeText={handleChange('unit_name')}
                                                onBlur={handleBlur('unit_name')}
                                                value={values.unit_name}
                                            />
                                            {errors.unit_name && touched.unit_name && (
                                                <Text className="text-red-500 text-sm">{errors.unit_name}</Text>
                                            )}
                                        </View>
                                    </View>

                                    <View className="w-full gap-2">
                                        <Text>Floor area (sqm)</Text>
                                        <Input
                                            placeholder=""
                                            onChangeText={handleChange('area_sqm')}
                                            onBlur={handleBlur('area_sqm')}
                                            value={`${values.area_sqm}`}
                                            keyboardType="numeric"
                                        />
                                        {errors.area_sqm && touched.area_sqm && (
                                            <Text className="text-red-500 text-sm">{errors.area_sqm}</Text>
                                        )}
                                    </View>

                                    <View className="w-full gap-2">
                                        <Text>Bedrooms</Text>
                                        <Input
                                            placeholder=""
                                            onChangeText={handleChange('bedrooms')}
                                            onBlur={handleBlur('bedrooms')}
                                            value={`${values.bedrooms}`}
                                            keyboardType="numeric"
                                        />
                                        {errors.bedrooms && touched.bedrooms && (
                                            <Text className="text-red-500 text-sm">{errors.bedrooms}</Text>
                                        )}
                                    </View>

                                    <View className="w-full gap-2">
                                        <Text>Status</Text>
                                        <View className="border border-gray-300 rounded-md">
                                            <Picker
                                                selectedValue={values.status}
                                                onValueChange={(itemValue) => setFieldValue('status', itemValue)}
                                            >
                                                <Picker.Item label="Available" value="available" />
                                                <Picker.Item label="Occupied" value="occupied" />
                                                <Picker.Item label="Maintenance" value="maintenance" />
                                                <Picker.Item label="Reserved" value="reserved" />
                                            </Picker>
                                        </View>
                                        {errors.status && touched.status && (
                                            <Text className="text-red-500 text-sm">{errors.status}</Text>
                                        )}
                                    </View>

                                    <View className="w-full gap-2">
                                        <Text>Rent Amount</Text>
                                        <Input
                                            placeholder=""
                                            onChangeText={handleChange('rent_amount')}
                                            onBlur={handleBlur('rent_amount')}
                                            value={`${values.rent_amount}`}
                                            keyboardType="numeric"
                                        />
                                        {errors.rent_amount && touched.rent_amount && (
                                            <Text className="text-red-500 text-sm">{errors.rent_amount}</Text>
                                        )}
                                    </View>

                                    <View className="w-full gap-2">
                                        <Text>Payment Frequency</Text>
                                        <View className="border border-gray-300 rounded-md">
                                            <Picker
                                                selectedValue={values.payment_freq}
                                                onValueChange={(itemValue) => setFieldValue('payment_freq', itemValue)}
                                            >
                                                <Picker.Item label="Monthly" value="monthly" />
                                                <Picker.Item label="Quarterly" value="quarterly" />
                                                <Picker.Item label="Biannual" value="biannual" />
                                                <Picker.Item label="Custom" value="custom" />
                                            </Picker>
                                        </View>
                                        {errors.payment_freq && touched.payment_freq && (
                                            <Text className="text-red-500 text-sm">{errors.payment_freq}</Text>
                                        )}
                                    </View>

                                    <View className="w-full gap-2">
                                        <Text>Utilities</Text>
                                        <View className="flex-row gap-4">
                                            <View className="flex gap-2 flex-row items-center">
                                                <Checkbox
                                                    checked={values.utilities.electricity}
                                                    onCheckedChange={(checked) =>
                                                        setFieldValue('utilities.electricity', checked)
                                                    }
                                                />
                                                <Text>Electricity</Text>
                                            </View>
                                            <View className="flex gap-2 flex-row items-center">
                                                <Checkbox
                                                    checked={values.utilities.water}
                                                    onCheckedChange={(checked) =>
                                                        setFieldValue('utilities.water', checked)
                                                    }
                                                />
                                                <Text>Water</Text>
                                            </View>
                                            <View className="flex gap-2 flex-row items-center">
                                                <Checkbox
                                                    checked={values.utilities.wifi}
                                                    onCheckedChange={(checked) =>
                                                        setFieldValue('utilities.wifi', checked)
                                                    }
                                                />
                                                <Text>WiFi</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="w-full gap-2">
                                        <Text>Meter Number</Text>
                                        <Input
                                            placeholder="Enter meter number"
                                            onChangeText={handleChange('meter_number')}
                                            onBlur={handleBlur('meter_number')}
                                            value={values.meter_number}
                                        />
                                        {errors.meter_number && touched.meter_number && (
                                            <Text className="text-red-500 text-sm">{errors.meter_number}</Text>
                                        )}
                                    </View>

                                    <View className="flex gap-2 flex-row items-center">
                                        <Checkbox
                                            checked={values.utility_in_rent}
                                            onCheckedChange={(checked) =>
                                                setFieldValue('utility_in_rent', checked)}
                                        />
                                        <Text>Utility included in rent</Text>
                                    </View>

                                    <View className="w-full gap-2">
                                        <Text>Cost allocation</Text>
                                        <View className="border border-gray-300 rounded-md">
                                            <Picker
                                                selectedValue={values.cost_allocation}
                                                onValueChange={(itemValue) =>
                                                    setFieldValue('cost_allocation', itemValue)}
                                            >
                                                <Picker.Item label="Landlord" value="landlord" />
                                                <Picker.Item label="Tenant" value="tenant" />
                                            </Picker>
                                        </View>
                                    </View>

                                    <View className="w-full gap-2">
                                        <Text>Notes</Text>
                                        <Input
                                            placeholder=""
                                            onChangeText={handleChange('notes')}
                                            onBlur={handleBlur('notes')}
                                            value={values.notes}
                                            multiline={true}
                                            numberOfLines={4}
                                            className="h-20 text-start"
                                        />
                                        {errors.notes && touched.notes && (
                                            <Text className="text-red-500 text-sm">{errors.notes}</Text>
                                        )}
                                    </View>

                                    <Button onPress={() => handleSubmit()}>Save Unit</Button>
                                </View>
                            )}
                        </Formik>
                    </KeyboardAwareScrollView>
                </BottomSheetScrollView>
            </BottomSheetModal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        gap: 16,
        zIndex: 1000,
        width: "100%",
        paddingHorizontal: 16,
    },
});
