import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const KG_PER_CUBIC_METRE_PER_PPG = 119.826427;

export type BrineSalinityPpmToPpgInput = {
  readonly salinityPpm: number;
};

export type BrineSalinityPpmToPpgOutput = {
  readonly densityKgPerCubicMetre: number;
  readonly mudWeightPpg: number;
  readonly specificGravity: number;
};

export const calculateBrineSalinityPpmToPpg = (
  input: BrineSalinityPpmToPpgInput,
): BrineSalinityPpmToPpgOutput => {
  if (!(input.salinityPpm >= 0))
    return simpleError(
      "salinityPpm",
      "Salinity cannot be negative.",
      "invalid_salinity",
    );
  const specificGravity = 1 + 7e-7 * input.salinityPpm;
  const densityKgPerCubicMetre = specificGravity * 1000;
  return {
    specificGravity,
    densityKgPerCubicMetre,
    mudWeightPpg: densityKgPerCubicMetre / KG_PER_CUBIC_METRE_PER_PPG,
  };
};

export const brineSalinityPpmToPpgExample = {
  input: { salinityPpm: 35000 },
  output: {
    specificGravity: 1.0245,
    densityKgPerCubicMetre: 1024.5,
    mudWeightPpg: 8.549866883705045,
  },
} satisfies ToolExample<
  BrineSalinityPpmToPpgInput,
  BrineSalinityPpmToPpgOutput
>;

export const brineSalinityPpmToPpgTool = createSimpleTool({
  id: "geology/brine-salinity-ppm-to-ppg",
  title: "Brine Salinity Ppm To Ppg Calculator",
  description:
    "Estimate brine mud weight in pounds per gallon from dissolved-solids salinity in ppm using the linear 0.7 kg/m3 per 1000 ppm rule.",
  inputs: [
    {
      description: "Dissolved solids concentration in parts per million.",
      id: "salinityPpm",
      kind: "number",
      label: "Salinity",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Estimated specific gravity of the brine.",
      id: "specificGravity",
      kind: "number",
      label: "Specific gravity",
    },
    {
      description: "Brine density in kilograms per cubic metre.",
      id: "densityKgPerCubicMetre",
      kind: "number",
      label: "Density",
    },
    {
      description: "Equivalent mud weight in pounds per gallon.",
      id: "mudWeightPpg",
      kind: "number",
      label: "Mud weight",
    },
  ],
  calculate: (input) =>
    calculateBrineSalinityPpmToPpg(
      input as unknown as BrineSalinityPpmToPpgInput,
    ),
});

export const runBrineSalinityPpmToPpg = brineSalinityPpmToPpgTool.execute;
export default brineSalinityPpmToPpgTool;
