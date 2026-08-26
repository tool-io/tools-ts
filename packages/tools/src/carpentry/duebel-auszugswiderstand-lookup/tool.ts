import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnchorSize = "m10" | "m12" | "m6" | "m8";

export type AnchorPullOutInput = {
  readonly anchorSize: AnchorSize;
};

export type AnchorPullOutOutput = {
  readonly ratedPullKg: number;
};

const RATED_PULL_KG: Record<AnchorSize, number> = {
  m10: 700,
  m12: 1000,
  m6: 200,
  m8: 400,
};

export const anchorPullOutExample = {
  input: { anchorSize: "m8" },
  output: { ratedPullKg: 400 },
} satisfies ToolExample<AnchorPullOutInput, AnchorPullOutOutput>;

export const anchorPullOutTool = createSimpleTool({
  id: "carpentry/duebel-auszugswiderstand-lookup",
  title: "Anchor Pull-Out Class Lookup",
  description:
    "Look up the rated pull-out load in kilograms for a metric anchor size.",
  inputs: [
    {
      description:
        "Metric anchor size: m6 (200 kg), m8 (400 kg), m10 (700 kg), or m12 (1000 kg).",
      enum: ["m6", "m8", "m10", "m12"],
      id: "anchorSize",
      kind: "string",
      label: "Anchor size",
    },
  ],
  outputs: [
    {
      description: "Rated pull-out load in kilograms.",
      format: "mass",
      id: "ratedPullKg",
      kind: "number",
      label: "Rated pull",
      unit: "kg",
    },
  ],
  calculate: (input) => {
    const anchorSize = input.anchorSize as AnchorSize;
    if (!(anchorSize in RATED_PULL_KG))
      simpleError("anchorSize", "Unknown anchor size.", "unknown_size");
    return { ratedPullKg: RATED_PULL_KG[anchorSize] };
  },
});
export const runAnchorPullOut = anchorPullOutTool.execute;
export default anchorPullOutTool;
