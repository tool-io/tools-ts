import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction, bounded } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualInitiallyEnrolledCount: number;
  readonly callerIndependentlyAssessedAttritionFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInitiallyEnrolledCount",
    label: "Actual initially enrolled count",
    kind: "number",
  },
  {
    id: "callerIndependentlyAssessedAttritionFraction",
    label: "Caller independently assessed attrition fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualInitiallyEnrolledCount,
    "actualInitiallyEnrolledCount",
    0,
    1000000,
  );
  fraction(
    input.callerIndependentlyAssessedAttritionFraction,
    "callerIndependentlyAssessedAttritionFraction",
  );
  return {
    value:
      input.actualInitiallyEnrolledCount *
      (1 - input.callerIndependentlyAssessedAttritionFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInitiallyEnrolledCount: 100,
    callerIndependentlyAssessedAttritionFraction: 0.2,
  },
  output: { result: { value: 80 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/attrition-adjusted-final-n",
  title: "Attrition-Adjusted Final N Calculator",
  description:
    "Conditional expectedfinalN=enrolled\u00d7(1\u2212attrition), fractional expectation retained, not deterministic integer participant outcome or inverse recruitmentbudget. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
