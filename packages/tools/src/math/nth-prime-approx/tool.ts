import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualN: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualN", label: "Actual n", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualN, "actualN", 1, 1000000);
  bounded(input.actualN, "n", 6, 1000000);
  return {
    value:
      input.actualN *
      (Math.log(input.actualN) + Math.log(Math.log(input.actualN))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualN: 10 },
  output: { result: { value: 31.366175382420018 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/nth-prime-approx",
  title: "Nth Prime Approximation",
  description:
    "Nthprimeasymptoticn(lnn+lnlnn), n\u22656, no bound or exact prime claim.",
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
