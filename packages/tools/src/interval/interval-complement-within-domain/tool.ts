import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  orderedPair,
  intervals,
  intervalCells,
} from "../batch53-shared.js";

export type Input = Readonly<{
  intervals: readonly (readonly number[])[];
  domainStart: number;
  domainEnd: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "intervals", label: "Intervals", kind: "matrix" },
  { id: "domainStart", label: "Domain start", kind: "number" },
  { id: "domainEnd", label: "Domain end", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  orderedPair(i.domainStart, i.domainEnd, true);
  const a = intervals(i.intervals)
      .map(([s, e]) => [Math.max(s, i.domainStart), Math.min(e, i.domainEnd)])
      .filter(([s, e]) => e > s),
    cells = intervalCells([[i.domainStart, i.domainEnd], ...a]);
  return {
    complement: cells
      .filter((c) => c.sourceIndexes.length === 1)
      .map((c) => [c.start, c.end]),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { intervals: [[1, 3]], domainStart: 0, domainEnd: 4 },
  output: {
    result: {
      complement: [
        [0, 1],
        [3, 4],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-complement-within-domain",
  title: "Interval Complement Within Domain",
  description:
    "Compute half-open uncovered domain cells after clipping supplied intervals; no extrapolation outside the explicit nonempty domain.",
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
