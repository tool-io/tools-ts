import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, intervals } from "../batch53-shared.js";

export type Input = Readonly<{
  intervals: readonly (readonly number[])[];
  windows: readonly (readonly number[])[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "intervals", label: "Intervals", kind: "matrix" },
  { id: "windows", label: "Windows", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  const a = intervals(i.intervals),
    b = intervals(i.windows);
  return {
    intersections: a.flatMap(([s, e], sourceIndex) =>
      b.flatMap(([lo, hi], windowIndex) => {
        const start = Math.max(s, lo),
          end = Math.min(e, hi);
        return end > start ? [{ sourceIndex, windowIndex, start, end }] : [];
      }),
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { intervals: [[0, 2]], windows: [[1, 3]] },
  output: {
    result: {
      intersections: [{ sourceIndex: 0, windowIndex: 0, start: 1, end: 2 }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-window-intersection-table",
  title: "Interval Window Intersection Table",
  description:
    "Tabulate each positive-length source/window intersection with both indexes; touching endpoints are not overlap rows.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          intersections: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                sourceIndex: { type: "number" },
                windowIndex: { type: "number" },
                start: { type: "number" },
                end: { type: "number" },
              },
              required: ["sourceIndex", "windowIndex", "start", "end"],
            },
          },
        },
        required: ["intersections"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
