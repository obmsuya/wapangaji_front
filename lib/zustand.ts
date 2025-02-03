import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

type Subscription = {
  subscription: any | null;
  payments: any | null
  loading: boolean;
  getSubscriptions: () => void;
};

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
