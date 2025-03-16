import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { Image } from 'expo-image';
import { usePropertyStore } from '@/lib/zustand';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";

interface PropertySummaryProps {
  onBack: () => void;
}

const PropertySummary: React.FC<PropertySummaryProps> = ({ onBack }) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { propertyDetails, floorPlans, units, saveProperty, resetStore } = usePropertyStore();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const savedData = await saveProperty();
      Alert.alert(
        'Success',
        'Property created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              resetStore();
              // @ts-ignore
              router.replace('(user)/(tabs)');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error saving property:', error);
      Alert.alert('Error', 'Failed to save property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Count total units across all floors
  const totalUnits = Object.values(floorPlans).reduce(
    (total, floorPlan) => total + floorPlan.totalUnits,
    0
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="huge" className="text-center mb-6">Property Summary</Text>

      <View style={styles.section}>
        <Text variant="large" className="mb-2">Property Details</Text>
        <View style={styles.card}>
          {propertyDetails.image ? (
            <Image
              source={{ uri: propertyDetails.image }}
              style={styles.propertyImage}
              contentFit="cover"
            />
          ) : null}
          <View style={styles.detailsRow}>
            <Text className="font-bold">Name:</Text>
            <Text>{propertyDetails.name}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text className="font-bold">Location:</Text>
            <Text>{propertyDetails.location}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text className="font-bold">Type:</Text>
            <Text>{propertyDetails.type}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text className="font-bold">Total Floors:</Text>
            <Text>{propertyDetails.totalFloors}</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text className="font-bold">Total Units:</Text>
            <Text>{totalUnits}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="large" className="mb-2">Floor Summary</Text>
        {Object.entries(floorPlans).map(([floorNumber, floorPlan]) => (
          <View key={floorNumber} style={styles.card}>
            <Text className="font-bold">Floor {floorNumber}</Text>
            <View style={styles.detailsRow}>
              <Text>Total Units:</Text>
              <Text>{floorPlan.totalUnits}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text>Units with Details:</Text>
              <Text>
                {units.filter(unit => unit.floor_number === parseInt(floorNumber)).length} / {floorPlan.totalUnits}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={onBack} variant="outline">
          Back
        </Button>
        <Button onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Create Property'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  propertyImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default PropertySummary;