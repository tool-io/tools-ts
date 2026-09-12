import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{ readonly rollingCircleRadius: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rollingCircleRadius", label: "Rolling circle radius", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.rollingCircleRadius, "rollingCircleRadius");
  return { value: 24 * input.rollingCircleRadius };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { rollingCircleRadius: 1 },
  output: { result: { value: 24 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/nephroid-perimeter",
  title: "Nephroid Perimeter Calculator",
  description: "Nephroidepicycloidperimeter24awhereaisrollingradius.",
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
