import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const MAX_SPOTS = 12;

export function getOccupancyDetails(booked: number) {
  const freeSpots = MAX_SPOTS - booked;

  if (freeSpots > 8) {
    return { color: "bg-orange-300", textColor: "text-orange-800", label: "Almost empty" };
  }
  if (freeSpots > 4) {
    return { color: "bg-orange-400", textColor: "text-orange-900", label: "Partially full" };
  }
  if (freeSpots > 0) {
    return { color: "bg-orange-500", textColor: "text-white", label: "Filling up" };
  }
  return { color: "bg-red-600", textColor: "text-white", label: "Full" };
}
