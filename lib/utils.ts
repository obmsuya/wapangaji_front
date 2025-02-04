import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Constants from "expo-constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const base_url = `https://8614-41-220-132-172.ngrok-free.app`;