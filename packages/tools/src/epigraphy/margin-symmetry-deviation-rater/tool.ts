import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MarginSymmetryDeviationRaterInput = {
  readonly leftMarginCm: number;
  readonly rightMarginCm: number;
  readonly topMarginCm: number;
  readonly bottomMarginCm: number;
};

export type MarginSymmetryDeviationRaterOutput = {
  readonly horizontalDeviationCm: number;
  readonly verticalDeviationCm: number;
  readonly maxDeviationCm: number;
};

export const calculateMarginSymmetryDeviationRater = (
  input: MarginSymmetryDeviationRaterInput,
): MarginSymmetryDeviationRaterOutput => {
  for (const key of [
    "leftMarginCm",
    "rightMarginCm",
    "topMarginCm",
    "bottomMarginCm",
  ] as const) {
    if (!((input[key] as number) >= 0))
      return simpleError(
        key,
        "Margins must be non-negative.",
        "invalid_margin",
      );
  }
  const horizontalDeviationCm = Math.abs(
    input.leftMarginCm - input.rightMarginCm,
  );
  const verticalDeviationCm = Math.abs(
    input.topMarginCm - input.bottomMarginCm,
  );
  return {
    horizontalDeviationCm,
    verticalDeviationCm,
    maxDeviationCm: Math.max(horizontalDeviationCm, verticalDeviationCm),
  };
};

export const marginSymmetryDeviationRaterExample = {
  input: {
    leftMarginCm: 3.2,
    rightMarginCm: 2.7,
    topMarginCm: 4,
    bottomMarginCm: 4.5,
  },
  output: {
    horizontalDeviationCm: 0.5,
    verticalDeviationCm: 0.5,
    maxDeviationCm: 0.5,
  },
} satisfies ToolExample<
  MarginSymmetryDeviationRaterInput,
  MarginSymmetryDeviationRaterOutput
>;

export const marginSymmetryDeviationRaterTool = createSimpleTool({
  id: "epigraphy/margin-symmetry-deviation-rater",
  title: "Margin Left Right Top Bottom Symmetry Deviation Rater",
  description:
    "Rate layout symmetry of an inscribed field by measuring the absolute deviations between opposing left-right and top-bottom margins.",
  inputs: [
    {
      description: "Left margin width in centimetres.",
      id: "leftMarginCm",
      kind: "number",
      label: "Left",
      minimum: 0,
    },
    {
      description: "Right margin width in centimetres.",
      id: "rightMarginCm",
      kind: "number",
      label: "Right",
      minimum: 0,
    },
    {
      description: "Top margin width in centimetres.",
      id: "topMarginCm",
      kind: "number",
      label: "Top",
      minimum: 0,
    },
    {
      description: "Bottom margin width in centimetres.",
      id: "bottomMarginCm",
      kind: "number",
      label: "Bottom",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Absolute difference of left and right margins.",
      id: "horizontalDeviationCm",
      kind: "number",
      label: "Horizontal deviation",
    },
    {
      description: "Absolute difference of top and bottom margins.",
      id: "verticalDeviationCm",
      kind: "number",
      label: "Vertical deviation",
    },
    {
      description: "Largest of the two axis deviations.",
      id: "maxDeviationCm",
      kind: "number",
      label: "Max deviation",
    },
  ],
  calculate: (input) =>
    calculateMarginSymmetryDeviationRater(
      input as unknown as MarginSymmetryDeviationRaterInput,
    ),
});

export const runMarginSymmetryDeviationRater =
  marginSymmetryDeviationRaterTool.execute;
export default marginSymmetryDeviationRaterTool;
