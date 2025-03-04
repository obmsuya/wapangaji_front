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

interface FloorUnit {
  floor_no: number;
  units_ids: string[];
  units_total: number;
  layout_data: string;
  area: number;
  units: Unit[];
}

interface UnitStore {
  units: Unit[];
  floorUnits: FloorUnit[];
  currentFloor: number;
  totalFloors: number;
  selectedUnitId: string;
  message: string;
  isModalVisible: boolean;
  
  setUnits: (units: Unit[]) => void;
  addUnit: (unit: Unit) => void;
  setFloorUnits: (floorUnits: FloorUnit[]) => void;
  setCurrentFloor: (floor: number) => void;
  setTotalFloors: (floors: number) => void;
  setSelectedUnitId: (id: string) => void;
  setMessage: (message: string) => void;
  setModalVisible: (visible: boolean) => void;
  saveFloor: () => void;
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

export const useUnitStore = create<UnitStore>((set, get) => ({
  units: [],
  floorUnits: [],
  currentFloor: 0,
  totalFloors: 0,
  selectedUnitId: '',
  message: '',
  isModalVisible: false,

  setUnits: (units) => set({ units }),
  addUnit: (unit) => set((state) => ({ units: [...state.units, unit] })),
  setFloorUnits: (floorUnits) => set({ floorUnits }),
  setCurrentFloor: (floor) => set({ currentFloor: floor }),
  setTotalFloors: (floors) => set({ totalFloors: floors }),
  setSelectedUnitId: (id) => set({ selectedUnitId: id }),
  setMessage: (message) => set({ message }),
  setModalVisible: (visible) => set({ isModalVisible: visible }),
  
  saveFloor: () => {
    const state = get();
    try {
      // Save to AsyncStorage instead of localStorage
      const floorData = {
        floor_no: state.currentFloor,
        units: state.units,
        floorUnits: state.floorUnits,
        totalFloors: state.totalFloors,
        selectedUnitId: state.selectedUnitId,
        message: state.message,
        isModalVisible: state.isModalVisible,
      };
      // Implementation of saving to AsyncStorage would go here
      console.log(floorData)
    } catch (error) {
      console.error('Error saving floor:', error);
    }
  },
}));


interface FloorPlanStore {
  selectedUnits: number[];
  currentFloor: number;
  totalFloors: number;
  floorPlans: {
    [floor: number]: {
      units: Array<{
        unitId: number;
        position: { x: number; y: number };
        floor: number;
        dimensions: { width: number; height: number };
      }>;
    };
  };
  addUnit: (id: number) => void;
  removeUnit: (id: number) => void;
  incrementFloor: () => void;
  saveFloorPlan: (floorPlan: any) => void;
}

export const useFloorPlanStore = create<FloorPlanStore>((set) => ({
  selectedUnits: [],
  currentFloor: 1,
  totalFloors: 4,
  floorPlans: {},
  addUnit: (id) =>
    set((state) => ({ selectedUnits: [...state.selectedUnits, id] })),
  removeUnit: (id) =>
    set((state) => ({
      selectedUnits: state.selectedUnits.filter((unit) => unit !== id),
    })),
  incrementFloor: () =>
    set((state) => ({ currentFloor: state.currentFloor + 1 })),
  saveFloorPlan: (floorPlan) =>
    set((state) => ({
      floorPlans: { ...state.floorPlans, [floorPlan.floor]: floorPlan },
    })),
}));
