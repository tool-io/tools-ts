import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReplacementLevelFertilityCheckerInput = {
  readonly totalFertilityRate: number;
};

export type ReplacementLevelFertilityCheckerOutput = {
  readonly gapToReplacement: number;
  readonly replacementLevel: boolean;
};

export const replacementLevelFertilityCheckerExample = {
  input: {
    totalFertilityRate: 1.7,
  },
  output: {
    gapToReplacement: -0.40000000000000013,
    replacementLevel: false,
  },
} satisfies ToolExample<
  ReplacementLevelFertilityCheckerInput,
  ReplacementLevelFertilityCheckerOutput
>;

const REPLACEMENT_TFR = 2.1;

export const calculateReplacementLevelFertility = (
  input: ReplacementLevelFertilityCheckerInput,
): ReplacementLevelFertilityCheckerOutput => {
  if (
    !Number.isFinite(input.totalFertilityRate) ||
    input.totalFertilityRate < 0
  )
    simpleError(
      "totalFertilityRate",
      "The fertility rate cannot be negative.",
      "invalid_value",
    );
  return {
    gapToReplacement: input.totalFertilityRate - REPLACEMENT_TFR,
    replacementLevel: input.totalFertilityRate >= REPLACEMENT_TFR,
  };
};

export const replacementLevelFertilityCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateReplacementLevelFertility({
      totalFertilityRate: input.totalFertilityRate as number,
    }),
  description:
    "Check a total fertility rate against the conventional 2.1-birth benchmark used for low-mortality populations; the actual replacement rate varies with mortality and sex ratio at birth.",
  id: "sociology/replacement-level-fertility-checker",
  inputs: [
    {
      description: "Total fertility rate for the population.",
      id: "totalFertilityRate",
      kind: "number",
      label: "TFR",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Signed distance from the replacement rate.",
      id: "gapToReplacement",
      kind: "number",
      label: "Gap to replacement",
    },
    {
      description: "Whether the population is at or above replacement.",
      id: "replacementLevel",
      kind: "boolean",
      label: "Replacement level",
    },
  ],
  title: "Replacement-Level Fertility Checker",
});
export const runReplacementLevelFertilityChecker =
  replacementLevelFertilityCheckerTool.execute;
export default replacementLevelFertilityCheckerTool;
