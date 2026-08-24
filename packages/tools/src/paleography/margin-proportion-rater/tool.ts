import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MarginProportionRaterInput = {
  readonly topMarginMm: number;
  readonly bottomMarginMm: number;
  readonly innerMarginMm: number;
  readonly outerMarginMm: number;
  readonly tolerance?: number;
};

export type MarginProportionRaterOutput = {
  readonly outerToInnerRatio: number;
  readonly topToBottomRatio: number;
  readonly followsTwoToOneRule: boolean;
};

export const calculateMarginProportionRater = (
  input: MarginProportionRaterInput,
): MarginProportionRaterOutput => {
  for (const key of [
    "topMarginMm",
    "bottomMarginMm",
    "innerMarginMm",
    "outerMarginMm",
  ] as const) {
    if (!(Number.isFinite(input[key]) && input[key] > 0))
      return simpleError(
        key,
        "Margins must be greater than zero.",
        "invalid_measurement",
      );
  }
  const tolerance = input.tolerance ?? 0.25;
  if (!(Number.isFinite(tolerance) && tolerance >= 0))
    return simpleError(
      "tolerance",
      "Tolerance must be non-negative.",
      "invalid_tolerance",
    );
  const outerToInnerRatio = input.outerMarginMm / input.innerMarginMm;
  const topToBottomRatio = input.topMarginMm / input.bottomMarginMm;
  if (!Number.isFinite(outerToInnerRatio) || !Number.isFinite(topToBottomRatio))
    return simpleError(
      "outerMarginMm",
      "The margin ratios exceed the numeric range.",
      "numeric_overflow",
    );
  return {
    outerToInnerRatio,
    topToBottomRatio,
    followsTwoToOneRule:
      Math.abs(outerToInnerRatio - 2) <= tolerance &&
      Math.abs(topToBottomRatio - 1 / 2) <= tolerance,
  };
};

export const marginProportionRaterExample = {
  input: {
    topMarginMm: 25,
    bottomMarginMm: 48,
    innerMarginMm: 20,
    outerMarginMm: 40,
  },
  output: {
    outerToInnerRatio: 2,
    topToBottomRatio: 0.5208333333333334,
    followsTwoToOneRule: true,
  },
} satisfies ToolExample<
  MarginProportionRaterInput,
  MarginProportionRaterOutput
>;

export const marginProportionRaterTool = createSimpleTool({
  id: "paleography/margin-proportion-rater",
  title: "Margin Proportion Rater",
  description:
    "Rate measured margins against the classic codicological rule of thumb (outer about twice the inner, bottom about twice the top) with exact ratios and a stated default tolerance of 0.25 on each ratio.",
  inputs: [
    {
      description: "Top margin in millimetres.",
      id: "topMarginMm",
      kind: "number",
      label: "Top margin",
      minimum: 0,
    },
    {
      description: "Bottom margin in millimetres.",
      id: "bottomMarginMm",
      kind: "number",
      label: "Bottom margin",
      minimum: 0,
    },
    {
      description: "Inner (gutter-side) margin in millimetres.",
      id: "innerMarginMm",
      kind: "number",
      label: "Inner margin",
      minimum: 0,
    },
    {
      description: "Outer margin in millimetres.",
      id: "outerMarginMm",
      kind: "number",
      label: "Outer margin",
      minimum: 0,
    },
    {
      default: 0.25,
      description: "Allowed deviation of each ratio from its target.",
      id: "tolerance",
      kind: "number",
      label: "Tolerance",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Outer margin divided by inner margin.",
      id: "outerToInnerRatio",
      kind: "number",
      label: "Outer/inner",
    },
    {
      description: "Top margin divided by bottom margin.",
      id: "topToBottomRatio",
      kind: "number",
      label: "Top/bottom",
    },
    {
      description:
        "True when both ratios sit within tolerance of the rule of thumb.",
      id: "followsTwoToOneRule",
      kind: "boolean",
      label: "Follows 2:1 rule",
    },
  ],
  calculate: (input) =>
    calculateMarginProportionRater({
      topMarginMm: input.topMarginMm as number,
      bottomMarginMm: input.bottomMarginMm as number,
      innerMarginMm: input.innerMarginMm as number,
      outerMarginMm: input.outerMarginMm as number,
      tolerance: input.tolerance as number,
    }),
});

export const runMarginProportionRater = marginProportionRaterTool.execute;
export default marginProportionRaterTool;
