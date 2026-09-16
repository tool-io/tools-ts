import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  intervals,
  intervalCells,
} from "../batch53-shared.js";

export type Input = Readonly<{
  leftIntervals: readonly (readonly number[])[];
  rightIntervals: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftIntervals", label: "Left intervals", kind: "matrix" },
  { id: "rightIntervals", label: "Right intervals", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = intervals(i.leftIntervals),
    b = intervals(i.rightIntervals);
  return {
    cells: intervalCells([...a, ...b])
      .filter((c) => {
        const left = c.sourceIndexes.some((j) => j < a.length),
          right = c.sourceIndexes.some((j) => j >= a.length);
        return left !== right;
      })
      .map((c) => [c.start, c.end]),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { leftIntervals: [[0, 2]], rightIntervals: [[1, 3]] },
  output: {
    result: {
      cells: [
        [0, 1],
        [2, 3],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-symmetric-difference",
  title: "Interval Symmetric Difference Tool",
  description:
    "Compute symmetric difference of half-open covered sets by endpoint cells; multiplicity within each input does not cancel its coverage.",
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
