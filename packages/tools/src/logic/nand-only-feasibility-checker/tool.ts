import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly primitive: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "primitive", label: "Primitive", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(i.primitive, { NOT: 1, AND: 2, OR: 3 }, "primitive"),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { primitive: "NOT" },
  output: { result: { reference: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "logic/nand-only-feasibility-checker",
  title: "NAND-Only Equivalent Circuit Feasibility Checker",
  description:
    "Bounded NAND gate counts for standard NOT/AND/OR templates with tied inputs and unlimited fanout; logical universality not circuit timing/power feasibility.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
