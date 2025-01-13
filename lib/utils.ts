import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Constants from "expo-constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const base_url = `http://${Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':8000')}`;