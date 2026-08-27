import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MohsHardnessLookupInput = {
  readonly mineral: string;
};

export type MohsHardnessLookupOutput = {
  readonly mohsHardness: number;
};

const MOHS_HARDNESS: Record<string, number> = {
  apatite: 5,
  calcite: 3,
  corundum: 9,
  diamond: 10,
  fluorite: 4,
  gypsum: 2,
  orthoclase: 6,
  quartz: 7,
  talc: 1,
  topaz: 8,
};

const MINERALS = Object.keys(MOHS_HARDNESS);

export const calculateMohsHardnessLookup = (
  input: MohsHardnessLookupInput,
): MohsHardnessLookupOutput => {
  const hardness = MOHS_HARDNESS[input.mineral];
  if (hardness === undefined)
    simpleError(
      "mineral",
      "Unknown mineral; pick one of the ten Mohs reference minerals.",
      "unknown_mineral",
    );
  return { mohsHardness: hardness };
};

export const mohsHardnessLookupExample = {
  input: { mineral: "quartz" },
  output: { mohsHardness: 7 },
} satisfies ToolExample<MohsHardnessLookupInput, MohsHardnessLookupOutput>;

export const mohsHardnessLookupTool = createSimpleTool({
  id: "geology/mohs-hardness-lookup",
  title: "Mohs Hardness Lookup",
  description:
    "Look up the Mohs scratch hardness on the classic 1-to-10 reference scale for a named mineral.",
  inputs: [
    {
      description: "Mineral name (one of the ten Mohs reference minerals).",
      enum: MINERALS,
      id: "mineral",
      kind: "string",
      label: "Mineral",
    },
  ],
  outputs: [
    {
      description: "Mohs relative hardness from 1 (talc) to 10 (diamond).",
      id: "mohsHardness",
      kind: "number",
      label: "Mohs hardness",
    },
  ],
  calculate: (input) =>
    calculateMohsHardnessLookup(input as unknown as MohsHardnessLookupInput),
});

export const runMohsHardnessLookup = mohsHardnessLookupTool.execute;
export default mohsHardnessLookupTool;
