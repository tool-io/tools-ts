import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EpoxyMixSystem = "1:1" | "2:1" | "5:1";

export type EpoxyMixRatioInput = {
  readonly resinGrams: number;
  readonly system: EpoxyMixSystem;
};

export type EpoxyMixRatioOutput = {
  readonly hardenerGrams: number;
  readonly hardenerParts: number;
  readonly resinParts: number;
};

const RESIN_PARTS: Record<EpoxyMixSystem, number> = {
  "1:1": 1,
  "2:1": 2,
  "5:1": 5,
};

const HARDENER_PARTS: Record<EpoxyMixSystem, number> = {
  "1:1": 1,
  "2:1": 1,
  "5:1": 1,
};

export const epoxyMixRatioExample = {
  input: { resinGrams: 100, system: "2:1" },
  output: { hardenerGrams: 50, hardenerParts: 1, resinParts: 2 },
} satisfies ToolExample<EpoxyMixRatioInput, EpoxyMixRatioOutput>;

export const epoxyMixRatioTool = createSimpleTool({
  id: "carpentry/epoxid-mischungsverhaeltnis-1-1-2-1-lookup",
  title: "Epoxy Mix Ratio Calculator",
  description:
    "Compute hardener grams from resin grams and an epoxy mixing system ratio.",
  inputs: [
    {
      description: "Weighed resin amount in grams.",
      id: "resinGrams",
      kind: "number",
      label: "Resin mass",
      unit: "g",
    },
    {
      description: "Epoxy mixing system ratio: 1:1, 2:1, or 5:1.",
      enum: ["1:1", "2:1", "5:1"],
      id: "system",
      kind: "string",
      label: "System",
    },
  ],
  outputs: [
    {
      description: "Resin parts by volume or weight in the mixing ratio.",
      format: "count",
      id: "resinParts",
      kind: "integer",
      label: "Resin parts",
    },
    {
      description: "Hardener parts by volume or weight in the mixing ratio.",
      format: "count",
      id: "hardenerParts",
      kind: "integer",
      label: "Hardener parts",
    },
    {
      description: "Required hardener mass in grams.",
      format: "mass",
      id: "hardenerGrams",
      kind: "number",
      label: "Hardener mass",
      unit: "g",
    },
  ],
  calculate: (input) => {
    const resinGrams = input.resinGrams as number;
    if (!(resinGrams > 0))
      simpleError(
        "resinGrams",
        "The resin mass must be greater than zero grams.",
        "invalid_resin_grams",
      );
    const system = input.system as EpoxyMixSystem;
    const resinParts = RESIN_PARTS[system];
    const hardenerParts = HARDENER_PARTS[system];
    return {
      hardenerGrams: (resinGrams / resinParts) * hardenerParts,
      hardenerParts,
      resinParts,
    };
  },
});
export const runEpoxyMixRatio = epoxyMixRatioTool.execute;
export default epoxyMixRatioTool;
