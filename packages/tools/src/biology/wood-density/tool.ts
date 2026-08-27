import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WoodDensityInput = {
  readonly dryMassG: number;
  readonly volumeCm3: number;
};

export type WoodDensityOutput = {
  readonly woodDensity: number;
};

export const woodDensityExample = {
  input: { dryMassG: 65, volumeCm3: 100 },
  output: { woodDensity: 0.65 },
} satisfies ToolExample<WoodDensityInput, WoodDensityOutput>;

export const woodDensityTool = createSimpleTool({
  id: "biology/wood-density",
  title: "Wood Density",
  description:
    "Compute basic wood density in grams per cubic centimetre as oven-dry mass divided by fresh volume.",
  inputs: [
    {
      id: "dryMassG",
      kind: "number",
      label: "Dry mass",
      unit: "g",
    },
    {
      id: "volumeCm3",
      kind: "number",
      label: "Volume",
      unit: "cm³",
    },
  ],
  outputs: [
    {
      id: "woodDensity",
      kind: "number",
      label: "Wood density",
      unit: "g/cm³",
    },
  ],
  calculate: (input) => {
    const dryMassG = input.dryMassG as number;
    const volumeCm3 = input.volumeCm3 as number;
    if (!(dryMassG > 0))
      simpleError("dryMassG", "The dry mass must be greater than zero.");
    if (!(volumeCm3 > 0))
      simpleError("volumeCm3", "The volume must be greater than zero.");
    return { woodDensity: dryMassG / volumeCm3 };
  },
});
export const runWoodDensity = woodDensityTool.execute;
export default woodDensityTool;
