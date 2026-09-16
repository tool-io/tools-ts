import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  rectangle,
} from "../batch53-shared.js";

export type Input = Readonly<{
  viewBox: readonly number[];
  viewportWidth: number;
  viewportHeight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "viewBox", label: "View box", kind: "numberList" },
  { id: "viewportWidth", label: "Viewport width", kind: "number" },
  { id: "viewportHeight", label: "Viewport height", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  rectangle(i.viewBox);
  positive(i.viewBox[2], "width");
  positive(i.viewBox[3], "height");
  positive(i.viewportWidth, "viewport-width");
  positive(i.viewportHeight, "viewport-height");
  const scale = Math.min(
      i.viewportWidth / i.viewBox[2],
      i.viewportHeight / i.viewBox[3],
    ),
    offsetX = (i.viewportWidth - i.viewBox[2] * scale) / 2,
    offsetY = (i.viewportHeight - i.viewBox[3] * scale) / 2;
  return {
    scale,
    offsetX,
    offsetY,
    translateX: offsetX - i.viewBox[0] * scale,
    translateY: offsetY - i.viewBox[1] * scale,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { viewBox: [0, 0, 10, 20], viewportWidth: 100, viewportHeight: 100 },
  output: {
    result: {
      scale: 5,
      offsetX: 25,
      offsetY: 0,
      translateX: 25,
      translateY: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/viewbox-aspect-letterbox",
  title: "SVG ViewBox Aspect Letterbox",
  description:
    "Compute SVG xMidYMid meet letterboxing for a positive viewBox and viewport; not preserveAspectRatio slice or arbitrary alignment.",
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
