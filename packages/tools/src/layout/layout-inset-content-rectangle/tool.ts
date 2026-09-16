import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  rectangle,
} from "../batch53-shared.js";

export type Input = Readonly<{
  rectangle: readonly number[];
  top: number;
  right: number;
  bottom: number;
  left: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rectangle", label: "Rectangle", kind: "numberList" },
  { id: "top", label: "Top", kind: "number" },
  { id: "right", label: "Right", kind: "number" },
  { id: "bottom", label: "Bottom", kind: "number" },
  { id: "left", label: "Left", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  rectangle(i.rectangle);
  [i.top, i.right, i.bottom, i.left].forEach((v) => nonnegative(v, "inset"));
  const width = i.rectangle[2] - i.left - i.right,
    height = i.rectangle[3] - i.top - i.bottom;
  return {
    rectangle: [
      i.rectangle[0] + i.left,
      i.rectangle[1] + i.top,
      Math.max(0, width),
      Math.max(0, height),
    ],
    overconstrained: width < 0 || height < 0,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { rectangle: [0, 0, 10, 10], top: 1, right: 2, bottom: 3, left: 4 },
  output: { result: { rectangle: [4, 1, 4, 6], overconstrained: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/layout-inset-content-rectangle",
  title: "Layout Inset Content Rectangle",
  description:
    "Compute axis-aligned inset content geometry, retaining an overconstrained flag when opposing insets exceed available size.",
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
