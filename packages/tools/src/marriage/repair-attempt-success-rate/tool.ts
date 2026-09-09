import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyCodedSuccessfulRepairAttempts: number;
  readonly actualObservedRepairAttempts: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyCodedSuccessfulRepairAttempts",
    label: "Actual independently coded successful repair attempts",
    kind: "number",
  },
  {
    id: "actualObservedRepairAttempts",
    label: "Actual observed repair attempts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyCodedSuccessfulRepairAttempts,
    "numerator",
  );
  positive(input.actualObservedRepairAttempts, "denominator");
  return {
    observedRatio:
      (1 * input.actualIndependentlyCodedSuccessfulRepairAttempts) /
      input.actualObservedRepairAttempts,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyCodedSuccessfulRepairAttempts: 2,
    actualObservedRepairAttempts: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/repair-attempt-success-rate",
  title: "Repair Attempt Success Rate Calculator",
  description:
    "Actual independently qualified successful repair/all repair attempt proportion. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
