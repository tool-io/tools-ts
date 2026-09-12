import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualObservedScore: number;
  readonly callerVerifiedSem: number;
  readonly callerApplicableNormalCriticalValue: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualObservedScore", label: "Actual observed score", kind: "number" },
  { id: "callerVerifiedSem", label: "Caller verified sem", kind: "number" },
  {
    id: "callerApplicableNormalCriticalValue",
    label: "Caller applicable normal critical value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerVerifiedSem, "SEM");
  positive(input.callerApplicableNormalCriticalValue, "critical");
  const h = input.callerVerifiedSem * input.callerApplicableNormalCriticalValue;
  return {
    lowerConditionalScoreBound: input.actualObservedScore - h,
    upperConditionalScoreBound: input.actualObservedScore + h,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualObservedScore: 10,
    callerVerifiedSem: 2,
    callerApplicableNormalCriticalValue: 2,
  },
  output: {
    result: { lowerConditionalScoreBound: 6, upperConditionalScoreBound: 14 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/confidence-interval-observed-score",
  title: "Observed Score Confidence Interval Calculator",
  description:
    "Classical observed score\u00b1independently applicable critical\u00d7SEM, not populationmeanCIor infer a true score without measurement assumptions.",
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
