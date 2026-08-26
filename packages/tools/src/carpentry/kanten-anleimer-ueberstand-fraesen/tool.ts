import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EdgeBandingTrimInput = {
  readonly roughLengthMm: number;
  readonly trimAllowanceMm?: number;
};

export type EdgeBandingTrimOutput = {
  readonly finalLengthAfterTrimMm: number;
};

export const edgeBandingTrimExample = {
  input: { roughLengthMm: 810, trimAllowanceMm: 5 },
  output: { finalLengthAfterTrimMm: 800 },
} satisfies ToolExample<EdgeBandingTrimInput, EdgeBandingTrimOutput>;

export const edgeBandingTrimTool = createSimpleTool({
  id: "carpentry/kanten-anleimer-ueberstand-fraesen",
  title: "Edge Banding Trim Allowance Calculator",
  description:
    "Compute the finished edge banding length after trimming both ends from the rough length and per-end trim allowance.",
  inputs: [
    {
      description: "Rough edge banding length before trimming in millimetres.",
      id: "roughLengthMm",
      kind: "number",
      label: "Rough length",
      unit: "mm",
    },
    {
      default: 5,
      description: "Material trimmed from each end in millimetres.",
      id: "trimAllowanceMm",
      kind: "number",
      label: "Trim allowance",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description:
        "Remaining length after trimming both ends, which must stay positive.",
      format: "length",
      id: "finalLengthAfterTrimMm",
      kind: "number",
      label: "Final length after trim",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const roughLengthMm = input.roughLengthMm as number;
    if (roughLengthMm <= 0)
      simpleError(
        "roughLengthMm",
        "The rough length must be greater than zero millimetres.",
        "invalid_rough_length",
      );
    const trimAllowanceMm = input.trimAllowanceMm as number;
    const finalLengthAfterTrimMm = roughLengthMm - 2 * trimAllowanceMm;
    if (!(finalLengthAfterTrimMm > 0))
      simpleError(
        "finalLengthAfterTrimMm",
        "The trimmed length must remain greater than zero millimetres.",
        "negative_length",
      );
    return { finalLengthAfterTrimMm };
  },
});
export const runEdgeBandingTrim = edgeBandingTrimTool.execute;
export default edgeBandingTrimTool;
