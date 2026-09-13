import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualObservedPersonMeasureVariance: number;
  readonly callerMeanSquaredMeasurementError: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedPersonMeasureVariance",
    label: "Actual observed person measure variance",
    kind: "number",
  },
  {
    id: "callerMeanSquaredMeasurementError",
    label: "Caller mean squared measurement error",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualObservedPersonMeasureVariance,
    "actualObservedPersonMeasureVariance",
  );
  positive(
    input.callerMeanSquaredMeasurementError,
    "callerMeanSquaredMeasurementError",
  );
  if (
    input.actualObservedPersonMeasureVariance <
    input.callerMeanSquaredMeasurementError
  )
    simpleError("variance", "Nonnegativeadjustedtruevariance.");
  return {
    value: Math.sqrt(
      (input.actualObservedPersonMeasureVariance -
        input.callerMeanSquaredMeasurementError) /
        input.callerMeanSquaredMeasurementError,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualObservedPersonMeasureVariance: 5,
    callerMeanSquaredMeasurementError: 1,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/person-separation-index-rasch",
  title: "Rasch Person Separation Index Calculator",
  description:
    "Rasch person separation G=sqrt((observed variance\u2212meanSE\u00b2)/meanSE\u00b2), actual same calibration logits; negative adjusted variance refused, no diagnosis or universal strata. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
