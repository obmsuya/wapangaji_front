import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert, ScrollView } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { useNavigation } from "expo-router";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { useFloorPlanStore } from "@/lib/zustand";

const GRID_SIZE = 8;
const CELL_SIZE = 40;

const FloorPlanDetails: React.FC = () => {
  const navigation = useNavigation();
  const {
    selectedUnits,
    addUnit,
    removeUnit,
    currentFloor,
    totalFloors,
    incrementFloor,
    saveFloorPlan
  } = useFloorPlanStore();

  const handleUnitSelection = (id: number) => {
    if (selectedUnits.includes(id)) {
      removeUnit(id);
    } else {
      addUnit(id);
    }
  };

  const saveFloorPlanUnits = () => {
    try {
      const floorPlanDetails = {
        floor: currentFloor,
        totalUnits: selectedUnits.length,
        units: selectedUnits.map(unitIndex => {
          const x = (unitIndex % GRID_SIZE) * CELL_SIZE;
          const y = Math.floor(unitIndex / GRID_SIZE) * CELL_SIZE;
          return {
            unitId: unitIndex,
            position: { x, y },
            floor: currentFloor,
            dimensions: {
              width: CELL_SIZE,
              height: CELL_SIZE
            }
          };
        })
      };

      saveFloorPlan(floorPlanDetails);
      console.log("Floor Plan Saved");
    //   navigation.navigate('UnitDetails', { 
    //     unitId: selectedUnits[0],
    //     floor: currentFloor 
    //   });
    } catch (e) {
      console.error(e);
    }
  };

  const addFloor = () => {
    if (currentFloor < totalFloors) {
      incrementFloor();
    } else {
      Alert.alert("Error", "Cannot add more floors than building allows");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Floor Details</Text>
      <Text style={{ textAlign: "center", marginVertical: 10 }}>
        Draw the units plans per floor. A box represents one unit on a floor.
      </Text>

      <Svg width={GRID_SIZE * CELL_SIZE} height={GRID_SIZE * CELL_SIZE}>
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => {
          const x = (index % GRID_SIZE) * CELL_SIZE;
          const y = Math.floor(index / GRID_SIZE) * CELL_SIZE;
          const isSelected = selectedUnits.includes(index);

          return (
            <Rect
              key={index}
              width={CELL_SIZE}
              height={CELL_SIZE}
              x={x}
              y={y}
              fill={isSelected ? "orange" : "gray"}
              stroke="black"
              strokeWidth={2}
              onPress={() => handleUnitSelection(index)}
            />
          );
        })}
      </Svg>

      <Button onPress={saveFloorPlanUnits}>Save Floor (next page)</Button>
      <Button onPress={addFloor}>Add Floor</Button>
    </ScrollView>
  );
};

export default FloorPlanDetails;
