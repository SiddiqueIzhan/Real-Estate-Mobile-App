import { PropertyType } from "@/types/properties";
import { create } from "zustand";

interface FilterStoreType {
  search: string;
  type: PropertyType;
  bedrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  setSearch: (value: string) => void;
  setType: (value: PropertyType | null) => void;
  setBedrooms: (value: number | null) => void;
  setMinPrice: (value: number | null) => void;
  setMaxPrice: (value: number | null) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStoreType>((set) => ({
  search: "",
  type: null,
  bedrooms: null,
  minPrice: null,
  maxPrice: null,

  setSearch: (value: string) => set({ search: value }),
  setType: (value: PropertyType | null) => set({ type: value }),
  setBedrooms: (value: number | null) => set({ bedrooms: value }),
  setMinPrice: (value: number | null) => set({ minPrice: value }),
  setMaxPrice: (value: number | null) => set({ maxPrice: value }),
  resetFilters: () =>
    set({
      search: "",
      type: null,
      bedrooms: null,
      minPrice: null,
      maxPrice: null,
    }),
}));
