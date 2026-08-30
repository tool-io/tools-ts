import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly measuredTransitionEndMeters: number;
  readonly measuredTransitionStartMeters: number;
  readonly predictedTransitionMeters: number;
  readonly toleranceMeters: number;
}>;
export type Output = Readonly<{
  readonly predictionErrorToBandMeters: number;
  readonly transitionVerifiedWithinTolerance: boolean;
}>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of Object.entries(input))
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        "Distances and tolerance must be finite and nonnegative.",
        "invalid_distance",
      );
  if (input.measuredTransitionStartMeters > input.measuredTransitionEndMeters)
    simpleError(
      "measuredTransitionStartMeters",
      "Measured interval is reversed.",
      "invalid_interval",
    );
  const predictionErrorToBandMeters =
    input.predictedTransitionMeters < input.measuredTransitionStartMeters
      ? input.measuredTransitionStartMeters - input.predictedTransitionMeters
      : input.predictedTransitionMeters > input.measuredTransitionEndMeters
        ? input.predictedTransitionMeters - input.measuredTransitionEndMeters
        : 0;
  if (!Number.isFinite(predictionErrorToBandMeters))
    simpleError(
      "predictedTransitionMeters",
      "Prediction error is out of range.",
      "numeric_overflow",
    );
  return {
    predictionErrorToBandMeters,
    transitionVerifiedWithinTolerance:
      predictionErrorToBandMeters <= input.toleranceMeters,
  };
};

export const example = {
  input: {
    measuredTransitionEndMeters: 120,
    measuredTransitionStartMeters: 100,
    predictedTransitionMeters: 110,
    toleranceMeters: 5,
  },
  output: {
    predictionErrorToBandMeters: 0,
    transitionVerifiedWithinTolerance: true,
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    measuredTransitionEndMeters: 120,
    measuredTransitionStartMeters: 100,
    predictedTransitionMeters: 140,
    toleranceMeters: 10,
  },
  output: {
    predictionErrorToBandMeters: 20,
    transitionVerifiedWithinTolerance: false,
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      measuredTransitionEndMeters: input.measuredTransitionEndMeters as number,
      measuredTransitionStartMeters:
        input.measuredTransitionStartMeters as number,
      predictedTransitionMeters: input.predictedTransitionMeters as number,
      toleranceMeters: input.toleranceMeters as number,
    }),
  description:
    "Compare a predicted shadow-zone transition with a measured transition interval and explicit tolerance; this does not certify projectile containment or range safety.",
  id: "acoustics/range-shadow-zone-verification",
  inputs: [
    {
      id: "measuredTransitionEndMeters",
      kind: "number",
      label: "Measured transition end",
      minimum: 0,
      unit: "m",
    },
    {
      id: "measuredTransitionStartMeters",
      kind: "number",
      label: "Measured transition start",
      minimum: 0,
      unit: "m",
    },
    {
      id: "predictedTransitionMeters",
      kind: "number",
      label: "Predicted transition",
      minimum: 0,
      unit: "m",
    },
    {
      id: "toleranceMeters",
      kind: "number",
      label: "Verification tolerance",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "predictionErrorToBandMeters",
      kind: "number",
      label: "Prediction error to measured band",
      minimum: 0,
      unit: "m",
    },
    {
      id: "transitionVerifiedWithinTolerance",
      kind: "boolean",
      label: "Transition verified within tolerance",
    },
  ],
  title: "Range Shadow-Zone Verification",
});

export const run = tool.execute;
export default tool;
