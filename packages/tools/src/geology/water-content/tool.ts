import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaterContentInput = {
  readonly dryMassKg: number;
  readonly waterMassKg: number;
};

export type WaterContentOutput = {
  readonly waterContentPercent: number;
};

export const calculateWaterContent = (
  input: WaterContentInput,
): WaterContentOutput => {
  if (!(input.dryMassKg > 0))
    simpleError(
      "dryMassKg",
      "Dry (solids) mass must be greater than zero.",
      "invalid_mass",
    );
  if (!(input.waterMassKg >= 0))
    simpleError(
      "waterMassKg",
      "Water mass cannot be negative.",
      "invalid_mass",
    );
  return { waterContentPercent: (input.waterMassKg / input.dryMassKg) * 100 };
};

export const waterContentExample = {
  input: { dryMassKg: 80, waterMassKg: 20 },
  output: { waterContentPercent: 25 },
} satisfies ToolExample<WaterContentInput, WaterContentOutput>;

export const waterContentTool = createSimpleTool({
  id: "geology/water-content",
  title: "Water Content Calculator",
  description:
    "Compute gravimetric water content as the mass of pore water divided by the oven-dry solids mass, in percent.",
  inputs: [
    {
      description: "Oven-dry mass of solids in kilograms.",
      id: "dryMassKg",
      kind: "number",
      label: "Dry mass",
      minimum: 0,
    },
    {
      description: "Mass of pore water in kilograms.",
      id: "waterMassKg",
      kind: "number",
      label: "Water mass",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Gravimetric water content expressed in percent of dry mass.",
      id: "waterContentPercent",
      kind: "number",
      label: "Water content",
    },
  ],
  calculate: (input) =>
    calculateWaterContent(input as unknown as WaterContentInput),
});

export const runWaterContent = waterContentTool.execute;
export default waterContentTool;
