import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  orderedPair,
} from "../batch53-shared.js";

export type Input = Readonly<{
  aStart: number;
  aEnd: number;
  bStart: number;
  bEnd: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "aStart", label: "A start", kind: "number" },
  { id: "aEnd", label: "A end", kind: "number" },
  { id: "bStart", label: "B start", kind: "number" },
  { id: "bEnd", label: "B end", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  [i.aStart, i.aEnd, i.bStart, i.bEnd].forEach((v) =>
    bounded(v, "endpoint", -1e12, 1e12),
  );
  orderedPair(i.aStart, i.aEnd);
  orderedPair(i.bStart, i.bEnd);
  return {
    sharedIntegerCount: Math.max(
      0,
      Math.min(i.aEnd, i.bEnd) - Math.max(i.aStart, i.bStart) + 1,
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { aStart: 0, aEnd: 2, bStart: 2, bEnd: 3 },
  output: { result: { sharedIntegerCount: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/closed-integer-overlap-count",
  title: "Closed Integer Interval Overlap Count",
  description:
    "Count shared integers in closed integer endpoint intervals, including one-point contact.",
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
