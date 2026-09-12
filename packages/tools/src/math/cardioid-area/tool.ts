import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{ readonly polarCoefficient: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "polarCoefficient", label: "Polar coefficient", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.polarCoefficient, "polarCoefficient");
  return { value: 1.5 * Math.PI * input.polarCoefficient ** 2 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { polarCoefficient: 1 },
  output: { result: { value: 4.71238898038469 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/cardioid-area",
  title: "Cardioid Area Calculator",
  description:
    "Cardioidr=a(1+cos\u03b8)area3\u03c0a\u00b2/2,actualaispolarcoefficient.",
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
