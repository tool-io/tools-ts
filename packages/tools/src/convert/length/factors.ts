export type LengthUnitDefinition = {
  readonly name: string;
  readonly meters: number;
};

// Each factor is the number of meters represented by one unit. Keep this
// portable data separate from UI labels, select controls, and locale handling.
export const lengthUnits: Readonly<Record<string, LengthUnitDefinition>> = {
  angstrom: { name: "Angstrom", meters: 1e-10 },
  au: { name: "Astronomical unit", meters: 149_597_870_700 },
  chain: { name: "Chain", meters: 20.1168 },
  cm: { name: "Centimeter", meters: 1e-2 },
  dm: { name: "Decimeter", meters: 1e-1 },
  fathom: { name: "Fathom", meters: 1.8288 },
  fermi: { name: "Fermi", meters: 1e-15 },
  ft: { name: "Foot", meters: 0.3048 },
  furlong: { name: "Furlong", meters: 201.168 },
  hand: { name: "Hand", meters: 0.1016 },
  in: { name: "Inch", meters: 0.0254 },
  km: { name: "Kilometer", meters: 1e3 },
  "light-day": { name: "Light-day", meters: 25_902_068_371_200 },
  "light-hour": { name: "Light-hour", meters: 1_079_252_848_800 },
  "light-minute": { name: "Light-minute", meters: 17_987_547_480 },
  "light-second": { name: "Light-second", meters: 299_792_458 },
  "light-year": { name: "Light-year", meters: 9_460_730_472_580_800 },
  link: { name: "Link", meters: 0.201168 },
  m: { name: "Meter", meters: 1 },
  mi: { name: "Mile", meters: 1609.344 },
  micron: { name: "Micron", meters: 1e-6 },
  mil: { name: "Mil", meters: 0.0000254 },
  mm: { name: "Millimeter", meters: 1e-3 },
  nm: { name: "Nanometer", meters: 1e-9 },
  nmi: { name: "Nautical mile", meters: 1852 },
  pc: { name: "Parsec", meters: 30_856_775_814_913_672 },
  pm: { name: "Picometer", meters: 1e-12 },
  rod: { name: "Rod", meters: 5.0292 },
  um: { name: "Micrometer", meters: 1e-6 },
  yd: { name: "Yard", meters: 0.9144 },
};

export const isLengthUnit = (value: unknown): value is string =>
  typeof value === "string" && Object.hasOwn(lengthUnits, value);
