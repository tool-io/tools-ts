import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch53-shared.js";

export type Input = Readonly<{
  progress: number;
  contentExtent: number;
  viewportExtent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "progress", label: "Progress", kind: "number" },
  { id: "contentExtent", label: "Content extent", kind: "number" },
  { id: "viewportExtent", label: "Viewport extent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  fraction(i.progress, "progress");
  nonnegative(i.contentExtent, "content");
  nonnegative(i.viewportExtent, "viewport");
  return {
    scrollPosition:
      i.progress * Math.max(0, i.contentExtent - i.viewportExtent),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { progress: 0.25, contentExtent: 200, viewportExtent: 100 },
  output: { result: { scrollPosition: 25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/scroll-position-from-progress",
  title: "Scroll Position from Progress",
  description:
    "Invert normalized scroll progress into a position using explicit content/viewport extents.",
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
