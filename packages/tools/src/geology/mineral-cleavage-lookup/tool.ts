import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MineralCleavageLookupInput = {
  readonly mineral: string;
};

export type MineralCleavageLookupOutput = {
  readonly cleavageDescription: string;
  readonly cleavageDirections: number;
};

const CLEAVAGES: Record<string, { description: string; directions: number }> = {
  biotite: {
    description:
      "Perfect basal (micaceous) cleavage in one direction into thin flexible sheets.",
    directions: 1,
  },
  calcite: {
    description:
      "Perfect rhombohedral cleavage in three directions that do not meet at right angles.",
    directions: 3,
  },
  fluorite: {
    description: "Perfect octahedral cleavage in four directions.",
    directions: 4,
  },
  galena: {
    description: "Perfect cubic cleavage in three directions at right angles.",
    directions: 3,
  },
  gypsum: {
    description:
      "One perfect basal cleavage direction, with two less perfect directions.",
    directions: 1,
  },
  halite: {
    description: "Perfect cubic cleavage in three directions at right angles.",
    directions: 3,
  },
  hornblende: {
    description:
      "Two good prismatic cleavage directions meeting at about 60 and 120 degrees.",
    directions: 2,
  },
  muscovite: {
    description:
      "Perfect basal (micaceous) cleavage in one direction into thin elastic sheets.",
    directions: 1,
  },
  orthoclase: {
    description:
      "Good cleavage in two directions meeting at nearly right angles.",
    directions: 2,
  },
  pyroxene: {
    description:
      "Good prismatic cleavage in two directions at nearly right angles.",
    directions: 2,
  },
  quartz: {
    description:
      "No true cleavage; breaks with a conchoidal (shell-like) fracture.",
    directions: 0,
  },
};

const MINERALS = Object.keys(CLEAVAGES);

export const calculateMineralCleavageLookup = (
  input: MineralCleavageLookupInput,
): MineralCleavageLookupOutput => {
  const entry = CLEAVAGES[input.mineral];
  if (entry === undefined)
    simpleError(
      "mineral",
      "Unknown mineral; pick one from the supported list.",
      "unknown_mineral",
    );
  return {
    cleavageDescription: entry.description,
    cleavageDirections: entry.directions,
  };
};

export const mineralCleavageLookupExample = {
  input: { mineral: "calcite" },
  output: {
    cleavageDescription:
      "Perfect rhombohedral cleavage in three directions that do not meet at right angles.",
    cleavageDirections: 3,
  },
} satisfies ToolExample<
  MineralCleavageLookupInput,
  MineralCleavageLookupOutput
>;

export const mineralCleavageLookupTool = createSimpleTool({
  id: "geology/mineral-cleavage-lookup",
  title: "Mineral Cleavage Lookup",
  description:
    "Look up the number of cleavage directions and their quality/geometry for a common mineral.",
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
      description: "Human-readable description of the cleavage or fracture.",
      id: "cleavageDescription",
      kind: "string",
      label: "Cleavage",
    },
    {
      description:
        "Number of cleavage directions (0 for fracture-only minerals).",
      id: "cleavageDirections",
      kind: "number",
      label: "Directions",
    },
  ],
  calculate: (input) =>
    calculateMineralCleavageLookup(
      input as unknown as MineralCleavageLookupInput,
    ),
});

export const runMineralCleavageLookup = mineralCleavageLookupTool.execute;
export default mineralCleavageLookupTool;
