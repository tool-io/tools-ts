import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  rectangle,
  intersection,
} from "../batch53-shared.js";

export type Input = Readonly<{
  rectangle: readonly number[];
  viewport: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rectangle", label: "Rectangle", kind: "numberList" },
  { id: "viewport", label: "Viewport", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  rectangle(i.rectangle);
  rectangle(i.viewport);
  const area = positive(i.rectangle[2] * i.rectangle[3], "area"),
    r = intersection(i.rectangle, i.viewport);
  return { visibleArea: r[2] * r[3], visibleFraction: (r[2] * r[3]) / area };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { rectangle: [0, 0, 10, 10], viewport: [5, 0, 10, 10] },
  output: { result: { visibleArea: 50, visibleFraction: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/rectangle-visibility-fraction",
  title: "Rectangle Visibility Fraction",
  description:
    "Compute geometric visible area fraction of a positive-area rectangle; clipping, transforms, occlusion and opacity are not modeled.",
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
