import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualAdjustmentResidualsMeters: readonly number[];
  readonly callerIndependentAbsoluteResidualReviewThresholdMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualAdjustmentResidualsMeters",
    label: "Actual adjustment residuals meters",
    kind: "numberList",
  },
  {
    id: "callerIndependentAbsoluteResidualReviewThresholdMeters",
    label: "Caller independent absolute residual review threshold meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerIndependentAbsoluteResidualReviewThresholdMeters,
    "threshold",
  );
  if (!input.actualAdjustmentResidualsMeters.length)
    simpleError("residuals", "Actual independent residual trace.");
  return {
    flaggedResidualIndices: input.actualAdjustmentResidualsMeters.flatMap(
      (v, i) =>
        Math.abs(v) >
        input.callerIndependentAbsoluteResidualReviewThresholdMeters
          ? [i]
          : [],
    ),
    signedResidualThresholdExcessesMeters:
      input.actualAdjustmentResidualsMeters.map(
        (v) =>
          Math.abs(v) -
          input.callerIndependentAbsoluteResidualReviewThresholdMeters,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualAdjustmentResidualsMeters: [1, -3, 2],
    callerIndependentAbsoluteResidualReviewThresholdMeters: 2,
  },
  output: {
    result: {
      flaggedResidualIndices: [1],
      signedResidualThresholdExcessesMeters: [-1, 1, 0],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/blunder-residual-flag",
  title: "Blunder Detection Residual Outlier Flag Calculator",
  description:
    "Actual adjustment residual absolute-threshold review, no infer a blunder cause, statistical outlier test or remove survey observations. Inclusive boundary unflagged, threshold independently applicable.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
