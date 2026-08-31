import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly numeratorCount: number;
  readonly denominatorCount: number;
  readonly callerSmallDenominatorThreshold: number;
  readonly callerDisplayScale: number;
}>;
export type Output = Readonly<{
  readonly displayedObservedRate: number;
  readonly oneAdditionalNumeratorRateStep: number;
  readonly belowCallerDenominatorEvidenceThreshold: boolean;
}>;
const inputFields = [
  { id: "numeratorCount", label: "Numerator count", kind: "number" },
  { id: "denominatorCount", label: "Denominator count", kind: "number" },
  {
    id: "callerSmallDenominatorThreshold",
    label: "Caller small denominator threshold",
    kind: "number",
  },
  { id: "callerDisplayScale", label: "Caller display scale", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerDisplayScale, "callerDisplayScale");
  bounded(input.denominatorCount, "denominator", 1, 1000000000);
  bounded(input.numeratorCount, "numerator", 0, input.denominatorCount);
  bounded(input.callerSmallDenominatorThreshold, "minimum", 1, 1000000000);
  return {
    displayedObservedRate:
      input.callerDisplayScale *
      (input.numeratorCount / input.denominatorCount),
    oneAdditionalNumeratorRateStep:
      input.callerDisplayScale / input.denominatorCount,
    belowCallerDenominatorEvidenceThreshold:
      input.denominatorCount < input.callerSmallDenominatorThreshold,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  numeratorCount: 2,
  denominatorCount: 10,
  callerSmallDenominatorThreshold: 30,
  callerDisplayScale: 100,
} satisfies Input;
export const exampleOutput = {
  displayedObservedRate: 20,
  oneAdditionalNumeratorRateStep: 10,
  belowCallerDenominatorEvidenceThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/small-denominator-instability-warning-checker",
  title: "Small Denominator Instability Warning Checker",
  description:
    "Expose rate sensitivity to a single numerator event and explicit caller denominator evidence floor; not just per-capita rate, inferential uncertainty interval, suppressed-data permission or a universal small-sample cutoff.",
  inputs: inputFields,
  outputs: [
    {
      id: "displayedObservedRate",
      label: "Displayed observed rate",
      kind: "number",
    },
    {
      id: "oneAdditionalNumeratorRateStep",
      label: "One additional numerator rate step",
      kind: "number",
    },
    {
      id: "belowCallerDenominatorEvidenceThreshold",
      label: "Below caller denominator evidence threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      numeratorCount: value.numeratorCount as number,
      denominatorCount: value.denominatorCount as number,
      callerSmallDenominatorThreshold:
        value.callerSmallDenominatorThreshold as number,
      callerDisplayScale: value.callerDisplayScale as number,
    }),
});
export const run = tool.execute;
export default tool;
