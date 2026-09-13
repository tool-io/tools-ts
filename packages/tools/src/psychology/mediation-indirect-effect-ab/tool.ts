import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualPathA: number;
  readonly actualPathB: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualPathA", label: "Actual path a", kind: "number" },
  { id: "actualPathB", label: "Actual path b", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return { value: input.actualPathA * input.actualPathB };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualPathA: 2, actualPathB: 3 },
  output: { result: { value: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/mediation-indirect-effect-ab",
  title: "Mediation Indirect Effect a*b Calculator",
  description:
    "Algebraic independently fit linear mediationindirecteffecta\u00d7b, compatible scaling. Not causal mediation identification, bootstrap uncertainty or claim of significance. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
