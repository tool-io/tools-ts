import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch49-shared.js";
export type Input = Readonly<{ readonly actualFreeParameterCount: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFreeParameterCount",
    label: "Actual free parameter count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualFreeParameterCount,
    "actualFreeParameterCount",
    0,
    1000000,
  );
  return { value: 10 * input.actualFreeParameterCount };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualFreeParameterCount: 5 },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/sem-minimum-sample-10-per-parameter",
  title: "SEM Minimum Sample 10-Per-Parameter Rule",
  description:
    "Nominal10participants/per parameter heuristic budget only, not SEM power, identification, estimatorvalidity or scientifically adequate sample size. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
