import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  span,
  surrogateBoundary,
} from "../batch53-shared.js";

export type Input = Readonly<{ text: string; start: number; end: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "start", label: "Start", kind: "number" },
  { id: "end", label: "End", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  span(i.start, i.end, i.text.length);
  return {
    startSplitsSurrogate: surrogateBoundary(i.text, i.start),
    endSplitsSurrogate: surrogateBoundary(i.text, i.end),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "😀", start: 1, end: 2 },
  output: { result: { startSplitsSurrogate: true, endSplitsSurrogate: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/selection-surrogate-boundary-check",
  title: "Selection Surrogate Boundary Check",
  description:
    "Check selection endpoints for splitting a UTF-16 surrogate pair; does not guarantee grapheme-cluster boundaries.",
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
