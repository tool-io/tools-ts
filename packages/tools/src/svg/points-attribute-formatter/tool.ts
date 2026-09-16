import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, points } from "../batch53-shared.js";

export type Input = Readonly<{ points: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "points", label: "Points", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  points(i.points, 0);
  return { value: i.points.map((r) => r.join(",")).join(" ") };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [1, 2],
    ],
  },
  output: { result: { value: "0,0 1,2" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/points-attribute-formatter",
  title: "SVG Points Attribute Formatter",
  description:
    "Format finite x,y coordinate pairs as an SVG points attribute without rounding or path grammar.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
