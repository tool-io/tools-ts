import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TakeoffDistanceFactorInput = {
  readonly densityAltitudeFt: number;
  readonly surface?: "dry-grass" | "paved" | "wet-grass";
  readonly tailwindKt?: number;
  readonly upslopePercent?: number;
};

export type TakeoffDistanceFactorOutput = {
  readonly factor: number;
};

const SURFACE_FACTORS: Readonly<Record<string, number>> = {
  paved: 1,
  "dry-grass": 1.2,
  "wet-grass": 1.5,
};
/** Documented planning model: about ten percent per thousand feet of DA. */
const ALTITUDE_FACTOR_PER_THOUSAND = 1.1;
/** Documented planning model: ten percent per five knots of tailwind. */
const TAILWIND_FACTOR_PER_KT = 0.02;
/** Documented planning model: ten percent per one percent of upslope. */
const UPSLOPE_FACTOR_PER_PERCENT = 0.1;

export const takeoffDistanceFactorExample = {
  input: {
    densityAltitudeFt: 3000,
    surface: "dry-grass",
    tailwindKt: 5,
    upslopePercent: 1,
  },
  output: { factor: 1.932612 },
} satisfies ToolExample<
  TakeoffDistanceFactorInput,
  TakeoffDistanceFactorOutput
>;

export const calculateTakeoffDistanceFactor = (
  input: TakeoffDistanceFactorInput,
): TakeoffDistanceFactorOutput => {
  const surface = input.surface ?? "paved";
  const surfaceFactor = SURFACE_FACTORS[surface];
  if (surfaceFactor === undefined)
    simpleError(
      "surface",
      "Choose a supported surface type.",
      "invalid_surface",
    );
  const tailwind = Math.max(0, input.tailwindKt ?? 0);
  const upslope = Math.max(0, input.upslopePercent ?? 0);
  const altitudeFactor =
    ALTITUDE_FACTOR_PER_THOUSAND ** (input.densityAltitudeFt / 1000);
  return {
    factor: roundStatistic(
      altitudeFactor *
        surfaceFactor *
        (1 + tailwind * TAILWIND_FACTOR_PER_KT) *
        (1 + upslope * UPSLOPE_FACTOR_PER_PERCENT),
    ),
  };
};

export const takeoffDistanceFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateTakeoffDistanceFactor(
      input as unknown as TakeoffDistanceFactorInput,
    ),
  description:
    "Compute the planning multiplier for takeoff distance from density altitude, surface, tailwind, and slope using documented rule-of-thumb factors.",
  id: "aviation/takeoff-distance-factor",
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
    {
      default: 0,
      description: "Upslope gradient in percent; downhill is ignored.",
      id: "upslopePercent",
      kind: "number",
      label: "Upslope",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Multiplier to apply to the published sea-level standard takeoff distance.",
      format: "factor",
      id: "factor",
      kind: "number",
      label: "Distance factor",
    },
  ],
  title: "Takeoff Distance Factor Calculator",
});
export const runTakeoffDistanceFactor = takeoffDistanceFactorTool.execute;
export default takeoffDistanceFactorTool;
