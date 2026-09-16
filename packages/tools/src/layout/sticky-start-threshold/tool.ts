import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch53-shared.js";

export type Input = Readonly<{ normalStart: number; stickyInset: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "normalStart", label: "Normal start", kind: "number" },
  { id: "stickyInset", label: "Sticky inset", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return { scrollThreshold: i.normalStart - i.stickyInset };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { normalStart: 100, stickyInset: 10 },
  output: { result: { scrollThreshold: 90 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/sticky-start-threshold",
  title: "Sticky Start Threshold",
  description:
    "Compute the simple sticky-start scroll threshold from independently measured normal position and inset; containing-block end constraints are outside scope.",
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
