import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RtiHighlightCountCheckerInput = {
  readonly highlightCount: number;
  readonly recommendedMinimum?: number;
};

export type RtiHighlightCountCheckerOutput = {
  readonly sufficient: boolean;
  readonly surplusCount: number;
  readonly adequacyRatio: number;
};

export const calculateRtiHighlightCountChecker = (
  input: RtiHighlightCountCheckerInput,
): RtiHighlightCountCheckerOutput => {
  if (!(Number.isInteger(input.highlightCount) && input.highlightCount >= 0))
    return simpleError(
      "highlightCount",
      "Highlight count must be a non-negative integer.",
      "invalid_count",
    );
  const minimum = input.recommendedMinimum ?? 24;
  if (!(Number.isInteger(minimum) && minimum > 0))
    return simpleError(
      "recommendedMinimum",
      "Recommended minimum must be a positive integer.",
      "invalid_count",
    );
  return {
    sufficient: input.highlightCount >= minimum,
    surplusCount: input.highlightCount - minimum,
    adequacyRatio: input.highlightCount / minimum,
  };
};

export const rtiHighlightCountCheckerExample = {
  input: { highlightCount: 32, recommendedMinimum: 24 },
  output: {
    sufficient: true,
    surplusCount: 8,
    adequacyRatio: 1.3333333333333333,
  },
} satisfies ToolExample<
  RtiHighlightCountCheckerInput,
  RtiHighlightCountCheckerOutput
>;

export const rtiHighlightCountCheckerTool = createSimpleTool({
  id: "epigraphy/rti-highlight-count-checker",
  title: "RTI Highlight Count Sufficiency Checker for Dome Capture",
  description:
    "Check whether a reflectance transformation imaging dome capture provides enough highlight positions against a configurable recommended minimum of 24.",
  inputs: [
    {
      description: "Number of captured highlight positions.",
      id: "highlightCount",
      kind: "integer",
      label: "Highlights",
      minimum: 0,
    },
    {
      default: 24,
      description: "Recommended minimum highlight count for the capture.",
      id: "recommendedMinimum",
      kind: "integer",
      label: "Recommended minimum",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Whether the highlight count meets the recommended minimum.",
      id: "sufficient",
      kind: "boolean",
      label: "Sufficient",
    },
    {
      description:
        "Highlights above (or below, if negative) the recommended minimum.",
      id: "surplusCount",
      kind: "integer",
      label: "Surplus",
    },
    {
      description: "Highlight count divided by the recommended minimum.",
      id: "adequacyRatio",
      kind: "number",
      label: "Adequacy ratio",
    },
  ],
  calculate: (input) =>
    calculateRtiHighlightCountChecker(
      input as unknown as RtiHighlightCountCheckerInput,
    ),
});

export const runRtiHighlightCountChecker = rtiHighlightCountCheckerTool.execute;
export default rtiHighlightCountCheckerTool;
