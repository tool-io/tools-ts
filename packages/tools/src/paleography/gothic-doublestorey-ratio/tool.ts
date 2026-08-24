import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GothicDoublestoreyRatioInput = {
  readonly doubleStoreyACount: number;
  readonly singleStoreyACount: number;
};

export type GothicDoublestoreyRatioOutput = {
  readonly doubleToSingleRatio: number;
  readonly doubleStoreyASharePct: number;
};

export const calculateGothicDoublestoreyRatio = (
  input: GothicDoublestoreyRatioInput,
): GothicDoublestoreyRatioOutput => {
  for (const key of ["doubleStoreyACount", "singleStoreyACount"] as const) {
    if (!(Number.isSafeInteger(input[key]) && input[key] >= 0))
      return simpleError(
        key,
        "Glyph counts must be non-negative safe integers.",
        "invalid_counts",
      );
  }
  const totalA = input.doubleStoreyACount + input.singleStoreyACount;
  if (!Number.isSafeInteger(totalA))
    return simpleError(
      "doubleStoreyACount",
      "The combined glyph count must be a safe integer.",
      "invalid_counts",
    );
  if (totalA === 0)
    return simpleError(
      "doubleStoreyACount",
      "Sample at least one a glyph before computing the ratio.",
      "invalid_counts",
    );
  if (input.singleStoreyACount === 0)
    return simpleError(
      "singleStoreyACount",
      "The double-to-single ratio needs at least one single-storey a; report such a pure hand qualitatively instead.",
      "invalid_counts",
    );
  return {
    doubleStoreyASharePct: (input.doubleStoreyACount / totalA) * 100,
    doubleToSingleRatio: input.doubleStoreyACount / input.singleStoreyACount,
  };
};

export const gothicDoublestoreyRatioExample = {
  input: { doubleStoreyACount: 16, singleStoreyACount: 4 },
  output: {
    doubleStoreyASharePct: 80,
    doubleToSingleRatio: 4,
  },
} satisfies ToolExample<
  GothicDoublestoreyRatioInput,
  GothicDoublestoreyRatioOutput
>;

export const gothicDoublestoreyRatioTool = createSimpleTool({
  id: "paleography/gothic-doublestorey-ratio",
  title: "Gothic Double-storey Ratio",
  description:
    "Quantify how strongly a sample leans toward the Gothic textualis double-storey a by reporting the double-to-single ratio and the double-storey share of all sampled a glyphs.",
  inputs: [
    {
      description: "Count of double-storey a glyphs sampled.",
      id: "doubleStoreyACount",
      kind: "integer",
      label: "Double-storey a",
      minimum: 0,
    },
    {
      description:
        "Count of single-storey a glyphs sampled; must exceed zero for the ratio.",
      id: "singleStoreyACount",
      kind: "integer",
      label: "Single-storey a",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Double-storey a count divided by single-storey a count.",
      id: "doubleToSingleRatio",
      kind: "number",
      label: "Double/single",
    },
    {
      description: "Double-storey a as a percentage of all sampled a glyphs.",
      id: "doubleStoreyASharePct",
      kind: "number",
      label: "Share %",
    },
  ],
  calculate: (input) =>
    calculateGothicDoublestoreyRatio({
      doubleStoreyACount: input.doubleStoreyACount as number,
      singleStoreyACount: input.singleStoreyACount as number,
    }),
});

export const runGothicDoublestoreyRatio = gothicDoublestoreyRatioTool.execute;
export default gothicDoublestoreyRatioTool;
