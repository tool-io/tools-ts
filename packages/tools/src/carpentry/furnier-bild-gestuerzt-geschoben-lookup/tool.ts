import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type VeneerMatchType = "mirrored" | "random" | "sliding";

export type VeneerMatchYieldInput = {
  readonly matchType: VeneerMatchType;
};

export type VeneerMatchYieldOutput = {
  readonly typicalYieldPercent: number;
};

const TYPICAL_YIELD_PERCENT: Record<VeneerMatchType, number> = {
  mirrored: 75,
  random: 65,
  sliding: 85,
};

export const veneerMatchYieldExample = {
  input: { matchType: "sliding" },
  output: { typicalYieldPercent: 85 },
} satisfies ToolExample<VeneerMatchYieldInput, VeneerMatchYieldOutput>;

export const veneerMatchYieldTool = createSimpleTool({
  id: "carpentry/furnier-bild-gestuerzt-geschoben-lookup",
  title: "Veneer Matching Yield Lookup",
  description:
    "Look up the typical usable yield percentage for a veneer matching pattern.",
  inputs: [
    {
      description:
        "Matching pattern: random, sliding (gestuerzt/geschoben), or mirrored.",
      enum: ["mirrored", "random", "sliding"],
      id: "matchType",
      kind: "string",
      label: "Match type",
    },
  ],
  outputs: [
    {
      description:
        "Typical yield share of the raw veneer that ends up usable, in percent.",
      format: "percent",
      id: "typicalYieldPercent",
      kind: "number",
      label: "Typical yield",
      unit: "%",
    },
  ],
  calculate: (input) => ({
    typicalYieldPercent:
      TYPICAL_YIELD_PERCENT[input.matchType as VeneerMatchType],
  }),
});
export const runVeneerMatchYield = veneerMatchYieldTool.execute;
export default veneerMatchYieldTool;
