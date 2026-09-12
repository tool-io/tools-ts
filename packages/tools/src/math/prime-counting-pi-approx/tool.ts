import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualX: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualX", label: "Actual x", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualX, "actualX", 1, 1000000);
  bounded(input.actualX, "x", 3, 1000000);
  return { value: input.actualX / Math.log(input.actualX) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualX: 10 },
  output: { result: { value: 4.3429448190325175 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/prime-counting-pi-approx",
  title: "Prime Counting Pi Approximation",
  description:
    "Crude\u03c0(x)\u2248x/lnx, declaredx\u22653, not guaranteed count or probability.",
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
