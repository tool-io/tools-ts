import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MineralStreakLookupInput = {
  readonly mineral: string;
};

export type MineralStreakLookupOutput = {
  readonly streakColor: string;
};

const STREAK_COLORS: Record<string, string> = {
  azurite: "pale blue",
  barite: "white",
  calcite: "white",
  fluorite: "white",
  galena: "lead gray",
  graphite: "black",
  hematite: "reddish brown",
  limonite: "yellowish brown",
  magnetite: "black",
  malachite: "pale green",
  pyrite: "greenish black",
  quartz: "colorless",
};

const MINERALS = Object.keys(STREAK_COLORS);

export const calculateMineralStreakLookup = (
  input: MineralStreakLookupInput,
): MineralStreakLookupOutput => {
  const streak = STREAK_COLORS[input.mineral];
  if (streak === undefined)
    simpleError(
      "mineral",
      "Unknown mineral; pick one from the supported list.",
      "unknown_mineral",
    );
  return { streakColor: streak };
};

export const mineralStreakLookupExample = {
  input: { mineral: "hematite" },
  output: { streakColor: "reddish brown" },
} satisfies ToolExample<MineralStreakLookupInput, MineralStreakLookupOutput>;

export const mineralStreakLookupTool = createSimpleTool({
  id: "geology/mineral-streak-lookup",
  title: "Mineral Streak Lookup",
  description:
    "Look up the characteristic color of a mineral's powder as it would appear on a streak plate.",
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
      description: "Typical powder (streak) color of the mineral.",
      id: "streakColor",
      kind: "string",
      label: "Streak color",
    },
  ],
  calculate: (input) =>
    calculateMineralStreakLookup(input as unknown as MineralStreakLookupInput),
});

export const runMineralStreakLookup = mineralStreakLookupTool.execute;
export default mineralStreakLookupTool;
