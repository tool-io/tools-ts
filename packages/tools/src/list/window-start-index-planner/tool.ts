import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{
  length: number;
  window: number;
  stride: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "length", label: "Length", kind: "number" },
  { id: "window", label: "Window", kind: "number" },
  { id: "stride", label: "Stride", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.length, "length", 0, 10000);
  bounded(i.window, "window", 1, 10000);
  bounded(i.stride, "stride", 1, 10000);
  return {
    startIndexes: Array.from(
      { length: Math.max(0, Math.floor((i.length - i.window) / i.stride) + 1) },
      (_, j) => j * i.stride,
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { length: 8, window: 3, stride: 2 },
  output: { result: { startIndexes: [0, 2, 4] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/window-start-index-planner",
  title: "Window Start Index Planner",
  description:
    "Plan full fixed-width window starts without allocating window values; incomplete tails are excluded.",
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
