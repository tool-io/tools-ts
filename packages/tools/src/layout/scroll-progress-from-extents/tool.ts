import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  angle,
} from "../batch53-shared.js";

export type Input = Readonly<{
  scrollPosition: number;
  contentExtent: number;
  viewportExtent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "scrollPosition", label: "Scroll position", kind: "number" },
  { id: "contentExtent", label: "Content extent", kind: "number" },
  { id: "viewportExtent", label: "Viewport extent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.contentExtent, "content");
  nonnegative(i.viewportExtent, "viewport");
  const maximum = Math.max(0, i.contentExtent - i.viewportExtent);
  angle(i.scrollPosition, "position", 0, maximum);
  return {
    progress: maximum ? i.scrollPosition / maximum : 0,
    maximumScroll: maximum,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { scrollPosition: 25, contentExtent: 200, viewportExtent: 100 },
  output: { result: { progress: 0.25, maximumScroll: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/scroll-progress-from-extents",
  title: "Scroll Progress from Extents",
  description:
    "Compute normalized scroll progress from explicit extents; a non-scrollable viewport has defined zero progress.",
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
