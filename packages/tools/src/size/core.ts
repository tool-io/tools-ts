export type SizeConfidence = "exact" | "recommended";

export type ShoeSizeProfile = "children" | "men" | "women";

export type ShoeSizeSystem =
  | "cn"
  | "eu"
  | "jp"
  | "kr"
  | "mondopoint"
  | "uk"
  | "us";

export type ShoeSizeMatch = {
  readonly confidence: SizeConfidence;
  readonly label: string;
  readonly markets: readonly string[];
  readonly system: ShoeSizeSystem;
};

export type ShoeSizeTableRow = {
  readonly footLengthMm: number;
  readonly matches: readonly ShoeSizeMatch[];
};

export const shoeSizeSystemLabels: Readonly<Record<ShoeSizeSystem, string>> = {
  cn: "China",
  eu: "European Union",
  jp: "Japan",
  kr: "South Korea",
  mondopoint: "Mondopoint",
  uk: "United Kingdom",
  us: "United States",
};

export const shoeSizeSystemMarkets: Readonly<
  Record<ShoeSizeSystem, readonly string[]>
> = {
  cn: ["China"],
  eu: ["EU", "Germany", "France", "Italy", "Spain"],
  jp: ["Japan"],
  kr: ["South Korea"],
  mondopoint: ["International", "NATO"],
  uk: ["United Kingdom"],
  us: ["United States", "Canada"],
};
