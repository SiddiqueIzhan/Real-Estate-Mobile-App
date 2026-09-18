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
  isFeatured: boolean;
  isSold: boolean;
  createdAt?: Date;
}

enum PropertyType {
  apartment,
  villa,
  house,
  studio,
}
