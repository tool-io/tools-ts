import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualCutoff: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualCutoff", label: "Actual cutoff", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualCutoff, "cutoff", 0, 1000000);
  let s = 0n;
  for (let d = 1; d <= input.actualCutoff; d++)
    s += BigInt(Math.floor(input.actualCutoff / d)) * 1n;
  return { exactDivisorSummatory: s.toString() };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualCutoff: 5 },
  output: { result: { exactDivisorSummatory: "10" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/divisor-summatory",
  title: "Divisor Summatory Calculator",
  description:
    "Exact finite sum\u03c4(n) divisor-summatory rearrangement, not single divisor-sum or count. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
