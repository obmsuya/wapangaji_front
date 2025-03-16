import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert, ScrollView } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { usePropertyStore } from "@/lib/zustand";

const GRID_SIZE = 8;
const CELL_SIZE = 40;

const FloorPlanDetails: React.FC = () => {
  const {
    selectedUnits,
    addUnit,
    removeUnit,
    currentFloor,
    propertyDetails,
    floorPlans,
    saveFloorPlan,
    incrementFloor,
    setCurrentFloor
  } = usePropertyStore();

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
      console.log("Floor Plan Saved for floor", currentFloor);
    } catch (e) {
      console.error(e);
    }
  };

  const addFloor = () => {
    if (currentFloor < propertyDetails.totalFloors) {
      // Save current floor before moving to next
      saveFloorPlanUnits();
      incrementFloor();
    } else {
      Alert.alert("Error", "Cannot add more floors than building allows");
    }
  };

  const handleFloorChange = (floor: number) => {
    if (floor >= 1 && floor <= propertyDetails.totalFloors) {
      // Save current floor before changing
      saveFloorPlanUnits();
      setCurrentFloor(floor);
    }
  };

  // Load existing floor plan when floor changes
  useEffect(() => {
    // If we have data for this floor, load the selected units
    if (floorPlans[currentFloor]) {
      // Clear existing selections to avoid duplicates
      floorPlans[currentFloor].units.forEach(unit => {
        if (!selectedUnits.includes(unit.unitId)) {
          addUnit(unit.unitId);
        }
      });
    }
  }, [currentFloor]);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Floor Details</Text>
      <Text style={{ textAlign: "center", marginVertical: 10 }}>
        Draw the units plans per floor. A box represents one unit on a floor.
      </Text>
      
      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
        <Text>Current Floor: {currentFloor} of {propertyDetails.totalFloors}</Text>
      </View>

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

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 }}>
        <Button 
          onPress={() => handleFloorChange(currentFloor - 1)}
          disabled={currentFloor <= 1}
        >
          Previous Floor
        </Button>
        
        <Button 
          onPress={() => handleFloorChange(currentFloor + 1)}
          disabled={currentFloor >= propertyDetails.totalFloors}
        >
          Next Floor
        </Button>
      </View>

      <Button 
        onPress={saveFloorPlanUnits}
        style={{ marginTop: 10 }}
      >
        Save Floor Plan
      </Button>
    </ScrollView>
  );
};

export default FloorPlanDetails;
