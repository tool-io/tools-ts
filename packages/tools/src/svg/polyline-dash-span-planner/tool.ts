import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  nonnegative,
  mod,
} from "../batch53-shared.js";

export type Input = Readonly<{
  totalLength: number;
  dashLength: number;
  gapLength: number;
  phase: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "totalLength", label: "Total length", kind: "number" },
  { id: "dashLength", label: "Dash length", kind: "number" },
  { id: "gapLength", label: "Gap length", kind: "number" },
  { id: "phase", label: "Phase", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.totalLength, "length");
  positive(i.dashLength, "dash");
  nonnegative(i.gapLength, "gap");
  const cycle = i.dashLength + i.gapLength;
  bounded(Math.ceil(i.totalLength / cycle) + 2, "dashes", 0, 10000);
  const p = mod(i.phase, cycle),
    spans: number[][] = [];
  for (let s = -p; s < i.totalLength; s += cycle) {
    const a = Math.max(0, s),
      b = Math.min(i.totalLength, s + i.dashLength);
    if (b > a) spans.push([a, b]);
  }
  return { dashSpans: spans };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { totalLength: 7, dashLength: 2, gapLength: 1, phase: 0 },
  output: {
    result: {
      dashSpans: [
        [0, 2],
        [3, 5],
        [6, 7],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/polyline-dash-span-planner",
  title: "Polyline Dash Span Planner",
  description:
    "Plan clipped one-dimensional dash spans for an explicit dash/gap cycle and phase; not a complete SVG stroking or corner renderer.",
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
