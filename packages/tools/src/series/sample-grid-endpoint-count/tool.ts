import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  orderedPair,
} from "../batch53-shared.js";

export type Input = Readonly<{
  start: number;
  end: number;
  step: number;
  includeEnd: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "start", label: "Start", kind: "number" },
  { id: "end", label: "End", kind: "number" },
  { id: "step", label: "Step", kind: "number" },
  { id: "includeEnd", label: "Include end", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  orderedPair(i.start, i.end);
  positive(i.step, "step");
  const q = (i.end - i.start) / i.step;
  bounded(Math.ceil(q), "sample-budget", 0, 10000);
  const count = i.includeEnd ? Math.floor(q) + 1 : Math.ceil(q);
  return { count, lastSample: count ? i.start + (count - 1) * i.step : null };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { start: 0, end: 4, step: 2, includeEnd: true },
  output: { result: { count: 3, lastSample: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/sample-grid-endpoint-count",
  title: "Sample Grid Endpoint Count",
  description:
    "Count a regular sample grid starting at start, with end inclusion explicit; a nonaligned end is not invented as an extra sample.",
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
