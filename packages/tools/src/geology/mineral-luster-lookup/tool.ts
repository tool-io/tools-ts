import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MineralLusterLookupInput = {
  readonly mineral: string;
};

export type MineralLusterLookupOutput = {
  readonly luster: string;
};

const LUSTERS: Record<string, string> = {
  amber: "resinous",
  calcite: "vitreous",
  chalcopyrite: "metallic",
  fluorite: "vitreous",
  galena: "metallic",
  graphite: "metallic",
  halite: "vitreous",
  kaolinite: "dull",
  limonite: "dull",
  pyrite: "metallic",
  quartz: "vitreous",
  sphalerite: "resinous",
  sulfur: "resinous",
  talc: "greasy",
};

const MINERALS = Object.keys(LUSTERS);

export const calculateMineralLusterLookup = (
  input: MineralLusterLookupInput,
): MineralLusterLookupOutput => {
  const luster = LUSTERS[input.mineral];
  if (luster === undefined)
    simpleError(
      "mineral",
      "Unknown mineral; pick one from the supported list.",
      "unknown_mineral",
    );
  return { luster };
};

export const mineralLusterLookupExample = {
  input: { mineral: "pyrite" },
  output: { luster: "metallic" },
} satisfies ToolExample<MineralLusterLookupInput, MineralLusterLookupOutput>;

export const mineralLusterLookupTool = createSimpleTool({
  id: "geology/mineral-luster-lookup",
  title: "Mineral Luster Lookup",
  description:
    "Look up the typical luster (quality of surface light reflection) of a common mineral.",
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
      description: "Typical luster term such as vitreous, metallic or dull.",
      id: "luster",
      kind: "string",
      label: "Luster",
    },
  ],
  calculate: (input) =>
    calculateMineralLusterLookup(input as unknown as MineralLusterLookupInput),
});

export const runMineralLusterLookup = mineralLusterLookupTool.execute;
export default mineralLusterLookupTool;
