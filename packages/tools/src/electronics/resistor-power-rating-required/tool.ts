import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResistorPowerRatingRequiredInput = {
  readonly currentAmps: number;
  readonly safetyFactor?: number;
  readonly voltsAcrossV: number;
};

export type ResistorPowerRatingRequiredOutput = {
  readonly recommendedRatingW: number;
  readonly requiredPowerWatts: number;
};

export const resistorPowerRatingRequiredExample = {
  input: { currentAmps: 0.02, voltsAcrossV: 5 },
  output: { recommendedRatingW: 0.2, requiredPowerWatts: 0.1 },
} satisfies ToolExample<
  ResistorPowerRatingRequiredInput,
  ResistorPowerRatingRequiredOutput
>;

export const calculateResistorPowerRatingRequired = (
  input: ResistorPowerRatingRequiredInput,
): ResistorPowerRatingRequiredOutput => {
  if (!(input.voltsAcrossV > 0))
    simpleError(
      "voltsAcrossV",
      "Voltage across the resistor must be positive.",
      "invalid_voltage",
    );
  if (!(input.currentAmps > 0))
    simpleError(
      "currentAmps",
      "Current through the resistor must be positive.",
      "invalid_current",
    );
  const safetyFactor = input.safetyFactor ?? 2;
  if (!(safetyFactor >= 1 && safetyFactor <= 5))
    simpleError(
      "safetyFactor",
      "Safety factor must be between 1 and 5.",
      "invalid_safety_factor",
    );
  const requiredPowerWatts = input.voltsAcrossV * input.currentAmps;
  return {
    recommendedRatingW: requiredPowerWatts * safetyFactor,
    requiredPowerWatts,
  };
};

export const resistorPowerRatingRequiredTool = createSimpleTool({
  calculate: (input) =>
    calculateResistorPowerRatingRequired(
      input as unknown as ResistorPowerRatingRequiredInput,
    ),
  description:
    "Compute the required resistor power rating from volts times current and recommend a derated rating using a safety factor between 1 and 5.",
  id: "electronics/resistor-power-rating-required",
  inputs: [
    {
      description: "Voltage dropped across the resistor.",
      id: "voltsAcrossV",
      kind: "number",
      label: "Volts across",
      unit: "V",
    },
    {
      description: "Current through the resistor.",
      id: "currentAmps",
      kind: "number",
      label: "Current",
      unit: "A",
    },
    {
      default: 2,
      description: "Derating multiplier between 1 and 5.",
      id: "safetyFactor",
      kind: "number",
      label: "Safety factor",
    },
  ],
  outputs: [
    {
      description: "Dissipated power the resistor must handle.",
      id: "requiredPowerWatts",
      kind: "number",
      label: "Required power",
      unit: "W",
    },
    {
      description: "Recommended component rating after derating.",
      id: "recommendedRatingW",
      kind: "number",
      label: "Recommended rating",
      unit: "W",
    },
  ],
  title: "Required Power Rating",
});
export const runResistorPowerRatingRequired =
  resistorPowerRatingRequiredTool.execute;
export default resistorPowerRatingRequiredTool;
