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
  maximumScroll: number;
  trackExtent: number;
  thumbExtent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "scrollPosition", label: "Scroll position", kind: "number" },
  { id: "maximumScroll", label: "Maximum scroll", kind: "number" },
  { id: "trackExtent", label: "Track extent", kind: "number" },
  { id: "thumbExtent", label: "Thumb extent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.maximumScroll, "maximum");
  angle(i.scrollPosition, "scroll", 0, i.maximumScroll);
  nonnegative(i.trackExtent, "track");
  angle(i.thumbExtent, "thumb", 0, i.trackExtent);
  return {
    thumbStart: i.maximumScroll
      ? (i.scrollPosition / i.maximumScroll) * (i.trackExtent - i.thumbExtent)
      : 0,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    scrollPosition: 25,
    maximumScroll: 100,
    trackExtent: 80,
    thumbExtent: 40,
  },
  output: { result: { thumbStart: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/scroll-thumb-position",
  title: "Scroll Thumb Position",
  description:
    "Map scroll position to thumb travel with explicit sizes and scroll range; non-scrollable content maps to zero.",
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
