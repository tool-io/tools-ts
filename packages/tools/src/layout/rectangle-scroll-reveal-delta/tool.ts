import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, rectangle } from "../batch53-shared.js";

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
  const delta = (a: number, size: number, b: number, view: number) =>
    a < b ? a - b : a + size > b + view ? a + size - b - view : 0;
  return {
    deltaX: delta(i.rectangle[0], i.rectangle[2], i.viewport[0], i.viewport[2]),
    deltaY: delta(i.rectangle[1], i.rectangle[3], i.viewport[1], i.viewport[3]),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { rectangle: [12, 0, 3, 3], viewport: [0, 0, 10, 10] },
  output: { result: { deltaX: 5, deltaY: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/rectangle-scroll-reveal-delta",
  title: "Rectangle Scroll Reveal Delta",
  description:
    "Plan minimum-edge scroll reveal deltas in axis-aligned coordinates, prioritizing the leading edge when an item exceeds viewport size; no DOM scrolling occurs.",
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
