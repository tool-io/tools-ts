import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, aliquot } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualN: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualN", label: "Actual n", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualN, "actualN", 1, 1000000);
  bounded(input.actualN, "n", 1, 1000000);
  return { value: (input.actualN - aliquot(input.actualN)) / input.actualN };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualN: 3 },
  output: { result: { value: 0.6666666666666666 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/deficiency-ratio",
  title: "Deficiency Ratio Calculator",
  description:
    "Signed deficiency ratio[n\u2212s(n)]/n, proper divisors sum, npositive\u22641e6, negative for abundant; not \u03c3(n)/n.",
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
