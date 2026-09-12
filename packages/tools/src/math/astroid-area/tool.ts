import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{ readonly axisInterceptRadius: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "axisInterceptRadius", label: "Axis intercept radius", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.axisInterceptRadius, "axisInterceptRadius");
  return { value: (3 * Math.PI * input.axisInterceptRadius ** 2) / 8 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { axisInterceptRadius: 1 },
  output: { result: { value: 1.1780972450961724 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/astroid-area",
  title: "Astroid Area Calculator",
  description:
    "Astroidx^(2/3)+y^(2/3)=a^(2/3),are3\u03c0a\u00b2/8,aisaxisinterceptnotrollingradius.",
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
