import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TurnLoadFactorGustInput = {
  readonly airDensityKgPerM3: number;
  readonly gustAlleviationFactor?: number;
  readonly gustVelocityMPerS: number;
  readonly liftCurveSlopePerRad: number;
  readonly trueAirspeedMPerS: number;
  readonly wingLoadingNPerM2: number;
};

export type TurnLoadFactorGustOutput = {
  readonly loadFactorG: number;
};

export const turnLoadFactorGustExample = {
  input: {
    airDensityKgPerM3: 1.225,
    gustVelocityMPerS: 10,
    liftCurveSlopePerRad: 5.5,
    trueAirspeedMPerS: 60,
    wingLoadingNPerM2: 3000,
  },
  output: { loadFactorG: 1.67375 },
} satisfies ToolExample<TurnLoadFactorGustInput, TurnLoadFactorGustOutput>;

export const calculateTurnLoadFactorGust = (
  input: TurnLoadFactorGustInput,
): TurnLoadFactorGustOutput => {
  const values = [
    input.airDensityKgPerM3,
    input.liftCurveSlopePerRad,
    input.trueAirspeedMPerS,
    input.wingLoadingNPerM2,
  ];
  if (values.some((value) => value <= 0))
    simpleError(
      "",
      "Density, airspeed, lift-curve slope, and wing loading must be positive.",
    );
  if (input.gustVelocityMPerS < 0)
    simpleError("gustVelocityMPerS", "Gust velocity cannot be negative.");
  const gustAlleviationFactor = input.gustAlleviationFactor ?? 1;
  if (gustAlleviationFactor < 0 || gustAlleviationFactor > 1)
    simpleError(
      "gustAlleviationFactor",
      "Gust alleviation factor must be between zero and one.",
    );
  const increment =
    (0.5 *
      input.airDensityKgPerM3 *
      input.trueAirspeedMPerS *
      input.gustVelocityMPerS *
      input.liftCurveSlopePerRad *
      gustAlleviationFactor) /
    input.wingLoadingNPerM2;
  const loadFactorG = 1 + increment;
  if (!Number.isFinite(loadFactorG))
    simpleError("", "The gust load factor exceeds the numeric range.");
  return { loadFactorG };
};

export const turnLoadFactorGustTool = createSimpleTool({
  calculate: (input) =>
    calculateTurnLoadFactorGust({
      airDensityKgPerM3: input.airDensityKgPerM3 as number,
      gustAlleviationFactor: input.gustAlleviationFactor as number,
      gustVelocityMPerS: input.gustVelocityMPerS as number,
      liftCurveSlopePerRad: input.liftCurveSlopePerRad as number,
      trueAirspeedMPerS: input.trueAirspeedMPerS as number,
      wingLoadingNPerM2: input.wingLoadingNPerM2 as number,
    }),
  description:
    "Estimate the positive one-g vertical-gust load factor using Δn = ρVUaK_g / (2W/S). Inputs must use consistent SI units; this is an aerodynamic estimate, not a certified flight-envelope limit.",
  id: "aviation/turn-load-factor-gust",
  inputs: [
    {
      id: "airDensityKgPerM3",
      kind: "number",
      label: "Air density",
      minimum: 0,
      unit: "kg/m³",
    },
    {
      id: "trueAirspeedMPerS",
      kind: "number",
      label: "True airspeed",
      minimum: 0,
      unit: "m/s",
    },
    {
      id: "gustVelocityMPerS",
      kind: "number",
      label: "Vertical gust velocity",
      minimum: 0,
      unit: "m/s",
    },
    {
      id: "liftCurveSlopePerRad",
      kind: "number",
      label: "Lift-curve slope",
      minimum: 0,
      unit: "rad⁻¹",
    },
    {
      id: "wingLoadingNPerM2",
      kind: "number",
      label: "Wing loading",
      minimum: 0,
      unit: "N/m²",
    },
    {
      default: 1,
      id: "gustAlleviationFactor",
      kind: "number",
      label: "Gust alleviation factor",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      description: "Resulting load factor in g.",
      id: "loadFactorG",
      kind: "number",
      label: "Load factor",
      unit: "g",
    },
  ],
  title: "Gust Load Factor Calculator",
});
export const runTurnLoadFactorGust = turnLoadFactorGustTool.execute;
export default turnLoadFactorGustTool;
