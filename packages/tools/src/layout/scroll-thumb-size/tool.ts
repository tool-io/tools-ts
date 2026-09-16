import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  angle,
} from "../batch53-shared.js";

export type Input = Readonly<{
  contentExtent: number;
  viewportExtent: number;
  trackExtent: number;
  minimumThumb: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "contentExtent", label: "Content extent", kind: "number" },
  { id: "viewportExtent", label: "Viewport extent", kind: "number" },
  { id: "trackExtent", label: "Track extent", kind: "number" },
  { id: "minimumThumb", label: "Minimum thumb", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(i.contentExtent, "content");
  nonnegative(i.viewportExtent, "viewport");
  positive(i.trackExtent, "track");
  angle(i.minimumThumb, "minimum", 0, i.trackExtent);
  return {
    thumbExtent: Math.min(
      i.trackExtent,
      Math.max(
        i.minimumThumb,
        (i.trackExtent * i.viewportExtent) / i.contentExtent,
      ),
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    contentExtent: 200,
    viewportExtent: 100,
    trackExtent: 80,
    minimumThumb: 10,
  },
  output: { result: { thumbExtent: 40 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/scroll-thumb-size",
  title: "Scroll Thumb Size",
  description:
    "Compute proportional scrollbar thumb size with an explicit minimum and track cap; no CSS or platform scrollbar rendering.",
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
