export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area_sqrt: number;
  address: string;
  city: string;
  latitude: number;
  longitube: number;
  images: string[];
  is_featured: boolean;
  is_sold: boolean;
  created_at?: string;
}

export type PropertyType = "apartment" | "villa" | "house" | "studio";
