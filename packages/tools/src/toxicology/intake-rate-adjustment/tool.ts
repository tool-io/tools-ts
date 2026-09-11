import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredOriginalIntakeRate: number;
  readonly callerIndependentlyEstablishedComparisonIntakeRate: number;
  readonly actualOriginalScenarioDose: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredOriginalIntakeRate",
    label: "Actual measured original intake rate",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedComparisonIntakeRate",
    label: "Caller independently established comparison intake rate",
    kind: "number",
  },
  {
    id: "actualOriginalScenarioDose",
    label: "Actual original scenario dose",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualMeasuredOriginalIntakeRate, "original-intake");
  nonnegative(
    input.callerIndependentlyEstablishedComparisonIntakeRate,
    "comparison",
  );
  nonnegative(input.actualOriginalScenarioDose, "dose");
  return {
    conditionalIntakeScaledDose:
      (input.actualOriginalScenarioDose *
        input.callerIndependentlyEstablishedComparisonIntakeRate) /
      input.actualMeasuredOriginalIntakeRate,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredOriginalIntakeRate: 2,
    callerIndependentlyEstablishedComparisonIntakeRate: 3,
    actualOriginalScenarioDose: 4,
  },
  output: { result: { conditionalIntakeScaledDose: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/intake-rate-adjustment",
  title: "Intake Rate Adjustment Calculator",
  description:
    "Conditional linear same-substance dose rescaling by independently established intake-rate ratio, assuming fixed concentration, absorption and bodymass. Not universal intake guidance or toxicodynamic scaling.",
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
