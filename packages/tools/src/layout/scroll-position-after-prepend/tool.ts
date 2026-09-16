import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch53-shared.js";

export type Input = Readonly<{
  scrollPosition: number;
  prependedExtent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "scrollPosition", label: "Scroll position", kind: "number" },
  { id: "prependedExtent", label: "Prepended extent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.scrollPosition, "scroll");
  nonnegative(i.prependedExtent, "prepend");
  return {
    anchorPreservingPosition: i.scrollPosition + i.prependedExtent,
    assumption: "same-anchor-and-no-other-layout-change",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { scrollPosition: 20, prependedExtent: 5 },
  output: {
    result: {
      anchorPreservingPosition: 25,
      assumption: "same-anchor-and-no-other-layout-change",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/scroll-position-after-prepend",
  title: "Scroll Position after Prepend",
  description:
    "Preserve an existing scroll anchor after a known prepended extent, before any independently required scroll-range clamp.",
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
