import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Alert, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { HousePlus, Plus } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import PropertyCard from "@/components/property-card";

interface Property {
  id: string;
  name: string;
  location: string;
  type: string;
  image: string;
  total_floors: number;
}

export default function PropertiesScreen() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch from API
      // For now, we'll load from AsyncStorage
      const propertyDataString = await AsyncStorage.getItem('propertyData');

      if (propertyDataString) {
        const propertyData = JSON.parse(propertyDataString);
        // Convert to array format if it's a single property
        const propertyArray = Array.isArray(propertyData)
          ? propertyData
          : [{
            id: '1',
            ...propertyData.property,
            total_floors: propertyData.property.total_floors
          }];

        setProperties(propertyArray);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      Alert.alert('Error', 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = () => {
    router.push('(user)/(property)/add-property');
  };

  const renderPropertyItem = ({ item }: { item: Property }) => (
    <PropertyCard
      id={item.id}
      name={item.name}
      location={item.location}
      type={item.type}
      image={item.image}
      total_floors={item.total_floors}
    />
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Properties",
            headerRight: () => (
              <Button
                variant="ghost"
                onPress={handleAddProperty}
                icon={<Plus color="#2B4B80" size={24} />}
              />
            ),
          }}
        />


        <Pressable
          className="my-[5%]"
          onPress={() => router.push("(user)/(property)/add-property")}
        >
          <View className="mt-4 w-16 h-16 p-4 rounded-full bg-primary items-center justify-center self-center">
            <HousePlus
              color="#ffffff"
              size={28}
            />
          </View>
          <Text className="text-center text-xl mt-4">App Property</Text>
        </Pressable>

        <View>
          {properties.length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <Text variant="large" className="text-center mb-4">No Properties Yet</Text>
              <Text className="text-center mb-6">Add your first property to get started</Text>
              <Button onPress={handleAddProperty}>
                Add Property
              </Button>
            </View>
          ) : (
            <FlatList
              data={properties}
              renderItem={renderPropertyItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              refreshing={loading}
              onRefresh={loadProperties}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});