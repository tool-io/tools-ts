import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpouseStatusGapDifferenceInput = {
  readonly respondentPrestigeScore: number;
  readonly spousePrestigeScore: number;
};

export type SpouseStatusGapDifferenceOutput = {
  readonly statusGap: number;
};

export const spouseStatusGapDifferenceExample = {
  input: {
    respondentPrestigeScore: 72,
    spousePrestigeScore: 58,
  },
  output: {
    statusGap: 14,
  },
} satisfies ToolExample<
  SpouseStatusGapDifferenceInput,
  SpouseStatusGapDifferenceOutput
>;

export const calculateSpouseStatusGap = (
  input: SpouseStatusGapDifferenceInput,
): SpouseStatusGapDifferenceOutput => {
  if (
    !Number.isFinite(input.respondentPrestigeScore) ||
    !Number.isFinite(input.spousePrestigeScore) ||
    input.respondentPrestigeScore < 0 ||
    input.spousePrestigeScore < 0
  )
    simpleError(
      "respondentPrestigeScore",
      "Prestige scores must be finite nonnegative numbers.",
      "invalid_value",
    );
  return {
    statusGap: Math.abs(
      input.respondentPrestigeScore - input.spousePrestigeScore,
    ),
  };
};

export const spouseStatusGapDifferenceTool = createSimpleTool({
  calculate: (input) =>
    calculateSpouseStatusGap({
      respondentPrestigeScore: input.respondentPrestigeScore as number,
      spousePrestigeScore: input.spousePrestigeScore as number,
    }),
  description:
    "Measure the absolute occupational prestige gap between spouses in a household.",
  id: "sociology/spouse-status-gap-difference",
  inputs: [
    {
      description: "Respondent's occupational prestige score.",
      id: "respondentPrestigeScore",
      kind: "number",
      label: "Respondent prestige",
      minimum: 0,
    },
    {
      description: "Spouse's occupational prestige score.",
      id: "spousePrestigeScore",
      kind: "number",
      label: "Spouse prestige",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Absolute prestige difference within the couple.",
      id: "statusGap",
      kind: "number",
      label: "Status gap",
    },
  ],
  title: "Spouse Status Gap Difference Calculator",
});
export const runSpouseStatusGapDifference =
  spouseStatusGapDifferenceTool.execute;
export default spouseStatusGapDifferenceTool;
