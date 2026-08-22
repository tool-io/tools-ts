import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type LandingDistanceFactorInput = {
  readonly densityAltitudeFt: number;
  readonly surface?: "dry-grass" | "paved" | "wet-grass";
  readonly tailwindKt?: number;
};

export type LandingDistanceFactorOutput = {
  readonly factor: number;
};

const SURFACE_FACTORS: Readonly<Record<string, number>> = {
  paved: 1,
  "dry-grass": 1.15,
  "wet-grass": 1.4,
};
/** Documented planning model: about five percent per thousand feet of DA. */
const ALTITUDE_FACTOR_PER_THOUSAND = 1.05;
/** Documented planning model: ten percent per five knots of tailwind. */
const TAILWIND_FACTOR_PER_KT = 0.02;

export const landingDistanceFactorExample = {
  input: {
    densityAltitudeFt: 3000,
    surface: "wet-grass",
    tailwindKt: 5,
  },
  output: { factor: 1.7827425 },
} satisfies ToolExample<
  LandingDistanceFactorInput,
  LandingDistanceFactorOutput
>;

export const calculateLandingDistanceFactor = (
  input: LandingDistanceFactorInput,
): LandingDistanceFactorOutput => {
  const surface = input.surface ?? "paved";
  const surfaceFactor = SURFACE_FACTORS[surface];
  if (surfaceFactor === undefined)
    simpleError(
      "surface",
      "Choose a supported surface type.",
      "invalid_surface",
    );
  const tailwind = Math.max(0, input.tailwindKt ?? 0);
  return {
    factor: roundStatistic(
      ALTITUDE_FACTOR_PER_THOUSAND ** (input.densityAltitudeFt / 1000) *
        surfaceFactor *
        (1 + tailwind * TAILWIND_FACTOR_PER_KT),
    ),
  };
};

export const landingDistanceFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateLandingDistanceFactor(
      input as unknown as LandingDistanceFactorInput,
    ),
  description:
    "Compute the planning multiplier for landing distance from density altitude, surface, and tailwind using documented rule-of-thumb factors.",
  id: "aviation/landing-distance-factor",
  inputs: [
    {
      description: "Density altitude of the runway.",
      id: "densityAltitudeFt",
      kind: "number",
      label: "Density altitude",
      unit: "ft",
    },
    {
      default: "paved",
      description: "Runway surface.",
      enum: ["paved", "dry-grass", "wet-grass"],
      id: "surface",
      kind: "string",
      label: "Surface",
    },
    {
      default: 0,
      description: "Tailwind component; headwinds have no benefit here.",
      id: "tailwindKt",
      kind: "number",
      label: "Tailwind",
      unit: "kt",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Multiplier to apply to the published sea-level standard landing distance.",
      format: "factor",
      id: "factor",
      kind: "number",
      label: "Distance factor",
    },
  ],
  title: "Landing Distance Factor Calculator",
});
export const runLandingDistanceFactor = landingDistanceFactorTool.execute;
export default landingDistanceFactorTool;
