import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Unit, useFloorPlanStore, useUnitStore } from "@/lib/zustand";

import Svg, { Rect } from "react-native-svg";
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { useSharedValue } from "react-native-reanimated"

import { View, ScrollView, StyleSheet } from "react-native";
import { Text } from "../ui/Text";
import { Input } from "../ui/Input";
import { Picker } from '@react-native-picker/picker';
import { Checkbox } from "../ui/Checkbox"
import { Button } from "../ui/Button";

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

export const UnitDetails: React.FC<UnitDetailsProps> = () => {
    const { floorPlans, currentFloor, selectedUnits } = useFloorPlanStore();
    const { units, addUnit } = useUnitStore();
    
    const [selectedUnitId, setSelectedUnitId] = useState(0);
    const currentFloorPlan = floorPlans[currentFloor];

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['75%', '100%'], []);

    const animatedIndex = useSharedValue(0);
    const animatedPosition = useSharedValue(0);

    const x = (selectedUnitId % GRID_SIZE) * CELL_SIZE;
    const y = Math.floor(selectedUnitId / GRID_SIZE) * CELL_SIZE;

    React.useEffect(() => {
        console.log(floorPlans)
    }, [])

    // callbacks
    const handlePresentModalPress = useCallback((unitId: any) => {
        setSelectedUnitId(unitId)
        bottomSheetModalRef.current?.present();
    }, []);

    const handleDismissModalPress = useCallback(() => {
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
                svg_id: selectedUnitId ? selectedUnitId.toString() : '',
                svg_geom: `${x},${y}`,
            };
            // Add to your store or API here
            addUnit(unitData)
            console.log('Unit Data:', unitData);
            handleDismissModalPress();
        } catch (error) {
            console.error('Error saving unit:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Unit Details</Text>
            <Text style={{ marginVertical: 10 }}>
                Floor {currentFloor} - Selected Units: {selectedUnits.length}
            </Text>

            <Svg width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE}>
                {currentFloorPlan?.units.map((unit) => {
                    const x = (unit.unitId % GRID_SIZE) * CELL_SIZE;
                    const y = Math.floor(unit.unitId / GRID_SIZE) * CELL_SIZE;
                    
                    return (
                        <Rect
                            key={unit.unitId}
                            width={CELL_SIZE}
                            height={CELL_SIZE}
                            x={x}
                            y={y}
                            fill="orange"
                            stroke="black"
                            strokeWidth={2}
                            onPress={() => handlePresentModalPress(unit.unitId)}
                        />
                    );
                })}
            </Svg>

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
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="always"
                    enableOnAndroid={true}
                    enableAutomaticScroll={true}
                    enableResetScrollToCoords={true}
                >
                    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                        <Text variant="large" className="text-center my-2">Unit Details</Text>

                        <Formik
                            initialValues={{
                                block: '',
                                floor_number: currentFloor,
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

                                    {/* Continue with other fields following the same pattern */}
                                    <View className="flex flex-row gap-4">
                                        <View className="flex gap-2 flex-row items-center">
                                            <Checkbox
                                                checked={values.utilities.electricity}
                                                onCheckedChange={(checked) =>
                                                    setFieldValue('utilities.electricity', checked)}
                                            />
                                            <Text>Electricity</Text>
                                        </View>
                                        <View className="flex gap-2 flex-row items-center">
                                            <Checkbox
                                                checked={values.utilities.water}
                                                onCheckedChange={(checked) =>
                                                    setFieldValue('utilities.water', checked)}
                                            />
                                            <Text>Water</Text>
                                        </View>
                                        <View className="flex gap-2 flex-row items-center">
                                            <Checkbox
                                                checked={values.utilities.wifi}
                                                onCheckedChange={(checked) =>
                                                    setFieldValue('utilities.wifi', checked)}
                                            />
                                            <Text>Wifi</Text>
                                        </View>
                                    </View>

                                    <View className="flex flex-row gap-4">
                                        <View className="w-[48%] gap-2">
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

                                        <View className="w-[48%] gap-2">
                                            <Text>Status</Text>
                                            <Picker
                                                selectedValue={values.status}
                                                onValueChange={(itemValue, itemIndex) =>
                                                    setFieldValue('status', itemValue)}
                                            >
                                                <Picker.Item label="Available" value="available" />
                                                <Picker.Item label="Occupied" value="occupied" />
                                                <Picker.Item label="maintenance" value="maintenance" />
                                            </Picker>
                                        </View>
                                    </View>

                                    <View className="flex flex-row gap-4">
                                        <View className="w-[48%] gap-2">
                                            <Text>Rent</Text>
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

                                        <View className="w-[48%] gap-2">
                                            <Text>Payment Frequency</Text>
                                            <Picker
                                                selectedValue={values.payment_freq}
                                                onValueChange={(itemValue, itemIndex) =>
                                                    setFieldValue('payment_freq', itemValue)}
                                            >
                                                <Picker.Item label="Monthly" value="monthly" />
                                                <Picker.Item label="Quarterly" value="quarterly" />
                                                <Picker.Item label="Biannual" value="biannual" />
                                            </Picker>
                                        </View>
                                    </View>

                                    <View className="w-full gap-2">
                                        <Text>Meter No.</Text>
                                        <Input
                                            placeholder=""
                                            onChangeText={handleChange('meter_number')}
                                            onBlur={handleBlur('meter_number')}
                                            value={`${values.meter_number}`}
                                            keyboardType="numeric"
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
                                        <Picker
                                            selectedValue={values.cost_allocation}
                                            onValueChange={(itemValue, itemIndex) =>
                                                setFieldValue('cost_allocation', itemValue)}
                                        >
                                            <Picker.Item label="Landlord" value="landlord" />
                                            <Picker.Item label="Tenant" value="tenant" />
                                        </Picker>
                                    </View>

                                    <View className="w-full gap-2">
                                        <Text>Notes</Text>
                                        <Input
                                            placeholder=""
                                            onChangeText={handleChange('notes')}
                                            onBlur={handleBlur('notes')}
                                            value={`${values.notes}`}
                                        />
                                        {errors.notes && touched.notes && (
                                            <Text className="text-red-500 text-sm">{errors.notes}</Text>
                                        )}
                                    </View>

                                    <Button onPress={() => handleSubmit()}>Save Unit</Button>
                                </View>
                            )}
                        </Formik>
                    </BottomSheetScrollView>
                </KeyboardAwareScrollView>
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