import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "a", label: "A", kind: "number" },
  { id: "b", label: "B", kind: "number" },
  { id: "c", label: "C", kind: "number" },
  { id: "d", label: "D", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.a === 0) simpleError("a", "Nonzerocubicleadingcoefficient.");
  return {
    value:
      input.b ** 2 * input.c ** 2 -
      4 * input.a * input.c ** 3 -
      4 * input.b ** 3 * input.d -
      27 * input.a ** 2 * input.d ** 2 +
      18 * input.a * input.b * input.c * input.d,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { a: 1, b: 0, c: -1, d: 0 },
  output: { result: { value: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/cubic-discriminant",
  title: "Cubic Discriminant Calculator",
  description:
    "Actualcubicax\u00b3+bx\u00b2+cx+d(nonzeroa) polynomialdiscriminantb\u00b2c\u00b2\u22124ac\u00b3\u22124b\u00b3d\u221227a\u00b2d\u00b2+18abcd. Finite binary64, no root certification.",
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
