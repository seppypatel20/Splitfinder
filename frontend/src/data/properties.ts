export type Property = {
  id: string;
  address: string;
  suburb: string;
  city: string;
  state: string;
  price: number;
  landSize: number; // m²
  frontage: number; // m
  bedrooms: number;
  bathrooms: number;
  latitude: number;
  longitude: number;
  imageUrl: string;
  description: string;
};

export const PROPERTIES: Property[] = [
  {
    id: "p1",
    address: "12 Subdivision Way",
    suburb: "Parramatta",
    city: "Sydney",
    state: "NSW",
    price: 650000,
    landSize: 620,
    frontage: 15,
    bedrooms: 3,
    bathrooms: 1,
    latitude: -33.815,
    longitude: 151.003,
    imageUrl:
      "https://images.pexels.com/photos/31664773/pexels-photo-31664773.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description:
      "Classic brick home on a deep block. Wide street frontage with strong subdivision potential in a high-demand corridor.",
  },
  {
    id: "p2",
    address: "45 Developer Avenue",
    suburb: "Footscray",
    city: "Melbourne",
    state: "VIC",
    price: 700000,
    landSize: 700,
    frontage: 22,
    bedrooms: 3,
    bathrooms: 2,
    latitude: -37.8,
    longitude: 144.9,
    imageUrl:
      "https://images.unsplash.com/photo-1760129745103-91c4022ed5fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHw0fHxhdXN0cmFsaWFuJTIwc3VidXJiYW4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDB8fHx8MTc4MDQwMzU2NXww&ixlib=rb-4.1.0&q=85",
    description:
      "Generous 700m² block with 22m frontage. Ideal split into two equal vacant lots with council pre-approval in area.",
  },
  {
    id: "p3",
    address: "8 Split Street",
    suburb: "Logan Central",
    city: "Brisbane",
    state: "QLD",
    price: 590000,
    landSize: 605,
    frontage: 20,
    bedrooms: 2,
    bathrooms: 1,
    latitude: -27.64,
    longitude: 153.11,
    imageUrl:
      "https://images.unsplash.com/photo-1579678929710-862f8e01c0b2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwxfHxhdXN0cmFsaWFuJTIwc3VidXJiYW4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDB8fHx8MTc4MDQwMzU2NXww&ixlib=rb-4.1.0&q=85",
    description:
      "Compact cottage on a flat 605m² parcel. Minimum frontage achieved exactly at 20m — strong dual-lot candidate.",
  },
  {
    id: "p4",
    address: "22 Profit Boulevard",
    suburb: "Armadale",
    city: "Perth",
    state: "WA",
    price: 620000,
    landSize: 650,
    frontage: 18,
    bedrooms: 3,
    bathrooms: 2,
    latitude: -32.15,
    longitude: 116.0,
    imageUrl:
      "https://images.pexels.com/photos/5866151/pexels-photo-5866151.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description:
      "Solid investor pick on 650m². Frontage marginally below 20m — verify with local council survey.",
  },
  {
    id: "p5",
    address: "104 Yield Crescent",
    suburb: "Salisbury",
    city: "Adelaide",
    state: "SA",
    price: 525000,
    landSize: 720,
    frontage: 24,
    bedrooms: 4,
    bathrooms: 2,
    latitude: -34.76,
    longitude: 138.64,
    imageUrl:
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description:
      "Largest block in this run. 24m frontage and 720m² — comfortably clears dual-lot minimums.",
  },
  {
    id: "p6",
    address: "3 Margin Lane",
    suburb: "Blacktown",
    city: "Sydney",
    state: "NSW",
    price: 685000,
    landSize: 610,
    frontage: 16,
    bedrooms: 3,
    bathrooms: 1,
    latitude: -33.77,
    longitude: 150.91,
    imageUrl:
      "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description:
      "Tidy weatherboard near transport. Frontage tight at 16m — may require battle-axe configuration.",
  },
  {
    id: "p7",
    address: "77 Equity Road",
    suburb: "Sunshine",
    city: "Melbourne",
    state: "VIC",
    price: 640000,
    landSize: 660,
    frontage: 21,
    bedrooms: 3,
    bathrooms: 1,
    latitude: -37.79,
    longitude: 144.83,
    imageUrl:
      "https://images.pexels.com/photos/2287310/pexels-photo-2287310.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description:
      "Strong fundamentals: 21m frontage, 660m² land. Established neighbourhood with comparable splits sold recently.",
  },
  {
    id: "p8",
    address: "16 Capital Court",
    suburb: "Ipswich",
    city: "Brisbane",
    state: "QLD",
    price: 480000,
    landSize: 800,
    frontage: 25,
    bedrooms: 3,
    bathrooms: 2,
    latitude: -27.61,
    longitude: 152.76,
    imageUrl:
      "https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description:
      "Largest land at the lowest price. 800m² of flat land with a generous 25m frontage. Headline subdivision pick.",
  },
  {
    id: "p9",
    address: "59 Leverage Drive",
    suburb: "Mandurah",
    city: "Perth",
    state: "WA",
    price: 570000,
    landSize: 690,
    frontage: 19,
    bedrooms: 3,
    bathrooms: 2,
    latitude: -32.53,
    longitude: 115.74,
    imageUrl:
      "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description:
      "Coastal-fringe block. Frontage just under 20m threshold — confirm with surveyor before commit.",
  },
  {
    id: "p10",
    address: "31 Return Place",
    suburb: "Elizabeth",
    city: "Adelaide",
    state: "SA",
    price: 440000,
    landSize: 750,
    frontage: 23,
    bedrooms: 3,
    bathrooms: 1,
    latitude: -34.71,
    longitude: 138.67,
    imageUrl:
      "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description:
      "Affordable entry into the SA dual-lot market. 23m frontage, 750m² land — strong gross margin profile.",
  },
  {
    id: "p11",
    address: "5 Holding Street",
    suburb: "Liverpool",
    city: "Sydney",
    state: "NSW",
    price: 695000,
    landSize: 615,
    frontage: 20,
    bedrooms: 3,
    bathrooms: 2,
    latitude: -33.92,
    longitude: 150.92,
    imageUrl:
      "https://images.pexels.com/photos/461940/pexels-photo-461940.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description:
      "Hits both thresholds exactly — 615m² land, 20m frontage. Clean comparable in the suburb at $410k per lot.",
  },
  {
    id: "p12",
    address: "88 Asset Avenue",
    suburb: "Werribee",
    city: "Melbourne",
    state: "VIC",
    price: 555000,
    landSize: 680,
    frontage: 22,
    bedrooms: 3,
    bathrooms: 1,
    latitude: -37.9,
    longitude: 144.66,
    imageUrl:
      "https://images.pexels.com/photos/2360673/pexels-photo-2360673.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description:
      "Outer-west growth corridor. 22m frontage, 680m² block. Council fast-track for two-lot subdivisions.",
  },
];

export const SUBURBS_ALL = "All Suburbs";

export function getUniqueSuburbs(): string[] {
  const set = new Set<string>();
  PROPERTIES.forEach((p) => set.add(p.suburb));
  return [SUBURBS_ALL, ...Array.from(set).sort()];
}
