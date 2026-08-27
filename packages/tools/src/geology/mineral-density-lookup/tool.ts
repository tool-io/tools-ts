import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MineralDensityLookupInput = {
  readonly mineral: string;
};

export type MineralDensityLookupOutput = {
  readonly densityGPerCm3: number;
};

const DENSITIES_G_PER_CM3: Record<string, number> = {
  albite: 2.62,
  calcite: 2.71,
  fluorite: 3.18,
  galena: 7.5,
  gypsum: 2.32,
  halite: 2.16,
  hematite: 5.26,
  magnetite: 5.18,
  orthoclase: 2.56,
  pyrite: 5.02,
  quartz: 2.65,
};

const MINERALS = Object.keys(DENSITIES_G_PER_CM3);

export const calculateMineralDensityLookup = (
  input: MineralDensityLookupInput,
): MineralDensityLookupOutput => {
  const density = DENSITIES_G_PER_CM3[input.mineral];
  if (density === undefined)
    simpleError(
      "mineral",
      "Unknown mineral; pick one from the supported list.",
      "unknown_mineral",
    );
  return { densityGPerCm3: density };
};

export const mineralDensityLookupExample = {
  input: { mineral: "quartz" },
  output: { densityGPerCm3: 2.65 },
} satisfies ToolExample<MineralDensityLookupInput, MineralDensityLookupOutput>;

export const mineralDensityLookupTool = createSimpleTool({
  id: "geology/mineral-density-lookup",
  title: "Mineral Density Lookup",
  description:
    "Look up the typical room-temperature grain density in g/cm3 for a common rock-forming or ore mineral.",
  inputs: [
    {
      description: "Mineral name (supported list).",
      enum: MINERALS,
      id: "mineral",
      kind: "string",
      label: "Mineral",
    },
  ],
  outputs: [
    {
      description: "Typical mineral density in g/cm3.",
      id: "densityGPerCm3",
      kind: "number",
      label: "Density",
    },
  ],
  calculate: (input) =>
    calculateMineralDensityLookup(
      input as unknown as MineralDensityLookupInput,
    ),
});

export const runMineralDensityLookup = mineralDensityLookupTool.execute;
export default mineralDensityLookupTool;
