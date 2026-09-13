import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSensitivity: number;
  readonly actualSpecificity: number;
  readonly callerApplicableBaseRate: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualSensitivity", label: "Actual sensitivity", kind: "number" },
  { id: "actualSpecificity", label: "Actual specificity", kind: "number" },
  {
    id: "callerApplicableBaseRate",
    label: "Caller applicable base rate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.actualSensitivity, "actualSensitivity");
  fraction(input.actualSpecificity, "actualSpecificity");
  fraction(input.callerApplicableBaseRate, "callerApplicableBaseRate");
  positive(
    input.actualSensitivity * input.callerApplicableBaseRate +
      (1 - input.actualSpecificity) * (1 - input.callerApplicableBaseRate),
    "positiveprobability",
  );
  return {
    value:
      (input.actualSensitivity * input.callerApplicableBaseRate) /
      (input.actualSensitivity * input.callerApplicableBaseRate +
        (1 - input.actualSpecificity) * (1 - input.callerApplicableBaseRate)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSensitivity: 0.8,
    actualSpecificity: 0.8,
    callerApplicableBaseRate: 0.2,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/ppv-from-sensitivity-and-base-rate",
  title: "PPV From Sensitivity and Base Rate Calculator",
  description:
    "Bayes PPV from independently applicable sensitivity, specificity, prevalence base-rate fractions; undefined zero-positive probability refused, not diagnostic certainty. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
