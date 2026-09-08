import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyObservedRhPercent: number;
  readonly callerApplicableRhReviewThresholdPercent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyObservedRhPercent",
    label: "Independently observed rh percent",
    kind: "number",
  },
  {
    id: "callerApplicableRhReviewThresholdPercent",
    label: "Caller applicable rh review threshold percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    [
      input.independentlyObservedRhPercent,
      input.callerApplicableRhReviewThresholdPercent,
    ].some((v) => v < 0 || v > 100)
  )
    simpleError("RH", "0–100RHmeasurements/policy.");
  return {
    exceedsCallerRhReviewThreshold:
      input.independentlyObservedRhPercent >
      input.callerApplicableRhReviewThresholdPercent,
    signedRhReviewMarginPercentagePoints:
      input.callerApplicableRhReviewThresholdPercent -
      input.independentlyObservedRhPercent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyObservedRhPercent: 70,
    callerApplicableRhReviewThresholdPercent: 65,
  },
  output: {
    result: {
      exceedsCallerRhReviewThreshold: true,
      signedRhReviewMarginPercentagePoints: -5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/mold-rh-alert-level-classifier",
  title: "Mold Risk RH Threshold Alert Level Classifier",
  description:
    "Actual RH excursion screen under independently applicable collection policy. Duration, temperature, substrate, history and spores unmodeled; no universal mould prediction or safe below-threshold certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
