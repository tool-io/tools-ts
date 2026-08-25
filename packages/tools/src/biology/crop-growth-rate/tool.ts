import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CropGrowthRateInput = {
  readonly daysElapsed: number;
  readonly dryMassW1G: number;
  readonly dryMassW2G: number;
  readonly groundAreaM2: number;
};

export type CropGrowthRateOutput = {
  readonly cgrGM2PerDay: number;
};

export const cropGrowthRateExample = {
  input: {
    daysElapsed: 30,
    dryMassW1G: 200,
    dryMassW2G: 350,
    groundAreaM2: 2.5,
  },
  output: { cgrGM2PerDay: 2 },
} satisfies ToolExample<CropGrowthRateInput, CropGrowthRateOutput>;

export const cropGrowthRateTool = createSimpleTool({
  id: "biology/crop-growth-rate",
  title: "Crop Growth Rate",
  description:
    "Compute crop growth rate in grams per square metre of ground per day as standing dry mass gain divided by ground area times elapsed days.",
  inputs: [
    {
      id: "daysElapsed",
      kind: "number",
      label: "Elapsed time",
      unit: "days",
    },
    {
      id: "dryMassW1G",
      kind: "number",
      label: "Initial dry mass",
      minimum: 0,
      unit: "g",
    },
    {
      id: "dryMassW2G",
      kind: "number",
      label: "Final dry mass",
      minimum: 0,
      unit: "g",
    },
    {
      id: "groundAreaM2",
      kind: "number",
      label: "Ground area",
      unit: "m²",
    },
  ],
  outputs: [
    {
      id: "cgrGM2PerDay",
      kind: "number",
      label: "Crop growth rate",
      unit: "g/m²/day",
    },
  ],
  calculate: (input) => {
    const dryMassW1G = input.dryMassW1G as number;
    const dryMassW2G = input.dryMassW2G as number;
    const groundAreaM2 = input.groundAreaM2 as number;
    const daysElapsed = input.daysElapsed as number;
    if (!(groundAreaM2 > 0))
      simpleError("groundAreaM2", "The ground area must be greater than zero.");
    if (!(daysElapsed > 0))
      simpleError(
        "daysElapsed",
        "The elapsed time must be greater than zero.",
        "degenerate_days",
      );
    return {
      cgrGM2PerDay: (dryMassW2G - dryMassW1G) / (groundAreaM2 * daysElapsed),
    };
  },
});
export const runCropGrowthRate = cropGrowthRateTool.execute;
export default cropGrowthRateTool;
