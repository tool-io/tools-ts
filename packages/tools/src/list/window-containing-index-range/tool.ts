import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{ length: number; window: number; index: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "length", label: "Length", kind: "number" },
  { id: "window", label: "Window", kind: "number" },
  { id: "index", label: "Index", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.length, "length", 1, 10000);
  bounded(i.window, "window", 1, i.length);
  bounded(i.index, "index", 0, i.length - 1);
  return {
    firstStart: Math.max(0, i.index - i.window + 1),
    lastStart: Math.min(i.index, i.length - i.window),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { length: 8, window: 3, index: 2 },
  output: { result: { firstStart: 0, lastStart: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/window-containing-index-range",
  title: "Window Containing Index Range",
  description:
    "Return the inclusive range of full stride-one window starts containing an index.",
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
