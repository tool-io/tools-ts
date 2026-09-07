import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly distinctObservedCases: number;
  readonly independentlyEstablishedTargetScope: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "distinctObservedCases",
    label: "Distinct observed cases",
    kind: "number",
  },
  {
    id: "independentlyEstablishedTargetScope",
    label: "Independently established target scope",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.independentlyEstablishedTargetScope, "scope", 1, 1000000);
  bounded(
    input.distinctObservedCases,
    "cases",
    0,
    input.independentlyEstablishedTargetScope,
  );
  return {
    observedScopeCoverageFraction:
      input.distinctObservedCases / input.independentlyEstablishedTargetScope,
    unobservedCaseCount:
      input.independentlyEstablishedTargetScope - input.distinctObservedCases,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { distinctObservedCases: 3, independentlyEstablishedTargetScope: 10 },
  output: {
    result: { observedScopeCoverageFraction: 0.3, unobservedCaseCount: 7 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/example-generalization-scope-checker",
  title: "Example Generalization Scope Checker",
  description:
    "Compare distinct independently observed cases with a known finite target scope, not random-sample representativeness or a universal generalization warrant.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
