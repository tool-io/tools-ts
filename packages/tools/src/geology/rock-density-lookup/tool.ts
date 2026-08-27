import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RockDensityLookupInput = {
  readonly rock: string;
};

export type RockDensityLookupOutput = {
  readonly typicalDensityHighGPerCm3: number;
  readonly typicalDensityLowGPerCm3: number;
  readonly typicalDensityMidGPerCm3: number;
};

const DENSITY_RANGES_G_PER_CM3: Record<string, { high: number; low: number }> =
  {
    basalt: { high: 3.0, low: 2.8 },
    coal: { high: 1.5, low: 1.2 },
    dolostone: { high: 2.9, low: 2.8 },
    gabbro: { high: 3.1, low: 2.9 },
    gneiss: { high: 2.9, low: 2.6 },
    granite: { high: 2.8, low: 2.6 },
    limestone: { high: 2.7, low: 2.3 },
    marble: { high: 2.8, low: 2.7 },
    peridotite: { high: 3.4, low: 3.2 },
    quartzite: { high: 2.7, low: 2.6 },
    "rock salt": { high: 2.2, low: 2.1 },
    sandstone: { high: 2.8, low: 2.2 },
    shale: { high: 2.8, low: 2.4 },
  };

const ROCKS = Object.keys(DENSITY_RANGES_G_PER_CM3);

export const calculateRockDensityLookup = (
  input: RockDensityLookupInput,
): RockDensityLookupOutput => {
  const range = DENSITY_RANGES_G_PER_CM3[input.rock];
  if (range === undefined)
    simpleError(
      "rock",
      "Unknown rock; pick one from the supported list.",
      "unknown_rock",
    );
  return {
    typicalDensityHighGPerCm3: range.high,
    typicalDensityLowGPerCm3: range.low,
    typicalDensityMidGPerCm3: (range.low + range.high) / 2,
  };
};

export const rockDensityLookupExample = {
  input: { rock: "basalt" },
  output: {
    typicalDensityHighGPerCm3: 3.0,
    typicalDensityLowGPerCm3: 2.8,
    typicalDensityMidGPerCm3: 2.9,
  },
} satisfies ToolExample<RockDensityLookupInput, RockDensityLookupOutput>;

export const rockDensityLookupTool = createSimpleTool({
  id: "geology/rock-density-lookup",
  title: "Rock Density Lookup",
  description:
    "Look up the typical dry bulk density range in g/cm3 for a common rock type.",
  inputs: [
    {
      description: "Rock type (supported list).",
      enum: ROCKS,
      id: "rock",
      kind: "string",
      label: "Rock",
    },
  ],
  outputs: [
    {
      description: "Upper end of the typical density range in g/cm3.",
      id: "typicalDensityHighGPerCm3",
      kind: "number",
      label: "High density",
    },
    {
      description: "Lower end of the typical density range in g/cm3.",
      id: "typicalDensityLowGPerCm3",
      kind: "number",
      label: "Low density",
    },
    {
      description: "Arithmetic midpoint of the typical density range in g/cm3.",
      id: "typicalDensityMidGPerCm3",
      kind: "number",
      label: "Mid density",
    },
  ],
  calculate: (input) =>
    calculateRockDensityLookup(input as unknown as RockDensityLookupInput),
});

export const runRockDensityLookup = rockDensityLookupTool.execute;
export default rockDensityLookupTool;
