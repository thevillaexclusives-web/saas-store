export interface Property {
  id: string;
  name: string;
  type: "Villa" | "Apartment" | "Townhouse" | "Condo" | "House";
  location: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  period: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  reviewCount: number;
  image: string;
  features: string[];
  isFeatured?: boolean;
  // Detail page fields
  description?: string;
  gallery?: string[];
  amenities?: Amenity[];
  host?: Host;
  yearBuilt?: number;
  areaSqm?: number;
  highlights?: string[];
}

export interface Amenity {
  name: string;
  icon: string;
  category: "essentials" | "outdoor" | "entertainment" | "safety";
}

export interface Host {
  name: string;
  avatar: string;
  responseRate: number;
  responseTime: string;
  superhost: boolean;
  joined: string;
}

export interface Category {
  name: string;
  icon: string;
  count: number;
}

export const categories: Category[] = [
  { name: "All Properties", icon: "layout-grid", count: 649 },
  { name: "Villa", icon: "home", count: 234 },
  { name: "Apartment", icon: "building-2", count: 187 },
  { name: "Townhouse", icon: "house", count: 98 },
  { name: "Condo", icon: "building", count: 85 },
  { name: "House", icon: "warehouse", count: 45 },
];

export const properties: Property[] = [
  {
    id: "1",
    name: "Five Palm Jumeirah Beachfront Villa - Pool, Jacuzzi",
    type: "Villa",
    location: "Palm Jumeirah",
    city: "Dubai",
    country: "UAE",
    price: 1920,
    currency: "USD",
    period: "night",
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    rating: 4.6,
    reviewCount: 24,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
    features: ["Pool", "Jacuzzi", "Beach Access", "Sea View"],
    isFeatured: true,
    description: "Experience unparalleled luxury at this stunning beachfront villa on the iconic Palm Jumeirah. Featuring a private infinity pool overlooking the Arabian Gulf, a state-of-the-art jacuzzi, and direct beach access, this residence offers the ultimate Dubai retreat. The open-plan living area seamlessly connects to expansive outdoor terraces, while four elegantly appointed bedrooms provide serene comfort. Enjoy world-class dining, spa facilities, and the vibrant energy of Palm Jumeirah steps from your door.",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { name: "Private Pool", icon: "waves", category: "outdoor" },
      { name: "Jacuzzi", icon: "sparkles", category: "outdoor" },
      { name: "Beach Access", icon: "umbrella", category: "outdoor" },
      { name: "Air Conditioning", icon: "thermometer", category: "essentials" },
      { name: "High-Speed WiFi", icon: "wifi", category: "essentials" },
      { name: "Full Kitchen", icon: "cooking-pot", category: "essentials" },
      { name: "Smart TV", icon: "tv", category: "entertainment" },
      { name: "BBQ Grill", icon: "flame", category: "outdoor" },
      { name: "Security System", icon: "shield", category: "safety" },
      { name: "Parking", icon: "car", category: "essentials" },
      { name: "Gym Access", icon: "dumbbell", category: "entertainment" },
      { name: "Concierge", icon: "bell", category: "essentials" },
    ],
    host: {
      name: "Rashid Al Maktoum",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      responseRate: 98,
      responseTime: "within 1 hour",
      superhost: true,
      joined: "2019",
    },
    yearBuilt: 2021,
    areaSqm: 450,
    highlights: ["Beachfront location", "Recently renovated", "Award-winning design", "24/7 concierge"],
  },
  {
    id: "2",
    name: "Two Bedroom Arabian Summerhouse Family Suite",
    type: "Villa",
    location: "Jumeirah Beach",
    city: "Dubai",
    country: "UAE",
    price: 890,
    currency: "USD",
    period: "night",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    rating: 3.2,
    reviewCount: 12,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    features: ["Pool", "Garden", "Family Friendly"],
    description: "A perfect family getaway in the heart of Jumeirah Beach. This two-bedroom suite offers spacious living with traditional Arabian design elements blended with modern comforts. The lush private garden leads to a shared pool area, and the beach is just a short walk away.",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { name: "Shared Pool", icon: "waves", category: "outdoor" },
      { name: "Garden", icon: "trees", category: "outdoor" },
      { name: "Air Conditioning", icon: "thermometer", category: "essentials" },
      { name: "WiFi", icon: "wifi", category: "essentials" },
      { name: "Full Kitchen", icon: "cooking-pot", category: "essentials" },
      { name: "Smart TV", icon: "tv", category: "entertainment" },
      { name: "Parking", icon: "car", category: "essentials" },
    ],
    host: {
      name: "Fatima Hassan",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
      responseRate: 92,
      responseTime: "within 2 hours",
      superhost: false,
      joined: "2021",
    },
    yearBuilt: 2018,
    areaSqm: 280,
    highlights: ["Family friendly", "Near beach", "Traditional design"],
  },
  {
    id: "3",
    name: "Beach Front Villa in Five Palm Jumeirah Hotel",
    type: "Villa",
    location: "Palm Jumeirah",
    city: "Dubai",
    country: "UAE",
    price: 750,
    currency: "USD",
    period: "night",
    guests: 6,
    bedrooms: 2,
    bathrooms: 2,
    rating: 5.0,
    reviewCount: 8,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop",
    features: ["Beach Front", "Hotel Services", "Sea View"],
    description: "Wake up to breathtaking sea views from this premium beachfront villa within the Five Palm Jumeirah Hotel. Enjoy full hotel services including room service, spa access, and valet parking while having the privacy and space of your own villa.",
    gallery: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { name: "Beach Access", icon: "umbrella", category: "outdoor" },
      { name: "Room Service", icon: "bell", category: "essentials" },
      { name: "Spa Access", icon: "sparkles", category: "entertainment" },
      { name: "Air Conditioning", icon: "thermometer", category: "essentials" },
      { name: "WiFi", icon: "wifi", category: "essentials" },
      { name: "Smart TV", icon: "tv", category: "entertainment" },
      { name: "Valet Parking", icon: "car", category: "essentials" },
      { name: "Security", icon: "shield", category: "safety" },
    ],
    host: {
      name: "Rashid Al Maktoum",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      responseRate: 98,
      responseTime: "within 1 hour",
      superhost: true,
      joined: "2019",
    },
    yearBuilt: 2020,
    areaSqm: 220,
    highlights: ["Hotel services included", "Beachfront", "5-star rated"],
  },
  {
    id: "4",
    name: "Arabian Summerhouse Superior",
    type: "Villa",
    location: "Al Sufouh",
    city: "Dubai",
    country: "UAE",
    price: 1299,
    currency: "USD",
    period: "night",
    guests: 8,
    bedrooms: 3,
    bathrooms: 3,
    rating: 3.8,
    reviewCount: 15,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    features: ["Pool", "Parking", "Gym"],
    description: "A superior Arabian summerhouse offering generous living space with contemporary furnishings. Three spacious bedrooms, a private pool, and dedicated parking make this an ideal base for exploring Dubai's attractions.",
    yearBuilt: 2019,
    areaSqm: 320,
    highlights: ["Private pool", "Spacious interiors", "Central location"],
  },
  {
    id: "5",
    name: "Stylish Luxury Sunshine Villa Perfect for Families",
    type: "Villa",
    location: "Emirates Hills",
    city: "Dubai",
    country: "UAE",
    price: 1000,
    currency: "USD",
    period: "night",
    guests: 6,
    bedrooms: 2,
    bathrooms: 2,
    rating: 4.8,
    reviewCount: 32,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    features: ["Pool", "Garden", "Modern Design"],
    isFeatured: true,
    description: "This architecturally stunning villa in Emirates Hills combines sleek modern design with warm family-friendly spaces. Floor-to-ceiling windows flood the interiors with natural light, while the private garden and pool create an oasis of calm.",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { name: "Private Pool", icon: "waves", category: "outdoor" },
      { name: "Garden", icon: "trees", category: "outdoor" },
      { name: "Air Conditioning", icon: "thermometer", category: "essentials" },
      { name: "WiFi", icon: "wifi", category: "essentials" },
      { name: "Full Kitchen", icon: "cooking-pot", category: "essentials" },
      { name: "Smart TV", icon: "tv", category: "entertainment" },
      { name: "Parking", icon: "car", category: "essentials" },
      { name: "Security System", icon: "shield", category: "safety" },
    ],
    host: {
      name: "Layla Khoury",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      responseRate: 95,
      responseTime: "within 1 hour",
      superhost: true,
      joined: "2020",
    },
    yearBuilt: 2022,
    areaSqm: 310,
    highlights: ["Award-winning architecture", "Smart home", "Family friendly"],
  },
  {
    id: "6",
    name: "Spacious Garden Villa near the Beach",
    type: "Villa",
    location: "Jumeirah",
    city: "Dubai",
    country: "UAE",
    price: 1450,
    currency: "USD",
    period: "night",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    rating: 3.6,
    reviewCount: 19,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    features: ["Garden", "Near Beach", "Parking"],
    description: "Nestled in the leafy streets of Jumeirah, this spacious garden villa is just moments from the beach. Three comfortable bedrooms surround a central courtyard garden, offering a peaceful retreat from the city bustle.",
    yearBuilt: 2016,
    areaSqm: 380,
    highlights: ["Lush garden", "Walking distance to beach", "Quiet street"],
  },
  {
    id: "7",
    name: "Modern Waterfront Apartment with Marina Views",
    type: "Apartment",
    location: "Dubai Marina",
    city: "Dubai",
    country: "UAE",
    price: 520,
    currency: "USD",
    period: "night",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    rating: 4.4,
    reviewCount: 41,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    features: ["Marina View", "Gym", "Pool"],
    description: "Stylish waterfront apartment overlooking the Dubai Marina skyline. Modern interiors with premium finishes, a fully equipped kitchen, and access to world-class amenities including an infinity pool, gym, and marina promenade.",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { name: "Infinity Pool", icon: "waves", category: "outdoor" },
      { name: "Gym", icon: "dumbbell", category: "entertainment" },
      { name: "Air Conditioning", icon: "thermometer", category: "essentials" },
      { name: "WiFi", icon: "wifi", category: "essentials" },
      { name: "Full Kitchen", icon: "cooking-pot", category: "essentials" },
      { name: "Smart TV", icon: "tv", category: "entertainment" },
      { name: "Parking", icon: "car", category: "essentials" },
      { name: "Doorman", icon: "shield", category: "safety" },
    ],
    host: {
      name: "Omar Sayed",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      responseRate: 90,
      responseTime: "within 3 hours",
      superhost: false,
      joined: "2022",
    },
    yearBuilt: 2023,
    areaSqm: 145,
    highlights: ["Marina views", "Premium building", "Walk to dining"],
  },
  {
    id: "8",
    name: "Luxury Penthouse Suite with Panoramic City Views",
    type: "Apartment",
    location: "Downtown Dubai",
    city: "Dubai",
    country: "UAE",
    price: 2100,
    currency: "USD",
    period: "night",
    guests: 4,
    bedrooms: 3,
    bathrooms: 2,
    rating: 4.9,
    reviewCount: 56,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    features: ["Panoramic Views", "Concierge", "Rooftop Pool"],
    isFeatured: true,
    description: "An extraordinary penthouse perched above Downtown Dubai with unobstructed views of the Burj Khalifa and the Dubai Fountain. This three-bedroom masterpiece features floor-to-ceiling windows, a private terrace, and exclusive access to a rooftop infinity pool. Full concierge service included.",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
    ],
    amenities: [
      { name: "Rooftop Pool", icon: "waves", category: "outdoor" },
      { name: "Concierge", icon: "bell", category: "essentials" },
      { name: "Air Conditioning", icon: "thermometer", category: "essentials" },
      { name: "WiFi", icon: "wifi", category: "essentials" },
      { name: "Chef's Kitchen", icon: "cooking-pot", category: "essentials" },
      { name: "Home Theater", icon: "tv", category: "entertainment" },
      { name: "Valet Parking", icon: "car", category: "essentials" },
      { name: "24/7 Security", icon: "shield", category: "safety" },
      { name: "Private Terrace", icon: "sun", category: "outdoor" },
      { name: "Wine Cellar", icon: "wine", category: "entertainment" },
    ],
    host: {
      name: "Amir Patel",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      responseRate: 99,
      responseTime: "within 30 minutes",
      superhost: true,
      joined: "2018",
    },
    yearBuilt: 2024,
    areaSqm: 280,
    highlights: ["Burj Khalifa views", "Private terrace", "Full concierge", "Ultra-premium finishes"],
  },
  {
    id: "9",
    name: "Cozy Townhouse in Quiet Neighbourhood",
    type: "Townhouse",
    location: "Arabian Ranches",
    city: "Dubai",
    country: "UAE",
    price: 680,
    currency: "USD",
    period: "night",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    rating: 4.1,
    reviewCount: 27,
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop",
    features: ["Garden", "Parking", "Community Pool"],
    description: "A charming townhouse in the family-friendly Arabian Ranches community. Three bedrooms, a private garden, and access to community amenities including a pool, park, and retail village. Perfect for longer stays.",
    yearBuilt: 2017,
    areaSqm: 260,
    highlights: ["Gated community", "Family friendly", "Community amenities"],
  },
];

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

/** Fallback amenities for properties that don't have custom ones */
export const defaultAmenities: Amenity[] = [
  { name: "Air Conditioning", icon: "thermometer", category: "essentials" },
  { name: "WiFi", icon: "wifi", category: "essentials" },
  { name: "Full Kitchen", icon: "cooking-pot", category: "essentials" },
  { name: "Smart TV", icon: "tv", category: "entertainment" },
  { name: "Parking", icon: "car", category: "essentials" },
  { name: "Security", icon: "shield", category: "safety" },
];

/** Fallback host for properties that don't have one */
export const defaultHost: Host = {
  name: "VillaHub Host",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  responseRate: 90,
  responseTime: "within a few hours",
  superhost: false,
  joined: "2023",
};

export const locations = [
  { name: "Dubai City", area: "Jumeirah", count: 649 },
  { name: "Abu Dhabi", area: "Saadiyat", count: 312 },
  { name: "Phuket", area: "Kamala", count: 245 },
  { name: "Bali", area: "Seminyak", count: 198 },
  { name: "Miami", area: "South Beach", count: 156 },
];
