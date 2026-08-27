import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PoreWaterPressureInput = {
  readonly waterColumnHeightM: number;
  readonly unitWeightKNPerM3?: number;
};

export type PoreWaterPressureOutput = {
  readonly porePressureKPa: number;
};

export const calculatePoreWaterPressure = (
  input: PoreWaterPressureInput,
): PoreWaterPressureOutput => {
  const heightM = input.waterColumnHeightM;
  const unitWeight = input.unitWeightKNPerM3 ?? 9.81;
  if (!(heightM >= 0))
    simpleError(
      "waterColumnHeightM",
      "Water column height must be non-negative.",
      "invalid_height",
    );
  if (!(unitWeight > 0))
    simpleError(
      "unitWeightKNPerM3",
      "Unit weight of water must be positive.",
      "invalid_unit_weight",
    );
  return { porePressureKPa: unitWeight * heightM };
};

export const poreWaterPressureExample = {
  input: { waterColumnHeightM: 3, unitWeightKNPerM3: 9.81 },
  output: { porePressureKPa: 29.43 },
} satisfies ToolExample<PoreWaterPressureInput, PoreWaterPressureOutput>;

export const poreWaterPressureTool = createSimpleTool({
  id: "geology/pore-water-pressure",
  title: "Pore Water Pressure Calculator",
  description:
    "Compute hydrostatic pore water pressure in kilopascals as unit weight of water times the height of the water column above the point.",
  inputs: [
    {
      description: "Height of the water column above the point in meters.",
      id: "waterColumnHeightM",
      kind: "number",
      label: "Water column",
      minimum: 0,
    },
    {
      default: 9.81,
      description: "Unit weight of water in kN per cubic meter.",
      id: "unitWeightKNPerM3",
      kind: "number",
      label: "Unit weight",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Hydrostatic pore water pressure in kilopascals.",
      id: "porePressureKPa",
      kind: "number",
      label: "u",
    },
  ],
  calculate: (input) =>
    calculatePoreWaterPressure(input as unknown as PoreWaterPressureInput),
});

export const runPoreWaterPressure = poreWaterPressureTool.execute;
export default poreWaterPressureTool;
