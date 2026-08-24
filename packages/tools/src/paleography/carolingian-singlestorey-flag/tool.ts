import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CarolingianSinglestoreyFlagInput = {
  readonly singleStoreyACount: number;
  readonly doubleStoreyACount: number;
  readonly carolineThresholdPct?: number;
};

export type CarolingianSinglestoreyFlagOutput = {
  readonly singleStoreyASharePct: number;
  readonly carolingianProfile: boolean;
};

export const calculateCarolingianSinglestoreyFlag = (
  input: CarolingianSinglestoreyFlagInput,
): CarolingianSinglestoreyFlagOutput => {
  for (const key of ["singleStoreyACount", "doubleStoreyACount"] as const) {
    if (!(Number.isSafeInteger(input[key]) && input[key] >= 0))
      return simpleError(
        key,
        "Glyph counts must be non-negative safe integers.",
        "invalid_count",
      );
  }
  const threshold = input.carolineThresholdPct ?? 80;
  if (!(Number.isFinite(threshold) && threshold >= 0 && threshold <= 100))
    return simpleError(
      "carolineThresholdPct",
      "Threshold must be a finite percentage from 0 to 100.",
      "invalid_threshold",
    );
  const totalA = input.singleStoreyACount + input.doubleStoreyACount;
  if (!(Number.isSafeInteger(totalA) && totalA > 0))
    return simpleError(
      "singleStoreyACount",
      "Sample at least one a glyph before rating the hand.",
      "invalid_counts",
    );
  const sharePct = (input.singleStoreyACount / totalA) * 100;
  return {
    carolingianProfile: sharePct >= threshold,
    singleStoreyASharePct: sharePct,
  };
};

export const carolingianSinglestoreyFlagExample = {
  input: {
    carolineThresholdPct: 80,
    doubleStoreyACount: 2,
    singleStoreyACount: 18,
  },
  output: {
    carolingianProfile: true,
    singleStoreyASharePct: 90,
  },
} satisfies ToolExample<
  CarolingianSinglestoreyFlagInput,
  CarolingianSinglestoreyFlagOutput
>;

export const carolingianSinglestoreyFlagTool = createSimpleTool({
  id: "paleography/carolingian-singlestorey-flag",
  title: "Carolingian Single-storey Flag",
  description:
    "Flag a Caroline-minuscule-like script profile under the stated heuristic: a hand counts as showing the single-storey Caroline a profile when its single-storey a share reaches the threshold percentage (default 80).",
  inputs: [
    {
      description: "Count of single-storey (Caroline) a glyphs sampled.",
      id: "singleStoreyACount",
      kind: "integer",
      label: "Single-storey a",
      minimum: 0,
    },
    {
      description: "Count of double-storey a glyphs sampled.",
      id: "doubleStoreyACount",
      kind: "integer",
      label: "Double-storey a",
      minimum: 0,
    },
    {
      default: 80,
      description: "Minimum single-storey share in percent to raise the flag.",
      id: "carolineThresholdPct",
      kind: "number",
      label: "Threshold %",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Single-storey a as a percentage of all sampled a glyphs.",
      id: "singleStoreyASharePct",
      kind: "number",
      label: "Share %",
    },
    {
      description: "True when the single-storey share meets the threshold.",
      id: "carolingianProfile",
      kind: "boolean",
      label: "Carolingian profile",
    },
  ],
  calculate: (input) =>
    calculateCarolingianSinglestoreyFlag({
      carolineThresholdPct: input.carolineThresholdPct as number | undefined,
      doubleStoreyACount: input.doubleStoreyACount as number,
      singleStoreyACount: input.singleStoreyACount as number,
    }),
});

export const runCarolingianSinglestoreyFlag =
  carolingianSinglestoreyFlagTool.execute;
export default carolingianSinglestoreyFlagTool;
