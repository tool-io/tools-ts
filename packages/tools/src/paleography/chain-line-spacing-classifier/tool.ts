import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChainLineSpacingClassifierInput = {
  readonly spacingMm: number;
  readonly rangeLowerMm: number;
  readonly rangeUpperMm: number;
};

export type ChainLineSpacingClassifierOutput = {
  readonly classification:
    "below_lower_bound" | "within_range" | "above_upper_bound";
};

export const calculateChainLineSpacingClassifier = (
  input: ChainLineSpacingClassifierInput,
): ChainLineSpacingClassifierOutput => {
  if (!(Number.isFinite(input.spacingMm) && input.spacingMm > 0))
    return simpleError(
      "spacingMm",
      "Measured spacing must be greater than zero.",
      "invalid_measurement",
    );
  if (!(Number.isFinite(input.rangeLowerMm) && input.rangeLowerMm > 0))
    return simpleError(
      "rangeLowerMm",
      "The lower bound must be greater than zero.",
      "invalid_range",
    );
  if (!(
    Number.isFinite(input.rangeUpperMm) &&
    input.rangeUpperMm > input.rangeLowerMm
  ))
    return simpleError(
      "rangeUpperMm",
      "The upper bound must exceed the lower bound.",
      "invalid_range",
    );
  return {
    classification:
      input.spacingMm < input.rangeLowerMm
        ? "below_lower_bound"
        : input.spacingMm > input.rangeUpperMm
          ? "above_upper_bound"
          : "within_range",
  };
};

export const chainLineSpacingClassifierExample = {
  input: { rangeLowerMm: 25, rangeUpperMm: 35, spacingMm: 28 },
  output: { classification: "within_range" },
} satisfies ToolExample<
  ChainLineSpacingClassifierInput,
  ChainLineSpacingClassifierOutput
>;

export const chainLineSpacingClassifierTool = createSimpleTool({
  id: "paleography/chain-line-spacing-classifier",
  title: "Chain Line Spacing Classifier",
  description:
    "Classify a measured chain-line spacing against your own supplied reference range (required bounds, since paper stocks vary) as below, within or above the interval with exact comparisons.",
  inputs: [
    {
      description: "Measured chain-to-chain spacing in millimetres.",
      id: "spacingMm",
      kind: "number",
      label: "Spacing",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Your reference lower bound in millimetres.",
      id: "rangeLowerMm",
      kind: "number",
      label: "Range lower",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Your reference upper bound in millimetres.",
      id: "rangeUpperMm",
      kind: "number",
      label: "Range upper",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Position of the measurement against your bounds.",
      id: "classification",
      enum: ["below_lower_bound", "within_range", "above_upper_bound"],
      kind: "string",
      label: "Classification",
    },
  ],
  calculate: (input) =>
    calculateChainLineSpacingClassifier({
      rangeLowerMm: input.rangeLowerMm as number,
      rangeUpperMm: input.rangeUpperMm as number,
      spacingMm: input.spacingMm as number,
    }),
});

export const runChainLineSpacingClassifier =
  chainLineSpacingClassifierTool.execute;
export default chainLineSpacingClassifierTool;
