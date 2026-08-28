import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WireResistanceInput = {
  readonly crossSectionMm2: number;
  readonly lengthMeters: number;
  readonly resistivityOhmMeter?: number;
};

export type WireResistanceOutput = {
  readonly resistanceOhms: number;
};

/** Copper resistivity at 20 °C, Ω·m. */
const COPPER_RESISTIVITY = 1.68e-8;

export const wireResistanceExample = {
  input: {
    crossSectionMm2: 1.5,
    lengthMeters: 10,
    resistivityOhmMeter: COPPER_RESISTIVITY,
  },
  output: { resistanceOhms: 0.11200000000000002 },
} satisfies ToolExample<WireResistanceInput, WireResistanceOutput>;

export const calculateWireResistance = (
  input: WireResistanceInput,
): WireResistanceOutput => {
  const resistivityOhmMeter = input.resistivityOhmMeter ?? COPPER_RESISTIVITY;
  if (
    input.lengthMeters <= 0 ||
    input.crossSectionMm2 <= 0 ||
    resistivityOhmMeter <= 0
  )
    simpleError(
      "lengthMeters",
      "Length, cross-section, and resistivity must be positive.",
      "invalid_input",
    );
  return {
    resistanceOhms:
      (resistivityOhmMeter * input.lengthMeters) /
      (input.crossSectionMm2 * 1e-6),
  };
};

export const wireResistanceTool = createSimpleTool({
  calculate: (input) =>
    calculateWireResistance(input as unknown as WireResistanceInput),
  description:
    "Compute wire resistance R = rho * L / A from length and cross-sectional area, defaulting to copper resistivity (1.68e-8 ohm-meter at 20 degrees Celsius); area is given in square millimeters and converted to square meters.",
  id: "electronics/wire-resistance",
  inputs: [
    {
      description: "Conductor cross-sectional area.",
      id: "crossSectionMm2",
      kind: "number",
      label: "Cross-section",
      unit: "mm^2",
    },
    {
      description:
        "One-way conductor length; double it for a full out-and-back loop.",
      id: "lengthMeters",
      kind: "number",
      label: "Length",
      unit: "m",
    },
    {
      default: COPPER_RESISTIVITY,
      description:
        "Material resistivity; defaults to copper. Aluminum is about 2.65e-8 ohm-meter.",
      format: "resistivity",
      id: "resistivityOhmMeter",
      kind: "number",
      label: "Resistivity",
      required: false,
      unit: "Ω·m",
    },
  ],
  outputs: [
    {
      description: "Resistance of the specified conductor length.",
      format: "resistance",
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance",
      unit: "Ω",
    },
  ],
  title: "Wire Resistance Calculator",
});
export const runWireResistance = wireResistanceTool.execute;
export default wireResistanceTool;
