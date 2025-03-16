import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

type Subscription = {
  subscription: any | null;
  payments: any | null
  loading: boolean;
  getSubscriptions: () => void;
};

export interface Unit {
  svg_id?: string;
  svg_geom?: string;
  block: string;
  floor_number: number;
  unit_name: string;
  area_sqm: number;
  bedrooms: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  rent_amount: number;
  payment_freq: 'monthly' | 'quarterly' | 'biannual' | 'custom';
  utilities: {
    electricity: boolean;
    water: boolean;
    wifi: boolean;
  };
  meter_number: string;
  utility_in_rent: boolean;
  cost_allocation: 'landlord' | 'tenant';
  notes: string;
}

export interface FloorUnit {
  floor_no: number;
  units_ids: string[];
  units_total: number;
  layout_data: string;
  area: number;
  units: Unit[];
}

// New combined property store interfaces
export interface PropertyDetails {
  name: string;
  location: string;
  type: string;
  image: string;
  totalFloors: number;
}

export interface FloorPlan {
  floor: number;
  totalUnits: number;
  units: Array<{
    unitId: number;
    position: { x: number; y: number };
    floor: number;
    dimensions: { width: number; height: number };
  }>;
}

export interface PropertyStore {
  // Property details
  propertyDetails: PropertyDetails;
  
  // Floor plan data
  currentFloor: number;
  selectedUnits: number[];
  floorPlans: {
    [floor: number]: FloorPlan;
  };
  
  // Units data
  units: Unit[];
  
  // UI state
  message: string;
  isModalVisible: boolean;
  selectedUnitId: string | number;
  
  // Property details actions
  setPropertyDetails: (details: Partial<PropertyDetails>) => void;
  
  // Floor plan actions
  setCurrentFloor: (floor: number) => void;
  addUnit: (id: number) => void;
  removeUnit: (id: number) => void;
  incrementFloor: () => void;
  saveFloorPlan: (floorPlan: FloorPlan) => void;
  
  // Unit actions
  addUnitDetails: (unit: Unit) => void;
  setSelectedUnitId: (id: string | number) => void;
  setModalVisible: (visible: boolean) => void;
  setMessage: (message: string) => void;
  
  // Save all property data
  saveProperty: () => void;
  
  // Reset store
  resetStore: () => void;
}

export const usePayment = create<any>((set) => ({
  subscription: null,
  loading: false,
  getSubscriptions: async () => {
    const token = await AsyncStorage.getItem("accessToken");
    set({ loading: true });

    try {
      const response = await api.get("payments/plans/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ subscription: response.data, loading: false });
      console.log(response.data);
      console.log(api.getUri());
      
    } catch (error: any) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },

  getPayments: async () => {
    const token = await AsyncStorage.getItem("accessToken");
    set({ loading: true });

    try {
      const response = await api.get("payments/plans/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ plans: response.data, loading: false });
      console.log(response.data);
      console.log(api.getUri());
      
    } catch (error: any) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
}));

// Combined property store
export const usePropertyStore = create<PropertyStore>((set, get) => ({
  // Property details
  propertyDetails: {
    name: '',
    location: '',
    type: 'Room',
    image: '',
    totalFloors: 4
  },
  
  // Floor plan data
  currentFloor: 1,
  selectedUnits: [],
  floorPlans: {},
  
  // Units data
  units: [],
  
  // UI state
  message: '',
  isModalVisible: false,
  selectedUnitId: '',
  
  // Property details actions
  setPropertyDetails: (details) => set((state) => ({
    propertyDetails: { ...state.propertyDetails, ...details }
  })),
  
  // Floor plan actions
  setCurrentFloor: (floor) => set({ currentFloor: floor }),
  addUnit: (id) => set((state) => ({ 
    selectedUnits: [...state.selectedUnits, id] 
  })),
  removeUnit: (id) => set((state) => ({
    selectedUnits: state.selectedUnits.filter((unit) => unit !== id)
  })),
  incrementFloor: () => set((state) => ({ 
    currentFloor: state.currentFloor + 1 
  })),
  saveFloorPlan: (floorPlan) => set((state) => ({
    floorPlans: { ...state.floorPlans, [floorPlan.floor]: floorPlan }
  })),
  
  // Unit actions
  addUnitDetails: (unit) => set((state) => ({ 
    units: [...state.units, unit] 
  })),
  setSelectedUnitId: (id) => set({ selectedUnitId: id }),
  setModalVisible: (visible) => set({ isModalVisible: visible }),
  setMessage: (message) => set({ message }),
  
  // Save all property data
  saveProperty: async () => {
    const state = get();
    try {
      // Format data to match sample.json structure
      const propertyData = {
        property: {
          name: state.propertyDetails.name,
          location: state.propertyDetails.location,
          type: state.propertyDetails.type,
          image: state.propertyDetails.image,
          total_floors: state.propertyDetails.totalFloors
        },
        floors: Object.keys(state.floorPlans).map(floorKey => {
          const floor = Number(floorKey);
          const floorPlan = state.floorPlans[floor];
          
          // Get units for this floor
          const floorUnits = state.units.filter(unit => unit.floor_number === floor);
          
          return {
            floor_number: floor,
            units_total: floorPlan.totalUnits,
            layout_data: JSON.stringify(floorPlan),
            units: floorUnits.map(unit => ({
              block: unit.block,
              floor_number: unit.floor_number,
              unit_name: unit.unit_name,
              area_sqm: unit.area_sqm,
              bedrooms: unit.bedrooms,
              status: unit.status,
              rent_amount: unit.rent_amount,
              payment_freq: unit.payment_freq,
              utilities: unit.utilities,
              meter_number: unit.meter_number,
              utility_in_rent: unit.utility_in_rent,
              cost_allocation: unit.cost_allocation,
              notes: unit.notes,
              svg_id: unit.svg_id,
              svg_geom: unit.svg_geom
            }))
          };
        })
      };
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('propertyData', JSON.stringify(propertyData));
      console.log('Property data saved:', propertyData);
      
      // Here you would typically send this to your API
      // const token = await AsyncStorage.getItem("accessToken");
      // await api.post("properties/", propertyData, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      return propertyData;
    } catch (error) {
      console.error('Error saving property:', error);
      throw error;
    }
  },
  
  // Reset store
  resetStore: () => set({
    propertyDetails: {
      name: '',
      location: '',
      type: 'Room',
      image: '',
      totalFloors: 4
    },
    currentFloor: 1,
    selectedUnits: [],
    floorPlans: {},
    units: [],
    message: '',
    isModalVisible: false,
    selectedUnitId: ''
  })
}));

// Keep these for backward compatibility if needed
export const useUnitStore = usePropertyStore;
export const useFloorPlanStore = usePropertyStore;
