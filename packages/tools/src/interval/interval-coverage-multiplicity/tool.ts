import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  intervals,
  intervalCells,
} from "../batch53-shared.js";

export type Input = Readonly<{ intervals: readonly (readonly number[])[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "intervals", label: "Intervals", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return {
    cells: intervalCells(intervals(i.intervals)).map((c) => ({
      ...c,
      multiplicity: c.sourceIndexes.length,
    })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    intervals: [
      [0, 2],
      [1, 3],
    ],
  },
  output: {
    result: {
      cells: [
        { start: 0, end: 1, sourceIndexes: [0], multiplicity: 1 },
        { start: 1, end: 2, sourceIndexes: [0, 1], multiplicity: 2 },
        { start: 2, end: 3, sourceIndexes: [1], multiplicity: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-coverage-multiplicity",
  title: "Interval Coverage Multiplicity Table",
  description:
    "Partition interval endpoint cells and report exact source multiplicity, including zero-covered gaps between supplied intervals.",
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
          cells: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                start: { type: "number" },
                end: { type: "number" },
                sourceIndexes: { type: "array", items: { type: "number" } },
                multiplicity: { type: "number" },
              },
              required: ["start", "end", "sourceIndexes", "multiplicity"],
            },
          },
        },
        required: ["cells"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
