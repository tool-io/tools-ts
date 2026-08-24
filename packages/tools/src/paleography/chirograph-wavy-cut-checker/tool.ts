import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChirographWavyCutCheckerInput = {
  readonly upperHalfLetterCount: number;
  readonly lowerHalfLetterCount: number;
  readonly letterTolerance?: number;
  readonly wavyCutVisible?: boolean;
};

export type ChirographWavyCutCheckerOutput = {
  readonly letterDifference: number;
  readonly letterBalanceRatio: number;
  readonly verdict: "matching" | "mismatched" | "indeterminate";
};

export const calculateChirographWavyCutChecker = (
  input: ChirographWavyCutCheckerInput,
): ChirographWavyCutCheckerOutput => {
  for (const key of ["upperHalfLetterCount", "lowerHalfLetterCount"] as const) {
    if (!(Number.isSafeInteger(input[key]) && input[key] >= 0))
      return simpleError(
        key,
        "Surviving letter counts must be non-negative safe integers.",
        "invalid_letters",
      );
  }
  const tolerance = input.letterTolerance ?? 2;
  if (!(Number.isSafeInteger(tolerance) && tolerance >= 0))
    return simpleError(
      "letterTolerance",
      "Letter tolerance must be a non-negative safe integer.",
      "invalid_tolerance",
    );
  if (input.upperHalfLetterCount + input.lowerHalfLetterCount === 0)
    return simpleError(
      "upperHalfLetterCount",
      "Record at least one surviving chirograph letter on one of the two halves.",
      "invalid_letters",
    );
  const wavyCutVisible = input.wavyCutVisible ?? false;
  const upper = input.upperHalfLetterCount;
  const lower = input.lowerHalfLetterCount;
  const letterDifference = Math.abs(upper - lower);
  const larger = Math.max(upper, lower);
  const smaller = Math.min(upper, lower);
  return {
    letterBalanceRatio: smaller / larger,
    letterDifference,
    verdict: !wavyCutVisible
      ? "indeterminate"
      : letterDifference <= tolerance
        ? "matching"
        : "mismatched",
  };
};

export const chirographWavyCutCheckerExample = {
  input: {
    letterTolerance: 2,
    lowerHalfLetterCount: 9,
    upperHalfLetterCount: 9,
    wavyCutVisible: true,
  },
  output: {
    letterBalanceRatio: 1,
    letterDifference: 0,
    verdict: "matching",
  },
} satisfies ToolExample<
  ChirographWavyCutCheckerInput,
  ChirographWavyCutCheckerOutput
>;

export const chirographWavyCutCheckerTool = createSimpleTool({
  id: "paleography/chirograph-wavy-cut-checker",
  title: "Chirograph Wavy-Cut Checker",
  description:
    "Assess a cut-apart chirograph under the stated heuristic: halves whose surviving letter counts differ by no more than the tolerance count as matching when a wavy cut is visible, mismatched otherwise, and indeterminate whenever no wavy cut is visible.",
  inputs: [
    {
      description: "Letters of the chirograph word surviving above the cut.",
      id: "upperHalfLetterCount",
      kind: "integer",
      label: "Upper letters",
      minimum: 0,
    },
    {
      description: "Letters of the chirograph word surviving below the cut.",
      id: "lowerHalfLetterCount",
      kind: "integer",
      label: "Lower letters",
      minimum: 0,
    },
    {
      default: 2,
      description:
        "Maximum allowed difference between the two letter counts for a match.",
      id: "letterTolerance",
      kind: "integer",
      label: "Letter tolerance",
      minimum: 0,
    },
    {
      default: false,
      description: "Whether the indented wavy cut line is actually visible.",
      id: "wavyCutVisible",
      kind: "boolean",
      label: "Wavy cut visible",
    },
  ],
  outputs: [
    {
      description: "Absolute difference between the two letter counts.",
      id: "letterDifference",
      kind: "integer",
      label: "Letter difference",
    },
    {
      description:
        "Smaller letter count divided by the larger (1 when perfectly balanced).",
      id: "letterBalanceRatio",
      kind: "number",
      label: "Balance ratio",
    },
    {
      description: "Stated-heuristic verdict for the two joining halves.",
      id: "verdict",
      enum: ["matching", "mismatched", "indeterminate"],
      kind: "string",
      label: "Verdict",
    },
  ],
  calculate: (input) =>
    calculateChirographWavyCutChecker({
      letterTolerance: input.letterTolerance as number | undefined,
      lowerHalfLetterCount: input.lowerHalfLetterCount as number,
      upperHalfLetterCount: input.upperHalfLetterCount as number,
      wavyCutVisible: input.wavyCutVisible as boolean | undefined,
    }),
});

export const runChirographWavyCutChecker = chirographWavyCutCheckerTool.execute;
export default chirographWavyCutCheckerTool;
